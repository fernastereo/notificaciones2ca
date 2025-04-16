<template>
  <div class="sm:px-6 md:px-0">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold leading-6 text-gray-900">{{ isEdit ? 'Editar Turno ' + turnoId : 'Nuevo Turno' }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ isEdit ? 'Modifique los datos del turno.' : 'Complete el formulario para crear un nuevo turno.' }}
        </p>
      </div>
    </div>
    <div class="mt-4 flow-root">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-2">
          <div class="overflow-hidden">
            <form @submit.prevent="handleSubmit" class="space-y-6 p-2 md:p-0">
              <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
                <!-- Fecha y Hora -->
                <div>
                  <label for="fecha" class="block text-sm font-medium leading-6 text-gray-900">Fecha</label>
                  <div class="mt-2">
                    <input
                      type="datetime-local" id="fecha" v-model="formData.fecha" disabled
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label for="turno" class="block text-sm font-medium leading-6 text-gray-900">Turno</label>
                  <div class="mt-2">
                    <input
                      type="text" id="turno" v-model="formData.hora" disabled
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <!-- Dirección -->
                <div class="sm:col-span-2">
                  <label for="direccion" class="block text-sm font-medium leading-6 text-gray-900">Dirección</label>
                  <div class="mt-2">
                    <input 
                      type="text" id="direccion" v-model="formData.direccion" 
                      autocomplete="family-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                  </div>
                </div>

                <!-- Responsables -->
                <div class="sm:col-span-4">
                  <div class="flex items-center gap-2">
                    <label class="block text-sm font-medium leading-6 text-gray-900">Responsables</label>
                    <button type="button" @click="addResponsable" class="relative rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group"><PlusIcon class="h-5 w-5" aria-hidden="true" /><span class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">Agregar responsable</span></button>
                  </div>
                  <div class="mt-2 space-y-4">
                    <div v-for="(responsable, index) in formData.responsables" :key="index" class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-7">
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
                        <label :for="'tipo-identificacion-' + index" class="block text-sm font-medium leading-6 text-gray-900">Tipo ID</label>
                        <div class="mt-2">
                          <select
                            :id="'tipo-identificacion-' + index"
                            v-model="responsable.tipo_identificacion"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Seleccione tipo ID</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="NIT">NIT</option>
                            <option value="TI">Tarjeta de Identidad</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label :for="'identificacion-' + index" class="block text-sm font-medium leading-6 text-gray-900">Identificación</label>
                        <div class="mt-2">
                          <input
                            :id="'identificacion-' + index"
                            type="text"
                            v-model="responsable.identificacion"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
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
                      <div>
                        <label :for="'correo-' + index" class="block text-sm font-medium leading-6 text-gray-900">Correo</label>
                        <div class="mt-2">
                          <input
                            :id="'correo-' + index"
                            type="email"
                            v-model="responsable.correo"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div class="flex items-end">
                        <button type="button" @click="removeResponsable(index)" class="rounded-full bg-red-600 p-2 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                          <TrashIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

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
      tipo_identificacion: '',
      identificacion: '',
      nombre: '',
      telefono: '',
      correo: ''
    }
  ]
})

const addResponsable = () => {
  formData.responsables.push({
    tiporesponsable_id: '',
    tipo_identificacion: '',
    identificacion: '',
    nombre: '',
    telefono: '',
    correo: ''
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