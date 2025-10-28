import { defineStore } from 'pinia'
import type { MailSettings } from '../../types/entities/mail-settings.js'

export const useMailSettingsStore = defineStore('admin-mailSettingses', {
  state: () => ({
    mailSettingses: [] as MailSettings[],
    currentMailSettings: null as MailSettings | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchMailSettingss(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { useMailSettings } = await import('../api/useMailSettings.js')
        const { fetchAll } = useMailSettings()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.mailSettingses = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentMailSettings(mailSettings: MailSettings) {
      this.currentMailSettings = mailSettings
    },

    clearCurrentMailSettings() {
      this.currentMailSettings = null
    }
  },

  getters: {
    getMailSettingsById: (state) => (id: number) => {
      return state.mailSettingses.find(item => item.id === id)
    },

    mailSettingsesCount: (state) => state.mailSettingses.length
  }
})
