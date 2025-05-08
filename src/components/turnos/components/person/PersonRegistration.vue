<template>
  <div class="person-registration">
    <h2 class="text-xl font-semibold leading-6 text-gray-900 mb-4">Registro de Personas</h2>
    
    <!-- Mensajes de alerta con barra de progreso -->
    <div v-if="alertMessage.show" :class="['alert mb-4 rounded-md overflow-hidden', alertMessage.type === 'success' ? 'bg-green-100 text-green-800' : alertMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800']">
      <div class="p-4 flex items-center">
        <svg v-if="alertMessage.type === 'success'" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="alertMessage.type === 'error'" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ alertMessage.text }}</span>
        <button @click="closeAlert" class="ml-auto text-gray-600 hover:text-gray-900">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Barra de progreso -->
      <div 
        :class="['progress-bar h-1', 
          alertMessage.type === 'success' ? 'bg-green-500' : 
          alertMessage.type === 'error' ? 'bg-red-500' : 'bg-yellow-500']"
        :style="{ animation: 'progress-bar-shrink 10s linear forwards' }"
        :key="alertMessage.timestamp"
      ></div>
    </div>
    
    <!-- Diálogo de confirmación para eliminar -->
    <div v-if="confirmDelete.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-3">Confirmar eliminación</h3>
        <p class="mb-4">¿Está seguro de que desea eliminar a <span class="font-semibold">{{ persons[confirmDelete.index]?.name }}</span>? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDeletePerson" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Botón para agregar nueva persona (visible solo cuando el formulario está oculto) -->
    <div v-if="!showForm" class="mb-4">
      <button 
        @click="showAddForm" 
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Agregar Persona
      </button>
    </div>
    
    <!-- Formulario de ingreso de datos -->
    <div v-if="showForm" class="bg-white p-4 rounded-lg shadow mb-6">
      <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-3">{{ editIndex !== null ? 'Editar Persona' : 'Agregar Nueva Persona' }}</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.name}"
            required
          />
          <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
        </div>
        
        <div class="form-group">
          <label for="identification" class="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
          <input 
            type="text" 
            id="identification" 
            v-model="formData.identification" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.identification}"
            required
          />
          <p v-if="formErrors.identification" class="mt-1 text-sm text-red-600">{{ formErrors.identification }}</p>
        </div>
        
        <div class="form-group">
          <label for="identificationType" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Identificación</label>
          <select 
            id="identificationType" 
            v-model="formData.identificationType" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.identificationType}"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Cédula">Cédula</option>
            <option value="RUC">RUC</option>
          </select>
          <p v-if="formErrors.identificationType" class="mt-1 text-sm text-red-600">{{ formErrors.identificationType }}</p>
        </div>
        
        <div class="form-group">
          <label for="personType" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Persona</label>
          <select 
            id="personType" 
            v-model="formData.personType" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.personType}"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Natural">Natural</option>
            <option value="Jurídica">Jurídica</option>
          </select>
          <p v-if="formErrors.personType" class="mt-1 text-sm text-red-600">{{ formErrors.personType }}</p>
        </div>
        
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.email}"
            required
          />
          <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
        </div>
        
        <div class="form-group">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :class="{'border-red-500': formErrors.phone}"
            required
          />
          <p v-if="formErrors.phone" class="mt-1 text-sm text-red-600">{{ formErrors.phone }}</p>
        </div>
      </div>
      
      <div class="mt-4 flex justify-end space-x-3">
        <button 
          @click="cancelForm" 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancelar
        </button>
        <button 
          @click="addOrUpdatePerson" 
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ editIndex !== null ? 'Guardar Cambios' : 'Guardar' }}
        </button>
      </div>
    </div>
    
    <!-- Estado vacío - Mostrar cuando no hay personas -->
    <div v-if="persons.length === 0 && !showForm" class="empty-state bg-white rounded-lg shadow p-8 text-center">
      <div class="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">No hay personas registradas</h3>
        <p class="text-gray-500 mb-6">Comienza agregando una nueva persona a la lista.</p>
        <button 
          @click="showAddForm" 
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Agregar Persona
        </button>
      </div>
    </div>
    
    <!-- Tabla de personas - Solo mostrar cuando hay datos -->
    <div v-if="persons.length > 0" class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(person, index) in persons" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ person.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.identification }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.identificationType }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.address }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.personType }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ person.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="editPerson(index)" 
                class="text-primary hover:text-primary-dark mr-3"
              >
                Editar
              </button>
              <button 
                @click="showDeleteConfirmation(index)" 
                class="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Estado para controlar la visibilidad del formulario
const showForm = ref(false)

// Estado para el formulario
const formData = reactive({
  name: '',
  identification: '',
  identificationType: '',
  address: '',
  personType: '',
  email: '',
  phone: ''
})

