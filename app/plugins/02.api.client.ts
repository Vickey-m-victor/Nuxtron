export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const { handleAlertify } = useAlertify()
  let isRefreshing = false
  let refreshSubscribers: ((token: string) => void)[] = []

  const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback)
  }

  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token))
    refreshSubscribers = []
  }

  // Create custom $fetch instance with interceptors
  const apiFetch: typeof $fetch = $fetch.create({
    credentials: 'include', // Always send cookies

    // Add Authorization header to all requests
    onRequest({ options }) {
      if (authStore.user.token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${authStore.user.token}`)
      }
    },

    // Handle successful responses and check for alertifyPayload
    onResponse({ response }) {
      // Check if response has alertifyPayload
      if (response._data?.alertifyPayload) {
        handleAlertify(response._data.alertifyPayload)
      }
    },

    // Handle 401 errors with automatic token refresh
    async onResponseError({ response, options, request }) {
      const originalRequest = options as any

      // Check for alertifyPayload in error responses
      if (response._data?.alertifyPayload) {
        handleAlertify(response._data.alertifyPayload)
      }

      // Only attempt refresh for 401 errors (not 403 or others)
      if (response.status === 401 && !originalRequest.retry) {
        if (isRefreshing) {
          // Queue this request until token is refreshed
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
              if (token) {
                originalRequest.headers = new Headers(originalRequest.headers)
                originalRequest.headers.set('Authorization', `Bearer ${token}`)
                resolve(apiFetch(request as string, originalRequest))
              } else {
                // Refresh failed, reject queued requests
                reject(new Error('Token refresh failed'))
              }
            })
          })
        }

        originalRequest.retry = true
        isRefreshing = true

        try {
          // Attempt token refresh via server API
          const data = await $fetch<{
            dataPayload: { access_token: string }
          }>('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          })

          if (data?.dataPayload?.access_token) {
            const newToken = data.dataPayload.access_token
            
            // Update store
            authStore.setToken(newToken, authStore.user.username!)

            // Notify queued requests with new token
            onTokenRefreshed(newToken)

            // Retry original request with new token
            originalRequest.headers = new Headers(originalRequest.headers)
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`)

            return apiFetch(request as string, originalRequest)
          } else {
            throw new Error('No access token in refresh response')
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          
          // ✅ Graceful logout on refresh failure
          // Notify queued requests that refresh failed
          onTokenRefreshed('')
          
          // Clear auth state
          authStore.clearAuth()
          
          // Redirect to login (only if not already there)
          const currentPath = window.location.pathname
          if (!currentPath.startsWith('/iam/auth/')) {
            await navigateTo('/iam/auth/login', { replace: true })
          }
          
          throw error
        } finally {
          isRefreshing = false
          refreshSubscribers = [] // Clear queue
        }
      }
    }
  })

  return {
    provide: {
      api: apiFetch
    }
  }
})
