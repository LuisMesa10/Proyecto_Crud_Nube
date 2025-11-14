import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import ProductosView from '../ProductosView.vue' // 👈 vista nueva del CRUD

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/productos', component: ProductosView }, // 👈 en lugar de ProductoLista
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Protección opcional: impide entrar al CRUD sin login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/productos' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
