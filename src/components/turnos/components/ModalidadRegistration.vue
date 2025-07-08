<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Solicitud de Licencia</h1>
        
        <!-- Objeto de Trámite -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Objeto de Trámite *
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label 
              v-for="tramite in objetosTramite" 
              :key="tramite.id"
              class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="selectedTramite === tramite.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
            >
              <input 
                type="radio" 
                :value="tramite.id" 
                v-model="selectedTramite"
                class="mr-3 text-blue-600"
              >
              <div>
                <div class="font-medium text-sm">{{ tramite.nombre }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Tipos de Licencia y Modalidades -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Seleccione las modalidades requeridas *
          </label>
          <p class="text-sm text-gray-600 mb-4">
            Puede seleccionar múltiples modalidades del mismo tipo de licencia o de diferentes tipos.
          </p>
          
          <!-- Indicador de carga -->
          <div v-if="loading" class="text-center py-4">
            <p class="text-gray-500">Cargando licencias...</p>
          </div>
          
          <div v-else class="space-y-6">
            <div 
              v-for="licencia in tiposLicencia" 
              :key="licencia.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                {{ licencia.nombre }}
                <span 
                  v-if="getSelectedModalidadesCount(licencia.id) > 0"
                  class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {{ getSelectedModalidadesCount(licencia.id) }} seleccionada{{ getSelectedModalidadesCount(licencia.id) > 1 ? 's' : '' }}
                </span>
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label 
                  v-for="modalidad in licencia.modalidades" 
                  :key="modalidad.id"
                  class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="selectedModalidades.includes(modalidad.id) ? 'border-green-500 bg-green-50' : 'border-gray-200'"
                >
                  <input 
                    type="checkbox" 
                    :value="modalidad.id"
                    v-model="selectedModalidades"
                    class="mt-1 mr-3 text-green-600"
                  >
                  <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">{{ modalidad.nombre }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen Simple -->
        <div v-if="selectedModalidades.length > 0" class="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-medium text-gray-900 mb-3">Resumen de su solicitud:</h3>
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium text-gray-700">Trámite:</span>
              <span class="text-sm text-gray-900 ml-2">{{ getSelectedTramiteNombre() }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-700">Modalidades ({{ selectedModalidades.length }}):</span>
              <div class="mt-1 flex flex-wrap gap-2">
                <span 
                  v-for="modalidad in getSelectedModalidadesDetails()" 
                  :key="modalidad.id"
                  class="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                >
                  {{ modalidad.licencia }} - {{ modalidad.nombre }}
                  <button
                    @click="removeModalidad(modalidad.id)"
                    class="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button 
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Limpiar
          </button>
          <button 
            @click="submitForm"
            :disabled="!isFormValid"
            class="px-6 py-2 rounded font-medium"
            :class="isFormValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
          >
            Enviar Solicitud
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useTiposLicencia } from '@/composables/useTiposLicencia'

// Composable
const { tiposLicencia, loading, getTiposLicencia } = useTiposLicencia()

// Estado reactivo
const selectedTramite = ref('')
const selectedModalidades = ref([])

// Datos del formulario
const objetosTramite = [
  { id: 'inicial', nombre: 'Inicial'},
  { id: 'prorroga', nombre: 'Prórroga'},
  { id: 'modificacion', nombre: 'Modificación'},
  { id: 'revalidacion', nombre: 'Revalidación' }
]

// Cargar datos al montar el componente
onMounted(() => {
  getTiposLicencia()
})

// Métodos
const getSelectedModalidadesCount = (licenciaId) => {
  const licencia = tiposLicencia.value.find(l => l.id === licenciaId)
  if (!licencia) return 0
  
  return licencia.modalidades.filter(m => selectedModalidades.value.includes(m.id)).length
}

const getSelectedTramiteNombre = () => {
  const tramite = objetosTramite.find(t => t.id === selectedTramite.value)
  return tramite ? tramite.nombre : 'No seleccionado'
}

const getSelectedModalidadesDetails = () => {
  const details = []
  
  tiposLicencia.value.forEach(licencia => {
    licencia.modalidades.forEach(modalidad => {
      if (selectedModalidades.value.includes(modalidad.id)) {
        details.push({
          id: modalidad.id,
          nombre: modalidad.nombre,
          licencia: licencia.nombre
        })
      }
    })
  })
  
  return details
}

const removeModalidad = (modalidadId) => {
  const index = selectedModalidades.value.indexOf(modalidadId)
  if (index > -1) {
    selectedModalidades.value.splice(index, 1)
  }
}

const resetForm = () => {
  selectedTramite.value = ''
  selectedModalidades.value = []
}

const submitForm = () => {
  if (isFormValid.value) {
    const formData = {
      tramite: selectedTramite.value,
      modalidades: getSelectedModalidadesDetails()
    }
    
    console.log('Datos del formulario:', formData)
    alert(`Solicitud enviada correctamente!\n\nTrámite: ${getSelectedTramiteNombre()}\nModalidades: ${selectedModalidades.value.length}\n\nRevisa la consola para más detalles.`)
  }
}

// Computed
const isFormValid = computed(() => {
  return selectedTramite.value && selectedModalidades.value.length > 0
})
</script>