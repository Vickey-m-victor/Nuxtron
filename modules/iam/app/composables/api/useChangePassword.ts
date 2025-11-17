import type { ChangePasswordCreatePayload } from '../../types/change-password-dto.js'

/**
 * Composable for changing user password
 * Uses the auth endpoint for password changes
 */
export const useChangePassword = () => {
  const authStore = useAuthStore()

  /**
   * Change the current user's password
   * @param payload - Contains currentPassword, newPassword, and confirmNewPassword
   */
  const changePassword = async (payload: ChangePasswordCreatePayload) => {
    console.log('Change password payload:', payload) // Debug log
    
    try {
      const response = await $fetch('/api/auth/change-password', {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${authStore.user.token}`
        }
      })
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Change password error:', error)
      
      // Extract error message and field errors from API response
      let errorMessage = 'Password change failed'
      let fieldErrors: Record<string, string> = {}
      
      if (error?.data) {
        // Check for errorPayload structure (similar to login)
        if (error.data.errorPayload?.errors) {
          const errors = error.data.errorPayload.errors
          console.log('Extracted field errors:', errors) // Debug log
          // Convert each field error to a simple string
          Object.keys(errors).forEach(key => {
            const errorValue = errors[key]
            fieldErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue
          })
        }
        
        // Check for alertifyPayload message
        if (error.data.alertifyPayload?.message) {
          errorMessage = error.data.alertifyPayload.message
        } else if (error.data.message) {
          errorMessage = error.data.message
        }
        
        // If we have field errors but no general message, create one
        if (Object.keys(fieldErrors).length > 0 && errorMessage === 'Password change failed') {
          const firstError = Object.values(fieldErrors)[0]
          errorMessage = firstError || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      return { 
        success: false, 
        error: errorMessage,
        fieldErrors
      }
    }
  }

  return {
    changePassword
  }
}
