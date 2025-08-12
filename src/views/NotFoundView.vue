<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <img class="mx-auto h-28 w-auto" src="@/assets/logo2ca.png" alt="Curaduría Urbana 2 Cartagena" />
      <div class="mt-8">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-600" />
        <h1 class="mt-4 text-2xl font-bold tracking-tight text-gray-900">Página no encontrada</h1>
        <p class="mt-2 text-sm text-gray-600">La página que buscas no existe o ha cambiado de ubicación.</p>
      </div>

      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'home' }"
          class="inline-flex w-full sm:w-auto justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Ir al inicio
        </router-link>
        <router-link
          v-else
          :to="{ name: 'login' }"
          class="inline-flex w-full sm:w-auto justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Ir al inicio de sesión
        </router-link>
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'publicaciones' }"
          class="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-600 hover:bg-red-50"
        >
          Ver publicaciones
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const { isAuthenticated } = useAuth()
</script>

<style scoped>
</style>
