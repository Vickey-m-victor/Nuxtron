import type { EntityDefinition } from '../../types/index.js'

// Template for reusable form component
export function formComponentTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)

  return `<script setup lang="ts">
import type { ${entity.name}CreatePayload } from '../types/${kebabCase(entity.name)}-dto.js'

interface Props {
  formData: ${entity.name}CreatePayload | any
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
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateCompactFormFieldComponent(p))
  .join('\n')}

      <!-- Submit button (hidden in view mode) -->
      <div v-if="!hideSubmit" class="d-flex gap-2 pt-2">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isLoading || loading || readonly"
        >
          <i class="fa fa-check opacity-50 me-1"></i>
          {{ loading || isLoading ? 'Saving...' : 'Save ${entity.name}' }}
        </button>
      </div>
    </div>

    <!-- Standard layout for pages -->
    <div v-else class="row push">
      <div class="col-lg-4">
        <p class="fs-sm text-muted">
          {{ readonly ? 'View ${entity.name.toLowerCase()} details' : 'Fill in the ${entity.name.toLowerCase()} information' }}
        </p>
      </div>
      <div class="col-lg-8 col-xl-6">
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateFormFieldComponentForReusableForm(p))
  .join('\n\n')}

        <!-- Submit button (hidden in view mode) -->
        <div v-if="!hideSubmit" class="mb-4">
          <button
            type="submit"
            class="btn btn-alt-primary"
            :disabled="isLoading || loading || readonly"
          >
            <i class="fa fa-check opacity-50 me-1"></i>
            {{ loading || isLoading ? 'Saving...' : 'Save ${entity.name}' }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Compact form styling handled globally in _modal.scss */
</style>
`
}

