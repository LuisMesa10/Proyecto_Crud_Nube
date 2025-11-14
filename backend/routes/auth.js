// 📂 Backend/routes/auth.js
const express = require("express");
const router = express.Router();

// Controlador (si existe)
const authController = require("../controllers/authController");

// ✅ Ruta para registrarse
router.post("/register", authController.register)

// ✅ Aquí defines la ruta POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
