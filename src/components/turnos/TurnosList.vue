<template >
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Turnos</h1>
      </div>
      <div class="mt-4 sm:mt-0 sm:block md:flex justify-between md:w-md">
        <div class="flex flex-1 items-center justify-center mb-4 md:mb-0 md:mx-6 md:justify-end">
          <SearchInput 
            @input="handleLocalSearch"
            @search="handleApiSearch"
            placeholder="Buscar por número de turno, dirección o responsable..."
          />
        </div>
        <button type="button" class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 size-5" aria-hidden="true" />
          Nuevo Turno
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <LoadingSpinner v-if="isLoading" class="flex pt-32 justify-center items-center"/>
          <template v-else>
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Fecha</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Turno</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Responsable</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dirección</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teléfono</th>
                  <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="expediente in filteredExpedientes" :key="expediente.id">
                  <td class="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-700 sm:pl-0">{{ `${expediente.fecha} - ${expediente.hora}` }}</td>
                  <td class="px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{{ `${expediente.numturno.toString().padStart(4, '0')}-${expediente.vigencia}` }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    <Badge color="yellow">Revision Juridica</Badge>
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-700">{{ expediente.responsables[0].nombre }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-700">{{ expediente.direccion }}</td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-700">{{ expediente.responsables[0].telefono }}</td>
                  <td class="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                    <RouterLink :to="'/home/turnos/' + expediente.id" class="text-indigo-600 hover:text-indigo-900">
                      <PencilSquareIcon class="size-5" />
                      <span class="sr-only">, {{ expediente.numturno }}</span>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination :pagination="turnos.pagination" @page-change="changePage" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Pagination from '@/components/common/Pagination.vue'
import Badge from '@/components/common/Badge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { PlusIcon, PencilSquareIcon } from '@heroicons/vue/20/solid'
import { RouterLink } from 'vue-router'
import { useTurnos } from '@/composables/useTurnos'
import { onMounted } from 'vue'

const isLoading = ref(false)
const { getTurnos, turnos, apiError } = useTurnos()
const searchTerm = ref('')

const filteredExpedientes = computed(() => {
  if (!searchTerm.value) return turnos.value.expedientes

  const term = searchTerm.value.toLowerCase()
  return turnos.value.expedientes.filter(expediente => {
    return (
      expediente.numturno.toString().includes(term) ||
      expediente.direccion.toLowerCase().includes(term) ||
      expediente.responsables[0].nombre.toLowerCase().includes(term)
    )
  })
})

const fetchTurnos = async (page = 1, search = '') => {
  isLoading.value = true
  try {
    await getTurnos(page, 10, search)
  } finally {
    isLoading.value = false
  }
}

const handleLocalSearch = (query) => {
  searchTerm.value = query
}

const handleApiSearch = (query) => {
  searchTerm.value = query
  
  fetchTurnos(1, query)
}

onMounted(async () => {
  await fetchTurnos()
})

const changePage = async (nuevaPagina) => {
  await fetchTurnos(nuevaPagina, searchTerm.value)
}
</script>

