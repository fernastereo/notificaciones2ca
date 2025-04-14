<template >
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto flex items-center gap-x-1.5">
        <h1 class="text-2xl font-semibold text-gray-900">Turnos</h1>
        <button type="button" @click="fetchTurnos" class="inline-flex pt-1 items-center gap-x-1.5 rounded-md text-center text-sm font-semibold">
          <ArrowPathIcon class="size-6" :class="{ 'animate-spin': isLoading }"/>
        </button>
      </div>
      <div class="mt-4 sm:mt-0 sm:block md:flex justify-between md:w-md">
        <div class="flex flex-1 items-center justify-center mb-4 md:mb-0 md:mx-6 md:justify-end">
          <SearchInput 
            @input="handleLocalSearch"
            @search="handleApiSearch"
            placeholder="Buscar..."
          />
        </div>
        <button type="button" @click="navigateTo({ name: 'nuevo-turno' })" class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
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
            <TurnosTable :expedientes="filteredExpedientes" />
            <Pagination :pagination="turnos.pagination" @page-change="changePage" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import TurnosTable from '@/components/turnos/TurnosTable.vue'
  import Pagination from '@/components/common/Pagination.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import SearchInput from '@/components/common/SearchInput.vue'
  import { PlusIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'
  import { useTurnos } from '@/composables/useTurnos'

  const router = useRouter()
  const isLoading = ref(false)
  const { getTurnos, turnos, apiError } = useTurnos()
  const searchTerm = ref('')

  const filteredExpedientes = computed(() => {
    if (!searchTerm.value) return turnos.value.expedientes || []

    const term = searchTerm.value.toLowerCase()
    return (turnos.value.expedientes || []).filter(expediente => {
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

  const handleLocalSearch = (value) => {
    searchTerm.value = value
  }

  const handleApiSearch = (value) => {
    searchTerm.value = value
    
    fetchTurnos(1, value)

  }

  const changePage = async (page) => {
    await fetchTurnos(page, searchTerm.value)
  }

  onMounted(async () => {
    await fetchTurnos()
  })

  const navigateTo = (route) => {
    router.push(route)
  }
</script>


