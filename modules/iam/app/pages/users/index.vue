<script setup lang="ts">
import type { Users } from '../../types/entities/users'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import UsersForm from '../../components/UsersForm.vue'
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

// Fetch data with query params
const fetchUsers = async () => {
  const params = new URLSearchParams({
    page: String(currentPage.value),
    'per-page': String(perPage.value),
  })
  
  if (searchQuery.value) {
    params.append('_search', searchQuery.value)
  }
  
  return $api(`/api/v1/iam/users?${params.toString()}`)
}

const { data, pending, error, refresh } = await useAsyncData(
  'users',
  fetchUsers,
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
    "field": "user_id",
    "header": "User ID"
  },
  {
    "field": "username",
    "header": "Username"
  },
  {
    "field": "status",
    "header": "Status"
  }
]

// ========== VIEW HANDLER ==========
const onView = async (row: Users) => {
  const id = row.username
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(`/iam/users/${id}`)
    return
  }

  // Modal mode: fetch data and show in modal
  try {
    const response = await $api(`/api/v1/iam/user/${id}`)
    const viewData = response?.dataPayload?.data || {}
    
    modalStore.openModal(
      UsersForm,
      {
        formData: viewData,
        error: {},
        fieldErrors: {},
        isLoading: false,
        readonly: true, // View mode: all fields disabled
        hideSubmit: true, // Hide submit button
        compact: true
      },
      'View User',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load user:', err)
    showToast('Failed to load user', 'error')
  }
}

// ========== DELETE HANDLER ==========
const onDelete = async (row: Users) => {
  const id = row.username
  
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
      const response = await $api(`/api/v1/iam/user/${id}`, {
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
    <BasePageHeading :title="'Users List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :pagination-data="paginationData"
        :search-in-backend="true"
        :actions="['view', 'delete']"
        row-key="username"
        :show-create="false"
        :empty-message="'No users found'"
        @view="onView"
        @delete="onDelete"
        @change-page="handleChangePage"
        @update:per-page="handleUpdatePerPage"
        @search="handleSearch"
      >
        <template #cell-status="{ row }">
          <span 
            :class="row.status === 'active' 
              ? 'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success' 
              : 'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-danger-light text-danger'"
          >
            {{ row.status }}
          </span>
        </template>
      </DataGrid>
    </BaseBlock>
  </div>
</template>
