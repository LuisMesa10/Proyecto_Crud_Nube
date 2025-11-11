<template>
  <div class="xml-viewer">
    <div class="viewer-header">
      <h2>Informe XML del Inventario</h2>
      <div class="button-group">
        <button
          class="btn"
          :class="{ active: vista === 'arbol-tradicional' }"
          @click="vista = 'arbol-tradicional'"
        >
          XML
        </button>
        <button
          class="btn"
          :class="{ active: vista === 'arbol-visual' }"
          @click="vista = 'arbol-visual'"
        >
          XML Gráfico
        </button>
      </div>
    </div>

    <!-- Árbol tradicional -->
    <div v-show="vista === 'arbol-tradicional'">
      <ArbolXML />
    </div>

    <!-- Árbol visual con líneas -->
    <div v-show="vista === 'arbol-visual'">
      <ArbolXMLVisual />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArbolXML from './ArbolXML.vue'
import ArbolXMLVisual from './ArbolXMLVisual.vue'

const vista = ref('arbol-tradicional')
</script>

<style scoped>
.xml-viewer {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.viewer-header h2 {
  margin: 0;
  color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn:hover {
  background: #f8f9fa;
}

.btn.active {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-group {
    width: 100%;
  }

  .button-group .btn {
    flex: 1;
  }
}
</style>
