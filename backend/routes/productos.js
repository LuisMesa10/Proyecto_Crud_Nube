const express = require('express');
const router = express.Router();

// Importar controladores
const {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

const { generarInformeXML } = require('../utils/xmlGenerador');

/**
 * Rutas CRUD estándar REST
 */

// CREATE - Crear producto
router.post('/', crearProducto);

// READ - Obtener todos
router.get('/', obtenerProductos);

// READ - Obtener uno
router.get('/:id', obtenerProductoPorId);

// UPDATE - Actualizar
router.put('/:id', actualizarProducto);

// DELETE - Eliminar
router.delete('/:id', eliminarProducto);

/**
 * Ruta especial para informe XML
 * IMPORTANTE: Debe ir ANTES de '/:id' para evitar conflictos
 */
router.get('/informe/xml', generarInformeXML);

module.exports = router;
