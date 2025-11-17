<script setup lang="ts">
import type { ResetPasswordRequestCreatePayload } from '../../types/reset-password-request-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, handleAlertify } = useAlertify()
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const formData = ref<ResetPasswordRequestCreatePayload>({
  username: ''
})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(`/api/v1/iam/reset-password-request`, {
      method: 'POST',
      body: formData.value
    })
    
    // Check for errorPayload in response (API returns 200 but with errors)
    if (response?.errorPayload?.errors) {
      fieldErrors.value = response.errorPayload.errors
      
      // Handle alertify for errors if present
      if (response.alertifyPayload) {
        handleAlertify(response.alertifyPayload)
      }
      
      loading.value = false
      return // Stop execution, don't navigate
    }
    
    // Handle backend alertifyPayload if present
    if (response?.alertifyPayload) {
      handleAlertify(response.alertifyPayload)
    } else {
      showToast('Created successfully', 'success')
    }
    
    router.push(`/iam/reset-password-requests`)
  } catch (err: any) {
    // Extract field-specific errors from errorPayload
    if (err.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.errorPayload.errors
    } else if (err.data?.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.data.errorPayload.errors
    }
    
    // Handle backend alertifyPayload if present
    if (err?.data?.alertifyPayload) {
      handleAlertify(err.data.alertifyPayload)
    } else if (Object.keys(fieldErrors.value).length === 0) {
      // Only show general error if no field errors
      error.value = err?.data?.message || err?.message || 'Create failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Create ResetPasswordRequest'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(`/iam/reset-password-requests`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="New ResetPasswordRequest" subtitle="Fill in the details below" content-full>
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-times-circle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="row push">
          <div class="col-lg-4">
            <p class="fs-sm text-muted">
              Provide the required information to create a new resetpasswordrequest.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
            <div class="mb-4">
              <label class="form-label" for="username-input">
                Username
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['username'] }"
                id="username-input"
                v-model="formData.username"
                placeholder="Enter username"
                :disabled="loading"
              />
              <div v-if="fieldErrors['username']" class="invalid-feedback">
                {{ fieldErrors['username'] }}
              </div>
            </div>

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Creating...' : 'Create ResetPasswordRequest' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(`/iam/reset-password-requests`)"
              >
                <i class="fa fa-times opacity-50 me-1"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
