<template>
  <!-- Diseño para version 2 -->
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Solicitud de Licencia</h1>
        
        <!-- Objeto de Trámite (Versión 4) -->
        <div class="mb-10">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <DocumentTextIcon class="w-7 h-7 mr-3 text-indigo-600" />
            Objeto de Trámite
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="tramite in objetosTramite"
              :key="tramite.id"
              @click="selectedTramite = tramite.id"
              :class="[
                'relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2',
                selectedTramite === tramite.id
                  ? 'border-indigo-500 shadow-lg transform scale-105 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              ]"
            >
              <div class="text-center">
                <div :class="[
                  'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
                  selectedTramite === tramite.id ? 'bg-indigo-500' : 'bg-gray-100'
                ]">
                  <component 
                    :is="getTramiteIcon(tramite.id)" 
                    :class="[
                      'w-8 h-8',
                      selectedTramite === tramite.id ? 'text-white' : 'text-gray-600'
                    ]" 
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tramite.nombre }}</h3>
                <p class="text-sm text-gray-600">{{ tramite.descripcion }}</p>
              </div>
              <div 
                v-if="selectedTramite === tramite.id"
                class="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
              >
                <CheckIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tipos de Licencia y Modalidades (Versión 1) -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Tipos de Licencia y Modalidades</h2>
          <p class="text-sm text-gray-600 mb-4">Puedes seleccionar múltiples modalidades de diferentes tipos de licencia.</p>
          
          <div class="space-y-4">
            <div 
              v-for="licencia in tiposLicencia" 
              :key="licencia.id"
              class="border border-gray-200 rounded-lg overflow-hidden"
            >
              <!-- Header de la licencia -->
              <div 
                @click="toggleLicencia(licencia.id)"
                class="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-5 h-5 flex items-center justify-center">
                    <ChevronRightIcon 
                      :class="['w-4 h-4 text-gray-500 transition-transform', expandedLicencias.includes(licencia.id) ? 'rotate-90' : '']"
                    />
                  </div>
                  <h3 class="font-medium text-gray-900">{{ licencia.nombre }}</h3>
                  <span 
                    v-if="getSelectedModalidadesCount(licencia.id) > 0"
                    class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {{ getSelectedModalidadesCount(licencia.id) }} seleccionada{{ getSelectedModalidadesCount(licencia.id) > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>

              <!-- Modalidades -->
              <div 
                v-show="expandedLicencias.includes(licencia.id)"
                class="p-4 bg-white"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label 
                    v-for="modalidad in licencia.modalidades" 
                    :key="modalidad.id"
                    class="relative cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      :value="modalidad.id"
                      v-model="selectedModalidades"
                      class="sr-only peer"
                    >
                    <div class="border-2 rounded-lg p-3 transition-all border-gray-200 hover:border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-50">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-medium text-sm">{{ modalidad.nombre }}</div>
                          <div class="text-xs text-gray-500 mt-1">{{ modalidad.descripcion }}</div>
                        </div>
                        <div 
                          v-if="selectedModalidades.includes(modalidad.id)"
                          class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckIcon class="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Selección -->
        <div v-if="selectedModalidades.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen de Selección</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="mb-2">
              <span class="font-medium">Objeto de trámite:</span> 
              {{ getSelectedTramiteNombre() }}
            </div>
            <div>
              <span class="font-medium">Modalidades seleccionadas:</span>
              <ul class="mt-2 space-y-1">
                <li 
                  v-for="modalidad in getSelectedModalidadesDetails()" 
                  :key="modalidad.id"
                  class="flex items-center space-x-2"
                >
                  <CheckIcon class="w-4 h-4 text-green-500" />
                  <span class="text-sm">{{ modalidad.licencia }} - {{ modalidad.nombre }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button 
            @click="resetForm"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Formulario
          </button>
          <button 
            @click="submitForm"
            :disabled="!isFormValid"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              isFormValid 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Enviar Solicitud
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ChevronRightIcon, 
  CheckIcon, 
  DocumentTextIcon,
  PlusIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

// Estado reactivo
const selectedTramite = ref('')
const selectedModalidades = ref([])
const expandedLicencias = ref([])

// Datos del formulario
const objetosTramite = [
  { id: 'inicial', nombre: 'Inicial', descripcion: 'Primera solicitud' },
  { id: 'prorroga', nombre: 'Prórroga', descripcion: 'Extensión de plazo' },
  { id: 'modificacion', nombre: 'Modificación', descripcion: 'Cambio de condiciones' },
  { id: 'revalidacion', nombre: 'Revalidación', descripcion: 'Renovación de vigencia' }
]

const tiposLicencia = [
  {
    id: 'construccion',
    nombre: 'Licencia de Construcción',
    modalidades: [
      { id: 'const_obra_nueva', nombre: 'Obra Nueva', descripcion: 'Construcción desde cero' },
      { id: 'const_ampliacion', nombre: 'Ampliación', descripcion: 'Extensión de construcción existente' },
      { id: 'const_adecuacion', nombre: 'Adecuación', descripcion: 'Modificación de espacios internos' },
      { id: 'const_reforzamiento', nombre: 'Reforzamiento', descripcion: 'Mejora estructural' },
      { id: 'const_reconstruccion', nombre: 'Reconstrucción', descripcion: 'Reedificación de estructura' }
    ]
  },
  {
    id: 'urbanismo',
    nombre: 'Licencia de Urbanismo',
    modalidades: [
      { id: 'urb_parcelacion', nombre: 'Parcelación', descripcion: 'División de predios' },
      { id: 'urb_subdivision', nombre: 'Subdivisión', descripcion: 'División menor de lotes' },
      { id: 'urb_urbanizacion', nombre: 'Urbanización', descripcion: 'Desarrollo urbano integral' },
      { id: 'urb_loteo', nombre: 'Loteo', descripcion: 'División en lotes para venta' }
    ]
  },
  {
    id: 'demolicion',
    nombre: 'Licencia de Demolición',
    modalidades: [
      { id: 'demo_total', nombre: 'Demolición Total', descripcion: 'Derribo completo' },
      { id: 'demo_parcial', nombre: 'Demolición Parcial', descripcion: 'Derribo de parte de la estructura' }
    ]
  },
  {
    id: 'intervencion',
    nombre: 'Licencia de Intervención',
    modalidades: [
      { id: 'int_conservacion', nombre: 'Conservación', descripcion: 'Mantenimiento de patrimonio' },
      { id: 'int_restauracion', nombre: 'Restauración', descripcion: 'Recuperación de estado original' },
      { id: 'int_primeros_auxilios', nombre: 'Primeros Auxilios', descripcion: 'Intervención de emergencia' },
      { id: 'int_consolidacion', nombre: 'Consolidación', descripcion: 'Refuerzo estructural patrimonial' }
    ]
  }
]

// Métodos para iconos
const getTramiteIcon = (tramiteId) => {
  const icons = {
    inicial: PlusIcon,
    prorroga: ArrowPathIcon,
    modificacion: WrenchScrewdriverIcon,
    revalidacion: CheckIcon
  }
  return icons[tramiteId] || DocumentTextIcon
}

// Métodos
const toggleLicencia = (licenciaId) => {
  const index = expandedLicencias.value.indexOf(licenciaId)
  if (index > -1) {
    expandedLicencias.value.splice(index, 1)
  } else {
    expandedLicencias.value.push(licenciaId)
  }
}

const getSelectedModalidadesCount = (licenciaId) => {
  const licencia = tiposLicencia.find(l => l.id === licenciaId)
  if (!licencia) return 0
  
  return licencia.modalidades.filter(m => selectedModalidades.value.includes(m.id)).length
}

const getSelectedTramiteNombre = () => {
  const tramite = objetosTramite.find(t => t.id === selectedTramite.value)
  return tramite ? tramite.nombre : 'No seleccionado'
}

const getSelectedModalidadesDetails = () => {
  const details = []
  
  tiposLicencia.forEach(licencia => {
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

const resetForm = () => {
  selectedTramite.value = ''
  selectedModalidades.value = []
  expandedLicencias.value = []
}

const submitForm = () => {
  if (isFormValid.value) {
    const formData = {
      tramite: selectedTramite.value,
      modalidades: getSelectedModalidadesDetails()
    }
    
    console.log('Datos del formulario:', formData)
    
    const resumen = getSelectedModalidadesDetails()
      .map(m => `• ${m.licencia}: ${m.nombre}`)
      .join('\n')
    
    alert(`¡Solicitud enviada correctamente!\n\nTrámite: ${getSelectedTramiteNombre()}\nModalidades (${selectedModalidades.value.length}):\n${resumen}\n\nRevisa la consola para más detalles.`)
  }
}

// Computed
const isFormValid = computed(() => {
  return selectedTramite.value && selectedModalidades.value.length > 0
})

// Expandir automáticamente las licencias al cargar
expandedLicencias.value = tiposLicencia.map(l => l.id)
</script>