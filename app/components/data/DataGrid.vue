<template>
  <div class="datagrid">
    <!-- Toolbar -->
    <div v-if="showToolbar" class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center gap-3 flex-grow-1">
        <div class="flex-grow-1" style="max-width: 400px;">
          <SearchInput v-if="searchable" v-model="searchQuery" :placeholder="searchPlaceholder" />
        </div>
        <!-- Rows per page selector -->
        <div v-if="paginated" class="d-flex align-items-center gap-2">
          <label class="text-muted mb-0 text-nowrap">Rows:</label>
          <select 
            class="form-select form-select-sm" 
            style="width: auto; min-width: 70px;"
            v-model="currentPerPage"
          >
            <option v-for="option in perPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex-shrink-0">
        <slot name="toolbar">
          <Button
            v-if="showCreate"
            variant="primary"
            icon="fa fa-plus"
            size="sm"
            @click="$emit('create')"
          >
            {{ createLabel }}
          </Button>
        </slot>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-vcenter">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.field"
              :class="getHeaderClass(column)"
              :style="column.width ? `width: ${column.width}` : ''"
              @click="column.sortable !== false && sortable ? onSort(column.field) : null"
            >
              {{ column.header }}
              <i 
                v-if="column.sortable !== false && sortable"
                :class="getSortIcon(column.field)"
                class="ms-1"
              ></i>
            </th>
            <th v-if="actions.length > 0" class="text-center" style="width: 150px;">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading state -->
          <tr v-if="loading">
            <td :colspan="totalColumns" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted mt-3 mb-0">Loading data...</p>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-else-if="!loading && displayData.length === 0">
            <td :colspan="totalColumns" class="text-center py-5">
              <slot name="empty">
                <i class="fa fa-inbox fa-3x text-muted mb-3"></i>
                <p class="text-muted mb-3">{{ emptyMessage }}</p>
                <Button
                  v-if="showCreate"
                  variant="primary"
                  size="sm"
                  icon="fa fa-plus"
                  @click="$emit('create')"
                >
                  {{ createLabel }}
                </Button>
              </slot>
            </td>
          </tr>

          <!-- Data rows -->
          <tr v-else v-for="(row, index) in displayData" :key="rowKey ? row[rowKey] : index">
            <td v-for="column in columns" :key="column.field" :class="getCellClass(column)">
              <slot :name="`cell-${column.field}`" :row="row" :value="row[column.field]">
                <span 
                  v-if="typeof row[column.field] === 'object' && row[column.field]?.label && row[column.field]?.theme"
                  :class="`fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-${row[column.field].theme}-light text-${row[column.field].theme}`"
                >
                  {{ row[column.field].label }}
                </span>
                <template v-else>
                  {{ formatValue(row[column.field], column) }}
                </template>
              </slot>
            </td>
            <td v-if="actions.length > 0" class="text-center">
              <ActionButtons
                :row-data="row"
                :actions="actions"
                :custom-actions="customActions"
                @view="$emit('view', row)"
                @edit="$emit('edit', row)"
                @delete="$emit('delete', row)"
                @custom-action="handleCustomAction"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="paginated && !loading && (searchInBackend ? (paginationData?.totalCount || 0) > 0 : filteredData.length > 0)"
      v-model:current-page="currentPage"
      :per-page="currentPerPage"
      :total="searchInBackend ? (paginationData?.totalCount || 0) : filteredData.length"
      :total-pages="searchInBackend ? (paginationData?.totalPages || 1) : undefined"
      @update:current-page="(page) => searchInBackend ? emit('change-page', page) : null"
    />
  </div>
</template>

<script setup lang="ts">
import SearchInput from './DataGrid/SearchInput.vue'
import ActionButtons from './DataGrid/ActionButtons.vue'
import Pagination from './DataGrid/Pagination.vue'

interface Column {
  field: string
  header: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
}

interface CustomAction {
  name: string
  label: string
  icon?: string
  variant?: string
}

interface PaginationData {
  countOnPage?: number
  currentPage: number
  perPage: number
  totalCount?: number
  totalPages?: number
  paginationLinks?: any
}

