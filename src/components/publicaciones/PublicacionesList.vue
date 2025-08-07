<template>
  <div class="min-h-screen bg-gray-50 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header con título y botón crear -->
      <div class="bg-white rounded-lg shadow-sm border mb-4">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon class="h-8 w-8 text-red-600 mr-3" />
              Gestión de Publicaciones
            </h1>
            <p class="text-gray-600 mt-1">Administre todas las publicaciones del sistema</p>
          </div>
          <router-link
            :to="{ name: 'nuevo-publicaciones' }"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Nueva Publicación
          </router-link>
        </div>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow-sm border mb-4 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Búsqueda -->
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Buscar por referencia..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <!-- Filtro por tipo -->
          <select
            v-model="filtros.tipo"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            :disabled="loadingTipos"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in tiposPublicacion" :key="tipo.id" :value="tipo.id">
              {{ tipo.descripcion }}
            </option>
          </select>

          <!-- Filtro por estado -->
          <select
            v-model="filtros.estado"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Todos los estados</option>
            <option value="1">Borrador</option>
            <option value="2">Publicado</option>
            <option value="3">Archivado</option>
          </select>
        </div>

        <!-- Botón limpiar filtros -->
        <div class="mt-4 flex justify-end" v-if="filtros.busqueda || filtros.tipo || filtros.estado">
          <button
            @click="limpiarFiltrosComposable"
            class="text-red-600 hover:text-red-800 text-sm flex items-center"
          >
            <XMarkIcon class="h-4 w-4 mr-1" />
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <DocumentTextIcon class="h-8 w-8 text-blue-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ publicacionesFiltradas.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <CheckCircleIcon class="h-8 w-8 text-green-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Publicadas</p>
              <p class="text-2xl font-bold text-gray-900">{{ contarPorEstado(2) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <PencilIcon class="h-8 w-8 text-yellow-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Borradores</p>
              <p class="text-2xl font-bold text-gray-900">{{ contarPorEstado(1) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <ArchiveBoxIcon class="h-8 w-8 text-gray-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Archivadas</p>
              <p class="text-2xl font-bold text-gray-900">{{ contarPorEstado(3) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de publicaciones -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-2 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Publicaciones ({{ publicacionesFiltradas.length }})
          </h2>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p class="mt-2 text-gray-600">Cargando publicaciones...</p>
        </div>

        <!-- Error -->
        <div v-else-if="apiError" class="p-8 text-center">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p class="text-red-600 font-medium">{{ apiError }}</p>
          <button 
            @click="cargarPublicaciones"
            class="mt-4 text-red-600 hover:text-red-800 underline"
          >
            Intentar nuevamente
          </button>
        </div>

        <!-- Tabla -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Publicación
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="publicacion in publicaciones" :key="publicacion.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    <a class="underline underline-offset-2 text-blue-600 hover:text-blue-800" :href="`${aws_url}${publicacion.archivo}`" target="_blank">
                      {{ publicacion.referencia.substring(0, 50) }}{{ publicacion.referencia.length > 50 ? '...' : '' }}
                    </a>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="obtenerClaseTipo(publicacion.tipopublicacion_id)">
                    {{ obtenerLabelTipo(publicacion.tipopublicacion_id) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ formatearFecha(publicacion.fecha) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ formatearFecha(publicacion.fechapublicacion) }}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="obtenerClaseEstado(publicacion.estado)">
                    {{ obtenerLabelEstado(publicacion.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="verPublicacion(publicacion)"
                      class="text-blue-600 hover:text-blue-900 p-1"
                      title="Ver detalles"
                    >
                      <EyeIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="editarPublicacion(publicacion)"
                      class="text-yellow-600 hover:text-yellow-900 p-1"
                      title="Editar"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="confirmarEliminacion(publicacion)"
                      class="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div class="px-6 py-4 bg-white border-t border-gray-200">
            <div class="flex items-center justify-between">
              <!-- Información de registros -->
              <div class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ ((paginacion.pagina - 1) * paginacion.porPagina) + 1 }}</span>
                a
                <span class="font-medium">
                  {{ Math.min(paginacion.pagina * paginacion.porPagina, publicacionesFiltradas.length) }}
                </span>
                de
                <span class="font-medium">{{ publicacionesFiltradas.length }}</span>
                registros
              </div>

              <!-- Controles de paginación -->
              <div class="flex items-center space-x-2">
                <!-- Botones de navegación -->
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <!-- Primera página -->
                  <button
                    @click="cambiarPagina(1)"
                    :disabled="paginacion.pagina === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginacion.pagina === 1 }"
                  >
                    <span class="sr-only">Primera página</span>
                    <ChevronDoubleLeftIcon class="h-4 w-4" />
                  </button>

                  <!-- Página anterior -->
                  <button
                    @click="cambiarPagina(paginacion.pagina - 1)"
                    :disabled="paginacion.pagina === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginacion.pagina === 1 }"
                  >
                    <span class="sr-only">Anterior</span>
                    <ChevronLeftIcon class="h-4 w-4" />
                  </button>

                  <!-- Número de página actual -->
                  <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {{ paginacion.pagina }} de {{ totalPaginas }}
                  </span>

                  <!-- Página siguiente -->
                  <button
                    @click="cambiarPagina(paginacion.pagina + 1)"
                    :disabled="paginacion.pagina >= totalPaginas"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginacion.pagina >= totalPaginas }"
                  >
                    <span class="sr-only">Siguiente</span>
                    <ChevronRightIcon class="h-4 w-4" />
                  </button>

                  <!-- Última página -->
                  <button
                    @click="cambiarPagina(totalPaginas)"
                    :disabled="paginacion.pagina >= totalPaginas"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginacion.pagina >= totalPaginas }"
                  >
                    <span class="sr-only">Última página</span>
                    <ChevronDoubleRightIcon class="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Indicador de carga en background -->
          <div v-if="loadingBackground" class="px-6 py-2 bg-yellow-50 border-t border-yellow-100">
            <p class="text-sm text-yellow-600 flex items-center">
              <ArrowPathIcon class="h-4 w-4 mr-2 animate-spin" />
              Cargando publicaciones adicionales...
            </p>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación de eliminación -->
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center mb-4">
            <ExclamationTriangleIcon class="h-8 w-8 text-red-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
          </div>
          <p class="text-gray-600 mb-6">
            ¿Está seguro de que desea eliminar esta publicación? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarConfirmacion = false"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              @click="eliminarPublicacion"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              :disabled="loading"
            >
              {{ loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de vista detallada -->
      <div v-if="mostrarDetalle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Detalles de la Publicación</h2>
            <button
              @click="mostrarDetalle = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          <div class="p-6" v-if="publicacionSeleccionada">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Referencia</label>
                <p class="mt-1 text-sm text-gray-900">{{ publicacionSeleccionada.referencia }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tipo</label>
                  <p class="mt-1 text-sm text-gray-900">{{ obtenerLabelTipo(publicacionSeleccionada.tipopublicacion_id) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <p class="mt-1 text-sm text-gray-900">{{ obtenerLabelEstado(publicacionSeleccionada.estado) }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatearFecha(publicacionSeleccionada.fecha) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatearFecha(publicacionSeleccionada.fechapublicacion) }}</p>
                </div>
              </div>
              <div v-if="publicacionSeleccionada.archivo">
                <label class="block text-sm font-medium text-gray-700">Archivo Adjunto</label>
                <div class="mt-1 flex items-center space-x-2">
                  <DocumentIcon class="h-5 w-5 text-gray-400" />
                  <a class="underline underline-offset-2 text-blue-600 hover:text-blue-800" :href="`${aws_url}${publicacionSeleccionada.archivo}`" target="_blank">
                    <span class="text-sm">{{ publicacionSeleccionada.archivo }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { usePublicaciones } from '@/composables/usePublicaciones'
import { useTiposPublicacion } from '@/composables/useTiposPublicacion'

const router = useRouter()
const { 
  publicaciones,
  publicacionesFiltradas,
  filtros,
  apiError,
  loading,
  loadingBackground,
  paginacion,
  totalPaginas,
  getPublicacionesIniciales,
  deletePublicacion,
  actualizarFiltros,
  limpiarFiltros: limpiarFiltrosComposable,
  cambiarPagina
} = usePublicaciones()

const { 
  tiposPublicacion,
  loading: loadingTipos,
  getTiposPublicacion 
} = useTiposPublicacion()

// Estado reactivo local
const mostrarConfirmacion = ref(false)
const mostrarDetalle = ref(false)
const publicacionSeleccionada = ref(null)
const aws_url = ref(import.meta.env.VITE_AWS_URL)

// Métodos
const contarPorEstado = (estado) => {
  return publicacionesFiltradas.value.filter(pub => pub.estado === estado).length
}

const obtenerLabelTipo = (tipo) => {
  const tipoEncontrado = tiposPublicacion.value.find(t => t.id === tipo)
  return tipoEncontrado ? tipoEncontrado.descripcion : tipo
}

const obtenerClaseTipo = (tipo) => {
  const clases = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-purple-100 text-purple-800'
  }
  return clases[tipo] || 'bg-gray-100 text-gray-800'
}

const obtenerLabelEstado = (estado) => {
  const estados = {
    1: 'Borrador',
    2: 'Publicado',
    3: 'Archivado'
  }
  return estados[estado] || estado
}

const obtenerClaseEstado = (estado) => {
  const clases = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-gray-100 text-gray-800'
  }
  return clases[estado] || 'bg-gray-100 text-gray-800'
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'No definida'
  const date = new Date(fecha)
  const dia = date.getDate().toString().padStart(2, '0')
  const mes = (date.getMonth() + 1).toString().padStart(2, '0')
  const año = date.getFullYear()
  return `${dia}-${mes}-${año}`
}

const editarPublicacion = (publicacion) => {
  router.push({ 
    name: 'editar-publicaciones',
    params: { id: publicacion.id }
  })
}

const verPublicacion = (publicacion) => {
  publicacionSeleccionada.value = publicacion
  mostrarDetalle.value = true
}

const confirmarEliminacion = (publicacion) => {
  publicacionSeleccionada.value = publicacion
  mostrarConfirmacion.value = true
}

const eliminarPublicacion = async () => {
  if (!publicacionSeleccionada.value) return
  
  const resultado = await deletePublicacion(publicacionSeleccionada.value.id)
  if (resultado.status === 'success') {
    await cargarPublicaciones()
    mostrarConfirmacion.value = false
    publicacionSeleccionada.value = null
  }
}

const cargarPublicaciones = async () => {
  await getPublicacionesIniciales()
}

// Inicialización
onMounted(async () => {
  await Promise.all([
    getPublicacionesIniciales(),
    getTiposPublicacion()
  ])
})
</script>

<style scoped>
/* Estilos personalizados */
.table-fixed {
  table-layout: fixed;
}

/* Animaciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #dc2626;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b91c1c;
}
</style>