<script setup lang="ts">
import type { Profile } from '../../types/entities/profile.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: Profile }
}>(`/api/v1/admin/profile/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)

const onEdit = () => {
  router.push(`/admin/profiles/${id}/edit`)
}

const onBack = () => {
  router.push(`/admin/profiles`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View Profile'">
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

    <BaseBlock title="Profile Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading profile details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load profile' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">First Name</p>
            <p v-if="typeof item.first_name === 'object' && item.first_name?.label && item.first_name?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.first_name.theme + '-light text-' + item.first_name.theme">{{ item.first_name.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.first_name || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Middle Name</p>
            <p v-if="typeof item.middle_name === 'object' && item.middle_name?.label && item.middle_name?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.middle_name.theme + '-light text-' + item.middle_name.theme">{{ item.middle_name.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.middle_name || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Last Name</p>
            <p v-if="typeof item.last_name === 'object' && item.last_name?.label && item.last_name?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.last_name.theme + '-light text-' + item.last_name.theme">{{ item.last_name.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.last_name || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Email Address</p>
            <p v-if="typeof item.email_address === 'object' && item.email_address?.label && item.email_address?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.email_address.theme + '-light text-' + item.email_address.theme">{{ item.email_address.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.email_address || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Phone Number</p>
            <p v-if="typeof item.phone_number === 'object' && item.phone_number?.label && item.phone_number?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.phone_number.theme + '-light text-' + item.phone_number.theme">{{ item.phone_number.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.phone_number || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Profile Picture</p>
            <p v-if="typeof item.profile_picture === 'object' && item.profile_picture?.label && item.profile_picture?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.profile_picture.theme + '-light text-' + item.profile_picture.theme">{{ item.profile_picture.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.profile_picture || '-' }}</p>
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
      </div>
    </BaseBlock>
  </div>
</template>
