<template>
  <div class="xml-viewer">
    <div class="viewer-header">
      <h2>Informe XML del Inventario</h2>
      <button class="btn btn-primary" @click="verXML">
        Ver Árbol XML Completo
      </button>
    </div>

    <div v-if="mostrarInfo" class="xml-info">
      <p class="info-text">
         El informe XML contiene la estructura completa del inventario con:
      </p>
      <ul class="info-list">
        <li>Árbol XML jerárquico estructurado</li>
        <li>Valor total del inventario calculado</li>
        <li>Porcentaje de participación de cada producto</li>
        <li>Porcentaje de cantidad respecto al total</li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { productoService } from '@/services/api'

const mostrarInfo = ref(true)

/**
 * Abrir informe XML en nueva ventana
 * El navegador mostrará el árbol XML con formato
 */
const verXML = () => {
  const xmlURL = productoService.getURLInformeXML()
  window.open(xmlURL, '_blank', 'width=800,height=600')
}
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

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.xml-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.info-text {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.info-list {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.info-list li {
  margin-bottom: 0.5rem;
  color: #5d6d7e;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.alert-info {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1565c0;
}

.alert strong {
  display: block;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .viewer-header .btn {
    width: 100%;
  }
}
</style>
