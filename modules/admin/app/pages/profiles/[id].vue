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
</script>

<template>
  <div>
    <BasePageHeading :title="'View Profile'">
      <template #extra>
        <NuxtLink 
          :to="`/admin/profiles/${id}/edit`"
          class="btn btn-warning me-2"
        >
          <i class="fa fa-pencil me-1"></i>
          Edit
        </NuxtLink>
        <NuxtLink 
          :to="`/admin/profiles`"
          class="btn btn-secondary"
        >
          <i class="fa fa-arrow-left me-1"></i>
          Back
        </NuxtLink>
      </template>
    </BasePageHeading>

    <BaseBlock>
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="item">
        <div class="mb-3">
          <label class="form-label fw-bold">First Name</label>
          <div>{{ item.first_name }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Middle Name</label>
          <div>{{ item.middle_name }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Last Name</label>
          <div>{{ item.last_name }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Email Address</label>
          <div>{{ item.email_address }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Phone Number</label>
          <div>{{ item.phone_number }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Profile Picture</label>
          <div>{{ item.profile_picture }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Status</label>
          <div>{{ item.status }}</div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
