<template>
  <div class="space-y-6">
    <!-- Selector de pestañas para móvil -->
    <MobileTabSelector 
      :tabs="tabs" 
      v-model="currentTab" 
    />

    <!-- Navegación de pestañas para escritorio -->
    <DesktopTabNavigation 
      :tabs="tabs" 
      v-model="currentTab" 
    />

    <!-- Contenido de las pestañas -->
    <div class="mt-6">
      <component 
        :is="getCurrentTabComponent" 
        v-if="getCurrentTabComponent"
      />
    </div>

    <!-- Botones de acción -->
    <ActionButtons 
      @cancel="handleCancel"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRouter } from 'vue-router'
import { ComputerDesktopIcon, WindowIcon, ClipboardDocumentCheckIcon, DocumentPlusIcon, CurrencyDollarIcon, DocumentMagnifyingGlassIcon, DocumentCheckIcon } from '@heroicons/vue/20/solid'
import MobileTabSelector from './components/MobileTabSelector.vue'
import DesktopTabNavigation from './components/DesktopTabNavigation.vue'
import ActionButtons from './components/ActionButtons.vue'
import VentanillaForm from './tabs/VentanillaForm.vue'
import FormularioForm from './tabs/FormularioForm.vue'
import DocumentacionForm from './tabs/DocumentacionForm.vue'
import NotasForm from './tabs/NotasForm.vue'
import PreliquidacionForm from './tabs/PreliquidacionForm.vue'
import SupervisionForm from './tabs/SupervisionForm.vue'
import PreradicacionForm from './tabs/PreradicacionForm.vue'

const router = useRouter()
const currentTab = ref('Ventanilla')

// Estado para manejar submit handlers de cada tab
const submitHandlers = ref(new Map())

// Provide función para que los tabs se registren
provide('registerSubmit', (tabName, submitHandler) => {
  submitHandlers.value.set(tabName, submitHandler)
})

// Configuración de las pestañas
const tabs = [
  { 
    name: 'Ventanilla', 
    component: VentanillaForm,
    icon: ComputerDesktopIcon
  },
  { 
    name: 'Formulario', 
    component: FormularioForm,
    icon: WindowIcon
  },
  { 
    name: 'Documentación', 
    component: DocumentacionForm,
    icon: ClipboardDocumentCheckIcon
  },
  { 
    name: 'Notas', 
    component: NotasForm,
    icon: DocumentPlusIcon
  },
  { 
    name: 'Preliquidación', 
    component: PreliquidacionForm,
    icon: CurrencyDollarIcon
  },
  { 
    name: 'Supervisión', 
    component: SupervisionForm,
    icon: DocumentMagnifyingGlassIcon
  },
  { 
    name: 'Preradicación', 
    component: PreradicacionForm,
    icon: DocumentCheckIcon
  }
]

// Computed para obtener el componente actual
const getCurrentTabComponent = computed(() => {
  const tab = tabs.find(t => t.name === currentTab.value)
  return tab?.component
})

// Manejadores de eventos
const handleCancel = () => {
  router.push({ name: 'turnos' })
}

const handleSubmit = async () => {
  try {
    // Obtener el handler del tab actual
    const currentSubmitHandler = submitHandlers.value.get(currentTab.value)
    
    if (currentSubmitHandler) {
      // Ejecutar la lógica de submit del tab activo
      await currentSubmitHandler()
    } else {
      console.warn(`No submit handler registered for tab: ${currentTab.value}`)
    }
  } catch (error) {
    console.error('Error al guardar:', error)
  }
}
</script>