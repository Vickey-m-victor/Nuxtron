<script setup lang="ts">
import type { ProfileCreatePayload } from '../types/profile-dto.js'

interface Props {
  formData: ProfileCreatePayload | any
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
          <label class="form-label" for="first_name-input">
            First Name
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['first_name'] }"
            id="first_name-input"
            v-model="formData.first_name"
            placeholder="Enter first name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['first_name']" class="invalid-feedback">
            {{ fieldErrors['first_name'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="middle_name-input">
            Middle Name
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['middle_name'] }"
            id="middle_name-input"
            v-model="formData.middle_name"
            placeholder="Enter middle name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['middle_name']" class="invalid-feedback">
            {{ fieldErrors['middle_name'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="last_name-input">
            Last Name
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['last_name'] }"
            id="last_name-input"
            v-model="formData.last_name"
            placeholder="Enter last name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['last_name']" class="invalid-feedback">
            {{ fieldErrors['last_name'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="email_address-input">
            Email Address
          </label>
          <input
            type="email"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['email_address'] }"
            id="email_address-input"
            v-model="formData.email_address"
            placeholder="Enter email address"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['email_address']" class="invalid-feedback">
            {{ fieldErrors['email_address'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="phone_number-input">
            Phone Number
          </label>
          <input
            type="tel"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['phone_number'] }"
            id="phone_number-input"
            v-model="formData.phone_number"
            placeholder="Enter phone number"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['phone_number']" class="invalid-feedback">
            {{ fieldErrors['phone_number'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="profile_picture-input">
            Profile Picture
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['profile_picture'] }"
            id="profile_picture-input"
            v-model="formData.profile_picture"
            placeholder="Enter profile picture"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['profile_picture']" class="invalid-feedback">
            {{ fieldErrors['profile_picture'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="status-input">
            Status
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['status'] }"
            id="status-input"
            v-model="formData.status"
            placeholder="Enter status"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['status']" class="invalid-feedback">
            {{ fieldErrors['status'] }}
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
          {{ loading || isLoading ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View profile details' : 'Fill in the profile information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="first_name-input">
            First Name
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['first_name'] }"
            id="first_name-input"
            v-model="formData.first_name"
            placeholder="Enter first name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['first_name']" class="invalid-feedback">
            {{ fieldErrors['first_name'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="middle_name-input">
            Middle Name
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['middle_name'] }"
            id="middle_name-input"
            v-model="formData.middle_name"
            placeholder="Enter middle name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['middle_name']" class="invalid-feedback">
            {{ fieldErrors['middle_name'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="last_name-input">
            Last Name
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['last_name'] }"
            id="last_name-input"
            v-model="formData.last_name"
            placeholder="Enter last name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['last_name']" class="invalid-feedback">
            {{ fieldErrors['last_name'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="email_address-input">
            Email Address
          </label>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['email_address'] }"
            id="email_address-input"
            v-model="formData.email_address"
            placeholder="Enter email address"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['email_address']" class="invalid-feedback">
            {{ fieldErrors['email_address'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="phone_number-input">
            Phone Number
          </label>
          <input
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['phone_number'] }"
            id="phone_number-input"
            v-model="formData.phone_number"
            placeholder="Enter phone number"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['phone_number']" class="invalid-feedback">
            {{ fieldErrors['phone_number'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="profile_picture-input">
            Profile Picture
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['profile_picture'] }"
            id="profile_picture-input"
            v-model="formData.profile_picture"
            placeholder="Enter profile picture"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['profile_picture']" class="invalid-feedback">
            {{ fieldErrors['profile_picture'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="status-input">
            Status
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['status'] }"
            id="status-input"
            v-model="formData.status"
            placeholder="Enter status"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['status']" class="invalid-feedback">
            {{ fieldErrors['status'] }}
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
            {{ loading || isLoading ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
