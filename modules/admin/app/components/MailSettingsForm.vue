<script setup lang="ts">
import type { MailSettingsCreatePayload } from '../types/mail-settings-dto.js'

interface Props {
  formData: MailSettingsCreatePayload | any
  error?: Record<string, string> | { message?: string }
  fieldErrors?: Record<string, string>
  isLoading?: boolean
  readonly?: boolean
  hideSubmit?: boolean
  compact?: boolean
  onSubmit?: (data: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  error: () => ({}),
  fieldErrors: () => ({}),
  isLoading: false,
  readonly: false,
  hideSubmit: false,
  compact: false
})

const emit = defineEmits(['submit'])
const loading = ref(false)

const onSubmit = async () => {
  if (props.onSubmit) {
    loading.value = true
    try {
      await props.onSubmit(props.formData)
    } catch (err) {
      console.error('Form submission error:', err)
    } finally {
      loading.value = false
    }
  } else {
    emit('submit', props.formData)
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- General error banner -->
    <div v-if="error?.message || (typeof error === 'string' && error)" 
         :class="compact ? 'alert alert-danger mb-3' : 'alert alert-danger alert-dismissible mb-4'">
      <h5 v-if="!compact" class="alert-heading mb-2">
        <i class="fa fa-fw fa-times-circle"></i> Error
      </h5>
      <p class="mb-0">{{ typeof error === 'string' ? error : error.message }}</p>
    </div>

    <!-- Compact layout for modals -->
    <div v-if="compact" class="compact-form">
        <div class="mb-3">
          <label class="form-label" for="smtp_server-input">
            Smtp Server
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['smtp_server'] }"
            id="smtp_server-input"
            v-model="formData.smtp_server"
            placeholder="Enter smtp server"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_server']" class="invalid-feedback">
            {{ fieldErrors['smtp_server'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="smtp_port-input">
            Smtp Port
          </label>
          <input
            type="number"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['smtp_port'] }"
            id="smtp_port-input"
            v-model="formData.smtp_port"
            placeholder="Enter smtp port"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_port']" class="invalid-feedback">
            {{ fieldErrors['smtp_port'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="smtp_username-input">
            Smtp Username
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['smtp_username'] }"
            id="smtp_username-input"
            v-model="formData.smtp_username"
            placeholder="Enter smtp username"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_username']" class="invalid-feedback">
            {{ fieldErrors['smtp_username'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="smtp_password-input">
            Smtp Password
          </label>
          <input
            type="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['smtp_password'] }"
            id="smtp_password-input"
            v-model="formData.smtp_password"
            placeholder="Enter smtp password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_password']" class="invalid-feedback">
            {{ fieldErrors['smtp_password'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="email_encryption-input">
            Email Encryption
          </label>
          <input
            type="email"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['email_encryption'] }"
            id="email_encryption-input"
            v-model="formData.email_encryption"
            placeholder="Enter email encryption"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['email_encryption']" class="invalid-feedback">
            {{ fieldErrors['email_encryption'] }}
          </div>
        </div>

      <!-- Submit button (hidden in view mode) -->
      <div v-if="!hideSubmit" class="d-flex gap-2 pt-2">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isLoading || loading || readonly"
        >
          <i class="fa fa-check opacity-50 me-1"></i>
          {{ loading || isLoading ? 'Saving...' : 'Save MailSettings' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View mailsettings details' : 'Fill in the mailsettings information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="smtp_server-input">
            Smtp Server
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['smtp_server'] }"
            id="smtp_server-input"
            v-model="formData.smtp_server"
            placeholder="Enter smtp server"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_server']" class="invalid-feedback">
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
            :class="{ 'is-invalid': fieldErrors?.['smtp_port'] }"
            id="smtp_port-input"
            v-model="formData.smtp_port"
            placeholder="Enter smtp port"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_port']" class="invalid-feedback">
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
            :class="{ 'is-invalid': fieldErrors?.['smtp_username'] }"
            id="smtp_username-input"
            v-model="formData.smtp_username"
            placeholder="Enter smtp username"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_username']" class="invalid-feedback">
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
            :class="{ 'is-invalid': fieldErrors?.['smtp_password'] }"
            id="smtp_password-input"
            v-model="formData.smtp_password"
            placeholder="Enter smtp password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['smtp_password']" class="invalid-feedback">
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
            :class="{ 'is-invalid': fieldErrors?.['email_encryption'] }"
            id="email_encryption-input"
            v-model="formData.email_encryption"
            placeholder="Enter email encryption"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['email_encryption']" class="invalid-feedback">
            {{ fieldErrors['email_encryption'] }}
          </div>
        </div>

        <!-- Submit button (hidden in view mode) -->
        <div v-if="!hideSubmit" class="mb-4">
          <button
            type="submit"
            class="btn btn-alt-primary"
            :disabled="isLoading || loading || readonly"
          >
            <i class="fa fa-check opacity-50 me-1"></i>
            {{ loading || isLoading ? 'Saving...' : 'Save MailSettings' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
