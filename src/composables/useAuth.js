import { ref, computed, readonly } from 'vue'
import { useRouter } from 'vue-router'

const token = ref(localStorage.getItem('token') || null)
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const authError = ref('')

export const useAuth = () => {
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push({ name: 'login' })
  }

  const login = async (credentials) => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
    const { username, password } = credentials

    authError.value = null

    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if(data.status === 'error') {
        authError.value = data.message
        return false
      }

      setToken(data.token);
      setUser(data.user);
      return true

    } catch (e) {
      authError.value = e.message
      return false
    } 
  }

  const checkAuth = async () => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    if (!token.value) return false;

    try {
      loading.value = true;
      const response = await fetch(`${BASE_API_URL}/verify-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        logout();
        return false;
      }

      return true;
    } catch (e) {
      logout();
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user: readonly(user),
    token: readonly(token),
    authError,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    setToken,
    setUser,
  };
}

