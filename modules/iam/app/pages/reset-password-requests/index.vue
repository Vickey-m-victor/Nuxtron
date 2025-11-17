<script setup lang="ts">
import type { ResetPasswordRequest } from '../../types/entities/reset-password-request.js'
import type { ResetPasswordRequestCreatePayload } from '../../types/reset-password-request-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import ResetPasswordRequestForm from '../../components/ResetPasswordRequestForm.vue'
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
    data: ResetPasswordRequest[]
    totalCount: number
    currentPage: number
  }
}>(`/api/v1/iam/reset-password-requests`, {
  $fetch: $api
})

const items = computed(() => data.value?.dataPayload?.data || [])
const errors = ref<Record<string, string>>({})

const columns = [
  {
    "field": "username",
    "header": "Username"
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
    router.push(`/iam/reset-password-requests/create`)
    return
  }

  // Modal mode: Define submit handler
  const handleSubmit = async (newData: ResetPasswordRequestCreatePayload) => {
    try {
      const response = await $api(`/api/v1/iam/reset-password-request`, {
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
        showToast('ResetPasswordRequest created successfully', 'success')
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
    ResetPasswordRequestForm,
    {
      formData: {
        username: ''
      },
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Create ResetPasswordRequest',
    modalSize
  )
}

// ========== VIEW HANDLER ==========
const onView = async (row: ResetPasswordRequest) => {
  const id = row.id
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(`/iam/reset-password-requests/${id}`)
    return
  }

  // Modal mode: fetch data and show in modal
  try {
    const response = await $api(`/api/v1/iam/reset-password-request/${id}`)
    const viewData = response?.dataPayload?.data || {}
    
    modalStore.openModal(
      ResetPasswordRequestForm,
      {
        formData: viewData,
        error: {},
        fieldErrors: {},
        isLoading: false,
        readonly: true, // View mode: all fields disabled
        hideSubmit: true, // Hide submit button
        compact: true
      },
      'View ResetPasswordRequest',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load resetpasswordrequest:', err)
    showToast('Failed to load resetpasswordrequest', 'error')
  }
}

// ========== EDIT HANDLER ==========
const onEdit = async (row: ResetPasswordRequest) => {
  const id = row.id
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(`/iam/reset-password-requests/${id}/edit`)
    return
  }

  // Fetch data first
  try {
    const response = await $api(`/api/v1/iam/reset-password-request/${id}`)
    const editData = response?.dataPayload?.data || {}
    
    // Define submit handler
    const handleSubmit = async (updatedData: ResetPasswordRequest) => {
      try {
        const response = await $api(`/api/v1/iam/reset-password-request/${id}`, {
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
          showToast('ResetPasswordRequest updated successfully', 'success')
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
      ResetPasswordRequestForm,
      {
        formData: editData,
        error: {},
        fieldErrors: errors,
        isLoading: false,
        readonly: false,
        hideSubmit: false,
        compact: true,
        onSubmit: handleSubmit
      },
      'Edit ResetPasswordRequest',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load resetpasswordrequest:', err)
    showToast('Failed to load resetpasswordrequest', 'error')
  }
}

const onDelete = async (row: ResetPasswordRequest) => {
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
      const response = await $api(`/api/v1/iam/reset-password-request/${row.id}`, {
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
    <BasePageHeading :title="'ResetPasswordRequest List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :actions="['view', 'edit', 'delete']"
        row-key="id"
        create-label="Create ResetPasswordRequest"
        :empty-message="'No resetpasswordrequest found'"
        @create="onCreate"
        @view="onView"
        @edit="onEdit"
        @delete="onDelete"
      />
    </BaseBlock>
  </div>
</template>
