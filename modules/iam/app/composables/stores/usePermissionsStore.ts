import { defineStore } from 'pinia'
import type { Permissions } from '../../types/entities/permissions.js'

export const usePermissionsStore = defineStore('iam-permissionses', {
  state: () => ({
    permissionses: [] as Permissions[],
    currentPermissions: null as Permissions | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPermissionss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { usePermissions } = await import('../api/usePermissions.js')
        const { fetchAll } = usePermissions()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.permissionses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentPermissions(permissions: Permissions) {
      this.currentPermissions = permissions
    },

    clearCurrentPermissions() {
      this.currentPermissions = null
    }
  },

  getters: {
    getPermissionsById: (state) => (id: number) => {
      return state.permissionses.find(item => item.id === id)
    },

    permissionsesCount: (state) => state.permissionses.length
  }
})
