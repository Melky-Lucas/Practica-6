import express, { json } from 'express'
const app = express()

app.use(json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

var contador = 3

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST - Crear nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body

    // Validar que lleguen los tres campos
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({ 
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios' 
        })
    }

    // Convertir el precio a número
    const precioNumero = parseFloat(precio)

    // El precio debe ser un número mayor que cero
    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({ 
            mensaje: 'El precio debe ser un número mayor que cero' 
        })
    }

    // Generar un id que no se repita: el mayor id existente + 1
    const nuevoId = contador + 1
    contador = nuevoId

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        descripcion,
        precio: precioNumero
    }

    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

// PUT - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si no existe, devolver 404
    if (indice === -1) {
        return res.status(404).json({ 
            mensaje: 'Producto no encontrado'
        })
    }

    const { nombre, descripcion, precio } = req.body

    // Validar que lleguen los tres campos
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    const precioNumero = parseFloat(precio)

    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        })
    }

    // Reemplazar los datos conservando el mismo id
    productos[indice] = {
        id: id,
        nombre,
        descripcion,
        precio: precioNumero
    }

    res.status(200).json(productos[indice])
})

// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si no existe, devolver 404
    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        })
    }

    const eliminado = productos.splice(indice, 1)[0]

    res.json({ mensaje: 'Producto eliminado', producto: eliminado })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