export function indexPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  // Use actual endpoints from OpenAPI or fallback to convention
  const listEndpoint = entity.endpoints?.list || `/${moduleName}/${entityRoutePlural}`
  const deleteEndpoint = entity.endpoints?.delete || `/${moduleName}/${entityRouteSingular}/{id}`
  const viewEndpoint = entity.endpoints?.view || `/${moduleName}/${entityRouteSingular}/{id}`
  const createEndpoint = entity.endpoints?.create || `/${moduleName}/${entityRouteSingular}`
  // Ensure update endpoint has {id} parameter (some OpenAPI schemas miss this)
  let updateEndpoint = entity.endpoints?.update || `/${moduleName}/${entityRouteSingular}/{id}`
  if (updateEndpoint && !updateEndpoint.includes('{id}') && !updateEndpoint.includes('{ID}')) {
    updateEndpoint = `${updateEndpoint}/{id}`
  }
  
  const deleteUrl = deleteEndpoint.replace('{id}', '${row.id}')
  const viewUrl = viewEndpoint.replace('{id}', '${id}')
  const updateUrl = updateEndpoint.replace('{id}', '${id}')

  // Use routePath for navigation, fallback to pluralized entity name
  const navigationPath = entity.routePath || entityRoutePlural

  // Calculate relative path depth based on routePath nesting
  // e.g., "rbac/roles" has 2 segments, so we need "../../../" to reach app/
  const routeSegments = (entity.routePath || entityRoutePlural).split('/').length
  const relativeToApp = '../'.repeat(routeSegments + 1) // +1 for the pages dir itself
  const relativeToModule = '../'.repeat(routeSegments + 2) // +2 to reach module root

  // Generate columns for DataGrid
  const columns = entity.properties.map(prop => ({
    field: prop.name,
    header: titleCase(prop.name)
  }))

  return `<script setup lang="ts">
import type { ${entity.name} } from '${relativeToApp}types/entities/${kebabCase(entity.name)}.js'
import type { ${entity.name}CreatePayload } from '${relativeToApp}types/${kebabCase(entity.name)}-dto.js'
import Swal from 'sweetalert2'
import { useModalStore } from '~/stores/modal'
import ${entity.name}Form from '${relativeToApp}components/${entity.name}Form.vue'
import moduleConfig from '${relativeToModule}module.config'

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

  return \`/api/v1${listEndpoint}?\${params.toString()}\`
}

const { data, pending, error, refresh } = await useAsyncData(
  '${entityLower}-list',
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

const columns = ${JSON.stringify(columns, null, 2)}

// ========== CREATE HANDLER ==========
const onCreate = async () => {
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to create page
    router.push(\`/${moduleName}/${navigationPath}/create\`)
    return
  }

  // Modal mode: Define submit handler
  const handleSubmit = async (newData: ${entity.name}CreatePayload) => {
    try {
      const response = await $api(\`/api/v1${createEndpoint}\`, {
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
        showToast('${entity.name} created successfully', 'success')
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
    ${entity.name}Form,
    {
      formData: {
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => `        ${p.name}: ${getDefaultValue(p)}`)
  .join(',\n')}
      },
      error: {},
      fieldErrors: errors,
      isLoading: false,
      readonly: false,
      hideSubmit: false,
      compact: true,
      onSubmit: handleSubmit
    },
    'Create ${entity.name}',
    modalSize
  )
}

// ========== VIEW HANDLER ==========
const onView = async (row: ${entity.name}) => {
  const id = row.id
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to view page
    router.push(\`/${moduleName}/${navigationPath}/\${id}\`)
    return
  }

  // Modal mode: fetch data and show in modal
  try {
    const response = await $api(\`/api/v1${viewUrl}\`)
    const viewData = response?.dataPayload?.data || {}
    
    modalStore.openModal(
      ${entity.name}Form,
      {
        formData: viewData,
        error: {},
        fieldErrors: {},
        isLoading: false,
        readonly: true, // View mode: all fields disabled
        hideSubmit: true, // Hide submit button
        compact: true
      },
      'View ${entity.name}',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load ${entity.name.toLowerCase()}:', err)
    showToast('Failed to load ${entity.name.toLowerCase()}', 'error')
  }
}

// ========== EDIT HANDLER ==========
const onEdit = async (row: ${entity.name}) => {
  const id = row.id
  errors.value = {}
  
  // Use modal setting from module config
  modalStore.toggleModalUsage(useModalMode)
  await nextTick()

  if (!modalStore.useModal) {
    // Navigate to edit page
    router.push(\`/${moduleName}/${navigationPath}/\${id}/edit\`)
    return
  }

  // Fetch data first
  try {
    const response = await $api(\`/api/v1${viewUrl}\`)
    const editData = response?.dataPayload?.data || {}
    
    // Define submit handler
    const handleSubmit = async (updatedData: ${entity.name}) => {
      try {
        const response = await $api(\`/api/v1${updateUrl}\`, {
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
          showToast('${entity.name} updated successfully', 'success')
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
      ${entity.name}Form,
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
      'Edit ${entity.name}',
      modalSize
    )
  } catch (err: any) {
    console.error('Failed to load ${entity.name.toLowerCase()}:', err)
    showToast('Failed to load ${entity.name.toLowerCase()}', 'error')
  }
}

const onDelete = async (row: ${entity.name}) => {
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
      const response = await $api(\`/api/v1${deleteUrl}\`, {
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
    <BasePageHeading :title="'${entity.name} List'" />

    <BaseBlock>
      <DataGrid
        :data="items"
        :columns="columns"
        :loading="pending"
        :pagination-data="paginationData"
        :search-in-backend="true"
        :actions="['view', 'edit', 'delete']"
        row-key="id"
        create-label="Create ${entity.name}"
        :empty-message="'No ${entity.name.toLowerCase()} found'"
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
`
}

