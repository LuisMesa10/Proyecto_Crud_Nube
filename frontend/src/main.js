import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

console.log('Aplicación Vue 3 iniciada')
console.log('API URL:', import.meta.env.VITE_API_URL)
