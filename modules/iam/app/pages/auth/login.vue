<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false
})

const { login } = useAuth()
const router = useRouter()

const state = reactive({
  username: '',
  password: '',
  rememberMe: false
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
    const result = await login({
      username: state.username,
      password: state.password
    })

    if (result.success) {
      await router.push('/dashboard')
    }
  } catch (err: any) {
    // useFetch error structure: err.data contains the server response
    if (err.data?.errorPayload?.errors) {
      fieldErrors.value = err.data.errorPayload.errors
    } else if (err.data?.data?.errorPayload?.errors) {
      // Alternative nesting
      fieldErrors.value = err.data.data.errorPayload.errors
    } else {
      // Fallback for general errors
      error.value = err.data?.message || err.message || 'Login failed. Please try again.'
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
          <!-- Sign In Block -->
          <BaseBlock title="Sign In" class="mb-0">
            <template #options>
              <NuxtLink
                to="/iam/auth/reminder"
                class="btn-block-option fs-sm"
              >
                Forgot Password?
              </NuxtLink>
              <NuxtLink
                to="/iam/auth/signin"
                class="btn-block-option"
              >
                <i class="fa fa-user-plus"></i>
              </NuxtLink>
            </template>

            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <h1 class="h2 mb-1">OmniNuxt</h1>
              <p class="fw-medium text-muted">Welcome, please login.</p>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                <div class="flex-shrink-0">
                  <i class="fa fa-fw fa-times-circle"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">{{ error }}</p>
                </div>
              </div>

              <!-- Sign In Form -->
              <form @submit.prevent="handleSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-alt form-control-lg"
                      :class="{ 'is-invalid': fieldErrors.username }"
                      id="login-username"
                      name="login-username"
                      placeholder="Username"
                      v-model="state.username"
                      :disabled="loading"
                    />
                    <div v-if="fieldErrors.username" class="invalid-feedback d-block">
                      {{ fieldErrors.username }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-alt form-control-lg"
                      :class="{ 'is-invalid': fieldErrors.password }"
                      id="login-password"
                      name="login-password"
                      placeholder="Password"
                      v-model="state.password"
                      :disabled="loading"
                    />
                    <div v-if="fieldErrors.password" class="invalid-feedback d-block">
                      {{ fieldErrors.password }}
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="state.rememberMe"
                        id="login-remember"
                        name="login-remember"
                        :disabled="loading"
                      />
                      <label class="form-check-label" for="login-remember">
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-md-6 col-xl-5">
                    <button type="submit" class="btn w-100 btn-alt-primary" :disabled="loading">
                      <i class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
                      {{ loading ? 'Signing In...' : 'Sign In' }}
                    </button>
                  </div>
                </div>
              </form>
              <!-- END Sign In Form -->
            </div>
          </BaseBlock>
          <!-- END Sign In Block -->
        </div>
      </div>
      <div class="fs-sm text-muted text-center">
        <strong>OmniNuxt 1.0</strong> &copy; {{ new Date().getFullYear() }}
      </div>
    </div>
  </div>
</template>
