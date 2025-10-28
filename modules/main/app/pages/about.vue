<template>
  <div class="page-wrapper bg-blue">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">About Our Application</h1>
        <p class="page-subtitle">Main Module - About Page</p>
        
        <div class="card">
          <h2 class="card-title">Modular Architecture Benefits</h2>
          
          <div class="feature-grid">
            <div class="feature-item">
              <h3 class="feature-title">🏗️ Team Independence</h3>
              <p>
                Each team can work on their own module (Main, CMS) without conflicts. 
                Teams have complete control over their module's pages, components, and business logic.
              </p>
            </div>
            
            <div class="feature-item">
              <h3 class="feature-title">🔄 Auto-Routing</h3>
              <p>
                Pages are automatically registered with Nuxt's router. No manual route configuration needed.
                Just create a .vue file in the module's pages directory and it becomes accessible.
              </p>
            </div>
            
            <div class="feature-item">
              <h3 class="feature-title">🎯 Auto-Imports</h3>
              <p>
                Components and composables are automatically imported with module prefixes.
                This prevents naming conflicts and makes the codebase more maintainable.
              </p>
            </div>
            
            <div class="feature-item">
              <h3 class="feature-title">⚡ Performance</h3>
              <p>
                Module-specific file watching and hot reloading. Changes in one module don't 
                trigger unnecessary rebuilds in other modules.
              </p>
            </div>
          </div>
          
          <div class="button-group">
            <NuxtLink to="/" class="btn btn-primary">
              Back Home
            </NuxtLink>
            <NuxtLink to="/dashboard" class="btn btn-success">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/cms/posts" class="btn btn-purple">
              CMS Posts
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

useHead({
  title: 'About - OmniNuxt Demo',
  meta: [
    { name: 'description', content: 'Learn about our modular architecture approach' }
  ]
})
</script>
