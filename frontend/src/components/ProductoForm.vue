
<template>
  <div class="producto-form">
    <h2 class="form-title">
      {{ modoEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <!-- Nombre -->
      <div class="form-group">
        <label for="nombre">Nombre del Producto *</label>
        <input
          id="nombre"
          v-model="formData.nombre"
          type="text"
          placeholder="Ej: Laptop Dell Inspiron"
          required
          minlength="3"
          maxlength="100"
        />
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          v-model="formData.descripcion"
          placeholder="Descripción del producto..."
          rows="3"
          maxlength="500"
        ></textarea>
        <small>{{ formData.descripcion.length }}/500 caracteres</small>
      </div>

      <!-- Precio y Cantidad -->
      <div class="form-row">
        <div class="form-group">
          <label for="precio">Precio (USD) *</label>
          <input
            id="precio"
            v-model.number="formData.precio"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>

        <div class="form-group">
          <label for="cantidad">Cantidad *</label>
          <input
            id="cantidad"
            v-model.number="formData.cantidad"
            type="number"
            min="0"
            placeholder="0"
            required
          />
        </div>
      </div>

      <!-- Categoría -->
      <div class="form-group">
        <label for="categoria">Categoría *</label>
        <select id="categoria" v-model="formData.categoria" required>
          <option value="">Seleccionar categoría</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Ropa">Ropa</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Hogar">Hogar</option>
          <option value="Deportes">Deportes</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <!-- Botones -->
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
        </button>
        <button
          v-if="modoEdicion"
          type="button"
          class="btn btn-secondary"
          @click="cancelarEdicion"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  productoEditar: {
    type: Object,
    default: null
  },
  cargando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancelar'])

// Estado del formulario
const formData = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  cantidad: 0,
  categoria: ''
})

// Modo edición
const modoEdicion = ref(false)

// --- CORREGIDO: primero declaramos resetForm ---
const resetForm = () => {
  modoEdicion.value = false
  formData.value = {
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    categoria: ''
  }
}

// --- El watcher ahora sí puede usar resetForm ---
watch(() => props.productoEditar, (producto) => {
  if (producto) {
    modoEdicion.value = true
    formData.value = {
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0,
      cantidad: producto.cantidad || 0,
      categoria: producto.categoria || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}

const cancelarEdicion = () => {
  resetForm()
  emit('cancelar')
}
</script>


<style scoped>
.producto-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-title {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
}

small {
  display: block;
  margin-top: 0.25rem;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
