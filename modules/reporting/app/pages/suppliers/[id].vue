<script setup lang="ts">
import type { Suppliers } from '../../types/entities/suppliers.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: Suppliers }
}>(`/api/v1/reporting/supplier/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onEdit = () => {
  router.push(`/reporting/suppliers/${id}/edit`)
}

const onBack = () => {
  router.push(`/reporting/suppliers`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View Suppliers'">
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

    <BaseBlock title="Suppliers Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading suppliers details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load suppliers' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Id</p>
            <p v-if="typeof item.id === 'object' && item.id?.label && item.id?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.id.theme + '-light text-' + item.id.theme">{{ item.id.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.id || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Name</p>
            <p v-if="typeof item.name === 'object' && item.name?.label && item.name?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.name.theme + '-light text-' + item.name.theme">{{ item.name.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.name || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Is Deleted</p>
            <p v-if="typeof item.is_deleted === 'object' && item.is_deleted?.label && item.is_deleted?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.is_deleted.theme + '-light text-' + item.is_deleted.theme">{{ item.is_deleted.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.is_deleted || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Status</p>
            <p v-if="typeof item.status === 'object' && item.status?.label && item.status?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.status.theme + '-light text-' + item.status.theme">{{ item.status.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.status || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Created At</p>
            <p v-if="typeof item.created_at === 'object' && item.created_at?.label && item.created_at?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.created_at.theme + '-light text-' + item.created_at.theme">{{ item.created_at.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.created_at || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Updated At</p>
            <p v-if="typeof item.updated_at === 'object' && item.updated_at?.label && item.updated_at?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.updated_at.theme + '-light text-' + item.updated_at.theme">{{ item.updated_at.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.updated_at || '-' }}</p>
          </div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
