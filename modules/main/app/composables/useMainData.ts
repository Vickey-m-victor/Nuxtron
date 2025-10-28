/**
 * Main module composable for handling main application data
 * This will be auto-imported and available in all main module pages
 */
export const useMainData = () => {
  const mainData = ref({
    appName: 'OmniNuxt Demo',
    version: '1.0.0',
    modules: ['main', 'cms'],
    lastUpdated: new Date().toISOString()
  })

  const getMainStats = () => {
    return {
      totalModules: 2,
      totalRoutes: 7,
      isDevMode: true
    }
  }

  const updateMainData = (newData: any) => {
    mainData.value = { ...mainData.value, ...newData }
  }

  return {
    mainData: readonly(mainData),
    getMainStats,
    updateMainData
  }
}
