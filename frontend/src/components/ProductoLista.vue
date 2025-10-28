<template>
  <div class="producto-lista">
    <div class="lista-header">
      <h2> Lista de Productos</h2>
      <span class="badge">{{ productos.length }} productos</span>
    </div>

    <!-- Tabla responsive -->
    <div class="table-container">
      <table v-if="productos.length > 0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Valor Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto._id">
            <td class="producto-nombre">
              <strong>{{ producto.nombre }}</strong>
              <p class="descripcion">{{ producto.descripcion || 'Sin descripción' }}</p>
            </td>
            <td>
              <span class="badge-categoria" :class="`cat-${producto.categoria.toLowerCase()}`">
                {{ producto.categoria }}
              </span>
            </td>
            <td class="precio">${{ producto.precio.toFixed(2) }}</td>
            <td class="cantidad">{{ producto.cantidad }}</td>
            <td class="valor-total">${{ (producto.precio * producto.cantidad).toFixed(2) }}</td>
            <td class="acciones">
              <button
                class="btn-icono btn-editar"
                @click="$emit('editar', producto)"
                title="Editar"
              >
                ✏️
              </button>
              <button
                class="btn-icono btn-eliminar"
                @click="$emit('eliminar', producto._id)"
                title="Eliminar"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <div class="empty-icon">📦</div>
        <p>No hay productos registrados</p>
        <small>Agrega tu primer producto usando el formulario</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  productos: {
    type: Array,
    required: true
  }
})

defineEmits(['editar', 'eliminar'])
</script>

<style scoped>
.producto-lista {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lista-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.lista-header h2 {
  margin: 0;
  color: #2c3e50;
}

.badge {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f8f9fa;
}

td {
  padding: 1rem;
}

.producto-nombre strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.descripcion {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
}

.badge-categoria {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.cat-electrónica { background: #e3f2fd; color: #1976d2; }
.cat-ropa { background: #fce4ec; color: #c2185b; }
.cat-alimentos { background: #e8f5e9; color: #388e3c; }
.cat-hogar { background: #fff3e0; color: #f57c00; }
.cat-deportes { background: #f3e5f5; color: #7b1fa2; }
.cat-otros { background: #eceff1; color: #546e7a; }

.precio,
.cantidad {
  font-weight: 600;
  color: #2c3e50;
}

.valor-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #27ae60;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-icono {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-icono:hover {
  transform: scale(1.1);
}

.btn-editar {
  background: #e3f2fd;
}

.btn-editar:hover {
  background: #bbdefb;
}

.btn-eliminar {
  background: #ffebee;
}

.btn-eliminar:hover {
  background: #ffcdd2;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.empty-state small {
  color: #95a5a6;
}

@media (max-width: 768px) {
  .producto-lista {
    padding: 1rem;
  }

  .lista-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
