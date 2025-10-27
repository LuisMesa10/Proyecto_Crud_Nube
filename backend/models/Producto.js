const mongoose = require('mongoose');

/**
 * Esquema de Producto
 * Define estructura y validaciones de los documentos en MongoDB
 */
const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    default: ''
  },
  
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa'],
    default: 0
  },
  
  categoria: {
    type: String,
    enum: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Otros'],
    default: 'Otros'
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índice para búsquedas más rápidas
productoSchema.index({ nombre: 1 });

// Exportar modelo
module.exports = mongoose.model('Producto', productoSchema);
