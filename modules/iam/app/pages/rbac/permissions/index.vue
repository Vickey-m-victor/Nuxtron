<script setup lang="ts">
import type { Permissions } from '../../../types/entities/permissions.js'
import type { PermissionsCreatePayload } from '../../../types/permissions-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import PermissionsForm from '../../../components/PermissionsForm.vue'
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
const fetchPermissions = async () => {
  const params = new URLSearchParams({
    page: String(currentPage.value),
    'per-page': String(perPage.value),
  })
  
  if (searchQuery.value) {
    params.append('_search', searchQuery.value)
  }
  
  return $api(`/api/v1/iam/rbac/permission?${params.toString()}`)
}

const { data, pending, error, refresh } = await useAsyncData(
  'permissions',
  fetchPermissions,
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

// ========== EDIT HANDLER ==========
const onEdit = async (row: Permissions) => {
  const id = row.name // Using 'name' as the identifier for permissions
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(`/iam/rbac/permissions/${id}/edit`)
    return
  }

  // Fetch data first
  try {
    const response = await $api(`/api/v1/iam/rbac/permission/${id}`)
    const editData = response?.dataPayload?.data || {}
    
    // Define submit handler
    const handleSubmit = async (updatedData: Permissions) => {
      try {
        const response = await $api(`/api/v1/iam/rbac/permission/${id}`, {
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
          showToast('Permissions updated successfully', 'success')
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
      PermissionsForm,
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
      'Edit Permissions',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load permissions:', err)
    showToast('Failed to load permissions', 'error')
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Permissions List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :pagination-data="paginationData"
        :search-in-backend="true"
        :actions="['edit']"
        :show-create="false"
        row-key="name"
        :empty-message="'No permissions found'"
        @edit="onEdit"
        @change-page="handleChangePage"
        @update:per-page="handleUpdatePerPage"
        @search="handleSearch"
      />
    </BaseBlock>
  </div>
</template>
