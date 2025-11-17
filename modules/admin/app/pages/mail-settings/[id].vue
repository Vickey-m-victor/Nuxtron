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

const onEdit = () => {
  router.push(`/admin/mail-settings/${id}/edit`)
}

const onBack = () => {
  router.push(`/admin/mail-settings`)
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'View MailSettings'">
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

    <BaseBlock title="MailSettings Details" content-full>
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading mailsettings details...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error.message || 'Failed to load mailsettings' }}</p>
        </div>
      </div>
      
      <div v-else-if="item" class="row g-4 push">
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Smtp Server</p>
            <p v-if="typeof item.smtp_server === 'object' && item.smtp_server?.label && item.smtp_server?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.smtp_server.theme + '-light text-' + item.smtp_server.theme">{{ item.smtp_server.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.smtp_server || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Smtp Port</p>
            <p v-if="typeof item.smtp_port === 'object' && item.smtp_port?.label && item.smtp_port?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.smtp_port.theme + '-light text-' + item.smtp_port.theme">{{ item.smtp_port.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.smtp_port || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Smtp Username</p>
            <p v-if="typeof item.smtp_username === 'object' && item.smtp_username?.label && item.smtp_username?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.smtp_username.theme + '-light text-' + item.smtp_username.theme">{{ item.smtp_username.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.smtp_username || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Smtp Password</p>
            <p v-if="typeof item.smtp_password === 'object' && item.smtp_password?.label && item.smtp_password?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.smtp_password.theme + '-light text-' + item.smtp_password.theme">{{ item.smtp_password.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.smtp_password || '-' }}</p>
          </div>
        </div>
        <div class="col-md-6 col-xl-4">
          <div class="border-start border-primary border-3 ps-3">
            <p class="text-muted fs-xs fw-semibold text-uppercase mb-1">Email Encryption</p>
            <p v-if="typeof item.email_encryption === 'object' && item.email_encryption?.label && item.email_encryption?.theme" class="mb-0">
              <span :class="'fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-' + item.email_encryption.theme + '-light text-' + item.email_encryption.theme">{{ item.email_encryption.label }}</span>
            </p>
            <p v-else class="fs-sm fw-medium mb-0">{{ item.email_encryption || '-' }}</p>
          </div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>
