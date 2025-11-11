import axios from 'axios'

/**
 * Cliente HTTP configurado para comunicarse con el backend
 * Centraliza todas las peticiones a la API REST
 */

// URL base desde variables de entorno
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Servicio de Productos
 * Encapsula todas las operaciones CRUD
 */
export const productoService = {

  /**
   * Obtener datos del informe para gráficos
   */
  obtenerDatosInforme() {
    return apiClient.get('/productos/informe/datos')
  },

  /**
   * Obtener todos los productos
   * GET /api/productos
   */
  obtenerTodos() {
    return apiClient.get('/productos')
  },

  /**
   * Obtener un producto por ID
   * GET /api/productos/:id
   */
  obtenerPorId(id) {
    return apiClient.get(`/productos/${id}`)
  },

  /**
   * Crear nuevo producto
   * POST /api/productos
   */
  crear(producto) {
    return apiClient.post('/productos', producto)
  },

  /**
   * Actualizar producto existente
   * PUT /api/productos/:id
   */
  actualizar(id, producto) {
    return apiClient.put(`/productos/${id}`, producto)
  },

  /**
   * Eliminar producto
   * DELETE /api/productos/:id
   */
  eliminar(id) {
    return apiClient.delete(`/productos/${id}`)
  },

  /**
   * Obtener URL del informe XML
   * No usa Axios porque queremos abrir en nueva ventana
   */
  getURLInformeXML() {
    return `${API_URL}/productos/informe/xml`
  }
}

// Interceptor para logging (desarrollo)
if (
  import.meta.env.DEV) {
  apiClient.interceptors.request.use(request => {
    console.log('Request:', request.method.toUpperCase(), request.url)
    return request
  })

  apiClient.interceptors.response.use(
    response => {
      console.log('Response:', response.status, response.data)
      return response
    },
    error => {
      console.error('Error:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )
}

export default apiClient
