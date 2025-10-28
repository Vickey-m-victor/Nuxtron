<template>
  <div class="page-wrapper bg-pink">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Media Library</h1>
        <p class="page-subtitle">CMS Module - Media Management</p>
        
        <div class="card card-wide">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 class="card-title" style="margin-bottom: 0;">Media Files</h2>
            <button class="btn btn-warning">
              + Upload Media
            </button>
          </div>
          
          <div class="filter-buttons">
            <button class="filter-btn active">
              All Files
            </button>
            <button class="filter-btn">
              Images
            </button>
            <button class="filter-btn">
              Documents
            </button>
            <button class="filter-btn">
              Videos
            </button>
          </div>
          
          <div class="media-grid">
            <div v-for="media in sampleMedia" :key="media.id" class="media-item">
              <div class="media-icon">
                <span>{{ media.icon }}</span>
              </div>
              <p class="media-name">{{ media.name }}</p>
              <p class="media-size">{{ media.size }}</p>
            </div>
          </div>
          
          <div class="feature-item" style="margin-top: 30px;">
            <h3 class="feature-title">Media Library Features:</h3>
            <div class="feature-grid">
              <div>
                <h4 style="font-weight: 600; margin-bottom: 10px;">📁 Organization</h4>
                <ul class="feature-list">
                  <li>• Folder management</li>
                  <li>• File categorization</li>
                  <li>• Search and filtering</li>
                  <li>• Bulk operations</li>
                </ul>
              </div>
              
              <div>
                <h4 style="font-weight: 600; margin-bottom: 10px;">🖼️ Image Processing</h4>
                <ul class="feature-list">
                  <li>• Automatic resizing</li>
                  <li>• Format conversion</li>
                  <li>• Compression optimization</li>
                  <li>• Alt text management</li>
                </ul>
              </div>
              
              <div>
                <h4 style="font-weight: 600; margin-bottom: 10px;">🔗 Integration</h4>
                <ul class="feature-list">
                  <li>• CDN integration</li>
                  <li>• SEO optimization</li>
                  <li>• Responsive delivery</li>
                  <li>• Usage tracking</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="button-group">
            <NuxtLink to="/cms" class="btn btn-warning">
              CMS Dashboard
            </NuxtLink>
            <NuxtLink to="/cms/posts" class="btn btn-purple">
              Manage Posts
            </NuxtLink>
            <NuxtLink to="/cms/pages" class="btn btn-info">
              Manage Pages
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Media Library - CMS',
  meta: [
    { name: 'description', content: 'Manage media files and assets' }
  ]
})

const sampleMedia = ref([
  { id: 1, name: "hero-image.jpg", size: "2.3 MB", icon: "��️" },
  { id: 2, name: "logo.png", size: "145 KB", icon: "🎨" },
  { id: 3, name: "user-guide.pdf", size: "1.2 MB", icon: "📄" },
  { id: 4, name: "demo-video.mp4", size: "15.7 MB", icon: "🎬" },
  { id: 5, name: "banner.jpg", size: "890 KB", icon: "🖼️" },
  { id: 6, name: "icon-set.svg", size: "67 KB", icon: "⭐" },
  { id: 7, name: "presentation.pptx", size: "4.1 MB", icon: "📊" },
  { id: 8, name: "thumbnail.png", size: "234 KB", icon: "🖼️" },
  { id: 9, name: "audio-clip.mp3", size: "3.2 MB", icon: "🎵" },
  { id: 10, name: "data-sheet.xlsx", size: "567 KB", icon: "📈" },
  { id: 11, name: "profile-pic.jpg", size: "456 KB", icon: "👤" },
  { id: 12, name: "background.png", size: "1.8 MB", icon: "🌅" }
])
</script>
