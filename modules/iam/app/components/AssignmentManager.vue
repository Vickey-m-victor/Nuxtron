<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface AssignmentConfig {
  title: string
  availableTitle: string
  assignedTitle: string
  keyField: string
  displayField: string
  getAllEndpoint: string
  getAssignedEndpoint: string
  assignEndpoint: string
  removeEndpoint: string
}

interface Props {
  entity: any
  config: AssignmentConfig
  initialData?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'refresh'])

const { $api } = useNuxtApp()
const { showToast, handleAlertify } = useAlertify()

// Reactive state
const allItems = ref<any>(props.initialData || {})
const selectedAvailableItems = ref<string[]>([])
const selectedAssignedItems = ref<string[]>([])
const availableItemsSearch = ref('')
const assignedItemsSearch = ref('')
const isLoading = ref(false)

// Computed properties
const availableItems = computed(() => {
  if (!allItems.value?.items?.available) return []
  
  return Object.entries(allItems.value.items.available).map(([key, value]) => ({
    [props.config.keyField]: key,
    [props.config.displayField]: key,
    type: value,
    description: key
  }))
})

const assignedItems = computed(() => {
  if (!allItems.value?.items?.assigned) return []
  
  return Object.entries(allItems.value.items.assigned).map(([key, value]) => ({
    [props.config.keyField]: key,
    [props.config.displayField]: key,
    type: value,
    description: key
  }))
})

const filteredAvailableItems = computed(() => {
  const searchTerm = availableItemsSearch.value.toLowerCase()
  return availableItems.value.filter(item =>
    item[props.config.displayField].toLowerCase().includes(searchTerm) ||
    (item.description && item.description.toLowerCase().includes(searchTerm))
  )
})

const filteredAssignedItems = computed(() => {
  const searchTerm = assignedItemsSearch.value.toLowerCase()
  return assignedItems.value.filter(item =>
    item[props.config.displayField].toLowerCase().includes(searchTerm) ||
    (item.description && item.description.toLowerCase().includes(searchTerm))
  )
})

const hasAvailableSelection = computed(() => selectedAvailableItems.value.length > 0)
const hasAssignedSelection = computed(() => selectedAssignedItems.value.length > 0)
const hasAvailableItems = computed(() => availableItems.value.length > 0)
const hasAssignedItems = computed(() => assignedItems.value.length > 0)

// Methods
const fetchData = async () => {
  // Skip fetching if initialData was provided
  if (props.initialData && Object.keys(allItems.value).length > 0) {
    return
  }
  
  isLoading.value = true
  try {
    const endpoint = typeof props.config.getAllEndpoint === 'function'
      ? props.config.getAllEndpoint(props.entity)
      : props.config.getAllEndpoint

    const response = await $api(endpoint)
    allItems.value = response?.dataPayload?.data || {}
  } catch (error) {
    console.error('Error fetching data:', error)
    showToast('Failed to load permissions', 'error')
  } finally {
    isLoading.value = false
  }
}

const isSelected = (item: any, type: 'available' | 'assigned') => {
  const selectedArray = type === 'available' ? selectedAvailableItems.value : selectedAssignedItems.value
  return selectedArray.includes(item[props.config.keyField])
}

const toggleSelection = (item: any, type: 'available' | 'assigned') => {
  const selectedArray = type === 'available' ? selectedAvailableItems : selectedAssignedItems
  const keyField = props.config.keyField
  const itemKey = item[keyField]

  const index = selectedArray.value.indexOf(itemKey)
  
  if (index === -1) {
    selectedArray.value.push(itemKey)
  } else {
    selectedArray.value.splice(index, 1)
  }
}

const selectAll = (type: 'available' | 'assigned') => {
  const items = type === 'available' ? filteredAvailableItems.value : filteredAssignedItems.value
  const selectedArray = type === 'available' ? selectedAvailableItems : selectedAssignedItems
  
  selectedArray.value = items.map(item => item[props.config.keyField])
}

const deselectAll = (type: 'available' | 'assigned') => {
  if (type === 'available') {
    selectedAvailableItems.value = []
  } else {
    selectedAssignedItems.value = []
  }
}

const assignItems = async () => {
  if (!hasAvailableSelection.value) return

  isLoading.value = true
  try {
    const endpoint = typeof props.config.assignEndpoint === 'function'
      ? props.config.assignEndpoint(props.entity)
      : props.config.assignEndpoint

    const response = await $api(endpoint, {
      method: 'POST',
      body: {
        permissions: selectedAvailableItems.value
      }
    })

    if (response?.alertifyPayload) {
      handleAlertify(response.alertifyPayload)
    } else {
      showToast('Permissions assigned successfully', 'success')
    }

    selectedAvailableItems.value = []
    await fetchData()
    emit('refresh')
  } catch (error: any) {
    console.error('Error assigning items:', error)
    showToast(error?.data?.message || 'Failed to assign permissions', 'error')
  } finally {
    isLoading.value = false
  }
}

