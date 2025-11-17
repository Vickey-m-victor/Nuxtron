<script setup lang="ts">
import type { ProjectsCreatePayload } from '../types/projects-dto.js'

interface Props {
  formData: ProjectsCreatePayload | any
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
          <label class="form-label" for="name-input">
            Name
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['name'] }"
            id="name-input"
            v-model="formData.name"
            placeholder="Enter name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['name']" class="invalid-feedback">
            {{ fieldErrors['name'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="is_deleted-input">
            Is Deleted
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['is_deleted'] }"
            id="is_deleted-input"
            v-model="formData.is_deleted"
            placeholder="Enter is deleted"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['is_deleted']" class="invalid-feedback">
            {{ fieldErrors['is_deleted'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="status-input">
            Status
          </label>
          <input
            type="number"
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
          {{ loading || isLoading ? 'Saving...' : 'Save Projects' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View projects details' : 'Fill in the projects information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="name-input">
            Name
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['name'] }"
            id="name-input"
            v-model="formData.name"
            placeholder="Enter name"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['name']" class="invalid-feedback">
            {{ fieldErrors['name'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="is_deleted-input">
            Is Deleted
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['is_deleted'] }"
            id="is_deleted-input"
            v-model="formData.is_deleted"
            placeholder="Enter is deleted"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['is_deleted']" class="invalid-feedback">
            {{ fieldErrors['is_deleted'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="status-input">
            Status
          </label>
          <input
            type="number"
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
            {{ loading || isLoading ? 'Saving...' : 'Save Projects' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
