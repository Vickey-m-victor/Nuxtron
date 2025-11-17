import { defineStore } from 'pinia'
import type { PaymentMethods } from '../../types/entities/payment-methods.js'

export const usePaymentMethodsStore = defineStore('reporting-paymentMethodses', {
  state: () => ({
    paymentMethodses: [] as PaymentMethods[],
    currentPaymentMethods: null as PaymentMethods | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPaymentMethodss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { usePaymentMethods } = await import('../api/usePaymentMethods.js')
        const { fetchAll } = usePaymentMethods()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.paymentMethodses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentPaymentMethods(paymentMethods: PaymentMethods) {
      this.currentPaymentMethods = paymentMethods
    },

    clearCurrentPaymentMethods() {
      this.currentPaymentMethods = null
    }
  },

  getters: {
    getPaymentMethodsById: (state) => (id: number) => {
      return state.paymentMethodses.find(item => item.id === id)
    },

    paymentMethodsesCount: (state) => state.paymentMethodses.length
  }
})
