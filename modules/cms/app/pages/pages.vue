<template>
  <div class="page-wrapper bg-indigo">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Pages Management</h1>
        <p class="page-subtitle">CMS Module - Static Pages</p>
        
        <div class="card card-wide">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 class="card-title" style="margin-bottom: 0;">Static Pages</h2>
            <button class="btn btn-info">
              + New Page
            </button>
          </div>
          
          <div class="pages-list">
            <div v-for="page in samplePages" :key="page.id" class="page-item">
              <div class="page-info">
                <h3 class="page-item-title">{{ page.title }}</h3>
                <p class="page-description">{{ page.description }}</p>
                <div class="page-meta">
                  <span>URL: {{ page.slug }}</span>
                  <span>Status: <strong style="color: #27ae60;">{{ page.status }}</strong></span>
                  <span>Modified: {{ page.lastModified }}</span>
                </div>
              </div>
              
              <div class="page-actions">
                <button class="btn btn-primary btn-small">
                  Edit
                </button>
                <button class="btn btn-success btn-small">
                  View
                </button>
                <button class="btn btn-danger btn-small">
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="feature-item" style="margin-top: 30px;">
            <h3 class="feature-title">Page Management Features:</h3>
            <div class="feature-grid">
              <div>
                <ul class="feature-list">
                  <li>• Create and edit static pages</li>
                  <li>• SEO meta tag management</li>
                  <li>• URL slug customization</li>
                  <li>• Page template selection</li>
                </ul>
              </div>
              <div>
                <ul class="feature-list">
                  <li>• Draft and publish workflow</li>
                  <li>• Page hierarchy management</li>
                  <li>• Content versioning</li>
                  <li>• Responsive preview modes</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="button-group">
            <NuxtLink to="/cms" class="btn btn-info">
              CMS Dashboard
            </NuxtLink>
            <NuxtLink to="/cms/posts" class="btn btn-purple">
              Manage Posts
            </NuxtLink>
            <NuxtLink to="/cms/media" class="btn btn-warning">
              Media Library
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Pages Management - CMS',
  meta: [
    { name: 'description', content: 'Manage static pages and content' }
  ]
})

const samplePages = ref([
  {
    id: 1,
    title: "About Us",
    description: "Company information and team details",
    slug: "/about-us",
    status: "Published",
    lastModified: "2025-01-15"
  },
  {
    id: 2,
    title: "Contact Information",
    description: "Contact details and office locations",
    slug: "/contact",
    status: "Published",
    lastModified: "2025-01-12"
  },
  {
    id: 3,
    title: "Privacy Policy",
    description: "Privacy policy and data handling information",
    slug: "/privacy-policy",
    status: "Published",
    lastModified: "2025-01-08"
  },
  {
    id: 4,
    title: "Terms of Service",
    description: "Terms and conditions for using our services",
    slug: "/terms-of-service",
    status: "Draft",
    lastModified: "2025-01-05"
  }
])
</script>
