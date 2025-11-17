<script setup lang="ts">
import type { InvoicesCreatePayload } from '../types/invoices-dto.js'

interface Props {
  formData: InvoicesCreatePayload | any
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
          <label class="form-label" for="date-input">
            Date
          </label>
          <input
            type="date"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['date'] }"
            id="date-input"
            v-model="formData.date"
            placeholder="Enter date"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['date']" class="invalid-feedback">
            {{ fieldErrors['date'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="supplier_id-input">
            Supplier Id
          </label>
          <input
            type="number"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['supplier_id'] }"
            id="supplier_id-input"
            v-model="formData.supplier_id"
            placeholder="Enter supplier id"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['supplier_id']" class="invalid-feedback">
            {{ fieldErrors['supplier_id'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="invoice_amount-input">
            Invoice Amount
          </label>
          <input
            type="number"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['invoice_amount'] }"
            id="invoice_amount-input"
            v-model="formData.invoice_amount"
            placeholder="Enter invoice amount"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['invoice_amount']" class="invalid-feedback">
            {{ fieldErrors['invoice_amount'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="payment_method_id-input">
            Payment Method Id
          </label>
          <input
            type="number"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['payment_method_id'] }"
            id="payment_method_id-input"
            v-model="formData.payment_method_id"
            placeholder="Enter payment method id"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['payment_method_id']" class="invalid-feedback">
            {{ fieldErrors['payment_method_id'] }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="is_deleted-input">
            Is Deleted
          </label>
          <input
            type="number"
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
          {{ loading || isLoading ? 'Saving...' : 'Save Invoices' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View invoices details' : 'Fill in the invoices information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
        <div class="mb-4">
          <label class="form-label" for="date-input">
            Date
          </label>
          <input
            type="date"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['date'] }"
            id="date-input"
            v-model="formData.date"
            placeholder="Enter date"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['date']" class="invalid-feedback">
            {{ fieldErrors['date'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="supplier_id-input">
            Supplier Id
          </label>
          <input
            type="number"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['supplier_id'] }"
            id="supplier_id-input"
            v-model="formData.supplier_id"
            placeholder="Enter supplier id"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['supplier_id']" class="invalid-feedback">
            {{ fieldErrors['supplier_id'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="invoice_amount-input">
            Invoice Amount
          </label>
          <input
            type="number"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['invoice_amount'] }"
            id="invoice_amount-input"
            v-model="formData.invoice_amount"
            placeholder="Enter invoice amount"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['invoice_amount']" class="invalid-feedback">
            {{ fieldErrors['invoice_amount'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="payment_method_id-input">
            Payment Method Id
          </label>
          <input
            type="number"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['payment_method_id'] }"
            id="payment_method_id-input"
            v-model="formData.payment_method_id"
            placeholder="Enter payment method id"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['payment_method_id']" class="invalid-feedback">
            {{ fieldErrors['payment_method_id'] }}
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label" for="is_deleted-input">
            Is Deleted
          </label>
          <input
            type="number"
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
            {{ loading || isLoading ? 'Saving...' : 'Save Invoices' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
