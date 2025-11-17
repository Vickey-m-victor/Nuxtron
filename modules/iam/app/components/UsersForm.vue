<script setup lang="ts">
import type { UsersCreatePayload } from '../types/users-dto'

interface Props {
  formData: UsersCreatePayload | any
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
      <!-- User ID (read-only in view mode) -->
      <div v-if="formData.user_id" class="mb-3">
        <label class="form-label">User ID</label>
        <input
          type="text"
          class="form-control form-control-sm"
          :value="formData.user_id"
          disabled
        />
      </div>

      <!-- Username -->
      <div class="mb-3">
        <label class="form-label">Username <span v-if="!readonly" class="text-danger">*</span></label>
        <input
          type="text"
          class="form-control form-control-sm"
          :class="{ 'is-invalid': fieldErrors?.username }"
          v-model="formData.username"
          :disabled="readonly"
          required
        />
        <div v-if="fieldErrors?.username" class="invalid-feedback">
          {{ fieldErrors.username }}
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control form-control-sm"
          :class="{ 'is-invalid': fieldErrors?.email }"
          v-model="formData.email"
          :disabled="readonly"
        />
        <div v-if="fieldErrors?.email" class="invalid-feedback">
          {{ fieldErrors.email }}
        </div>
      </div>

      <!-- Status -->
      <div class="mb-3">
        <label class="form-label">Status</label>
        <div v-if="readonly && typeof formData.status === 'object' && formData.status?.label">
          <span 
            :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-${formData.status.theme}-light text-${formData.status.theme}`"
          >
            {{ formData.status.label }}
          </span>
        </div>
        <select
          v-else
          class="form-select form-select-sm"
          :class="{ 'is-invalid': fieldErrors?.status }"
          v-model="formData.status"
          :disabled="readonly"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <div v-if="fieldErrors?.status" class="invalid-feedback">
          {{ fieldErrors.status }}
        </div>
      </div>

      <!-- Created At (read-only) -->
      <div v-if="formData.created_at" class="mb-3">
        <label class="form-label">Created At</label>
        <input
          type="text"
          class="form-control form-control-sm"
          :value="formData.created_at"
          disabled
        />
      </div>

      <!-- Updated At (read-only) -->
      <div v-if="formData.updated_at" class="mb-3">
        <label class="form-label">Updated At</label>
        <input
          type="text"
          class="form-control form-control-sm"
          :value="formData.updated_at"
          disabled
        />
      </div>

      <!-- Submit button (hidden in view mode) -->
      <div v-if="!hideSubmit" class="d-flex gap-2 pt-2">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isLoading || loading || readonly"
        >
          <i class="fa fa-check opacity-50 me-1"></i>
          {{ loading || isLoading ? 'Saving...' : 'Save User' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View user details' : 'Fill in the user information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <!-- User ID (read-only in view mode) -->
        <div v-if="formData.user_id" class="mb-4">
          <label class="form-label">User ID</label>
          <input
            type="text"
            class="form-control"
            :value="formData.user_id"
            disabled
          />
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label class="form-label">Username <span v-if="!readonly" class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.username }"
            v-model="formData.username"
            :disabled="readonly"
            required
          />
          <div v-if="fieldErrors?.username" class="invalid-feedback">
            {{ fieldErrors.username }}
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.email }"
            v-model="formData.email"
            :disabled="readonly"
          />
          <div v-if="fieldErrors?.email" class="invalid-feedback">
            {{ fieldErrors.email }}
          </div>
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label class="form-label">Status</label>
          <div v-if="readonly && typeof formData.status === 'object' && formData.status?.label">
            <span 
              :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-${formData.status.theme}-light text-${formData.status.theme}`"
            >
              {{ formData.status.label }}
            </span>
          </div>
          <select
            v-else
            class="form-select"
            :class="{ 'is-invalid': fieldErrors?.status }"
            v-model="formData.status"
            :disabled="readonly"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div v-if="fieldErrors?.status" class="invalid-feedback">
            {{ fieldErrors.status }}
          </div>
        </div>

        <!-- Created At (read-only) -->
        <div v-if="formData.created_at" class="mb-4">
          <label class="form-label">Created At</label>
          <input
            type="text"
            class="form-control"
            :value="formData.created_at"
            disabled
          />
        </div>

        <!-- Updated At (read-only) -->
        <div v-if="formData.updated_at" class="mb-4">
          <label class="form-label">Updated At</label>
          <input
            type="text"
            class="form-control"
            :value="formData.updated_at"
            disabled
          />
        </div>

        <!-- Submit button (hidden in view mode) -->
        <div v-if="!hideSubmit" class="mb-4">
          <button
            type="submit"
            class="btn btn-alt-primary"
            :disabled="isLoading || loading || readonly"
          >
            <i class="fa fa-check opacity-50 me-1"></i>
            {{ loading || isLoading ? 'Saving...' : 'Save User' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
