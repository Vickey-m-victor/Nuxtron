import { defineStore } from 'pinia'
import type { Login } from '../../types/entities/login.js'

export const useLoginStore = defineStore('iam-logins', {
  state: () => ({
    logins: [] as Login[],
    currentLogin: null as Login | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchLogins(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useLogin } = await import('../api/useLogin.js')
        const { fetchAll } = useLogin()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.logins = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentLogin(login: Login) {
      this.currentLogin = login
    },

    clearCurrentLogin() {
      this.currentLogin = null
    }
  },

  getters: {
    getLoginById: (state) => (id: number) => {
      return state.logins.find(item => item.id === id)
    },

    loginsCount: (state) => state.logins.length
  }
})
