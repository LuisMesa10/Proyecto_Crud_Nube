<template>
  <div v-if="nodo" class="nodo-xml" :class="{ expandido: expandido }">
    <!-- Encabezado del nodo con toggle -->
    <div class="encabezado-nodo" @click="toggleNodo">
      <!-- Botón toggle solo si tiene hijos -->
      <span v-if="tieneHijos" class="toggle-btn" :class="{ rotado: expandido }">
        ▶️
      </span>
      <span v-else class="toggle-placeholder"></span>

      <!-- Nombre del nodo -->
      <span class="nombre-etiqueta">{{ nombreNodo }}</span>

      <!-- Atributos si existen -->
      <span v-if="tieneAtributos" class="atributos">
        <span v-for="(valor, attr) in nodo._attributes" :key="attr" class="atributo">
          {{ attr }}="<span class="valor-atributo">{{ valor }}</span>"
        </span>
      </span>

      <!-- Valor de texto si existe (y no tiene hijos) -->
      <span v-else-if="esValorPrimitivo" class="valor-texto">
        {{ nodo }}
      </span>
    </div>

    <!-- Contenido expandible (hijos) -->
    <div v-if="tieneHijos" class="contenido-nodo" :style="{ display: expandido ? 'block' : 'none' }">
      <div class="hijos">
        <!-- Renderizar propiedades como nodos -->
        <NodoXML
          v-for="(hijo, clave) in obtenerHijos()"
          :key="clave"
          :nodo="hijo"
          :nombreNodo="clave"
          :nivel="nivel + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  nodo: {
    type: [Object, String, Number, Boolean],
    default: null
  },
  nombreNodo: {
    type: String,
    default: 'root'
  },
  nivel: {
    type: Number,
    default: 0
  }
})

const expandido = ref(props.nivel < 2) // Expandir primeros 2 niveles por defecto

/**
 * Verificar si es un valor primitivo (string, number, boolean)
 */
const esValorPrimitivo = computed(() => {
  return typeof props.nodo === 'string' ||
         typeof props.nodo === 'number' ||
         typeof props.nodo === 'boolean'
})

/**
 * Verificar si el nodo tiene atributos
 */
const tieneAtributos = computed(() => {
  if (typeof props.nodo !== 'object' || props.nodo === null) return false
  return props.nodo._attributes && Object.keys(props.nodo._attributes).length > 0
})

/**
 * Verificar si el nodo tiene hijos (propiedades)
 */
const tieneHijos = computed(() => {
  if (typeof props.nodo !== 'object' || props.nodo === null) return false

  // Contar propiedades que no sean _text ni _attributes
  const claves = Object.keys(props.nodo).filter(
    key => key !== '_text' && key !== '_attributes'
  )
  return claves.length > 0
})

/**
 * Obtener los nodos hijos para renderizar
 */
const obtenerHijos = () => {
  if (typeof props.nodo !== 'object' || props.nodo === null) return {}

  const hijos = {}
  Object.keys(props.nodo).forEach(clave => {
    if (clave !== '_text' && clave !== '_attributes') {
      hijos[clave] = props.nodo[clave]
    }
  })
  return hijos
}

/**
 * Toggle para expandir/colapsar
 */
const toggleNodo = () => {
  if (tieneHijos.value) {
    expandido.value = !expandido.value
  }
}
</script>

<style scoped>
.nodo-xml {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  margin: 0.25rem 0;
}

.encabezado-nodo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  flex-wrap: wrap;
}

.encabezado-nodo:hover {
  background: #e8f0fe;
}

.toggle-btn {
  display: inline-block;
  width: 20px;
  text-align: center;
  transition: transform 0.2s;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.toggle-btn.rotado {
  transform: rotate(90deg);
}

.toggle-placeholder {
  display: inline-block;
  width: 20px;
  flex-shrink: 0;
}

.nombre-etiqueta {
  color: #d4380d;
  font-weight: 600;
  flex-shrink: 0;
}

.atributos {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: 0.5rem;
  flex-wrap: wrap;
}

.atributo {
  color: #6e6e6e;
  font-size: 0.9rem;
}

.valor-atributo {
  color: #0b7500;
  font-weight: 500;
}

.valor-texto {
  color: #0b7500;
  margin-left: 0.5rem;
  font-weight: 500;
  word-break: break-all;
}

.contenido-nodo {
  margin-left: 2rem;
  border-left: 1px dashed #bbb;
  padding-left: 1rem;
}

.hijos {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .nodo-xml {
    font-size: 0.85rem;
  }

  .contenido-nodo {
    margin-left: 1rem;
    padding-left: 0.5rem;
  }

  .encabezado-nodo {
    font-size: 0.9rem;
  }
}
</style>
