<script setup lang="ts">
import type { MailSettings } from '../../types/entities/mail-settings.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: MailSettings }
}>(`/api/v1/admin/mail-settings/${id}`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)
</script>

<template>
  <div>
    <BasePageHeading :title="'View MailSettings'">
      <template #extra>
        <NuxtLink 
          :to="`/admin/mail-settings/${id}/edit`"
          class="btn btn-warning me-2"
        >
          <i class="fa fa-pencil me-1"></i>
          Edit
        </NuxtLink>
        <NuxtLink 
          :to="`/admin/mail-settings`"
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
          <label class="form-label fw-bold">Smtp Server</label>
          <div>{{ item.smtp_server }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Smtp Port</label>
          <div>{{ item.smtp_port }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Smtp Username</label>
          <div>{{ item.smtp_username }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Smtp Password</label>
          <div>{{ item.smtp_password }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Email Encryption</label>
          <div>{{ item.email_encryption }}</div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
