export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  const router = useRouter()
  
  // Initialize auth state from localStorage
  authStore.initStore()
  
  // ✅ If we have a username but no valid token, try to refresh
  if (authStore.user.username && !authStore.isAuthenticated) {
    console.log('Token expired, attempting automatic refresh...')
    
    try {
      // Try to get new access token using refresh token cookie
      const data = await $fetch<{
        dataPayload: { access_token: string }
      }>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (data?.dataPayload?.access_token) {
        const newToken = data.dataPayload.access_token
        authStore.setToken(newToken, authStore.user.username)
        console.log('Token refreshed successfully on startup')
      }
    } catch (error) {
      console.warn('Failed to refresh token on startup:', error)
      // Clear auth and redirect to login
      authStore.clearAuth()
      
      // Only redirect if not already on a public route
      const currentRoute = router.currentRoute.value
      const publicRoutes = ['/iam/auth/login', '/iam/auth/signin', '/iam/auth/forgot-password']
      const isPublicRoute = publicRoutes.some(route => currentRoute.path.startsWith(route))
      
      if (!isPublicRoute && currentRoute.path !== '/') {
        await navigateTo('/iam/auth/login')
      }
    }
  }
})
