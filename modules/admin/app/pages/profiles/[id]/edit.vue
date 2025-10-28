<script setup lang="ts">
import type { Profile, ProfileUpdatePayload } from '../../types/profile-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: Profile }
}>(`/v1/admin/profiles/${id}`)

const formData = ref<ProfileUpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch(`/v1/admin/profiles/${id}`, {
      method: 'PUT',
      body: formData.value
    })
    
    router.push(`/admin/profiles`)
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Edit Profile'" />

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
            {{ loading ? 'Updating...' : 'Update' }}
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