// Estado para errores de formulario
const formErrors = reactive({
  name: '',
  identification: '',
  identificationType: '',
  address: '',
  personType: '',
  email: '',
  phone: ''
})

// Estado para mensajes de alerta
const alertMessage = reactive({
  show: false,
  type: 'info', // 'success', 'error', 'info'
  text: '',
  timestamp: Date.now() // Para forzar la recreación de la barra de progreso
})

// Estado para confirmación de eliminación
const confirmDelete = reactive({
  show: false,
  index: -1
})

// Lista de personas
const persons = ref([])

// Índice de la persona que se está editando (null si estamos agregando una nueva)
const editIndex = ref(null)

// Función para mostrar el formulario de agregar
const showAddForm = () => {
  resetForm()
  showForm.value = true
}

// Función para validar el formulario
const validateForm = () => {
  let isValid = true
  
  // Resetear errores
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  // Validar nombre
  if (!formData.name.trim()) {
    formErrors.name = 'El nombre es obligatorio'
    isValid = false
  }
  
  // Validar identificación
  if (!formData.identification.trim()) {
    formErrors.identification = 'La identificación es obligatoria'
    isValid = false
  }
  
  // Validar tipo de identificación
  if (!formData.identificationType) {
    formErrors.identificationType = 'Seleccione un tipo de identificación'
    isValid = false
  }
  
  // Validar dirección
  if (!formData.address.trim()) {
    formErrors.address = 'La dirección es obligatoria'
    isValid = false
  }
  
  // Validar tipo de persona
  if (!formData.personType) {
    formErrors.personType = 'Seleccione un tipo de persona'
    isValid = false
  }
  
  // Validar email
  if (!formData.email.trim()) {
    formErrors.email = 'El email es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    formErrors.email = 'Ingrese un email válido'
    isValid = false
  }
  
  // Validar teléfono
  if (!formData.phone.trim()) {
    formErrors.phone = 'El teléfono es obligatorio'
    isValid = false
  }
  
  return isValid
}

// Función para agregar o actualizar una persona
const addOrUpdatePerson = () => {
  // Validar formulario
  if (!validateForm()) {
    showAlert('Por favor, corrija los errores en el formulario', 'error')
    return
  }
  
  // Crear una copia del objeto formData
  const personData = { ...formData }
  
  if (editIndex.value !== null) {
    // Actualizar persona existente
    persons.value[editIndex.value] = personData
    showAlert(`Los datos de ${personData.name} han sido actualizados correctamente`, 'success')
    editIndex.value = null
  } else {
    // Agregar nueva persona
    persons.value.push(personData)
    showAlert(`${personData.name} ha sido agregado correctamente`, 'success')
  }
  
  // Ocultar el formulario después de guardar
  showForm.value = false
  
  // Limpiar el formulario
  resetForm()
}

// Función para editar una persona
const editPerson = (index) => {
  // Cargar los datos de la persona en el formulario
  const person = persons.value[index]
  Object.assign(formData, person)
  
  // Establecer el índice de edición
  editIndex.value = index
  
  // Mostrar el formulario
  showForm.value = true
}

// Función para mostrar confirmación de eliminación
const showDeleteConfirmation = (index) => {
  confirmDelete.index = index
  confirmDelete.show = true
}

// Función para cancelar eliminación
const cancelDelete = () => {
  confirmDelete.show = false
  confirmDelete.index = -1
}

// Función para confirmar eliminación
const confirmDeletePerson = () => {
  const personName = persons.value[confirmDelete.index].name
  persons.value.splice(confirmDelete.index, 1)
  
  // Si estábamos editando esta persona, resetear el formulario y ocultar
  if (editIndex.value === confirmDelete.index) {
    resetForm()
    showForm.value = false
  }
  
  // Mostrar mensaje de éxito
  showAlert(`${personName} ha sido eliminado correctamente`, 'success')
  
  // Cerrar diálogo de confirmación
  confirmDelete.show = false
  confirmDelete.index = -1
}

// Función para cancelar el formulario
const cancelForm = () => {
  resetForm()
  showForm.value = false
}

// Función para resetear el formulario
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  
  // Resetear errores
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  editIndex.value = null
}

// Función para mostrar mensajes de alerta
const showAlert = (text, type = 'info') => {
  // Actualizar el timestamp para forzar la recreación de la barra de progreso
  alertMessage.timestamp = Date.now()
  alertMessage.text = text
  alertMessage.type = type
  alertMessage.show = true
  
  // Auto-cerrar después de 10 segundos
  setTimeout(() => {
    if (alertMessage.text === text) {
      alertMessage.show = false
    }
  }, 10000)
}

// Función para cerrar alerta
const closeAlert = () => {
  alertMessage.show = false
}
</script>

<style>


/* Estado vacío */
.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animación de la barra de progreso */
@keyframes progress-bar-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.progress-bar {
  width: 100%;
  transform-origin: left;
}
</style>