interface Props {
  data: any[]
  columns: Column[]
  actions?: ('view' | 'edit' | 'delete')[]
  customActions?: CustomAction[]
  loading?: boolean
  paginated?: boolean
  paginationData?: PaginationData
  perPage?: number
  perPageOptions?: number[]
  sortable?: boolean
  searchable?: boolean
  searchInBackend?: boolean
  rowKey?: string
  showCreate?: boolean
  createLabel?: string
  searchPlaceholder?: string
  emptyMessage?: string
  showToolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => ['view', 'edit', 'delete'],
  customActions: () => [],
  loading: false,
  paginated: true,
  perPage: 10,
  perPageOptions: () => [5, 10, 20, 50],
  sortable: true,
  searchable: true,
  searchInBackend: true,
  showCreate: true,
  createLabel: 'Create New',
  searchPlaceholder: 'Search...',
  emptyMessage: 'No data found',
  showToolbar: true
})

const emit = defineEmits<{
  create: []
  view: [row: any]
  edit: [row: any]
  delete: [row: any]
  'custom-action': [payload: { action: string, row: any }]
  'change-page': [page: number]
  'update:per-page': [perPage: number]
  search: [query: string]
}>()

// State
const currentPage = ref(props.paginationData?.currentPage || 1)
const currentPerPage = ref(props.paginationData?.perPage || props.perPage)
const searchQuery = ref('')
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Watch for external pagination data changes
watch(() => props.paginationData, (newData) => {
  if (newData) {
    currentPage.value = newData.currentPage
    currentPerPage.value = newData.perPage
  }
}, { deep: true })

// Watch for perPage changes
watch(currentPerPage, (newVal) => {
  emit('update:per-page', newVal)
})

// Computed
const totalColumns = computed(() => props.columns.length + (props.actions.length > 0 || props.customActions.length > 0 ? 1 : 0))

// Display data - either from backend pagination or client-side
const displayData = computed(() => {
  if (props.searchInBackend) {
    // Backend pagination mode - display data as-is from API
    return props.data
  } else {
    // Client-side mode - use filtered and paginated data
    return paginatedData.value
  }
})

// Filter data based on search
const filteredData = computed(() => {
  if (!searchQuery.value || !props.searchable) {
    return props.data
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(row => {
    return props.columns.some(column => {
      const value = row[column.field]
      return value && String(value).toLowerCase().includes(query)
    })
  })
})

// Sort data
const sortedData = computed(() => {
  if (!sortField.value || !props.sortable) {
    return filteredData.value
  }
  
  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortField.value!]
    const bVal = b[sortField.value!]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

// Paginate data
const paginatedData = computed(() => {
  if (!props.paginated) {
    return sortedData.value
  }
  
  const start = (currentPage.value - 1) * currentPerPage.value
  const end = start + currentPerPage.value
  return sortedData.value.slice(start, end)
})

// Methods
const onSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortField.value !== field) {
    return 'fa fa-sort text-muted'
  }
  return sortOrder.value === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'
}

const getHeaderClass = (column: Column) => {
  const classes = []
  if (column.sortable !== false && props.sortable) {
    classes.push('cursor-pointer', 'user-select-none')
  }
  if (column.align) {
    classes.push(`text-${column.align}`)
  }
  return classes
}

const getCellClass = (column: Column) => {
  const classes = []
  if (column.align) {
    classes.push(`text-${column.align}`)
  }
  return classes
}

const formatValue = (value: any, column: Column) => {
  if (column.format) {
    return column.format(value)
  }
  return value
}

const handleCustomAction = (payload: { action: string, row: any }) => {
  emit('custom-action', payload)
}

// Handle search with debounce
let searchTimeout: NodeJS.Timeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (props.searchInBackend) {
      emit('search', searchQuery.value)
    }
  }, 500)
}

// Watch for search query changes
watch(searchQuery, () => {
  if (props.searchInBackend) {
    handleSearch()
  } else {
    // Client-side: reset to first page
    currentPage.value = 1
  }
})

// Watch for perPage changes
watch(currentPerPage, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal !== oldVal) {
    if (props.searchInBackend) {
      // Already emitted in the watch above
      currentPage.value = 1
    } else {
      // Client-side: reset to first page
      currentPage.value = 1
    }
  }
})

// Don't reset page on data changes in backend mode
watch(() => props.data, () => {
  if (!props.searchInBackend) {
    currentPage.value = 1
  }
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.user-select-none {
  user-select: none;
}
</style>
