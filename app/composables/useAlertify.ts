import { useToast } from 'vue-toastification'
import type { TYPE } from 'vue-toastification'
import Swal from 'sweetalert2'

/**
 * AlertifyPayload structure from backend
 */
export interface AlertifyPayload {
  message: string
  theme: 'success' | 'error' | 'warning' | 'info'
  type: 'toast' | 'alert'
}

/**
 * Global alert handler based on backend alertifyPayload
 * Automatically displays toasts or alerts based on API responses
 */
export const useAlertify = () => {
  const toast = useToast()

  /**
   * Map backend theme to toast type
   */
  const getToastType = (theme: string): TYPE => {
    const typeMap: Record<string, TYPE> = {
      success: 'success' as TYPE,
      error: 'error' as TYPE,
      warning: 'warning' as TYPE,
      info: 'info' as TYPE
    }
    return typeMap[theme] || ('info' as TYPE)
  }

  /**
   * Map backend theme to SweetAlert icon
   */
  const getSwalIcon = (theme: string): 'success' | 'error' | 'warning' | 'info' | 'question' => {
    const iconMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    }
    return iconMap[theme] || 'info'
  }

  /**
   * Display toast notification
   */
  const showToast = (message: string, theme: string) => {
    const type = getToastType(theme)
    toast(message, { type })
  }

  /**
   * Display SweetAlert2 modal
   * Beautiful, responsive, and customizable alert dialogs
   */
  const showAlert = (message: string, theme: string) => {
    const icon = getSwalIcon(theme)
    
    Swal.fire({
      title: theme === 'error' ? 'Error' : theme === 'warning' ? 'Warning' : theme === 'success' ? 'Success' : 'Notice',
      text: message,
      icon,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2356d7', // OneUI primary color
      customClass: {
        popup: 'swal2-oneui-popup',
        title: 'swal2-oneui-title',
        htmlContainer: 'swal2-oneui-text',
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  /**
   * Handle alertifyPayload from API response
   * This is the main function called by interceptors
   */
  const handleAlertify = (alertifyPayload?: AlertifyPayload) => {
    if (!alertifyPayload) return

    const { message, theme, type } = alertifyPayload

    if (!message) return

    if (type === 'toast') {
      showToast(message, theme)
    } else if (type === 'alert') {
      showAlert(message, theme)
    }
  }

  return {
    handleAlertify,
    showToast,
    showAlert
  }
}
