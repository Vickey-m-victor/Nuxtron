<template>
  <div class="cms-layout">
    <AppHeader />
    
    <div class="cms-container">
      <aside class="cms-sidebar">
        <div class="sidebar-content">
          <h6 class="sidebar-heading">CMS Management</h6>
          <nav class="nav flex-column">
            <NuxtLink to="/cms" class="nav-link" active-class="active">
              <i class="fas fa-tachometer-alt me-2"></i>
              CMS Dashboard
            </NuxtLink>
            <NuxtLink to="/cms/posts" class="nav-link" active-class="active">
              <i class="fas fa-file-alt me-2"></i>
              Posts
            </NuxtLink>
            <NuxtLink to="/cms/pages" class="nav-link" active-class="active">
              <i class="fas fa-file me-2"></i>
              Pages
            </NuxtLink>
            <NuxtLink to="/cms/media" class="nav-link" active-class="active">
              <i class="fas fa-images me-2"></i>
              Media Library
            </NuxtLink>
            <NuxtLink to="/cms/test" class="nav-link" active-class="active">
              <i class="fas fa-flask me-2"></i>
              Test Page
            </NuxtLink>
          </nav>
          
          <hr class="my-3">
          
          <h6 class="sidebar-heading">Quick Actions</h6>
          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-sm">
              <i class="fas fa-plus me-1"></i>
              New Post
            </button>
            <button class="btn btn-outline-secondary btn-sm">
              <i class="fas fa-upload me-1"></i>
              Upload Media
            </button>
          </div>
        </div>
      </aside>
      
      <main class="cms-main">
        <div class="container-fluid">
          <AppBreadcrumb />
          <slot />
        </div>
      </main>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
// Components will be auto-imported from components/ directory
</script>

<style scoped>
.cms-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cms-container {
  flex: 1;
  display: flex;
}

.cms-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.sidebar-content {
  padding: 1.5rem;
}

.sidebar-heading {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.cms-main {
  flex: 1;
  padding: 2rem 0;
  overflow-x: auto;
  background-color: #f8f9fa;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateX(4px);
}

.btn {
  border-radius: 0.5rem;
}

.btn-primary {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-outline-secondary {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-outline-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

@media (max-width: 768px) {
  .cms-container {
    flex-direction: column;
  }
  
  .cms-sidebar {
    width: 100%;
    order: 2;
  }
  
  .cms-main {
    order: 1;
  }
}
</style>