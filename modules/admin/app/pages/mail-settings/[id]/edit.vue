<script setup lang="ts">
import type { MailSettings, MailSettingsUpdatePayload } from '../../types/mail-settings-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, showAlert, handleAlertify } = useAlertify()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: MailSettings }
}>(`/api/v1/admin/mail-settings/${id}`, {
  $fetch: $api
})

const formData = ref<MailSettingsUpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(`/api/v1/admin/mail-settings/${id}`, {
      method: 'PUT',
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
      showToast('Updated successfully', 'success')
    }
    
    router.push(`/admin/mail-settings`)
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
      error.value = err?.data?.message || err?.message || 'Update failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Edit MailSettings'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(`/admin/mail-settings`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="Update MailSettings" subtitle="Modify the details below" content-full>
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
              Update the form fields to modify this mailsettings.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
            <div class="mb-4">
              <label class="form-label" for="smtp_server-input">
                Smtp Server
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['smtp_server'] }"
                id="smtp_server-input"
                v-model="formData.smtp_server"
                placeholder="Enter smtp server"
                :disabled="loading"
              />
              <div v-if="fieldErrors['smtp_server']" class="invalid-feedback">
                {{ fieldErrors['smtp_server'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="smtp_port-input">
                Smtp Port
              </label>
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['smtp_port'] }"
                id="smtp_port-input"
                v-model="formData.smtp_port"
                placeholder="Enter smtp port"
                :disabled="loading"
              />
              <div v-if="fieldErrors['smtp_port']" class="invalid-feedback">
                {{ fieldErrors['smtp_port'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="smtp_username-input">
                Smtp Username
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['smtp_username'] }"
                id="smtp_username-input"
                v-model="formData.smtp_username"
                placeholder="Enter smtp username"
                :disabled="loading"
              />
              <div v-if="fieldErrors['smtp_username']" class="invalid-feedback">
                {{ fieldErrors['smtp_username'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="smtp_password-input">
                Smtp Password
              </label>
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['smtp_password'] }"
                id="smtp_password-input"
                v-model="formData.smtp_password"
                placeholder="Enter smtp password"
                :disabled="loading"
              />
              <div v-if="fieldErrors['smtp_password']" class="invalid-feedback">
                {{ fieldErrors['smtp_password'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="email_encryption-input">
                Email Encryption
              </label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['email_encryption'] }"
                id="email_encryption-input"
                v-model="formData.email_encryption"
                placeholder="Enter email encryption"
                :disabled="loading"
              />
              <div v-if="fieldErrors['email_encryption']" class="invalid-feedback">
                {{ fieldErrors['email_encryption'] }}
              </div>
            </div>

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Updating...' : 'Update MailSettings' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(`/admin/mail-settings`)"
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
