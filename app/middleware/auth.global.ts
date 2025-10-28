export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
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

  // Check if route is public (exact match for root, startsWith for others)
  const isPublicRoute = to.path === '/' || publicRoutes.some(route => to.path.startsWith(route))

  // Redirect unauthenticated users to login
  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo('/iam/auth/login')
  }

  // Redirect authenticated users away from auth pages
  if (authStore.isAuthenticated && to.path.startsWith('/iam/auth/')) {
    return navigateTo('/dashboard')
  }
})
