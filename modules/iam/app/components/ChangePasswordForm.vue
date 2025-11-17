<script setup lang="ts">
import { ref } from 'vue'
import type { ChangePasswordCreatePayload } from '../types/change-password-dto.js'

interface Props {
  formData: ChangePasswordCreatePayload | any
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
          <label class="form-label" for="currentPassword-input">
            Current Password
          </label>
          <input
            type="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['currentPassword'] }"
            id="currentPassword-input"
            v-model="formData.currentPassword"
            placeholder="Enter current password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['currentPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['currentPassword'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="newPassword-input">
            New Password
          </label>
          <input
            type="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['newPassword'] }"
            id="newPassword-input"
            v-model="formData.newPassword"
            placeholder="Enter new password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['newPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['newPassword'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="confirmNewPassword-input">
            Confirm New Password
          </label>
          <input
            type="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['confirmNewPassword'] }"
            id="confirmNewPassword-input"
            v-model="formData.confirmNewPassword"
            placeholder="Confirm new password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['confirmNewPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['confirmNewPassword'] }}
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
          {{ loading || isLoading ? 'Saving...' : 'Change Password' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View password details' : 'Fill in the password information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="currentPassword-std-input">
            Current Password
          </label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['currentPassword'] }"
            id="currentPassword-std-input"
            v-model="formData.currentPassword"
            placeholder="Enter current password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['currentPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['currentPassword'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="newPassword-std-input">
            New Password
          </label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['newPassword'] }"
            id="newPassword-std-input"
            v-model="formData.newPassword"
            placeholder="Enter new password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['newPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['newPassword'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="confirmNewPassword-std-input">
            Confirm New Password
          </label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['confirmNewPassword'] }"
            id="confirmNewPassword-std-input"
            v-model="formData.confirmNewPassword"
            placeholder="Confirm new password"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['confirmNewPassword']" class="invalid-feedback d-block">
            {{ fieldErrors['confirmNewPassword'] }}
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
            {{ loading || isLoading ? 'Saving...' : 'Change Password' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
