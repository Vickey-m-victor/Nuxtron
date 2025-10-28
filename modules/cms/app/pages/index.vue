<script setup>

useHead({
  title: 'CMS Dashboard - OmniNuxt Demo',
  meta: [
    { name: 'description', content: 'Content Management System dashboard' }
  ]
})

const cmsData = useCmsData()
</script>

<template>
  <div class="page-wrapper bg-purple">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">CMS Dashboard</h1>
        <p class="page-subtitle">Content Management System Module</p>
        
        <div class="card card-wide">
          <h2 class="card-title">Content Management Overview</h2>
          
          <div class="text-content">
            <p>
              Welcome to the CMS module! This is a completely separate module from the main application,
              demonstrating how teams can work independently on different features.
            </p>
            
            <p>
              The CMS team can develop content management features, user interfaces, and business logic
              without affecting the main application team's work. All routes, components, and composables
              are automatically prefixed and isolated.
            </p>
            
            <p>
              This module includes pages for managing posts, pages, media, and other content-related features
              that a typical CMS would provide.
            </p>
          </div>
          
          <div class="feature-grid">
            <div class="feature-item">
              <h3 class="feature-title">📝 Content</h3>
              <ul class="feature-list">
                <li>• Posts Management</li>
                <li>• Pages Management</li>
                <li>• Media Library</li>
                <li>• Content Categories</li>
              </ul>
            </div>
            
            <div class="feature-item">
              <h3 class="feature-title">⚙️ Module Features</h3>
              <ul class="feature-list">
                <li>• Auto-routed Pages</li>
                <li>• Prefixed Components</li>
                <li>• Isolated Composables</li>
                <li>• Independent Development</li>
              </ul>
            </div>
          </div>
          
          <div class="button-group">
            <NuxtLink to="/cms/posts" class="btn btn-purple">
              Manage Posts
            </NuxtLink>
            <NuxtLink to="/cms/pages" class="btn btn-info">
              Manage Pages
            </NuxtLink>
            <NuxtLink to="/cms/media" class="btn btn-warning">
              Media Library
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-secondary">
              Back to Main
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
