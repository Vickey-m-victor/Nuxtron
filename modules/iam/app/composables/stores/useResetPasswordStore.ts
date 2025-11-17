import { defineStore } from 'pinia'
import type { ResetPassword } from '../../types/entities/reset-password.js'

export const useResetPasswordStore = defineStore('iam-resetPasswords', {
  state: () => ({
    resetPasswords: [] as ResetPassword[],
    currentResetPassword: null as ResetPassword | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchResetPasswords(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useResetPassword } = await import('../api/useResetPassword.js')
        const { fetchAll } = useResetPassword()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.resetPasswords = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentResetPassword(resetPassword: ResetPassword) {
      this.currentResetPassword = resetPassword
    },

    clearCurrentResetPassword() {
      this.currentResetPassword = null
    }
  },

  getters: {
    getResetPasswordById: (state) => (id: number) => {
      return state.resetPasswords.find(item => item.id === id)
    },

    resetPasswordsCount: (state) => state.resetPasswords.length
  }
})
