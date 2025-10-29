import { defineStore } from 'pinia'
import { apiClient } from '@/plugins/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      try {
        const response = await apiClient.post('/auth/login', { username, password })
        const { token, username: user } = response.data
        if (token) {
          this.user = { username: user }
          this.token = token
          return true
        }
        return false
      } catch (err) {
        console.error('Login failed:', err.response?.data?.message || err.message)
        return false
      }
    },
    logout() {
      this.user = null
      this.token = null
    },
  },
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['user', 'token'],
  },
})
