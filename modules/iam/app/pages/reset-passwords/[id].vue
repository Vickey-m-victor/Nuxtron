<script setup lang="ts">
import type { ResetPassword } from '../../types/entities/reset-password.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: ResetPassword }
}>(`/api/v1/iam/reset-password/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onEdit = () => {
  router.push(`/iam/reset-passwords/${id}/edit`)
}

const onBack = () => {
  router.push(`/iam/reset-passwords`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View ResetPassword'">
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

    <BaseBlock title="ResetPassword Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading resetpassword details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load resetpassword' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Password</p>
            <p v-if="typeof item.password === 'object' && item.password?.label && item.password?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.password.theme + '-light text-' + item.password.theme">{{ item.password.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.password || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">ConfirmPassword</p>
            <p v-if="typeof item.confirmPassword === 'object' && item.confirmPassword?.label && item.confirmPassword?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.confirmPassword.theme + '-light text-' + item.confirmPassword.theme">{{ item.confirmPassword.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.confirmPassword || '-' }}</p>
          </div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
