import { defineStore } from 'pinia'
import type { Projects } from '../../types/entities/projects.js'

export const useProjectsStore = defineStore('reporting-projectses', {
  state: () => ({
    projectses: [] as Projects[],
    currentProjects: null as Projects | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchProjectss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useProjects } = await import('../api/useProjects.js')
        const { fetchAll } = useProjects()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.projectses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentProjects(projects: Projects) {
      this.currentProjects = projects
    },

    clearCurrentProjects() {
      this.currentProjects = null
    }
  },

  getters: {
    getProjectsById: (state) => (id: number) => {
      return state.projectses.find(item => item.id === id)
    },

    projectsesCount: (state) => state.projectses.length
  }
})
