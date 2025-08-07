<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo Section -->
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-30 w-auto" src="@/assets/logo2ca.png" alt="Curaduria Urbana 2 Cartagena" />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Crear nueva cuenta</h2>
      </div>

      <!-- Registration Form -->
      <div class="mt-8 space-y-6">
        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Nombre completo -->
            <div>
              <label for="fullName" class="block text-sm/6 font-medium text-gray-900">
                Nombre completo
              </label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                placeholder="Ingrese su nombre completo"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm/6 font-medium text-gray-900">
                Correo electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                placeholder="Ingrese su correo electrónico"
              />
            </div>

            <!-- Usuario -->
            <div>
              <label for="username" class="block text-sm/6 font-medium text-gray-900">
                Usuario
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                placeholder="Elija un nombre de usuario"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm/6 font-medium text-gray-900">
                Contraseña
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                placeholder="Cree una contraseña segura"
              />
            </div>

            <!-- Confirmar Password -->
            <div>
              <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                placeholder="Confirme su contraseña"
              />
              <div v-if="passwordMismatch" class="text-red-500 text-sm mt-1">
                Las contraseñas no coinciden
              </div>
            </div>

            <!-- Términos y condiciones -->
            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                Acepto los 
                <a href="#" class="text-red-600 hover:text-red-500">términos y condiciones</a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>
          </div>

          <div v-if="registrationError" class="text-center text-red-500 text-sm">
            {{ registrationError }}
          </div>

          <div class="text-center">
            <span class="text-sm text-gray-600">
              ¿Ya tienes una cuenta? 
              <router-link 
                :to="{ name: 'login' }" 
                class="font-semibold leading-6 text-red-600 hover:text-red-500"
              >
                Inicia sesión aquí
              </router-link>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuth()

const form = ref({
  fullName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isLoading = ref(false)
const registrationError = ref('')

const passwordMismatch = computed(() => {
  return form.value.password !== form.value.confirmPassword && form.value.confirmPassword.length > 0
})

const isFormValid = computed(() => {
  return form.value.fullName &&
         form.value.email &&
         form.value.username &&
         form.value.password &&
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         form.value.acceptTerms
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  registrationError.value = ''

  const userData = {
    name: form.value.fullName,
    email: form.value.email,
    username: form.value.username,
    password: form.value.password
  }

  try {
    const { success, message } = await auth.register(userData)

    if (success) {
      // El login se realiza automáticamente en el composable
      router.push({ name: 'publicaciones' })
    } else {
      registrationError.value = message
    }
  } catch (error) {
    registrationError.value = 'Ocurrió un error durante el registro. Por favor, intente nuevamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>