export function createPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  // Use actual endpoints from OpenAPI or fallback to convention
  const createEndpoint = entity.endpoints?.create || `/${moduleName}/${entityRouteSingular}`

  // Use routePath for navigation, fallback to pluralized entity name
  const navigationPath = entity.routePath || entityRoutePlural

  // Calculate relative path depth
  const routeSegments = navigationPath.split('/').length
  const relativeToApp = '../'.repeat(routeSegments + 1)

  return `<script setup lang="ts">
import type { ${entity.name}CreatePayload } from '${relativeToApp}types/${kebabCase(entity.name)}-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, handleAlertify } = useAlertify()
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const formData = ref<${entity.name}CreatePayload>({
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => `  ${p.name}: ${getDefaultValue(p)}`)
  .join(',\n')}
})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(\`/api/v1${createEndpoint}\`, {
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
    
    router.push(\`/${moduleName}/${navigationPath}\`)
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
    <BasePageHeading :title="'Create ${entity.name}'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(\`/${moduleName}/${navigationPath}\`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="New ${entity.name}" subtitle="Fill in the details below" content-full>
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
              Provide the required information to create a new ${entity.name.toLowerCase()}.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateFormFieldComponent(p))
  .join('\n\n')}

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Creating...' : 'Create ${entity.name}' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(\`/${moduleName}/${navigationPath}\`)"
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
`
}

export function viewPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  // Use actual endpoints from OpenAPI or fallback to convention
  const viewEndpoint = entity.endpoints?.view || `/${moduleName}/${entityRouteSingular}/{id}`
  const viewUrl = viewEndpoint.replace('{id}', '${id}')

  // Use routePath for navigation, fallback to pluralized entity name
  const navigationPath = entity.routePath || entityRoutePlural

  // Calculate relative path depth
  const routeSegments = navigationPath.split('/').length
  const relativeToApp = '../'.repeat(routeSegments + 1)

  return `<script setup lang="ts">
import type { ${entity.name} } from '${relativeToApp}types/entities/${kebabCase(entity.name)}.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: ${entity.name} }
}>(\`/api/v1${viewUrl}\`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onEdit = () => {
  router.push(\`/${moduleName}/${navigationPath}/\${id}/edit\`)
}

const onBack = () => {
  router.push(\`/${moduleName}/${navigationPath}\`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View ${entity.name}'">
      <template #extra>
        <button 
          class="btn btn-warning me-2"
          @click="onEdit"
        >
          <i class="fa fa-pencil-alt opacity-50 me-1"></i>
          Edit
        </button>
        <button 
          class="btn btn-alt-secondary"
          @click="onBack"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="${entity.name} Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading ${entity.name.toLowerCase()} details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load ${entity.name.toLowerCase()}' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
${entity.properties.map(p => `        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">${titleCase(p.name)}</p>
            <p v-if="typeof item.${p.name} === 'object' && item.${p.name}?.label && item.${p.name}?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.${p.name}.theme + '-light text-' + item.${p.name}.theme">{{ item.${p.name}.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.${p.name} || '-' }}</p>
          </div>
        </div>`).join('\n')}
      </div>
    </BaseBlock>
  </div>
</template>
`
}

export function editPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  // Use actual endpoints from OpenAPI or fallback to convention
  const viewEndpoint = entity.endpoints?.view || `/${moduleName}/${entityRouteSingular}/{id}`
  // Ensure update endpoint has {id} parameter (some OpenAPI schemas miss this)
  let updateEndpoint = entity.endpoints?.update || `/${moduleName}/${entityRouteSingular}/{id}`
  if (updateEndpoint && !updateEndpoint.includes('{id}') && !updateEndpoint.includes('{ID}')) {
    updateEndpoint = `${updateEndpoint}/{id}`
  }
  const viewUrl = viewEndpoint.replace('{id}', '${id}')
  const updateUrl = updateEndpoint.replace('{id}', '${id}')

  // Use routePath for navigation, fallback to pluralized entity name
  const navigationPath = entity.routePath || entityRoutePlural

  // Calculate relative path depth
  const routeSegments = navigationPath.split('/').length
  const relativeToApp = '../'.repeat(routeSegments + 1)

  return `<script setup lang="ts">
import type { ${entity.name}, ${entity.name}UpdatePayload } from '${relativeToApp}types/${kebabCase(entity.name)}-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, showAlert, handleAlertify } = useAlertify()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: ${entity.name} }
}>(\`/api/v1${viewUrl}\`, {
  $fetch: $api
})

const formData = ref<${entity.name}UpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(\`/api/v1${updateUrl}\`, {
      method: 'PUT',
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
      showToast('Updated successfully', 'success')
    }
    
    router.push(\`/${moduleName}/${navigationPath}\`)
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
      error.value = err?.data?.message || err?.message || 'Update failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Edit ${entity.name}'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(\`/${moduleName}/${navigationPath}\`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="Update ${entity.name}" subtitle="Modify the details below" content-full>
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
              Update the form fields to modify this ${entity.name.toLowerCase()}.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateFormFieldComponent(p))
  .join('\n\n')}

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Updating...' : 'Update ${entity.name}' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(\`/${moduleName}/${navigationPath}\`)"
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
`
}

