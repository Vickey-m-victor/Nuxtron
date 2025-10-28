export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // Only allow unauthenticated users
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
