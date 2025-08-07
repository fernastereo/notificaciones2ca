import { ref } from 'vue'
import { useAuth } from './useAuth'

export const useTiposPublicacion = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
  const { token } = useAuth()

  const tiposPublicacion = ref([])
  const loading = ref(false)
  const apiError = ref('')

  const getTiposPublicacion = async () => {
    apiError.value = null
    loading.value = true

    try {
      const response = await fetch(`${BASE_API_URL}/tipos-publicacion`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`)
      }

      if (data.status === 'error') {
        throw new Error(data.message)
      }

      tiposPublicacion.value = data.data || []
      return {
        status: 'success',
        data: tiposPublicacion.value
      }
    } catch (error) {
      console.error('Error en getTiposPublicacion:', error)
      apiError.value = error.message
      return {
        status: 'error',
        message: error.message
      }
    } finally {
      loading.value = false
    }
  }

  return {
    tiposPublicacion,
    loading,
    apiError,
    getTiposPublicacion
  }
}
