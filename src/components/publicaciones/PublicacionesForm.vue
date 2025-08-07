<template>
  <div class="min-h-screen bg-gray-50 py-4">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border mb-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <PlusCircleIcon class="h-8 w-8 text-red-600 mr-3" />
            {{ isEditing ? 'Editar Publicación' : 'Crear Nueva Publicación' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isEditing ? 'Modifique los datos de la publicación' : 'Complete el formulario para crear una nueva publicación' }}
          </p>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-lg shadow-sm border">
        <form @submit.prevent="guardarPublicacion" class="p-6 space-y-6">
          
          <!-- Fechas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Fecha de Creación -->
            <div>
              <label for="fecha" class="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon class="h-4 w-4 inline mr-1" />
                Fecha de Creación
              </label>
              <input
                id="fecha"
                v-model="publicacion.fecha"
                type="date"
                :readonly=true
                disabled
                :class="[
                  'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none',
                ]"
              />
              <p class="text-xs text-gray-500 mt-1">{{ isEditing ? 'No se puede modificar la fecha de creación' : 'Fecha de creación de la publicación' }}</p>
            </div>

            <!-- Fecha de Publicación -->
            <div>
              <label for="fechapublicacion" class="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon class="h-4 w-4 inline mr-1" />
                Fecha de Publicación *
              </label>
              <input
                id="fechapublicacion"
                v-model="publicacion.fechapublicacion"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-500': errores.fechapublicacion }"
              />
              <p v-if="errores.fechapublicacion" class="text-red-500 text-xs mt-1">{{ errores.fechapublicacion }}</p>
              <p v-else class="text-xs text-gray-500 mt-1">Fecha que se mostrará en la publicación</p>
            </div>
          </div>

          <!-- Tipo de Publicación -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="tipopublicacion_id" class="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon class="h-4 w-4 inline mr-1" />
                Tipo de Publicación *
              </label>
              <select
                id="tipopublicacion_id"
                v-model="publicacion.tipopublicacion_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                :class="{ 'border-red-500': errores.tipopublicacion_id }"
              >
                <option value="">Seleccione un tipo de publicación</option>
                <option v-for="tipo in tiposPublicacion" :key="tipo.id" :value="tipo.id">
                  {{ tipo.descripcion }}
                </option>
              </select>
              <p v-if="errores.tipopublicacion_id" class="text-red-500 text-xs mt-1">{{ errores.tipopublicacion_id }}</p>
            </div>

            <!-- Estado (solo en modo edición) -->
            <div>
              <label for="estado" class="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircleIcon class="h-4 w-4 inline mr-1" />
                Estado de la Publicación
              </label>
              <select
                id="estado"
                v-model="publicacion.estado"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option :value="1">Borrador</option>
                <option :value="2">Publicado</option>
                <option :value="3">Archivado</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                Seleccione el estado actual de la publicación
              </p>
            </div>
          </div>
          <!-- Referencia -->
          <div>
            <label for="referencia" class="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon class="h-4 w-4 inline mr-1" />
              Referencia *
            </label>
            <textarea
              id="referencia"
              v-model="publicacion.referencia"
              required
              rows="2"
              placeholder="Ingrese la referencia o descripción de la publicación..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              :class="{ 'border-red-500': errores.referencia }"
            ></textarea>
            <div class="flex justify-between items-center mt-1">
              <p v-if="errores.referencia" class="text-red-500 text-xs">{{ errores.referencia }}</p>
              <p class="text-xs text-gray-500">{{ publicacion.referencia.length }}/250 caracteres</p>
            </div>
          </div>

          <!-- Carga de Archivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <ArrowUpTrayIcon class="h-4 w-4 inline mr-1" />
              Archivo Adjunto {{ isEditing ? '' : '*' }}
            </label>
            
            <!-- Área de carga -->
            <div 
              @drop="manejarDrop"
              @dragover.prevent
              @dragenter.prevent
              @dragleave="manejarDragLeave"
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors duration-200"
              :class="{ 'border-red-400 bg-red-50': arrastrando }"
            >
              <input
                ref="inputArchivo"
                type="file"
                @change="manejarArchivoSeleccionado"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                class="hidden"
              />
              
              <div v-if="!publicacion.archivo">
                <ArrowUpTrayIcon class="h-8 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Arrastra y suelta un archivo aquí, o</p>
                <button
                  type="button"
                  @click="$refs.inputArchivo.click()"
                  class="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Seleccionar Archivo
                </button>
                <p class="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (máx. 10MB)</p>
              </div>

              <!-- Archivo seleccionado -->
              <div v-else class="flex items-center justify-center space-x-4">
                <div class="flex items-center space-x-2">
                  <DocumentIcon class="h-8 w-8 text-red-600" />
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">
                      {{ typeof publicacion.archivo === 'string' ? publicacion.archivo.split('/').pop() : publicacion.archivo.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ typeof publicacion.archivo === 'string' ? 'Archivo existente' : formatearTamano(publicacion.archivo.size) }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="eliminarArchivo"
                  class="text-red-600 hover:text-red-800 p-1"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <p v-if="errores.archivo" class="text-red-500 text-xs mt-1">{{ errores.archivo }}</p>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-between space-x-4 pt-6 border-t border-gray-200">
            <router-link
              :to="{ name: 'publicaciones' }"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Volver
            </router-link>

            <div class="flex space-x-4">
              <button
                type="button"
                @click="limpiarFormulario"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Limpiar
              </button>

              <button
                type="submit"
                class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
                :disabled="loading"
              >
                <span v-if="loading" class="mr-2">
                  <ArrowPathIcon class="animate-spin h-4 w-4" />
                </span>
                <PaperAirplaneIcon v-else class="h-4 w-4 mr-2" />
                {{ loading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Publicación') }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Toast de notificación -->
      <div
        v-if="mostrarNotificacion"
        class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start space-x-4"
        :class="[notificacion.tipo === 'success' ? 'border-green-500' : 'border-red-500']"
      >
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="notificacion.tipo === 'success'" class="h-6 w-6 text-green-500" />
          <ExclamationCircleIcon v-else class="h-6 w-6 text-red-500" />
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-900">
            {{ notificacion.titulo }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ notificacion.mensaje }}
          </p>
        </div>
        <button
          @click="cerrarNotificacion"
          class="flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePublicaciones } from '@/composables/usePublicaciones'
import { useTiposPublicacion } from '@/composables/useTiposPublicacion'
import { 
  PlusCircleIcon,
  CalendarDaysIcon,
  TagIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { createPublicacion, updatePublicacion, getPublicacionById, loading, apiError } = usePublicaciones()
const { tiposPublicacion, getTiposPublicacion } = useTiposPublicacion()

// Estado reactivo
const publicacion = reactive({
  fecha: new Date().toISOString().split('T')[0],
  fechapublicacion: '',
  referencia: '',
  archivo: null,
  tipopublicacion_id: '',
  estado: 1
})

const errores = reactive({
  fechapublicacion: '',
  referencia: '',
  archivo: '',
  tipopublicacion_id: ''
})

const arrastrando = ref(false)
const mostrarNotificacion = ref(false)
const notificacion = reactive({
  tipo: 'success',
  titulo: '',
  mensaje: ''
})

// Computed properties
const isEditing = computed(() => route.name === 'editar-publicaciones')

// Métodos
const mostrarError = (mensaje) => {
  notificacion.tipo = 'error'
  notificacion.titulo = 'Error'
  notificacion.mensaje = mensaje
  mostrarNotificacion.value = true
  setTimeout(cerrarNotificacion, 5000)
}

const mostrarExito = (mensaje) => {
  notificacion.tipo = 'success'
  notificacion.titulo = 'Éxito'
  notificacion.mensaje = mensaje
  mostrarNotificacion.value = true
  setTimeout(cerrarNotificacion, 5000)
}

const cerrarNotificacion = () => {
  mostrarNotificacion.value = false
}

const validarFormulario = () => {
  let valido = true
  errores.fechapublicacion = ''
  errores.referencia = ''
  errores.archivo = ''
  errores.tipopublicacion_id = ''

  if (!publicacion.fechapublicacion) {
    errores.fechapublicacion = 'La fecha de publicación es requerida'
    valido = false
  }

  if (!publicacion.referencia.trim()) {
    errores.referencia = 'La referencia es requerida'
    valido = false
  }

  if (!isEditing && !publicacion.archivo) {
    errores.archivo = 'El archivo es requerido'
    valido = false
  }

  if (!publicacion.tipopublicacion_id) {
    errores.tipopublicacion_id = 'El tipo de publicación es requerido'
    valido = false
  }

  return valido
}

const guardarPublicacion = async () => {
  if (!validarFormulario()) return

  try {
    const resultado = isEditing.value
      ? await updatePublicacion(route.params.id, publicacion)
      : await createPublicacion(publicacion)

    if (resultado.status === 'success') {
      mostrarExito(isEditing.value ? 'Publicación actualizada correctamente' : 'Publicación creada correctamente')
      // Esperamos 5 segundos antes de redirigir
      setTimeout(() => {
        router.push({ name: 'publicaciones' })
      }, 5000)
    } else {
      mostrarError(resultado.message || 'Ha ocurrido un error')
    }
  } catch (error) {
    mostrarError(error.message || 'Ha ocurrido un error inesperado')
  }
}

const manejarArchivoSeleccionado = (event) => {
  const archivo = event.target.files[0]
  if (archivo) {
    if (archivo.size > 10 * 1024 * 1024) {
      errores.archivo = 'El archivo no debe superar los 10MB'
      return
    }
    publicacion.archivo = archivo
    errores.archivo = ''
  }
}

const manejarDrop = (event) => {
  event.preventDefault()
  arrastrando.value = false
  
  const archivo = event.dataTransfer.files[0]
  if (archivo) {
    if (archivo.size > 10 * 1024 * 1024) {
      errores.archivo = 'El archivo no debe superar los 10MB'
      return
    }
    publicacion.archivo = archivo
    errores.archivo = ''
  }
}

const manejarDragLeave = () => {
  arrastrando.value = false
}

const eliminarArchivo = () => {
  publicacion.archivo = null
  if (this.$refs.inputArchivo) {
    this.$refs.inputArchivo.value = ''
  }
}

const limpiarFormulario = () => {
  Object.assign(publicacion, {
    fecha: new Date().toISOString().split('T')[0],
    fechapublicacion: '',
    referencia: '',
    archivo: null,
    tipopublicacion_id: '',
    estado: 1
  })
  Object.keys(errores).forEach(key => errores[key] = '')
}

const formatearTamano = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Cargar datos si estamos en modo edición
onMounted(async () => {
  // Cargar tipos de publicación
  await getTiposPublicacion()
  
  if (isEditing.value) {
    try {
      const resultado = await getPublicacionById(route.params.id)
      if (resultado.status === 'success') {
        Object.assign(publicacion, resultado.data)
      } else {
        mostrarError('No se pudo cargar la publicación')
        router.push({ name: 'publicaciones' })
      }
    } catch (error) {
      mostrarError('Error al cargar la publicación')
      router.push({ name: 'publicaciones' })
    }
  }
})
</script>

<style scoped>
/* Animaciones personalizadas */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Estilos para el área de drag and drop */
.drag-over {
  border-color: #dc2626;
  background-color: #fef2f2;
}

/* Spinner personalizado */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>