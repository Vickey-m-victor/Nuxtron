import { defineStore } from 'pinia'
import type { Suppliers } from '../../types/entities/suppliers.js'

export const useSuppliersStore = defineStore('reporting-supplierses', {
  state: () => ({
    supplierses: [] as Suppliers[],
    currentSuppliers: null as Suppliers | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchSupplierss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useSuppliers } = await import('../api/useSuppliers.js')
        const { fetchAll } = useSuppliers()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.supplierses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentSuppliers(suppliers: Suppliers) {
      this.currentSuppliers = suppliers
    },

    clearCurrentSuppliers() {
      this.currentSuppliers = null
    }
  },

  getters: {
    getSuppliersById: (state) => (id: number) => {
      return state.supplierses.find(item => item.id === id)
    },

    suppliersesCount: (state) => state.supplierses.length
  }
})
