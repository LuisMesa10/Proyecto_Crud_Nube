import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('Aplicación Vue 3 iniciada')
console.log('API URL:', import.meta.env.VITE_API_URL)
