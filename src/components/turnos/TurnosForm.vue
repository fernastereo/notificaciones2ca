<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">{{ isEdit ? 'Editar Turno ' + turnoId : 'Nuevo Turno' }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ isEdit ? 'Modifique los datos del turno.' : 'Complete el formulario para crear un nuevo turno.' }}
        </p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
              <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <!-- Fecha y Hora -->
                <div>
                  <label for="fecha" class="block text-sm font-medium leading-6 text-gray-900">Fecha</label>
                  <div class="mt-2">
                    <input
                      type="date"
                      v-model="formData.fecha"
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label for="hora" class="block text-sm font-medium leading-6 text-gray-900">Hora</label>
                  <div class="mt-2">
                    <input
                      type="time"
                      v-model="formData.hora"
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <!-- Dirección -->
                <div class="sm:col-span-2">
                  <label for="direccion" class="block text-sm font-medium leading-6 text-gray-900">Dirección</label>
                  <div class="mt-2">
                    <input
                      type="text"
                      v-model="formData.direccion"
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <!-- Responsables -->
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium leading-6 text-gray-900">Responsables</label>
                  <div class="mt-2 space-y-4">
                    <div v-for="(responsable, index) in formData.responsables" :key="index" class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
                      <div>
                        <label :for="'tipo-' + index" class="block text-sm font-medium leading-6 text-gray-900">Tipo</label>
                        <div class="mt-2">
                          <select
                            :id="'tipo-' + index"
                            v-model="responsable.tiporesponsable_id"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Seleccione un tipo</option>
                            <option v-for="tipo in tiposResponsable" :key="tipo.id" :value="tipo.id">
                              {{ tipo.nombre }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label :for="'nombre-' + index" class="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                        <div class="mt-2">
                          <input
                            :id="'nombre-' + index"
                            type="text"
                            v-model="responsable.nombre"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label :for="'telefono-' + index" class="block text-sm font-medium leading-6 text-gray-900">Teléfono</label>
                        <div class="mt-2">
                          <input
                            :id="'telefono-' + index"
                            type="tel"
                            v-model="responsable.telefono"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="addResponsable"
                      class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Agregar Responsable
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  @click="$router.push({ name: 'turnos' })"
                  class="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <span v-if="loading">Guardando...</span>
                  <span v-else>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTurnos } from '@/composables/useTurnos'

const router = useRouter()
const route = useRoute()
const { createTurno, loading, apiError } = useTurnos()

const isEdit = computed(() => route.name === 'editar-turno')
const turnoId = computed(() => route.params.id)

const tiposResponsable = ref([
  { id: 1, nombre: 'Propietario' },
  { id: 2, nombre: 'Arquitecto' },
  { id: 3, nombre: 'Constructor' },
  { id: 4, nombre: 'Interventor' }
])

const formData = reactive({
  fecha: '',
  hora: '',
  direccion: '',
  responsables: [
    {
      tiporesponsable_id: '',
      nombre: '',
      telefono: ''
    }
  ]
})

const addResponsable = () => {
  formData.responsables.push({
    tiporesponsable_id: '',
    nombre: '',
    telefono: ''
  })
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      // Lógica para actualizar el turno
      console.log('Actualizando turno:', turnoId.value)
    } else {
      const result = await createTurno(formData)
      if (result) {
        router.push({ name: 'turnos' })
      }
    }
  } catch (error) {
    console.error('Error al guardar el turno:', error)
  }
}

onMounted(() => {
  if (isEdit.value) {
    // Aquí cargaríamos los datos del turno a editar usando el turnoId
    console.log('Cargando datos del turno:', turnoId.value)
  }
})
</script> 