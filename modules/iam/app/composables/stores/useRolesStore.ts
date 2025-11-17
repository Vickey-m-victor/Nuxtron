import { defineStore } from 'pinia'
import type { Roles } from '../../types/entities/roles.js'

export const useRolesStore = defineStore('iam-roleses', {
  state: () => ({
    roleses: [] as Roles[],
    currentRoles: null as Roles | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchRoless(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useRoles } = await import('../api/useRoles.js')
        const { fetchAll } = useRoles()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.roleses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentRoles(roles: Roles) {
      this.currentRoles = roles
    },

    clearCurrentRoles() {
      this.currentRoles = null
    }
  },

  getters: {
    getRolesById: (state) => (id: number) => {
      return state.roleses.find(item => item.id === id)
    },

    rolesesCount: (state) => state.roleses.length
  }
})
