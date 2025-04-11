<template >
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Turnos</h1>
      </div>
      <div class="mt-4 sm:mt-0 sm:block md:flex justify-between md:w-md">
        <div class="flex flex-1 items-center justify-center mb-4 md:mb-0 md:mx-6 md:justify-end">
          <div class="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
            <input type="search" name="search" class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Buscar..." />
            <MagnifyingGlassIcon class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400" aria-hidden="true" />
          </div>
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
              <tr v-for="expediente in turnos.expedientes" :key="expediente.id">
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
        </div>
        <Pagination :pagination="turnos.pagination" @page-change="cambiarPagina" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import Pagination from '@/components/common/Pagination.vue'
  import Badge from '@/components/common/Badge.vue'
  import { PlusIcon, PencilSquareIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
  import { RouterLink } from 'vue-router'
  import { useTurnos } from '@/composables/useTurnos'
  import { onMounted } from 'vue'

  const { getTurnos, turnos, apiError } = useTurnos()

  onMounted(async () => {
    await getTurnos()
  })

  const cambiarPagina = async (nuevaPagina) => {
    await getTurnos(nuevaPagina)
  };
</script>

