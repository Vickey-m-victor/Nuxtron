<script setup lang="ts">
import type { InvoicesCreatePayload } from '../../types/invoices-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, handleAlertify } = useAlertify()
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const formData = ref<InvoicesCreatePayload>({
  date: '',
  supplier_id: 0,
  invoice_amount: 0,
  payment_method_id: 0,
  is_deleted: 0,
  status: 0
})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(`/api/v1/reporting/invoice`, {
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
    
    router.push(`/reporting/invoices`)
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
    <BasePageHeading :title="'Create Invoices'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(`/reporting/invoices`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="New Invoices" subtitle="Fill in the details below" content-full>
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
              Provide the required information to create a new invoices.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
            <div class="mb-4">
              <label class="form-label" for="date-input">
                Date
              </label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['date'] }"
                id="date-input"
                v-model="formData.date"
                placeholder="Enter date"
                :disabled="loading"
              />
              <div v-if="fieldErrors['date']" class="invalid-feedback">
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
                :class="{ 'is-invalid': fieldErrors['supplier_id'] }"
                id="supplier_id-input"
                v-model="formData.supplier_id"
                placeholder="Enter supplier id"
                :disabled="loading"
              />
              <div v-if="fieldErrors['supplier_id']" class="invalid-feedback">
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
                :class="{ 'is-invalid': fieldErrors['invoice_amount'] }"
                id="invoice_amount-input"
                v-model="formData.invoice_amount"
                placeholder="Enter invoice amount"
                :disabled="loading"
              />
              <div v-if="fieldErrors['invoice_amount']" class="invalid-feedback">
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
                :class="{ 'is-invalid': fieldErrors['payment_method_id'] }"
                id="payment_method_id-input"
                v-model="formData.payment_method_id"
                placeholder="Enter payment method id"
                :disabled="loading"
              />
              <div v-if="fieldErrors['payment_method_id']" class="invalid-feedback">
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
                :class="{ 'is-invalid': fieldErrors['is_deleted'] }"
                id="is_deleted-input"
                v-model="formData.is_deleted"
                placeholder="Enter is deleted"
                :disabled="loading"
              />
              <div v-if="fieldErrors['is_deleted']" class="invalid-feedback">
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
                :class="{ 'is-invalid': fieldErrors['status'] }"
                id="status-input"
                v-model="formData.status"
                placeholder="Enter status"
                :disabled="loading"
              />
              <div v-if="fieldErrors['status']" class="invalid-feedback">
                {{ fieldErrors['status'] }}
              </div>
            </div>

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Creating...' : 'Create Invoices' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(`/reporting/invoices`)"
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
