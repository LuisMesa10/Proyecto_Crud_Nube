const mongoose = require('mongoose');

/**
 * Conectar a MongoDB Atlas
 * Función asíncrona que establece conexión con la base de datos
 */
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(' MongoDB conectado exitosamente');
    console.log(` Base de datos: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error(' Error de conexión a MongoDB:', error.message);
    process.exit(1); // Salir si no hay conexión
  }
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.log(' MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error(' Error de MongoDB:', err);
});

module.exports = conectarDB;
