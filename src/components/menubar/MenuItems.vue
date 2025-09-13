<template>
  <ul role="list" class="-mx-2 space-y-1">
    <li v-for="item in navigation" :key="item.name">
      <RouterLink :to="item.href" :class="[isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
        <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
        {{ item.name }}
      </RouterLink>
    </li>
    <li>
      <button @click="$emit('logout')" class="text-gray-400 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer">
        <ArrowRightStartOnRectangleIcon class="size-6 shrink-0"/>
        Cerrar Sesión
      </button>
    </li>
  </ul>
</template>

<script setup>
  import { computed } from 'vue'
  import { DocumentDuplicateIcon, ArrowRightStartOnRectangleIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
  import { RouterLink, useRoute } from 'vue-router'
  
  // Definir el emit
  const emit = defineEmits(['logout'])
  
  const route = useRoute()
  
  const navigation = [
    { name: 'Publicaciones', href: { name: 'publicaciones' }, icon: DocumentDuplicateIcon },
    { name: 'Crear Usuarios', href: { name: 'register' }, icon: UserPlusIcon },
  ]

  const isActive = (href) => {
    return computed (() => route.name === href.name).value
  }
</script>