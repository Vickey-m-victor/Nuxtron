<script setup lang="ts">
const { showToast, showAlert } = useAlertify()

const testToast = (theme: string) => {
  const messages = {
    success: 'Operation completed successfully!',
    error: 'An error occurred!',
    warning: 'Please be careful!',
    info: 'Here is some information.'
  }
  showToast(messages[theme as keyof typeof messages], theme)
}

const testAlert = (theme: string) => {
  const messages = {
    success: 'Your changes have been saved successfully!',
    error: 'Failed to complete the operation. Please try again.',
    warning: 'This action cannot be undone. Are you sure?',
    info: 'You have 3 new notifications waiting.'
  }
  showAlert(messages[theme as keyof typeof messages], theme)
}
</script>

<template>
  <div>
    <BasePageHeading title="Alertify Test Page" subtitle="Test toasts and alerts">
      <template #extra>
        <NuxtLink to="/dashboard" class="btn btn-alt-secondary">
          <i class="fa fa-arrow-left opacity-50 me-1"></i> Back to Dashboard
        </NuxtLink>
      </template>
    </BasePageHeading>

    <div class="content">
      <div class="row">
        <!-- Toast Notifications -->
        <div class="col-lg-6">
          <BaseBlock title="Toast Notifications" subtitle="Quick, non-intrusive messages">
            <div class="mb-4">
              <h5 class="mb-3">Test Toasts</h5>
              <p class="text-muted fs-sm mb-3">
                Toasts appear in the top-right corner and auto-dismiss after 5 seconds.
              </p>
              <div class="row g-2">
                <div class="col-6">
                  <button 
                    @click="testToast('success')" 
                    class="btn btn-success w-100"
                  >
                    <i class="fa fa-check me-1"></i> Success Toast
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testToast('error')" 
                    class="btn btn-danger w-100"
                  >
                    <i class="fa fa-times me-1"></i> Error Toast
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testToast('warning')" 
                    class="btn btn-warning w-100"
                  >
                    <i class="fa fa-exclamation me-1"></i> Warning Toast
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testToast('info')" 
                    class="btn btn-info w-100"
                  >
                    <i class="fa fa-info me-1"></i> Info Toast
                  </button>
                </div>
              </div>
            </div>

            <div class="border-top pt-4">
              <h6 class="mb-2">Features</h6>
              <ul class="fs-sm text-muted">
                <li>Auto-dismiss after 5 seconds</li>
                <li>Multiple toasts can stack</li>
                <li>Pausable on hover</li>
                <li>Draggable to dismiss</li>
                <li>OneUI color scheme</li>
              </ul>
            </div>
          </BaseBlock>
        </div>

        <!-- SweetAlert2 Modals -->
        <div class="col-lg-6">
          <BaseBlock title="Alert Modals (SweetAlert2)" subtitle="Important messages that require attention">
            <div class="mb-4">
              <h5 class="mb-3">Test Alerts</h5>
              <p class="text-muted fs-sm mb-3">
                Beautiful modal dialogs that block interaction until dismissed.
              </p>
              <div class="row g-2">
                <div class="col-6">
                  <button 
                    @click="testAlert('success')" 
                    class="btn btn-outline-success w-100"
                  >
                    <i class="fa fa-check me-1"></i> Success Alert
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testAlert('error')" 
                    class="btn btn-outline-danger w-100"
                  >
                    <i class="fa fa-times me-1"></i> Error Alert
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testAlert('warning')" 
                    class="btn btn-outline-warning w-100"
                  >
                    <i class="fa fa-exclamation me-1"></i> Warning Alert
                  </button>
                </div>
                <div class="col-6">
                  <button 
                    @click="testAlert('info')" 
                    class="btn btn-outline-info w-100"
                  >
                    <i class="fa fa-info me-1"></i> Info Alert
                  </button>
                </div>
              </div>
            </div>

            <div class="border-top pt-4">
              <h6 class="mb-2">Features</h6>
              <ul class="fs-sm text-muted">
                <li>Blocks user interaction</li>
                <li>Requires acknowledgment</li>
                <li>Beautiful SweetAlert2 design</li>
                <li>Custom OneUI styling</li>
                <li>Responsive on all devices</li>
              </ul>
            </div>
          </BaseBlock>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="row">
        <div class="col-12">
          <BaseBlock title="How It Works" subtitle="Automatic notification handling from backend">
            <div class="row">
              <div class="col-lg-6">
                <h6 class="mb-3">Backend Response Example:</h6>
                <pre class="bg-body-light p-3 rounded"><code>{
  "dataPayload": {
    "data": { /* your data */ }
  },
  "alertifyPayload": {
    "message": "Access granted",
    "theme": "success",
    "type": "toast"
  }
}</code></pre>
              </div>
              <div class="col-lg-6">
                <h6 class="mb-3">Automatic Display:</h6>
                <p class="text-muted fs-sm">
                  The API interceptor automatically detects <code>alertifyPayload</code> in responses and displays the appropriate notification.
                </p>
                <ul class="fs-sm text-muted">
                  <li><strong>type: "toast"</strong> → Shows toast notification</li>
                  <li><strong>type: "alert"</strong> → Shows SweetAlert2 modal</li>
                  <li><strong>theme:</strong> success | error | warning | info</li>
                </ul>
                <div class="alert alert-info d-flex align-items-center" role="alert">
                  <div class="flex-shrink-0">
                    <i class="fa fa-fw fa-info-circle"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <p class="mb-0">
                      No manual alert calls needed! The backend controls what messages appear.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BaseBlock>
        </div>
      </div>
    </div>
  </div>
</template>
