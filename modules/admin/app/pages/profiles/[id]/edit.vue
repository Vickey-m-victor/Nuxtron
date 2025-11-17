<script setup lang="ts">
import type { Profile, ProfileUpdatePayload } from '../../types/profile-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, showAlert, handleAlertify } = useAlertify()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: Profile }
}>(`/api/v1/admin/profile/${id}`, {
  $fetch: $api
})

const formData = ref<ProfileUpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  loading.value = true
  
  try {
    const response = await $api(`/api/v1/admin/profile/${id}`, {
      method: 'PUT',
      body: formData.value
    })
    
    // Check for errorPayload in response (API returns 200 but with errors)
    if (response?.errorPayload?.errors) {
      fieldErrors.value = response.errorPayload.errors
      
      // Handle alertify for errors if present
      if (response.alertifyPayload) {
        handleAlertify(response.alertifyPayload)
      }
      
      loading.value = false
      return // Stop execution, don't navigate
    }
    
    // Handle backend alertifyPayload if present
    if (response?.alertifyPayload) {
      handleAlertify(response.alertifyPayload)
    } else {
      showToast('Updated successfully', 'success')
    }
    
    router.push(`/admin/profiles`)
  } catch (err: any) {
    // Extract field-specific errors from errorPayload
    if (err.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.errorPayload.errors
    } else if (err.data?.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.data.errorPayload.errors
    }
    
    // Handle backend alertifyPayload if present
    if (err?.data?.alertifyPayload) {
      handleAlertify(err.data.alertifyPayload)
    } else if (Object.keys(fieldErrors.value).length === 0) {
      // Only show general error if no field errors
      error.value = err?.data?.message || err?.message || 'Update failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="content">
    <BasePageHeading :title="'Edit Profile'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(`/admin/profiles`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="Update Profile" subtitle="Modify the details below" content-full>
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4" role="alert">
        <div class="flex-shrink-0">
          <i class="fa fa-fw fa-times-circle"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <p class="mb-0">{{ error }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="row push">
          <div class="col-lg-4">
            <p class="fs-sm text-muted">
              Update the form fields to modify this profile.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
            <div class="mb-4">
              <label class="form-label" for="first_name-input">
                First Name
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['first_name'] }"
                id="first_name-input"
                v-model="formData.first_name"
                placeholder="Enter first name"
                :disabled="loading"
              />
              <div v-if="fieldErrors['first_name']" class="invalid-feedback">
                {{ fieldErrors['first_name'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="middle_name-input">
                Middle Name
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['middle_name'] }"
                id="middle_name-input"
                v-model="formData.middle_name"
                placeholder="Enter middle name"
                :disabled="loading"
              />
              <div v-if="fieldErrors['middle_name']" class="invalid-feedback">
                {{ fieldErrors['middle_name'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="last_name-input">
                Last Name
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['last_name'] }"
                id="last_name-input"
                v-model="formData.last_name"
                placeholder="Enter last name"
                :disabled="loading"
              />
              <div v-if="fieldErrors['last_name']" class="invalid-feedback">
                {{ fieldErrors['last_name'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="email_address-input">
                Email Address
              </label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['email_address'] }"
                id="email_address-input"
                v-model="formData.email_address"
                placeholder="Enter email address"
                :disabled="loading"
              />
              <div v-if="fieldErrors['email_address']" class="invalid-feedback">
                {{ fieldErrors['email_address'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="phone_number-input">
                Phone Number
              </label>
              <input
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['phone_number'] }"
                id="phone_number-input"
                v-model="formData.phone_number"
                placeholder="Enter phone number"
                :disabled="loading"
              />
              <div v-if="fieldErrors['phone_number']" class="invalid-feedback">
                {{ fieldErrors['phone_number'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="profile_picture-input">
                Profile Picture
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['profile_picture'] }"
                id="profile_picture-input"
                v-model="formData.profile_picture"
                placeholder="Enter profile picture"
                :disabled="loading"
              />
              <div v-if="fieldErrors['profile_picture']" class="invalid-feedback">
                {{ fieldErrors['profile_picture'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="status-input">
                Status
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['status'] }"
                id="status-input"
                v-model="formData.status"
                placeholder="Enter status"
                :disabled="loading"
              />
              <div v-if="fieldErrors['status']" class="invalid-feedback">
                {{ fieldErrors['status'] }}
              </div>
            </div>

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(`/admin/profiles`)"
              >
                <i class="fa fa-times opacity-50 me-1"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
