<script setup lang="ts">
import type { ResetPasswordCreatePayload } from '../types/reset-password-dto.js'

interface Props {
  formData: ResetPasswordCreatePayload | any
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
          <label class="form-label" for="password-input">
            Password
          </label>
          <input
            type="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['password'] }"
            id="password-input"
            v-model="formData.password"
            placeholder="Enter password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['password']" class="invalid-feedback">
            {{ fieldErrors['password'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="confirmPassword-input">
            ConfirmPassword
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['confirmPassword'] }"
            id="confirmPassword-input"
            v-model="formData.confirmPassword"
            placeholder="Enter confirmpassword"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['confirmPassword']" class="invalid-feedback">
            {{ fieldErrors['confirmPassword'] }}
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
          {{ loading || isLoading ? 'Saving...' : 'Save ResetPassword' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View resetpassword details' : 'Fill in the resetpassword information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="password-input">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['password'] }"
            id="password-input"
            v-model="formData.password"
            placeholder="Enter password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['password']" class="invalid-feedback">
            {{ fieldErrors['password'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="confirmPassword-input">
            ConfirmPassword
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['confirmPassword'] }"
            id="confirmPassword-input"
            v-model="formData.confirmPassword"
            placeholder="Enter confirmpassword"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['confirmPassword']" class="invalid-feedback">
            {{ fieldErrors['confirmPassword'] }}
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
            {{ loading || isLoading ? 'Saving...' : 'Save ResetPassword' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