const removeItems = async () => {
  if (!hasAssignedSelection.value) return

  isLoading.value = true
  try {
    const endpoint = typeof props.config.removeEndpoint === 'function'
      ? props.config.removeEndpoint(props.entity)
      : props.config.removeEndpoint

    const response = await $api(endpoint, {
      method: 'POST',
      body: {
        permissions: selectedAssignedItems.value
      }
    })

    if (response?.alertifyPayload) {
      handleAlertify(response.alertifyPayload)
    } else {
      showToast('Permissions removed successfully', 'success')
    }

    selectedAssignedItems.value = []
    await fetchData()
    emit('refresh')
  } catch (error: any) {
    console.error('Error removing items:', error)
    showToast(error?.data?.message || 'Failed to remove permissions', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="assignment-manager">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row g-0">
      <!-- Available Items -->
      <div class="col-md-5">
        <div class="p-3 border-end" style="min-height: 500px;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">{{ config.availableTitle }}</h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn btn-sm btn-outline-primary" 
                @click="selectAll('available')"
                :disabled="!hasAvailableItems"
              >
                Select All
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="deselectAll('available')"
                :disabled="!hasAvailableSelection"
              >
                Clear
              </button>
            </div>
          </div>

          <input
            v-model="availableItemsSearch"
            type="text"
            class="form-control form-control-sm mb-3"
            placeholder="Search available..."
          />

          <div class="list-group" style="max-height: 400px; overflow-y: auto;">
            <div
              v-for="item in filteredAvailableItems"
              :key="item[config.keyField]"
              class="list-group-item list-group-item-action d-flex align-items-center"
              :class="{ 'active': isSelected(item, 'available') }"
              @click="toggleSelection(item, 'available')"
              style="cursor: pointer;"
            >
              <input
                type="checkbox"
                class="form-check-input me-2"
                :checked="isSelected(item, 'available')"
                @click.stop="toggleSelection(item, 'available')"
              />
              <div class="flex-grow-1">
                <div class="fw-semibold" :class="{ 'text-white': isSelected(item, 'available') }">
                  {{ item[config.displayField] }}
                </div>
                <small 
                  v-if="item.type" 
                  :class="isSelected(item, 'available') ? 'text-white-50' : 'text-muted'"
                >
                  {{ item.type }}
                </small>
              </div>
            </div>

            <div v-if="!filteredAvailableItems.length" class="text-center text-muted py-4">
              No available items
            </div>
          </div>

          <div class="mt-3 text-muted small">
            {{ selectedAvailableItems.length }} selected
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="col-md-2 d-flex flex-column justify-content-center align-items-center p-3 bg-light">
        <button 
          class="btn btn-primary mb-2 w-100" 
          @click="assignItems"
          :disabled="!hasAvailableSelection || isLoading"
        >
          <i class="fa fa-arrow-right"></i>
          <span class="d-block small">Assign</span>
        </button>
        <button 
          class="btn btn-danger w-100" 
          @click="removeItems"
          :disabled="!hasAssignedSelection || isLoading"
        >
          <i class="fa fa-arrow-left"></i>
          <span class="d-block small">Remove</span>
        </button>
      </div>

      <!-- Assigned Items -->
      <div class="col-md-5">
        <div class="p-3" style="min-height: 500px;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">{{ config.assignedTitle }}</h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn btn-sm btn-outline-primary" 
                @click="selectAll('assigned')"
                :disabled="!hasAssignedItems"
              >
                Select All
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="deselectAll('assigned')"
                :disabled="!hasAssignedSelection"
              >
                Clear
              </button>
            </div>
          </div>

          <input
            v-model="assignedItemsSearch"
            type="text"
            class="form-control form-control-sm mb-3"
            placeholder="Search assigned..."
          />

          <div class="list-group" style="max-height: 400px; overflow-y: auto;">
            <div
              v-for="item in filteredAssignedItems"
              :key="item[config.keyField]"
              class="list-group-item list-group-item-action d-flex align-items-center"
              :class="{ 'active': isSelected(item, 'assigned') }"
              @click="toggleSelection(item, 'assigned')"
              style="cursor: pointer;"
            >
              <input
                type="checkbox"
                class="form-check-input me-2"
                :checked="isSelected(item, 'assigned')"
                @click.stop="toggleSelection(item, 'assigned')"
              />
              <div class="flex-grow-1">
                <div class="fw-semibold" :class="{ 'text-white': isSelected(item, 'assigned') }">
                  {{ item[config.displayField] }}
                </div>
                <small 
                  v-if="item.type" 
                  :class="isSelected(item, 'assigned') ? 'text-white-50' : 'text-muted'"
                >
                  {{ item.type }}
                </small>
              </div>
            </div>

            <div v-if="!filteredAssignedItems.length" class="text-center text-muted py-4">
              No assigned items
            </div>
          </div>

          <div class="mt-3 text-muted small">
            {{ selectedAssignedItems.length }} selected
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assignment-manager {
  width: 100%;
}

.list-group-item.active {
  z-index: 0;
}

.list-group {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}
</style>
