<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { changePassword } = useAuth()
const router = useRouter()

const state = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  // Validation
  if (!state.currentPassword) {
    error.value = 'Please enter your current password'
    return
  }

  if (!state.newPassword || state.newPassword.length < 5) {
    error.value = 'New password must be at least 5 characters'
    return
  }

  if (state.newPassword !== state.confirmPassword) {
    error.value = 'New passwords do not match'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  const result = await changePassword({
    currentPassword: state.currentPassword,
    newPassword: state.newPassword
  })

  if (result.success) {
    success.value = true
    // Will auto redirect to login
  } else {
    error.value = result.error || 'Failed to change password'
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
          <!-- Change Password Block -->
          <BaseBlock title="Change Password" class="mb-0">
            <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
              <h1 class="h2 mb-1">Change Password</h1>
              <p class="fw-medium text-muted">
                Update your password for enhanced security.
              </p>

              <!-- Success Alert -->
              <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                <div class="flex-shrink-0">
                  <i class="fa fa-fw fa-check-circle"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0">Password changed successfully! Please login with your new password.</p>
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

              <!-- Change Password Form -->
              <form @submit.prevent="handleSubmit">
                <div class="py-3">
                  <div class="mb-4">
                    <label class="form-label" for="current-password">Current Password</label>
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt"
                      id="current-password"
                      name="current-password"
                      v-model="state.currentPassword"
                      :disabled="loading || success"
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="new-password">New Password</label>
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt"
                      id="new-password"
                      name="new-password"
                      v-model="state.newPassword"
                      :disabled="loading || success"
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <label class="form-label" for="confirm-password">Confirm New Password</label>
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt"
                      id="confirm-password"
                      name="confirm-password"
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
                      {{ loading ? 'Changing...' : 'Change Password' }}
                    </button>
                  </div>
                </div>
              </form>
              <!-- END Change Password Form -->
            </div>
          </BaseBlock>
          <!-- END Change Password Block -->
        </div>
      </div>
    </div>
  </div>
</template>
