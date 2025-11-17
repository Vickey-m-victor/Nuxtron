<script setup lang="ts">
import type { Roles } from '../../../types/entities/roles.js'
import type { RolesCreatePayload } from '../../../types/roles-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import RolesForm from '../../../components/RolesForm.vue'
import AssignmentManager from '../../../components/AssignmentManager.vue'
import moduleConfig from '../../../../module.config'

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

// Fetch data with query params
const fetchRoles = async () => {
  const params = new URLSearchParams({
    page: String(currentPage.value),
    'per-page': String(perPage.value),
  })
  
  if (searchQuery.value) {
    params.append('_search', searchQuery.value)
  }
  
  return $api(`/api/v1/iam/rbac/roles?${params.toString()}`)
}

const { data, pending, error, refresh } = await useAsyncData(
  'roles',
  fetchRoles,
  { watch: [currentPage, perPage, searchQuery] }
)

const items = computed(() => data.value?.dataPayload?.data || [])
const paginationData = computed(() => ({
  currentPage: data.value?.dataPayload?.currentPage || 1,
  perPage: data.value?.dataPayload?.perPage || 20,
  totalCount: data.value?.dataPayload?.totalCount || 0,
  totalPages: data.value?.dataPayload?.totalPages || 1,
  countOnPage: data.value?.dataPayload?.countOnPage || 0,
}))

const errors = ref<Record<string, string>>({})

// Event handlers
const handleChangePage = (page: number) => {
  currentPage.value = page
}

const handleUpdatePerPage = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1 // Reset to first page
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page
}

const columns = [
  {
    "field": "name",
    "header": "Name"
  },
  {
    "field": "description",
    "header": "Description"
  },
  {
    "field": "ruleName",
    "header": "RuleName"
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
    router.push(`/iam/rbac/roles/create`)
    return
  }

  // Modal mode: Define submit handler
  const handleSubmit = async (newData: RolesCreatePayload) => {
    try {
      const response = await $api(`/api/v1/iam/rbac/role`, {
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
        showToast('Roles created successfully', 'success')
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
    RolesForm,
    {
      formData: {
        name: '',
        description: '',
        ruleName: ''
      },
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Create Roles',
    modalSize
  )
}

// ========== VIEW HANDLER ==========
const onView = async (row: Roles) => {
  const id = row.name // Using 'name' as identifier
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(`/iam/rbac/roles/${id}`)
    return
  }

  // Modal mode: fetch data and show in modal
  try {
    const response = await $api(`/api/v1/iam/rbac/role/${id}`)
    const viewData = response?.dataPayload?.data || {}
    
    modalStore.openModal(
      RolesForm,
      {
        formData: viewData,
        error: {},
        fieldErrors: {},
        isLoading: false,
        readonly: true, // View mode: all fields disabled
        hideSubmit: true, // Hide submit button
        compact: true
      },
      'View Roles',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load roles:', err)
    showToast('Failed to load roles', 'error')
  }
}

// ========== EDIT HANDLER ==========
const onEdit = async (row: Roles) => {
  const id = row.name // Using 'name' as identifier
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(`/iam/rbac/roles/${id}/edit`)
    return
  }

  // Fetch data first
  try {
    const response = await $api(`/api/v1/iam/rbac/role/${id}`)
    const editData = response?.dataPayload?.data || {}
    
    // Define submit handler
    const handleSubmit = async (updatedData: Roles) => {
      try {
        const response = await $api(`/api/v1/iam/rbac/role/${id}`, {
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
          showToast('Roles updated successfully', 'success')
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
      RolesForm,
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
      'Edit Roles',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load roles:', err)
    showToast('Failed to load roles', 'error')
  }
}

const onDelete = async (row: Roles) => {
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
      const response = await $api(`/api/v1/iam/rbac/role/${row.name}`, {
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

// ========== MANAGE PERMISSIONS ==========
const manageRolePermissions = (role: Roles) => {
  modalStore.openModal(
    AssignmentManager,
    {
      entity: role,
      config: {
        title: 'permissions',
        availableTitle: 'Available Permissions',
        assignedTitle: 'Assigned Permissions',
        keyField: 'name',
        displayField: 'name',
        getAllEndpoint: `/api/v1/iam/rbac/role/${role.name}`,
        getAssignedEndpoint: `/api/v1/iam/rbac/role/${role.name}`,
        assignEndpoint: `/api/v1/iam/rbac/role/assign/${role.name}`,
        removeEndpoint: `/api/v1/iam/rbac/role/remove/${role.name}`,
      },
    },
    `Manage Permissions for ${role.name} Role`,
    'xl',
    false,
    {
      centered: false,
      scrollable: true,
      bodyClass: 'p-0'
    }
  )
}

const customActions = [
  {
    name: 'manage-permissions',
    label: 'Manage Permissions',
    icon: 'fa fa-shield-alt',
    variant: 'info'
  }
]

const handleCustomAction = (payload: { action: string, row: Roles }) => {
  if (payload.action === 'manage-permissions') {
    manageRolePermissions(payload.row)
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Roles List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :pagination-data="paginationData"
        :search-in-backend="true"
        :actions="['view', 'edit', 'delete']"
        :custom-actions="customActions"
        row-key="name"
        create-label="Create Role"
        :empty-message="'No roles found'"
        @create="onCreate"
        @view="onView"
        @edit="onEdit"
        @delete="onDelete"
        @custom-action="handleCustomAction"
        @change-page="handleChangePage"
        @update:per-page="handleUpdatePerPage"
        @search="handleSearch"
      />
    </BaseBlock>
  </div>
</template>
