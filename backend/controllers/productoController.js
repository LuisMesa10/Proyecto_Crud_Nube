const Producto = require('../models/Producto')

/**
 * CREATE - Crear nuevo producto
 * @route POST /api/productos
 */
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad, categoria } = req.body;
    
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria
    });
    
    const productoGuardado = await nuevoProducto.save();
    
    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      data: productoGuardado
    });
    
  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        mensaje: 'Error de validación',
        errores: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear el producto',
      error: error.message
    });
  }
};

/**
 * READ - Obtener todos los productos
 * @route GET /api/productos
 */
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    
    // Calcular valor total del inventario
    const valorTotal = productos.reduce((sum, p) => {
      return sum + (p.precio * p.cantidad);
    }, 0);
    
    res.status(200).json({
      success: true,
      total: productos.length,
      valorInventario: valorTotal.toFixed(2),
      data: productos
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
};

/**
 * READ - Obtener un producto por ID
 * @route GET /api/productos/:id
 */
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: producto
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        mensaje: 'ID de producto inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
};

/**
 * UPDATE - Actualizar producto
 * @route PUT /api/productos/:id
 */
exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Retornar documento actualizado
        runValidators: true // Ejecutar validaciones
      }
    );
    
    if (!productoActualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      mensaje: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        mensaje: 'Error de validación',
        errores: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

/**
 * DELETE - Eliminar producto
 * @route DELETE /api/productos/:id
 */
exports.eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    
    if (!productoEliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      mensaje: 'Producto eliminado exitosamente',
      data: productoEliminado
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el producto',
      error: error.message
    });
  }
};