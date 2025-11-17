<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ChangePasswordForm from './ChangePasswordForm.vue'
import type { ChangePasswordCreatePayload } from '../types/change-password-dto.js'
import { useChangePassword } from '../composables/api/useChangePassword'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const emit = defineEmits(['close', 'success'])
const { handleAlertify } = useAlertify()
const { changePassword } = useChangePassword()

// Modal state
const showModal = ref(props.show)
const isLoading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

// Form data
const formData = ref<ChangePasswordCreatePayload>({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Watch for prop changes
watch(() => props.show, (newVal) => {
  showModal.value = newVal
  if (newVal) {
    // Reset form when modal opens
    resetForm()
  }
})

// Watch modal state and emit close
watch(showModal, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

const resetForm = () => {
  formData.value = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  errorMessage.value = ''
  fieldErrors.value = {}
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const handleSubmit = async () => {
  // Reset errors before submitting
  errorMessage.value = ''
  fieldErrors.value = {}
  
  console.log('Form data before submit:', formData.value) // Debug log
  
  isLoading.value = true

  try {
    const result = await changePassword(formData.value)

    if (result.success) {
      handleAlertify({
        type: 'toast',
        theme: 'success',
        message: 'Password changed successfully. Please login with your new password.'
      })
      
      emit('success')
      closeModal()
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigateTo('/iam/auth/login')
      }, 1500)
    } else {
      // Handle field-level errors from API
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        fieldErrors.value = result.fieldErrors
      }
      
      errorMessage.value = result.error || 'Failed to change password'
      handleAlertify({
        type: 'toast',
        theme: 'error',
        message: errorMessage.value
      })
    }
  } catch (error: any) {
    console.error('Change password modal error:', error)
    
    // Extract field errors from the error object (following login form pattern)
    if (error?.data?.errorPayload?.errors) {
      const errors = error.data.errorPayload.errors
      fieldErrors.value = {}
      Object.keys(errors).forEach(key => {
        const errorValue = errors[key]
        fieldErrors.value[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue
      })
      
      // When field errors exist, DON'T set general error message
      errorMessage.value = ''
      
      // Show toast for validation errors
      handleAlertify({
        type: 'toast',
        theme: 'error',
        message: 'Please fix the validation errors'
      })
    } else if (error?.data?.data?.errorPayload?.errors) {
      // Alternative nesting (following login form pattern)
      const errors = error.data.data.errorPayload.errors
      fieldErrors.value = {}
      Object.keys(errors).forEach(key => {
        const errorValue = errors[key]
        fieldErrors.value[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue
      })
      
      // When field errors exist, DON'T set general error message
      errorMessage.value = ''
      
      // Show toast for validation errors
      handleAlertify({
        type: 'toast',
        theme: 'error',
        message: 'Please fix the validation errors'
      })
    } else {
      // ONLY set general error when NO field errors exist
      errorMessage.value = error?.data?.message || error?.message || 'Password change failed. Please try again.'
      
      // Show toast for general errors
      handleAlertify({
        type: 'toast',
        theme: 'error',
        message: errorMessage.value
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Change Password Modal -->
  <div
    class="modal fade"
    :class="{ show: showModal }"
    :style="{ display: showModal ? 'block' : 'none' }"
    tabindex="-1"
    role="dialog"
    aria-labelledby="changePasswordModalLabel"
    :aria-hidden="!showModal"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changePasswordModalLabel">
            <i class="fa fa-key opacity-50 me-2"></i>Change Password
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            :disabled="isLoading"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <ChangePasswordForm
            :formData="formData"
            :error="{ message: errorMessage }"
            :fieldErrors="fieldErrors"
            :isLoading="isLoading"
            :compact="true"
            :hideSubmit="true"
          />
        </div>
        <div class="modal-footer justify-content-center">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="handleSubmit"
            :disabled="isLoading"
          >
            <i class="fa fa-check opacity-50 me-1"></i>
            {{ isLoading ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="showModal"
    class="modal-backdrop fade"
    :class="{ show: showModal }"
    @click="closeModal"
  ></div>
</template>

<style scoped>
.modal.show {
  display: block;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.modal {
  z-index: 1050;
}
</style>
