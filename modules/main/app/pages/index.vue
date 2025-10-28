<script setup>

useHead({
  title: 'OmniNuxt Demo - Home',
  meta: [
    { name: 'description', content: 'Welcome to our modular Nuxt 4 demo application' }
  ]
})

const mainData = useMainData()
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Welcome to OmniNuxt Demo</h1>
        <p class="page-subtitle">Main Module - Homepage</p>
        
        <div class="card">
          <h2 class="card-title">About This Demo</h2>
          
          <div class="text-content">
            <p>
              This is a demonstration of Nuxt 4's modular architecture. We have implemented two modules:
              <strong>Main</strong> and <strong>CMS</strong> to showcase how teams can work independently
              while sharing a common application structure.
            </p>
            
            <p>
              The Main module handles the core application pages like the homepage, about page, and dashboard.
              Each module has its own isolated app/ directory with pages, components, and composables that
              are automatically imported and configured.
            </p>
            
            <p>
              This modular approach allows different teams to work on different parts of the application
              without interfering with each other's code, while still benefiting from shared infrastructure
              and components.
            </p>
          </div>
          
          <div class="button-group">
            <NuxtLink to="/about" class="btn btn-primary">
              About Page
            </NuxtLink>
            <NuxtLink to="/dashboard" class="btn btn-success">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/cms" class="btn btn-purple">
              CMS Module
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
