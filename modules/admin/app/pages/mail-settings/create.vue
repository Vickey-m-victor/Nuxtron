<script setup lang="ts">
import type { MailSettingsCreatePayload } from '../../types/mail-settings-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const loading = ref(false)
const formData = ref<MailSettingsCreatePayload>({
  smtp_server: '',
  smtp_port: 0,
  smtp_username: '',
  smtp_password: '',
  email_encryption: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await $api(`/api/v1/admin/mail-settings`, {
      method: 'POST',
      body: formData.value
    })
    
    router.push(`/admin/mail-settings`)
  } catch (error) {
    console.error('Create failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Create MailSettings'" />

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
            {{ loading ? 'Creating...' : 'Create' }}
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
