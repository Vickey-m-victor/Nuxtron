<script setup lang="ts">
import type { MailSettings, MailSettingsUpdatePayload } from '../../types/mail-settings-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: MailSettings }
}>(`/api/v1/admin/mail-settings/${id}`, {
  $fetch: $api
})

const formData = ref<MailSettingsUpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await $api(`/api/v1/admin/mail-settings/${id}`, {
      method: 'PUT',
      body: formData.value
    })
    
    router.push(`/admin/mail-settings`)
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Edit MailSettings'" />

    <BaseBlock>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Smtp Server</label>
          <input
            v-model="formData.smtp_server"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Smtp Port</label>
          <input
            v-model="formData.smtp_port"
            type="number"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Smtp Username</label>
          <input
            v-model="formData.smtp_username"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Smtp Password</label>
          <input
            v-model="formData.smtp_password"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email Encryption</label>
          <input
            v-model="formData.email_encryption"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
          <NuxtLink 
            :to="`/admin/mail-settings`"
            class="btn btn-secondary ms-2"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
