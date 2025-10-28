import { defineStore } from 'pinia'
import type { Profile } from '../../types/entities/profile.js'

export const useProfileStore = defineStore('admin-profiles', {
  state: () => ({
    profiles: [] as Profile[],
    currentProfile: null as Profile | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchProfiles(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useProfile } = await import('../api/useProfile.js')
        const { fetchAll } = useProfile()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.profiles = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentProfile(profile: Profile) {
      this.currentProfile = profile
    },

    clearCurrentProfile() {
      this.currentProfile = null
    }
  },

  getters: {
    getProfileById: (state) => (id: number) => {
      return state.profiles.find(item => item.id === id)
    },

    profilesCount: (state) => state.profiles.length
  }
})
