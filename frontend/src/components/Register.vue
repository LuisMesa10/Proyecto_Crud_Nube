<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="registrar">
        <input
          v-model="nombre"
          type="text"
          placeholder="Nombre completo"
          required
        />
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Registrarse</button>
      </form>

      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

      <p class="ir-login">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      nombre: "",
      email: "",
      password: "",
      mensaje: "",
    };
  },
  methods: {
    async registrar() {
      try {
        const res = await api.post("/auth/register", {
          nombre: this.nombre,
          email: this.email,
          password: this.password,
        });
        this.mensaje = res.data.message || "Usuario registrado correctamente ✅";
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        this.mensaje =
          err.response?.data?.message || "Error al registrar usuario ❌";
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f6fb;
  font-family: "Poppins", sans-serif;
}

/* Tarjeta con degradado */
.register-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 45px 40px;
  width: 380px;
  color: #fff;
  box-shadow: 0 8px 25px rgba(63, 43, 150, 0.2);
  transition: all 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(63, 43, 150, 0.3);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
}

/* Campos blancos con contraste */
input {
  width: 100%;
  margin-bottom: 18px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  color: #333;
  font-size: 15px;
  box-shadow: 0 3px 6px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

input:focus {
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
}

/* Botón con brillo y efecto */
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffffff, #dbe4ff);
  color: #3f2b96;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

button:hover {
  background: linear-gradient(135deg, #e3e9ff, #ffffff);
  transform: scale(1.05);
}

/* Mensaje */
.mensaje {
  margin-top: 10px;
  color: #fff;
}

/* Enlace a login */
.ir-login {
  margin-top: 20px;
  font-size: 14px;
  color: #f8f8f8;
}

.ir-login a {
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
}
</style>
