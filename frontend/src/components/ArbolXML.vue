<template>
  <div class="arbol-xml">
    <div class="arbol-header">
      <h3>Árbol XML - Informe del Inventario</h3>
      <div class="acciones">
        <button class="btn btn-small" @click="expandirTodo">
          Expandir todo
        </button>
        <button class="btn btn-small" @click="colapsarTodo">
          Contraer todo
        </button>
        <button class="btn btn-small" @click="descargarXML">
          Abrir Archivo XML
        </button>
      </div>
    </div>

    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando XML...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="arbol-container">
      <!-- Mostrar el árbol XML -->
      <div class="nodo-root">
        <NodoXML
          v-if="arbolXML && arbolXML.informe"
          :nodo="arbolXML.informe"
          nombreNodo="informe"
          :nivel="0"
        />
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productoService } from '@/services/api'
import NodoXML from './NodoXML.vue'

const cargando = ref(false)
const error = ref(null)
const arbolXML = ref(null)
const resumen = ref({
  totalProductos: 0,
  cantidadTotal: 0,
  valorTotal: 0
})

/**
 * Cargar el árbol XML desde el backend
 */
const cargarArbol = async () => {
  cargando.value = true
  error.value = null

  try {
    // Obtener datos del backend (ya parseados como JSON)
    const response = await productoService.obtenerDatosInforme()

    if (response.data.success) {
      // El backend devuelve el árbol XML como JSON
      arbolXML.value = response.data.arbolXML

      // Extraer datos de resumen
      resumen.value = {
        totalProductos: response.data.resumen.totalProductos,
        cantidadTotal: response.data.resumen.cantidadTotal,
        valorTotal: response.data.resumen.valorTotal
      }

      console.log('✅ Árbol XML cargado:', arbolXML.value)
    }
  } catch (err) {
    console.error('❌ Error al cargar XML:', err)
    error.value = 'No se pudo cargar el árbol XML'
  } finally {
    cargando.value = false
  }
}

/**
 * Expandir todos los nodos
 */
const expandirTodo = () => {
  document.querySelectorAll('.nodo-xml').forEach(nodo => {
    const toggle = nodo.querySelector('.toggle-btn')
    const contenido = nodo.querySelector('.contenido-nodo')
    if (toggle && contenido && contenido.style.display === 'none') {
      toggle.click()
    }
  })
}

/**
 * Colapsar todos los nodos
 */
const colapsarTodo = () => {
  document.querySelectorAll('.nodo-xml').forEach(nodo => {
    const toggle = nodo.querySelector('.toggle-btn')
    const contenido = nodo.querySelector('.contenido-nodo')
    if (toggle && contenido && contenido.style.display !== 'none') {
      toggle.click()
    }
  })
}

/**
 * Descargar archivo XML
 */
const descargarXML = () => {
  const xmlURL = productoService.getURLInformeXML()
  const link = document.createElement('a')
  link.href = xmlURL
  link.download = `informe-inventario-${new Date().toISOString().split('T')[0]}.xml`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  cargarArbol()
})
</script>

<style scoped>
.arbol-xml {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.arbol-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.arbol-header h3 {
  margin: 0;
  color: #2c3e50;
}

.acciones {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-small:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.loading p,
.error p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.error p {
  color: #e74c3c;
}

.arbol-container {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 2rem;
}

.nodo-root {
  max-height: 500px;
  overflow-y: auto;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  background: #f8f9fa;
}

.nodo-root::-webkit-scrollbar {
  width: 8px;
}

.nodo-root::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.nodo-root::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.nodo-root::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

.estadisticas-xml {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.estadisticas-xml h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.stat-label {
  color: #7f8c8d;
  font-weight: 600;
}

.stat-value {
  color: #2c3e50;
  font-weight: bold;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .arbol-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .acciones {
    width: 100%;
  }

  .btn-small {
    flex: 1;
    min-width: 100px;
  }
}
</style>
