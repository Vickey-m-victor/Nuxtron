<script setup lang="ts">
import type { Users } from '../../types/entities/users'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: {
    data: Users
  }
}>(`/api/v1/iam/user/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onBack = () => {
  router.push('/iam/users')
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View User'">
      <template #extra>
        <button 
          class="btn btn-alt-secondary"
          @click="onBack"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="User Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading user details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load user' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">User ID</p>
            <p v-if="typeof item.user_id === 'object' && item.user_id?.label && item.user_id?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.user_id.theme + '-light text-' + item.user_id.theme">{{ item.user_id.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.user_id || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Username</p>
            <p v-if="typeof item.username === 'object' && item.username?.label && item.username?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.username.theme + '-light text-' + item.username.theme">{{ item.username.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.username || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Email</p>
            <p v-if="typeof item.email === 'object' && item.email?.label && item.email?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.email.theme + '-light text-' + item.email.theme">{{ item.email.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.email || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Status</p>
            <p v-if="typeof item.status === 'object' && item.status?.label && item.status?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.status.theme + '-light text-' + item.status.theme">{{ item.status.label }}</span>
            </p>
            <p v-else class="mb-0">
              <span 
                :class="item.status === 'active' 
                  ? 'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success' 
                  : 'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-danger-light text-danger'"
              >
                {{ item.status || '-' }}
              </span>
            </p>
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
