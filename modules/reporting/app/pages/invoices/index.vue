<script setup lang="ts">
import type { Invoices } from '../../types/entities/invoices.js'
import type { InvoicesCreatePayload } from '../../types/invoices-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import InvoicesForm from '../../components/InvoicesForm.vue'
import moduleConfig from '../../../module.config'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, showAlert, handleAlertify } = useAlertify()
const modalStore = useModalStore()

// Get modal settings from module config
const useModalMode = moduleConfig.ui?.useModal ?? true
const modalSize = moduleConfig.ui?.modalSize ?? 'lg'

const { data, pending, error, refresh } = await useFetch<{
  dataPayload: {
    data: Invoices[]
    totalCount: number
    currentPage: number
  }
}>(`/api/v1/reporting/invoices`, {
  $fetch: $api
})

const items = computed(() => data.value?.dataPayload?.data || [])
const errors = ref<Record<string, string>>({})

const columns = [
  {
    "field": "id",
    "header": "Id"
  },
  {
    "field": "date",
    "header": "Date"
  },
  {
    "field": "supplier_id",
    "header": "Supplier Id"
  },
  {
    "field": "invoice_amount",
    "header": "Invoice Amount"
  },
  {
    "field": "payment_method_id",
    "header": "Payment Method Id"
  },
  {
    "field": "is_deleted",
    "header": "Is Deleted"
  },
  {
    "field": "status",
    "header": "Status"
  },
  {
    "field": "created_at",
    "header": "Created At"
  },
  {
    "field": "updated_at",
    "header": "Updated At"
  }
]

// ========== CREATE HANDLER ==========
const onCreate = async () => {
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to create page
    router.push(`/reporting/invoices/create`)
    return
  }

  // Modal mode: Define submit handler
  const handleSubmit = async (newData: InvoicesCreatePayload) => {
    try {
      const response = await $api(`/api/v1/reporting/invoice`, {
        method: 'POST',
        body: newData
      })

      // Check for errorPayload in response (API returns 200 but with errors)
      if (response?.errorPayload?.errors) {
        errors.value = response.errorPayload.errors
        
        // Handle alertify for errors if present
        if (response.alertifyPayload) {
          handleAlertify(response.alertifyPayload)
        }
        
        throw new Error('Validation failed') // Throw to let form handle it
      }

      // Handle backend notifications
      if (response?.alertifyPayload) {
        handleAlertify(response.alertifyPayload)
      } else {
        showToast('Invoices created successfully', 'success')
      }

      // Close modal and refresh
      modalStore.closeModal()
      await refresh()
    } catch (err: any) {
      // Extract field errors
      if (err.data?.errorPayload?.errors) {
        errors.value = err.data.errorPayload.errors
      } else if (err.data?.data?.errorPayload?.errors) {
        errors.value = err.data.data.errorPayload.errors
      }
      
      // Handle error notifications
      if (err?.data?.alertifyPayload) {
        handleAlertify(err.data.alertifyPayload)
      }
      
      console.error('Create failed:', err)
      throw err // Re-throw to let form handle it
    }
  }

  // Open modal with form
  modalStore.openModal(
    InvoicesForm,
    {
      formData: {
        date: '',
        supplier_id: 0,
        invoice_amount: 0,
        payment_method_id: 0,
        is_deleted: 0,
        status: 0
      },
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Create Invoices',
    modalSize
  )
}

// ========== VIEW HANDLER ==========
const onView = async (row: Invoices) => {
  const id = row.id
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(`/reporting/invoices/${id}`)
    return
  }

  // Modal mode: fetch data and show in modal
  const { data: viewData } = await useFetch<{
    dataPayload: { data: Invoices }
  }>(`/api/v1/reporting/invoice/${id}`, {
    $fetch: $api
  })

  modalStore.openModal(
    InvoicesForm,
    {
      formData: viewData.value?.dataPayload?.data || {},
      error: {},
      fieldErrors: {},
      isLoading: false,
      readonly: true, // View mode: all fields disabled
      hideSubmit: true, // Hide submit button
      compact: true
    },
    'View Invoices',
    modalSize
  )
}

// ========== EDIT HANDLER ==========
const onEdit = async (row: Invoices) => {
  const id = row.id
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(`/reporting/invoices/${id}/edit`)
    return
  }

  // Fetch data first
  const { data: editData, error: fetchError } = await useFetch<{
    dataPayload: { data: Invoices }
  }>(`/api/v1/reporting/invoice/${id}`, {
    $fetch: $api
  })

  if (fetchError.value) {
    showToast('Failed to load invoices', 'error')
    return
  }

  // Define submit handler
  const handleSubmit = async (updatedData: Invoices) => {
    try {
      const response = await $api(`/api/v1/reporting/invoice/${id}`, {
        method: 'PUT',
        body: updatedData
      })

      // Check for errorPayload in response (API returns 200 but with errors)
      if (response?.errorPayload?.errors) {
        errors.value = response.errorPayload.errors
        
        // Handle alertify for errors if present
        if (response.alertifyPayload) {
          handleAlertify(response.alertifyPayload)
        }
        
        throw new Error('Validation failed') // Throw to let form handle it
      }

      if (response?.alertifyPayload) {
        handleAlertify(response.alertifyPayload)
      } else {
        showToast('Invoices updated successfully', 'success')
      }

      modalStore.closeModal()
      await refresh()
    } catch (err: any) {
      if (err.data?.errorPayload?.errors) {
        errors.value = err.data.errorPayload.errors
      } else if (err.data?.data?.errorPayload?.errors) {
        errors.value = err.data.data.errorPayload.errors
      }
      
      if (err?.data?.alertifyPayload) {
        handleAlertify(err.data.alertifyPayload)
      }
      
      console.error('Update failed:', err)
      throw err
    }
  }

  // Open modal
  modalStore.openModal(
    InvoicesForm,
    {
      formData: editData.value?.dataPayload?.data || {},
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Edit Invoices',
    modalSize
  )
}

const onDelete = async (row: Invoices) => {
  // Use SweetAlert2 for confirmation instead of native confirm
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d63939',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    try {
      const response = await $api(`/api/v1/reporting/invoice/${row.id}`, {
        method: 'DELETE'
      })
      
      // Handle backend alertifyPayload if present
      if (response?.alertifyPayload) {
        const { handleAlertify } = useAlertify()
        handleAlertify(response.alertifyPayload)
      } else {
        showToast('Deleted successfully', 'success')
      }
      
      await refresh()
    } catch (err: any) {
      // Handle error alertifyPayload from backend
      if (err?.data?.alertifyPayload) {
        const { handleAlertify } = useAlertify()
        handleAlertify(err.data.alertifyPayload)
      } else {
        showAlert(err?.data?.message || 'Delete failed', 'error')
      }
    }
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Invoices List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :actions="['view', 'edit', 'delete']"
        row-key="id"
        create-label="Create Invoices"
        :empty-message="'No invoices found'"
        @create="onCreate"
        @view="onView"
        @edit="onEdit"
        @delete="onDelete"
      />
    </BaseBlock>
  </div>
</template>
