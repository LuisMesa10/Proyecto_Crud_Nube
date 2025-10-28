const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const conectarDB = require('./config/database');

// Importar rutas
const productosRoutes = require('./routes/productos');

// Crear aplicación Express
const app = express();

// ==================== MIDDLEWARES ====================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: [
    'https://proyecto-crud-nube-frontend.onrender.com',  // EL DOMINIO DEL FRONTEND
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

 
// Parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================

// Ruta raíz - Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    mensaje: 'API REST - Sistema CRUD de Productos',
    version: '1.0.0',
    endpoints: {
      productos: '/api/productos',
      informeXML: '/api/productos/informe/xml'
    }
  });
});

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Ruta 404 - No encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 5000;

const iniciarServidor = async () => {
  try {
    // Primero conectar a base de datos
    await conectarDB();
    
    // Luego iniciar servidor
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api/productos`);
      console.log(`XML: http://localhost:${PORT}/api/productos/informe/xml`);
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
iniciarServidor();
