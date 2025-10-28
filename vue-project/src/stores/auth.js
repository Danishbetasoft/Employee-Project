import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(userData, authToken) {
      this.user = userData
      this.token = authToken
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
