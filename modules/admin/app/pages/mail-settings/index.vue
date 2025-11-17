<script setup lang="ts">
import type { MailSettings } from '../../types/entities/mail-settings.js'
import type { MailSettingsCreatePayload } from '../../types/mail-settings-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import MailSettingsForm from '../../components/MailSettingsForm.vue'
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

// Pagination state
const currentPage = ref(1)
const perPage = ref(20)
const searchQuery = ref('')

// Fetch function with query parameters
const fetchItems = () => {
  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    'per-page': perPage.value.toString()
  })

  if (searchQuery.value) {
    params.append('_search', searchQuery.value)
  }

  return `/api/v1/admin/mail-settings?${params.toString()}`
}

const { data, pending, error, refresh } = await useAsyncData(
  'mailSettings-list',
  () => $api(fetchItems()),
  {
    watch: [currentPage, perPage, searchQuery]
  }
)

const items = computed(() => data.value?.dataPayload?.data || [])
const errors = ref<Record<string, string>>({})

// Pagination data for DataGrid
const paginationData = computed(() => ({
  currentPage: data.value?.dataPayload?.currentPage || 1,
  perPage: data.value?.dataPayload?.perPage || 20,
  totalCount: data.value?.dataPayload?.totalCount || 0,
  totalPages: data.value?.dataPayload?.totalPages || 1,
  countOnPage: data.value?.dataPayload?.countOnPage || 0
}))

// Pagination event handlers
const handleChangePage = (page: number) => {
  currentPage.value = page
}

const handleUpdatePerPage = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1 // Reset to first page
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page on search
}

const columns = [
  {
    "field": "smtp_server",
    "header": "Smtp Server"
  },
  {
    "field": "smtp_port",
    "header": "Smtp Port"
  },
  {
    "field": "smtp_username",
    "header": "Smtp Username"
  },
  {
    "field": "smtp_password",
    "header": "Smtp Password"
  },
  {
    "field": "email_encryption",
    "header": "Email Encryption"
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
    router.push(`/admin/mail-settings/create`)
    return
  }

  // Modal mode: Define submit handler
  const handleSubmit = async (newData: MailSettingsCreatePayload) => {
    try {
      const response = await $api(`/api/v1/admin/mail-settings`, {
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
        showToast('MailSettings created successfully', 'success')
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
    MailSettingsForm,
    {
      formData: {
        smtp_server: '',
        smtp_port: 0,
        smtp_username: '',
        smtp_password: '',
        email_encryption: ''
      },
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Create MailSettings',
    modalSize
  )
}

// ========== VIEW HANDLER ==========
const onView = async (row: MailSettings) => {
  const id = row.id
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(`/admin/mail-settings/${id}`)
    return
  }

  // Modal mode: fetch data and show in modal
  try {
    const response = await $api(`/api/v1/admin/mail-settings/${id}`)
    const viewData = response?.dataPayload?.data || {}
    
    modalStore.openModal(
      MailSettingsForm,
      {
        formData: viewData,
        error: {},
        fieldErrors: {},
        isLoading: false,
        readonly: true, // View mode: all fields disabled
        hideSubmit: true, // Hide submit button
        compact: true
      },
      'View MailSettings',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load mailsettings:', err)
    showToast('Failed to load mailsettings', 'error')
  }
}

// ========== EDIT HANDLER ==========
const onEdit = async (row: MailSettings) => {
  const id = row.id
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(`/admin/mail-settings/${id}/edit`)
    return
  }

  // Fetch data first
  try {
    const response = await $api(`/api/v1/admin/mail-settings/${id}`)
    const editData = response?.dataPayload?.data || {}
    
    // Define submit handler
    const handleSubmit = async (updatedData: MailSettings) => {
      try {
        const response = await $api(`/api/v1/admin/mail-settings/${id}`, {
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
          showToast('MailSettings updated successfully', 'success')
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
      MailSettingsForm,
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
      'Edit MailSettings',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load mailsettings:', err)
    showToast('Failed to load mailsettings', 'error')
  }
}

const onDelete = async (row: MailSettings) => {
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
      const response = await $api(`/api/v1/admin/mail-settings/${row.id}`, {
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
    <BasePageHeading :title="'MailSettings List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :pagination-data="paginationData"
        :search-in-backend="true"
        :actions="['view', 'edit', 'delete']"
        row-key="id"
        create-label="Create MailSettings"
        :empty-message="'No mailsettings found'"
        @create="onCreate"
        @view="onView"
        @edit="onEdit"
        @delete="onDelete"
        @change-page="handleChangePage"
        @update:per-page="handleUpdatePerPage"
        @search="handleSearch"
      />
    </BaseBlock>
  </div>
</template>
