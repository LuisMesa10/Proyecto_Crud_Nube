<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Sistema CRUD de Productos</h1>
      <p class="subtitle">Accede para gestionar el inventario</p>

      <form @submit.prevent="login" class="login-form">
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="register-text">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", res.data.token);
        this.$router.push("/productos");
      } catch (err) {
        this.error = err.response?.data?.message || "Error al iniciar sesión";
      }
    },
  },
};
</script>

<style scoped>
/* Fondo degradado coherente con el CRUD */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Tarjeta con sombra suave */
.login-card {
  background: #ffffff;
  padding: 45px;
  border-radius: 18px;
  width: 380px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Título y subtítulo */
.title {
  font-size: 1.5rem;
  color: #2c2c54;
  margin-bottom: 5px;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 25px;
}

/* Inputs */
.login-form input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
}

.login-form input:focus {
  border-color: #6a11cb;
  box-shadow: 0 0 6px rgba(106, 17, 203, 0.3);
  outline: none;
}

/* Botón principal */
button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.3);
}

/* Error y texto de registro */
.error {
  color: #e74c3c;
  margin-top: 10px;
}

.register-text {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #555;
}

.register-text a {
  color: #2575fc;
  text-decoration: none;
  font-weight: bold;
}

.register-text a:hover {
  text-decoration: underline;
}
</style>
