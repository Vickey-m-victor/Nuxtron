import { defineStore } from 'pinia'
import type { Groups } from '../../types/entities/groups.js'

export const useGroupsStore = defineStore('iam-groupses', {
  state: () => ({
    groupses: [] as Groups[],
    currentGroups: null as Groups | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchGroupss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useGroups } = await import('../api/useGroups.js')
        const { fetchAll } = useGroups()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.groupses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentGroups(groups: Groups) {
      this.currentGroups = groups
    },

    clearCurrentGroups() {
      this.currentGroups = null
    }
  },

  getters: {
    getGroupsById: (state) => (id: number) => {
      return state.groupses.find(item => item.id === id)
    },

    groupsesCount: (state) => state.groupses.length
  }
})
