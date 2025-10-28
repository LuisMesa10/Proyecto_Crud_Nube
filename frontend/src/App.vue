<template>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <div class="container">
        <h1 class="app-title"> Sistema CRUD de Productos</h1>
        <p class="app-subtitle">Gestión de Inventario con Informes XML y desplegado en la Nube.
          <span class="spanNombres">Luis Mesa & Yarledy Zapata</span>
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <div class="container">

        <!-- Estadísticas -->
        <section class="stats-section">
          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-value">{{ productos.length }}</div>
              <div class="stat-label">Total Productos</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-value">${{ valorInventario }}</div>
              <div class="stat-label">Valor Inventario</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-value">{{ cantidadTotal }}</div>
              <div class="stat-label">Unidades Totales</div>
            </div>
          </div>
        </section>

        <!-- Visualizador XML -->
        <XMLViewer />

        <!-- Formulario CRUD -->
        <ProductoForm
          :producto-editar="productoEditando"
          :cargando="cargando"
          @submit="guardarProducto"
          @cancelar="cancelarEdicion"
        />

        <!-- Loading -->
        <div v-if="cargandoLista" class="loading">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <!-- Lista de productos -->
        <ProductoLista
          v-else
          :productos="productos"
          @editar="editarProducto"
          @eliminar="eliminarProducto"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2025 Sistema CRUD | Desarrollado con MEVN Stack | Luis Mesa & Yarledy Zapata</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productoService } from '@/services/api'
import ProductoForm from '@/components/ProductoForm.vue'
import ProductoLista from '@/components/ProductoLista.vue'
import XMLViewer from '@/components/XMLViewer.vue'
import Swal from 'sweetalert2'

// Estado de la aplicación
const productos = ref([])
const productoEditando = ref(null)
const cargando = ref(false)
const cargandoLista = ref(false)

// Computed properties para estadísticas
const valorInventario = computed(() => {
  const total = productos.value.reduce((sum, p) => {
    return sum + (p.precio * p.cantidad)
  }, 0)
  return total.toFixed(2)
})

const cantidadTotal = computed(() => {
  return productos.value.reduce((sum, p) => sum + p.cantidad, 0)
})

/**
 * Cargar productos desde la API
 */
const cargarProductos = async () => {
  cargandoLista.value = true
  try {
    const response = await productoService.obtenerTodos()
    if (response.data.success) {
      productos.value = response.data.data
      console.log('✅ Productos cargados:', productos.value.length)
    }
  } catch (error) {
    console.error(' Error al cargar productos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los productos'
    })
  } finally {
    cargandoLista.value = false
  }
}

/**
 * Guardar producto (crear o actualizar)
 */
const guardarProducto = async (producto) => {
  cargando.value = true

  try {
    let response

    if (productoEditando.value) {
      // Actualizar
      response = await productoService.actualizar(productoEditando.value._id, producto)
    } else {
      // Crear
      response = await productoService.crear(producto)
    }

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: response.data.mensaje,
        timer: 2000,
        showConfirmButton: false
      })

      // Recargar lista y resetear formulario
      await cargarProductos()
      cancelarEdicion()
    }
  } catch (error) {
    console.error(' Error al guardar:', error)

    const mensaje = error.response?.data?.mensaje || 'Error al guardar el producto'
    const errores = error.response?.data?.errores || []

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      html: errores.length > 0
        ? `<ul style="text-align: left;">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`
        : mensaje
    })
  } finally {
    cargando.value = false
  }
}

/**
 * Editar producto
 */
const editarProducto = (producto) => {
  productoEditando.value = { ...producto }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Eliminar producto
 */
const eliminarProducto = async (id) => {
  const resultado = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!resultado.isConfirmed) return

  try {
    const response = await productoService.eliminar(id)

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: response.data.mensaje,
        timer: 2000,
        showConfirmButton: false
      })

      await cargarProductos()
    }
  } catch (error) {
    console.error(' Error al eliminar:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el producto'
    })
  }
}

/**
 * Cancelar edición
 */
const cancelarEdicion = () => {
  productoEditando.value = null
}

// Cargar productos al montar el componente
onMounted(() => {
  cargarProductos()
})
</script>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #2c3e50;
  line-height: 1.6;
}
.spanNombres{
  font-size: x-small;
  font-weight: bold;
  transition: all 0.3s ease; /* para que el cambio sea suave */

}
.spanNombres:hover{
  color:azure;
  font-size: medium;

}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 2.5rem;
  margin: 0;
}

.app-subtitle {
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.95;
}

/* Main */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

/* Estadísticas */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 1rem;
  color: #7f8c8d;
}

/* Footer */
.app-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .app-title {
    font-size: 1.8rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }
}
</style>
