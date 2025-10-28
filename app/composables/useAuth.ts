export const useAuth = () => {
  const authStore = useAuthStore()
  const { handleAlertify } = useAlertify()

  // Login
  const login = async (credentials: { username: string; password: string }) => {
    const { data, error } = await useFetch<{
      dataPayload: {
        data: {
          access_token: string
          userData: {
            permissions: string[]
            menus: Record<string, any>
          }
        }
      }
      alertifyPayload?: {
        message: string
        theme: string
        type: string
      }
    }>('/api/auth/login', {
      method: 'POST',
      body: credentials,
      credentials: 'include' // Important: Send/receive cookies
    })

    if (error.value) {
      // Handle alertifyPayload from error response
      if (error.value.data?.alertifyPayload) {
        handleAlertify(error.value.data.alertifyPayload)
      }
      // Throw the full error object so the component can access error.data
      throw error.value
    }

    if (data.value?.dataPayload?.data) {
      const { access_token, userData } = data.value.dataPayload.data

      // Handle success alertifyPayload
      if (data.value.alertifyPayload) {
        handleAlertify(data.value.alertifyPayload)
      }

      // Store access token (encrypted)
      authStore.setToken(access_token, credentials.username)

      // Store user data (permissions, menus)
      if (userData) {
        authStore.setUserData(userData)
      }

      return { success: true }
    }

    throw createError({
      statusCode: 500,
      message: 'Invalid response from server'
    })
  }

  // Logout
  const logout = async () => {
    try {
      // Call backend to invalidate refresh token
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Send refresh token cookie
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local auth state
      authStore.clearAuth()
      await navigateTo('/iam/auth/login')
    }
  }

  // Refresh access token using httpOnly cookie
  const refreshToken = async () => {
    try {
      const data = await $fetch<{
        dataPayload: { access_token: string }
      }>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // Send refresh token cookie
      })

      if (!data?.dataPayload?.access_token) {
        throw new Error('Token refresh failed')
      }

      const newToken = data.dataPayload.access_token
      authStore.setToken(newToken, authStore.user.username!)

      return newToken
    } catch (error) {
      // Refresh failed - logout user
      authStore.clearAuth()
      await navigateTo('/iam/auth/login')
      throw error
    }
  }

  // Change password
  const changePassword = async (passwords: {
    currentPassword: string
    newPassword: string
  }) => {
    try {
      const { data, error } = await useFetch('/api/auth/change-password', {
        method: 'POST',
        body: passwords,
        headers: {
          Authorization: `Bearer ${authStore.user.token}`
        },
        credentials: 'include'
      })

      if (error.value) {
        throw new Error(error.value.message || 'Password change failed')
      }

      // Backend invalidates all refresh tokens, user must login again
      authStore.clearAuth()
      await navigateTo('/iam/auth/login')

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/request-password-reset', {
        method: 'POST',
        body: { email }
      })

      if (error.value) {
        throw new Error(error.value.message || 'Request failed')
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Reset password with token
  const resetPassword = async (token: string, password: string) => {
    try {
      const { data, error } = await useFetch('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password }
      })

      if (error.value) {
        throw new Error(error.value.message || 'Reset failed')
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    login,
    logout,
    refreshToken,
    changePassword,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    hasPermission: (permission: string) => authStore.hasPermission(permission)
  }
}
