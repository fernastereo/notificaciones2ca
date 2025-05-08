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

              </div>
              <!-- Responsables -->
              <PersonRegistration />
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
import PersonRegistration from '../components/person/PersonRegistration.vue'

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