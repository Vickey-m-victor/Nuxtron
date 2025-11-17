<script setup lang="ts">
import type { RolesCreatePayload } from '../types/roles-dto.js'

interface Props {
  formData: RolesCreatePayload | any
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
          <label class="form-label" for="description-input">
            Description
          </label>
          <textarea
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['description'] }"
            id="description-input"
            v-model="formData.description"
            rows="3"
            placeholder="Enter description"
            :disabled="readonly || isLoading || loading"
          ></textarea>
          <div v-if="fieldErrors?.['description']" class="invalid-feedback">
            {{ fieldErrors['description'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="ruleName-input">
            RuleName
          </label>
          <input
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['ruleName'] }"
            id="ruleName-input"
            v-model="formData.ruleName"
            placeholder="Enter rulename"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['ruleName']" class="invalid-feedback">
            {{ fieldErrors['ruleName'] }}
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
          {{ loading || isLoading ? 'Saving...' : 'Save Roles' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View roles details' : 'Fill in the roles information' }}
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
          <label class="form-label" for="description-input">
            Description
          </label>
          <textarea
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['description'] }"
            id="description-input"
            v-model="formData.description"
            rows="4"
            placeholder="Enter description"
            :disabled="readonly || isLoading || loading"
          ></textarea>
          <div v-if="fieldErrors?.['description']" class="invalid-feedback">
            {{ fieldErrors['description'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="ruleName-input">
            RuleName
          </label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['ruleName'] }"
            id="ruleName-input"
            v-model="formData.ruleName"
            placeholder="Enter rulename"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['ruleName']" class="invalid-feedback">
            {{ fieldErrors['ruleName'] }}
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
            {{ loading || isLoading ? 'Saving...' : 'Save Roles' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
