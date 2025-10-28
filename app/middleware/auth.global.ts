export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side entirely
  // Authentication state only exists in localStorage on client
  if (!import.meta.client) {
    return
  }

  const authStore = useAuthStore()
  
  // Always ensure store is initialized before checking authentication
  authStore.initStore()
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/iam/auth/login',
    '/iam/auth/signin',
    '/iam/auth/signin2',
    '/iam/auth/signin3',
    '/iam/auth/forgot-password',
    '/iam/auth/reminder',
    '/iam/auth/reminder2',
    '/iam/auth/reminder3',
    '/iam/auth/reset-password',
    '/iam/auth/lock',
    '/iam/auth/lock2',
    '/iam/auth/lock3',
    '/iam/auth/two-factor',
    '/iam/auth/two-factor2',
    '/iam/auth/two-factor3'
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  // Check authentication status after initialization
  const isAuthenticated = authStore.isAuthenticated

  // Homepage redirect logic
  if (to.path === '/') {
    if (isAuthenticated) {
      // Logged in users go to dashboard
      return navigateTo('/dashboard', { replace: true })
    } else {
      // Not logged in users go to login page
      return navigateTo('/iam/auth/login', { replace: true })
    }
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo('/iam/auth/login', { replace: true })
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthenticated && to.path.startsWith('/iam/auth/')) {
    return navigateTo('/dashboard', { replace: true })
  }
})
