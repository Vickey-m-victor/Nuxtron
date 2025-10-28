<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false
})

const { requestPasswordReset } = useAuth()
const router = useRouter()

const state = reactive({
  email: ''
})

const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const success = ref(false)

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  fieldErrors.value = {}
  success.value = false
  loading.value = true

  try {
    const result = await requestPasswordReset(state.email)

    if (result.success) {
      success.value = true
      setTimeout(() => {
        router.push('/iam/auth/login')
      }, 3000)
    }
  } catch (err: any) {
    // Extract backend validation errors from errorPayload.errors
    if (err.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.errorPayload.errors
    } else {
      error.value = err.data?.message || err.message || 'Failed to send password reset email'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Page Content -->
  <div class="hero-static d-flex align-items-center">
    <div class="content">
      <div class="row justify-content-center push">
        <div class="col-md-8 col-lg-6 col-xl-4">
          <!-- Reminder Block -->
          <BaseBlock title="Password Reminder" class="mb-0">
            <template #options>
              <NuxtLink
                to="/iam/auth/login"
                class="btn-block-option"
              >
                <i class="fa fa-sign-in-alt"></i>
              </NuxtLink>
            </template>

            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <h1 class="h2 mb-1">OmniNuxt</h1>
              <p class="fw-medium text-muted">
                Please provide your account's email or username and we will send
                you a password reset link.
              </p>

              <!-- Success Alert -->
              <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                <div class="flex-shrink-0">
                  <i class="fa fa-fw fa-check-circle"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">Password reset link sent! Redirecting to login...</p>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                <div class="flex-shrink-0">
                  <i class="fa fa-fw fa-times-circle"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">{{ error }}</p>
                </div>
              </div>

              <!-- Reminder Form -->
              <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                  <input
                    type="text"
                    class="form-control form-control-lg form-control-alt"
                    id="reminder-credential"
                    name="reminder-credential"
                    placeholder="Username or Email"
                    v-model="state.email"
                    :disabled="loading || success"
                    required
                  />
                </div>
                <div class="row mb-4">
                  <div class="col-md-6 col-xl-5">
                    <button type="submit" class="btn w-100 btn-alt-primary" :disabled="loading || success">
                      <i class="fa fa-fw fa-envelope me-1 opacity-50"></i>
                      {{ loading ? 'Sending...' : 'Send Mail' }}
                    </button>
                  </div>
                </div>
              </form>
              <!-- END Reminder Form -->
            </div>
          </BaseBlock>
          <!-- END Reminder Block -->
        </div>
      </div>
      <div class="fs-sm text-muted text-center">
        <strong>OmniNuxt 1.0</strong> &copy; {{ new Date().getFullYear() }}
      </div>
    </div>
  </div>
</template>
