import { defineStore } from 'pinia'
import type { ResetPasswordRequest } from '../../types/entities/reset-password-request.js'

export const useResetPasswordRequestStore = defineStore('iam-resetPasswordRequests', {
  state: () => ({
    resetPasswordRequests: [] as ResetPasswordRequest[],
    currentResetPasswordRequest: null as ResetPasswordRequest | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchResetPasswordRequests(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useResetPasswordRequest } = await import('../api/useResetPasswordRequest.js')
        const { fetchAll } = useResetPasswordRequest()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.resetPasswordRequests = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentResetPasswordRequest(resetPasswordRequest: ResetPasswordRequest) {
      this.currentResetPasswordRequest = resetPasswordRequest
    },

    clearCurrentResetPasswordRequest() {
      this.currentResetPasswordRequest = null
    }
  },

  getters: {
    getResetPasswordRequestById: (state) => (id: number) => {
      return state.resetPasswordRequests.find(item => item.id === id)
    },

    resetPasswordRequestsCount: (state) => state.resetPasswordRequests.length
  }
})
