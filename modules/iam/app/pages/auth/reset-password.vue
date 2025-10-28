<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false
})

const router = useRouter()
const route = useRoute()

const state = reactive({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const token = computed(() => route.query.token as string)

const handleSubmit = async () => {
  // Validation
  if (!state.password || state.password.length < 5) {
    error.value = 'Password must be at least 5 characters'
    return
  }

  if (state.password !== state.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (!token.value) {
    error.value = 'Invalid or missing reset token'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  const { resetPassword } = useAuth()
  const result = await resetPassword(token.value, state.password)

  if (result.success) {
    success.value = true
    setTimeout(() => {
      router.push('/iam/auth/login')
    }, 2000)
  } else {
    error.value = result.error || 'Failed to reset password'
  }

  loading.value = false
}
</script>

<template>
  <!-- Page Content -->
  <div class="hero-static d-flex align-items-center">
    <div class="content">
      <div class="row justify-content-center push">
        <div class="col-md-8 col-lg-6 col-xl-4">
          <!-- Reset Password Block -->
          <BaseBlock title="Reset Password" class="mb-0">
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
                Enter your new password below.
              </p>

              <!-- Success Alert -->
              <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                <div class="flex-shrink-0">
                  <i class="fa fa-fw fa-check-circle"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">Password reset successful! Redirecting to login...</p>
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

              <!-- Reset Password Form -->
              <form @submit.prevent="handleSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt"
                      id="reset-password"
                      name="reset-password"
                      placeholder="New Password"
                      v-model="state.password"
                      :disabled="loading || success"
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt"
                      id="reset-confirm-password"
                      name="reset-confirm-password"
                      placeholder="Confirm New Password"
                      v-model="state.confirmPassword"
                      :disabled="loading || success"
                      required
                    />
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-md-6 col-xl-5">
                    <button type="submit" class="btn w-100 btn-alt-primary" :disabled="loading || success">
                      <i class="fa fa-fw fa-check me-1 opacity-50"></i>
                      {{ loading ? 'Resetting...' : 'Reset Password' }}
                    </button>
                  </div>
                </div>
              </form>
              <!-- END Reset Password Form -->
            </div>
          </BaseBlock>
          <!-- END Reset Password Block -->
        </div>
      </div>
      <div class="fs-sm text-muted text-center">
        <strong>OmniNuxt 1.0</strong> &copy; {{ new Date().getFullYear() }}
      </div>
    </div>
  </div>
</template>