// Helper functions
function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

function pluralize(str: string): string {
  // Words that are already plural or don't need pluralization
  const alreadyPlural = ['settings', 'data', 'information', 'equipment', 'news', 'series', 'species']
  const lowerStr = str.toLowerCase()
  
  // Check if the word (or the last part after camelCase) is already plural
  if (alreadyPlural.some(plural => lowerStr.endsWith(plural))) {
    return str
  }
  
  // Handle words ending in 'y' (but not 'ay', 'ey', 'oy', 'uy')
  if (str.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some(end => str.endsWith(end))) {
    return str.slice(0, -1) + 'ies'
  }
  
  // Handle words ending in 's', 'ss', 'sh', 'ch', 'x', 'z'
  if (str.endsWith('ss') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
    return str + 'es'
  }
  
  // Default: just add 's'
  return str + 's'
}

function titleCase(str: string): string {
  return str.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function getDefaultValue(prop: any): string {
  if (prop.type === 'string') return "''"
  if (prop.type === 'number') return '0'
  if (prop.type === 'boolean') return 'false'
  if (prop.type.endsWith('[]')) return '[]'
  return 'undefined'
}

function generateFormField(prop: any): string {
  const label = titleCase(prop.name)
  const inputType = prop.type === 'number' ? 'number' : 'text'
  
  return `        <div class="mb-3">
          <label class="form-label">${label}</label>
          <input
            v-model="formData.${prop.name}"
            type="${inputType}"
            class="form-control"
            ${prop.required ? 'required' : ''}
          />
        </div>`
}

function generatePrimeVueFormField(prop: any): string {
  const label = titleCase(prop.name)
  
  // For text fields
  if (prop.type === 'string') {
    // Check if it might be a longer text field
    if (prop.name.includes('description') || prop.name.includes('note') || prop.name.includes('comment')) {
      return `        <div class="mb-4">
          <label class="form-label fw-semibold mb-2 d-block">${label}</label>
          <Textarea 
            v-model="formData.${prop.name}" 
            rows="3" 
            ${prop.required ? ':required="true"' : ''}
          />
        </div>`
    }
    return `        <div class="mb-4">
          <label class="form-label fw-semibold mb-2 d-block">${label}</label>
          <InputText 
            v-model="formData.${prop.name}" 
            ${prop.required ? ':required="true"' : ''}
          />
        </div>`
  }
  
  // For number fields
  if (prop.type === 'number' || prop.type === 'integer') {
    return `        <div class="mb-4">
          <label class="form-label fw-semibold mb-2 d-block">${label}</label>
          <InputNumber 
            v-model="formData.${prop.name}" 
            ${prop.required ? ':required="true"' : ''}
          />
        </div>`
  }
  
  // For boolean fields
  if (prop.type === 'boolean') {
    return `        <div class="mb-4">
          <div class="form-check">
            <Checkbox 
              v-model="formData.${prop.name}" 
              :binary="true"
              inputId="${prop.name}"
            />
            <label class="form-check-label ms-2" for="${prop.name}">${label}</label>
          </div>
        </div>`
  }
  
  // Default fallback
  return `        <div class="mb-4">
          <label class="form-label fw-semibold mb-2 d-block">${label}</label>
          <InputText 
            v-model="formData.${prop.name}" 
            ${prop.required ? ':required="true"' : ''}
          />
        </div>`
}

function generateFormFieldComponent(prop: any): string {
  const label = titleCase(prop.name)
  const fieldId = `${prop.name}-input`
  
  // Determine field type
  let fieldType = 'text'
  let inputElement = ''
  
  if (prop.type === 'number' || prop.type === 'integer') {
    fieldType = 'number'
  } else if (prop.type === 'boolean') {
    // Checkbox/Switch
    return `            <div class="mb-4">
              <label class="form-label">${label}</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="formData.${prop.name}"
                  id="${fieldId}"
                  :disabled="loading"
                />
                <label class="form-check-label" for="${fieldId}">
                  Enable ${label}
                </label>
              </div>
            </div>`
  } else if (prop.name.includes('description') || prop.name.includes('note') || prop.name.includes('comment') || prop.name.includes('content')) {
    // Textarea
    return `            <div class="mb-4">
              <label class="form-label" for="${fieldId}">
                ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
              </label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['${prop.name}'] }"
                id="${fieldId}"
                v-model="formData.${prop.name}"
                rows="4"
                placeholder="Enter ${label.toLowerCase()}"
                :disabled="loading"
              ></textarea>
              <div v-if="fieldErrors['${prop.name}']" class="invalid-feedback">
                {{ fieldErrors['${prop.name}'] }}
              </div>
            </div>`
  } else if (prop.name.includes('email')) {
    fieldType = 'email'
  } else if (prop.name.includes('password')) {
    fieldType = 'password'
  } else if (prop.name.includes('phone') || prop.name.includes('tel')) {
    fieldType = 'tel'
  } else if (prop.name.includes('url') || prop.name.includes('website')) {
    fieldType = 'url'
  } else if (prop.name.includes('date') && !prop.name.includes('updated') && !prop.name.includes('created')) {
    fieldType = 'date'
  }
  
  // Standard input field (text, email, password, number, tel, url, date)
  return `            <div class="mb-4">
              <label class="form-label" for="${fieldId}">
                ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
              </label>
              <input
                type="${fieldType}"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['${prop.name}'] }"
                id="${fieldId}"
                v-model="formData.${prop.name}"
                placeholder="Enter ${label.toLowerCase()}"
                :disabled="loading"
              />
              <div v-if="fieldErrors['${prop.name}']" class="invalid-feedback">
                {{ fieldErrors['${prop.name}'] }}
              </div>
            </div>`
}

// For reusable form component (used in modals and pages)
function generateFormFieldComponentForReusableForm(prop: any): string {
  const label = titleCase(prop.name)
  const fieldId = `${prop.name}-input`
  
  // Determine field type
  let fieldType = 'text'
  
  if (prop.type === 'number' || prop.type === 'integer') {
    fieldType = 'number'
  } else if (prop.type === 'boolean') {
    // Checkbox/Switch
    return `        <div class="mb-4">
          <label class="form-label">${label}</label>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="formData.${prop.name}"
              id="${fieldId}"
              :disabled="readonly || isLoading || loading"
            />
            <label class="form-check-label" for="${fieldId}">
              Enable ${label}
            </label>
          </div>
        </div>`
  } else if (prop.name.includes('description') || prop.name.includes('note') || prop.name.includes('comment') || prop.name.includes('content')) {
    // Textarea
    return `        <div class="mb-4">
          <label class="form-label" for="${fieldId}">
            ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
          </label>
          <textarea
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['${prop.name}'] }"
            id="${fieldId}"
            v-model="formData.${prop.name}"
            rows="4"
            placeholder="Enter ${label.toLowerCase()}"
            :disabled="readonly || isLoading || loading"
          ></textarea>
          <div v-if="fieldErrors?.['${prop.name}']" class="invalid-feedback">
            {{ fieldErrors['${prop.name}'] }}
          </div>
        </div>`
  } else if (prop.name.includes('email')) {
    fieldType = 'email'
  } else if (prop.name.includes('password')) {
    fieldType = 'password'
  } else if (prop.name.includes('phone') || prop.name.includes('tel')) {
    fieldType = 'tel'
  } else if (prop.name.includes('url') || prop.name.includes('website')) {
    fieldType = 'url'
  } else if (prop.name.includes('date') && !prop.name.includes('updated') && !prop.name.includes('created')) {
    fieldType = 'date'
  }
  
  // Standard input field (text, email, password, number, tel, url, date)
  return `        <div class="mb-4">
          <label class="form-label" for="${fieldId}">
            ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
          </label>
          <input
            type="${fieldType}"
            class="form-control"
            :class="{ 'is-invalid': fieldErrors?.['${prop.name}'] }"
            id="${fieldId}"
            v-model="formData.${prop.name}"
            placeholder="Enter ${label.toLowerCase()}"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['${prop.name}']" class="invalid-feedback">
            {{ fieldErrors['${prop.name}'] }}
          </div>
        </div>`
}

// For compact form component (used in modals for better spacing)
function generateCompactFormFieldComponent(prop: any): string {
  const label = titleCase(prop.name)
  const fieldId = `${prop.name}-input`
  
  // Determine field type
  let fieldType = 'text'
  
  if (prop.type === 'number' || prop.type === 'integer') {
    fieldType = 'number'
  } else if (prop.type === 'boolean') {
    // Checkbox/Switch - compact version
    return `        <div class="mb-3">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="formData.${prop.name}"
              id="${fieldId}"
              :disabled="readonly || isLoading || loading"
            />
            <label class="form-check-label" for="${fieldId}">
              ${label}
            </label>
          </div>
        </div>`
  } else if (prop.name.includes('description') || prop.name.includes('note') || prop.name.includes('comment') || prop.name.includes('content')) {
    // Textarea - compact version
    return `        <div class="mb-3">
          <label class="form-label" for="${fieldId}">
            ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
          </label>
          <textarea
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['${prop.name}'] }"
            id="${fieldId}"
            v-model="formData.${prop.name}"
            rows="3"
            placeholder="Enter ${label.toLowerCase()}"
            :disabled="readonly || isLoading || loading"
          ></textarea>
          <div v-if="fieldErrors?.['${prop.name}']" class="invalid-feedback">
            {{ fieldErrors['${prop.name}'] }}
          </div>
        </div>`
  } else if (prop.name.includes('email')) {
    fieldType = 'email'
  } else if (prop.name.includes('password')) {
    fieldType = 'password'
  } else if (prop.name.includes('phone') || prop.name.includes('tel')) {
    fieldType = 'tel'
  } else if (prop.name.includes('url') || prop.name.includes('website')) {
    fieldType = 'url'
  } else if (prop.name.includes('date') && !prop.name.includes('updated') && !prop.name.includes('created')) {
    fieldType = 'date'
  }
  
  // Compact input field with form-control-sm and mb-3
  return `        <div class="mb-3">
          <label class="form-label" for="${fieldId}">
            ${label}${prop.required ? ' <span class="text-danger">*</span>' : ''}
          </label>
          <input
            type="${fieldType}"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': fieldErrors?.['${prop.name}'] }"
            id="${fieldId}"
            v-model="formData.${prop.name}"
            placeholder="Enter ${label.toLowerCase()}"
            :disabled="readonly || isLoading || loading"
          />
          <div v-if="fieldErrors?.['${prop.name}']" class="invalid-feedback">
            {{ fieldErrors['${prop.name}'] }}
          </div>
        </div>`
}
