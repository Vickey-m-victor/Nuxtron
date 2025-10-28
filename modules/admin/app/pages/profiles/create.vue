<script setup lang="ts">
import type { ProfileCreatePayload } from '../../types/profile-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const loading = ref(false)
const formData = ref<ProfileCreatePayload>({
  first_name: '',
  middle_name: '',
  last_name: '',
  email_address: '',
  phone_number: '',
  profile_picture: '',
  status: undefined
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch(`/v1/admin/profiles`, {
      method: 'POST',
      body: formData.value
    })
    
    router.push(`/admin/profiles`)
  } catch (error) {
    console.error('Create failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Create Profile'" />

    <BaseBlock>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">First Name</label>
          <input
            v-model="formData.first_name"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Middle Name</label>
          <input
            v-model="formData.middle_name"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Last Name</label>
          <input
            v-model="formData.last_name"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email Address</label>
          <input
            v-model="formData.email_address"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Phone Number</label>
          <input
            v-model="formData.phone_number"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Profile Picture</label>
          <input
            v-model="formData.profile_picture"
            type="text"
            class="form-control"
            
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Status</label>
          <input
            v-model="formData.status"
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
            :to="`/admin/profiles`"
            class="btn btn-secondary ms-2"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
