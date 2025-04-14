<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:hidden">
      <select 
        v-model="currentTab" 
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
      >
        <option v-for="tab in tabs" :key="tab.name" :value="tab.name">{{ tab.name }}</option>
      </select>
      <ChevronDownIcon class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500" aria-hidden="true" />
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <a 
            v-for="tab in tabs" 
            :key="tab.name" 
            href="#" 
            @click.prevent="currentTab = tab.name"
            :class="[
              currentTab === tab.name 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 
              'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium'
            ]" 
            :aria-current="currentTab === tab.name ? 'page' : undefined"
          >
            <component 
              :is="tab.icon" 
              :class="[
                currentTab === tab.name 
                  ? 'text-indigo-500' 
                  : 'text-gray-400 group-hover:text-gray-500', 
                'mr-2 -ml-0.5 size-5'
              ]" 
              aria-hidden="true" 
            />
            <span>{{ tab.name }}</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="mt-6">
      <div v-if="currentTab === 'Ventanilla'" class="text-center py-12" >
        <VentanillaForm />
      </div>
      <div v-else-if="currentTab === 'Formulario'" class="text-center py-12">
        <FormularioForm />
      </div>
      <div v-else-if="currentTab === 'Documentación'" class="text-center py-12">
        <DocumentacionForm />
      </div>
      <div v-else-if="currentTab === 'Notas'" class="text-center py-12">
        <NotasForm />
      </div>
      <div v-else-if="currentTab === 'Preliquidación'" class="text-center py-12">
        <PreliquidacionForm />
      </div>
      <div v-else-if="currentTab === 'Supervisión'" class="text-center py-12">
        <SupervisionForm />
      </div>
      <div v-else-if="currentTab === 'Preradicación'" class="text-center py-12">
        <PreradicacionForm />
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="mt-6 flex justify-end gap-x-3">
      <button
        type="button"
        @click="handleCancel"
        class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="handleSubmit"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Guardar
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { ChevronDownIcon } from '@heroicons/vue/16/solid'
  import { BuildingOfficeIcon, CreditCardIcon, UserIcon, UsersIcon } from '@heroicons/vue/20/solid'
  import VentanillaForm from '@/components/turnos/tabs/VentanillaForm.vue'
  import FormularioForm from '@/components/turnos/tabs/FormularioForm.vue'
  import DocumentacionForm from '@/components/turnos/tabs/DocumentacionForm.vue'
  import NotasForm from '@/components/turnos/tabs/NotasForm.vue'
  import PreliquidacionForm from '@/components/turnos/tabs/PreliquidacionForm.vue'
  import SupervisionForm from '@/components/turnos/tabs/SupervisionForm.vue'
  import PreradicacionForm from '@/components/turnos/tabs/PreradicacionForm.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const ventanillaTab = ref(null)

  const currentTab = ref('Ventanilla')

  const tabs = [
    { name: 'Ventanilla', icon: UserIcon },
    { name: 'Formulario', icon: BuildingOfficeIcon },
    { name: 'Documentación', icon: UsersIcon },
    { name: 'Notas', icon: CreditCardIcon },
    { name: 'Preliquidación', icon: CreditCardIcon },
    { name: 'Supervisión', icon: CreditCardIcon },
    { name: 'Preradicación', icon: CreditCardIcon },
  ]

  const handleCancel = () => {
    router.push({ name: 'turnos' })
  }

  const handleSubmit = async () => {
    try {
      // Obtener los datos del formulario de la pestaña actual
      const formData = currentTab.value === 'Ventanilla' 
        ? ventanillaTab.value?.formData 
        : {}

      // Aquí iría la lógica para guardar los datos
      console.log('Datos a guardar:', formData)
      
      // Redirigir a la lista de turnos después de guardar
      router.push({ name: 'turnos' })
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }
</script>