<template>
  <div class="arbol-grafo">
    <div class="arbol-header">
      <h3>🌳 Árbol XML - Estructura de Productos</h3>
      <button class="btn-reset" @click="resetScroll">↺ Reset</button>
    </div>

    <div v-if="cargando" class="loading">
      <p>Cargando árbol...</p>
    </div>

    <div v-else class="svg-wrapper">
      <svg :width="ancho" :height="alto">
        <!-- LÍNEAS -->
        <line
          v-for="(linea, idx) in lineas"
          :key="`linea-${idx}`"
          :x1="linea.x1"
          :y1="linea.y1"
          :x2="linea.x2"
          :y2="linea.y2"
          stroke="#bdc3c7"
          stroke-width="2"
        />

        <!-- NODOS -->
        <g v-for="(nodo, idx) in nodos" :key="`nodo-${idx}`">
          <rect
            :x="nodo.x - nodo.ancho / 2"
            :y="nodo.y - 20"
            :width="nodo.ancho"
            height="40"
            :class="`nodo nodo-${nodo.tipo}`"
            rx="5"
          />
          <text :x="nodo.x" :y="nodo.y + 2" class="texto-nodo">
            {{ nodo.texto }}
          </text>
        </g>
      </svg>
    </div>

    <!-- LEYENDA -->
    <div class="leyenda">
      <div class="leyenda-item">
        <div class="leyenda-nodo nodo-raiz"></div>
        <span>Raíz</span>
      </div>
      <div class="leyenda-item">
        <div class="leyenda-nodo nodo-contenedor"></div>
        <span>Contenedor</span>
      </div>
      <div class="leyenda-item">
        <div class="leyenda-nodo nodo-producto"></div>
        <span>Producto</span>
      </div>
      <div class="leyenda-item">
        <div class="leyenda-nodo nodo-atributo"></div>
        <span>Atributo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productoService } from '@/services/api'

const cargando = ref(true)
const ancho = ref(1800)
const alto = ref(700)
const nodos = ref([])
const lineas = ref([])

/**
 * Cargar y construir árbol
 */
const construirArbol = async () => {
  try {
    const response = await productoService.obtenerDatosInforme()

    if (response.data.success) {
      const productos = response.data.productos

      nodos.value = []
      lineas.value = []

      let nodosArr = []
      let lineasArr = []
      let idNodo = 0

      // === NIVEL 0: RAÍZ ===
      const nodoRaiz = {
        id: idNodo++,
        texto: 'informe',
        tipo: 'raiz',
        x: ancho.value / 2,
        y: 60,
        ancho: 120
      }
      nodosArr.push(nodoRaiz)

      // === NIVEL 1: PRODUCTOS ===
      const nodoProductos = {
        id: idNodo++,
        texto: 'productos',
        tipo: 'contenedor',
        x: ancho.value / 2,
        y: 160,
        ancho: 140
      }
      nodosArr.push(nodoProductos)

      lineasArr.push({
        x1: nodoRaiz.x,
        y1: nodoRaiz.y + 20,
        x2: nodoProductos.x,
        y2: nodoProductos.y - 20
      })

      // === NIVEL 2: CADA PRODUCTO ===
      const cantProductos = productos.length
      const espacioProductos = 400
      const startX = (ancho.value / 2) - ((cantProductos - 1) * espacioProductos) / 2

      productos.forEach((prod, idx) => {
        const xProducto = startX + idx * espacioProductos

        const nodoProducto = {
          id: idNodo++,
          texto: `producto[${idx}]`,
          tipo: 'producto',
          x: xProducto,
          y: 280,
          ancho: 120
        }
        nodosArr.push(nodoProducto)

        lineasArr.push({
          x1: nodoProductos.x,
          y1: nodoProductos.y + 20,
          x2: nodoProducto.x,
          y2: nodoProducto.y - 20
        })

        // === NIVEL 3: ATRIBUTOS ===
        const atributos = [
          { nombre: 'nombre', valor: prod.nombre ? prod.nombre.substring(0, 12) : 'N/A' },
          { nombre: 'precio', valor: prod.precio ? `$${prod.precio}` : '$0' },
          { nombre: 'cantidad', valor: prod.cantidad !== undefined ? prod.cantidad : '0' },
          { nombre: 'total', valor: prod.valorTotal ? `$${prod.valorTotal}` : '$0' }
        ]

        const espacioAtributos = 110
        const totalWidth = atributos.length * espacioAtributos
        const startAttrX = xProducto - totalWidth / 2 + espacioAtributos / 2

        atributos.forEach((attr, attrIdx) => {
          const xAttr = startAttrX + attrIdx * espacioAtributos

          const nodoAttr = {
            id: idNodo++,
            texto: `${attr.nombre}: ${attr.valor}`,
            tipo: 'atributo',
            x: xAttr,
            y: 430,
            ancho: 100
          }

          nodosArr.push(nodoAttr)

          lineasArr.push({
            x1: nodoProducto.x,
            y1: nodoProducto.y + 20,
            x2: nodoAttr.x,
            y2: nodoAttr.y - 20
          })
        })
      })

      nodos.value = nodosArr
      lineas.value = lineasArr

      // Ajustar ancho según cantidad de productos
      if (cantProductos <= 3) {
        ancho.value = 1600
      } else if (cantProductos <= 5) {
        ancho.value = 2000
      } else {
        ancho.value = 2400
      }

      console.log('✅ Árbol construido')
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    cargando.value = false
  }
}

const resetScroll = () => {
  window.scrollTo(0, 0)
}

onMounted(() => {
  construirArbol()
})
</script>

<style scoped>
.arbol-grafo {
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
}

.arbol-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-reset {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-reset:hover {
  background: #5568d3;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.svg-wrapper {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: auto;
  height: 600px;
  margin-bottom: 1.5rem;
}

svg {
  display: block;
  margin: 0 auto;
}

.nodo {
  stroke-width: 2;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.nodo:hover {
  stroke-width: 3;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}

.nodo-raiz {
  fill: #27ae60;
  stroke: #1e8449;
}

.nodo-contenedor {
  fill: #3498db;
  stroke: #2980b9;
}

.nodo-producto {
  fill: #f39c12;
  stroke: #d68910;
}

.nodo-atributo {
  fill: #9b59b6;
  stroke: #7d3c98;
}

.texto-nodo {
  text-anchor: middle;
  dominant-baseline: middle;
  font-weight: 700;
  font-size: 11px;
  fill: white;
  pointer-events: none;
}

.leyenda {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-top: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.leyenda-nodo {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 2px solid;
}

.leyenda-nodo.nodo-raiz {
  background: #27ae60;
  border-color: #1e8449;
}

.leyenda-nodo.nodo-contenedor {
  background: #3498db;
  border-color: #2980b9;
}

.leyenda-nodo.nodo-producto {
  background: #f39c12;
  border-color: #d68910;
}

.leyenda-nodo.nodo-atributo {
  background: #9b59b6;
  border-color: #7d3c98;
}
</style>
