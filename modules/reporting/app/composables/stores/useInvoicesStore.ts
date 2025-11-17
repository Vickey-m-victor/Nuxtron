import { defineStore } from 'pinia'
import type { Invoices } from '../../types/entities/invoices.js'

export const useInvoicesStore = defineStore('reporting-invoiceses', {
  state: () => ({
    invoiceses: [] as Invoices[],
    currentInvoices: null as Invoices | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchInvoicess(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useInvoices } = await import('../api/useInvoices.js')
        const { fetchAll } = useInvoices()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.invoiceses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentInvoices(invoices: Invoices) {
      this.currentInvoices = invoices
    },

    clearCurrentInvoices() {
      this.currentInvoices = null
    }
  },

  getters: {
    getInvoicesById: (state) => (id: number) => {
      return state.invoiceses.find(item => item.id === id)
    },

    invoicesesCount: (state) => state.invoiceses.length
  }
})
