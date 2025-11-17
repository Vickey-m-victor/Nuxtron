<script setup lang="ts">
import type { Permissions, PermissionsUpdatePayload } from '../../../types/permissions-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { showToast, showAlert, handleAlertify } = useAlertify()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: Permissions }
}>(`/api/v1/iam/rbac/permission/${id}`, {
  $fetch: $api
})

const formData = ref<PermissionsUpdatePayload>({
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
    const response = await $api(`/api/v1/iam/rbac/permission/${id}`, {
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
    
    router.push(`/iam/rbac/permissions`)
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
    <BasePageHeading :title="'Edit Permissions'">
      <template #extra>
        <button 
          type="button" 
          class="btn btn-alt-secondary"
          @click="() => router.push(`/iam/rbac/permissions`)"
        >
          <i class="fa fa-arrow-left opacity-50 me-1"></i>
          Back to List
        </button>
      </template>
    </BasePageHeading>

    <BaseBlock title="Update Permissions" subtitle="Modify the details below" content-full>
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
              Update the form fields to modify this permissions.
            </p>
          </div>
          <div class="col-lg-8 col-xl-7">
            <div class="mb-4">
              <label class="form-label" for="name-input">
                Name
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['name'] }"
                id="name-input"
                v-model="formData.name"
                placeholder="Enter name"
                :disabled="loading"
              />
              <div v-if="fieldErrors['name']" class="invalid-feedback">
                {{ fieldErrors['name'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="description-input">
                Description
              </label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['description'] }"
                id="description-input"
                v-model="formData.description"
                rows="4"
                placeholder="Enter description"
                :disabled="loading"
              ></textarea>
              <div v-if="fieldErrors['description']" class="invalid-feedback">
                {{ fieldErrors['description'] }}
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="ruleName-input">
                RuleName
              </label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': fieldErrors['ruleName'] }"
                id="ruleName-input"
                v-model="formData.ruleName"
                placeholder="Enter rulename"
                :disabled="loading"
              />
              <div v-if="fieldErrors['ruleName']" class="invalid-feedback">
                {{ fieldErrors['ruleName'] }}
              </div>
            </div>

            <div class="mb-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i class="fa fa-check opacity-50 me-1"></i>
                {{ loading ? 'Updating...' : 'Update Permissions' }}
              </button>
              <button 
                type="button" 
                class="btn btn-alt-secondary ms-2"
                :disabled="loading"
                @click="() => router.push(`/iam/rbac/permissions`)"
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
