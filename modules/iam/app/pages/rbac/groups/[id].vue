<script setup lang="ts">
import type { Groups } from '../../../types/entities/groups.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: Groups }
}>(`/api/v1/iam/rbac/group/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onEdit = () => {
  router.push(`/iam/rbac/groups/${id}/edit`)
}

const onBack = () => {
  router.push(`/iam/rbac/groups`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View Groups'">
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

    <BaseBlock title="Groups Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading groups details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load groups' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
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
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Description</p>
            <p v-if="typeof item.description === 'object' && item.description?.label && item.description?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.description.theme + '-light text-' + item.description.theme">{{ item.description.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.description || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">RuleName</p>
            <p v-if="typeof item.ruleName === 'object' && item.ruleName?.label && item.ruleName?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.ruleName.theme + '-light text-' + item.ruleName.theme">{{ item.ruleName.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.ruleName || '-' }}</p>
          </div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
