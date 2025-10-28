<script setup>


useHead({
  title: 'Dashboard - OmniNuxt Demo',
  meta: [
    { name: 'description', content: 'Main dashboard for the OmniNuxt application' }
  ]
})

const dashboardStats = reactive({
  modules: 2,
  routes: 7,
  components: 0,
  lastUpdated: new Date().toLocaleString()
})
</script>

<template>
  <div class="dashboard-content">
    <div class="page-header mb-4">
      <h1 class="h2">Main Dashboard</h1>
      <p class="text-muted">Overview of your modular application</p>
    </div>
    
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Total Modules</h5>
            <h3 class="text-primary">{{ dashboardStats.modules }}</h3>
            <small class="text-muted">Main & CMS</small>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Total Routes</h5>
            <h3 class="text-success">{{ dashboardStats.routes }}</h3>
            <small class="text-muted">Auto-generated</small>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Teams</h5>
            <h3 class="text-info">2</h3>
            <small class="text-muted">Independent</small>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Dashboard Features</h5>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">
              <li class="mb-2">✅ Real-time module loading status</li>
              <li class="mb-2">✅ Auto-generated route information</li>
              <li class="mb-2">✅ Component auto-import statistics</li>
              <li class="mb-2">✅ Performance monitoring per module</li>
              <li class="mb-2">✅ Development mode hot-reload tracking</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <NuxtLink to="/" class="btn btn-outline-primary">
                Back Home
              </NuxtLink>
              <NuxtLink to="/about" class="btn btn-outline-secondary">
                About
              </NuxtLink>
              <NuxtLink to="/cms" class="btn btn-outline-success">
                CMS Dashboard
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
