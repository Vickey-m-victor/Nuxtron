<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Posts Management</h1>
        <p class="page-subtitle">CMS Module - Posts Page</p>
        
        <div class="card card-wide">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 class="card-title" style="margin-bottom: 0;">Blog Posts</h2>
            <button class="btn btn-purple">
              + New Post
            </button>
          </div>
          
          <div class="posts-grid">
            <div v-for="post in samplePosts" :key="post.id" class="post-card">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              
              <div class="post-meta">
                <span>{{ post.author }}</span>
                <span>{{ post.date }}</span>
              </div>
              
              <div class="post-actions">
                <button class="btn btn-primary btn-small">
                  Edit
                </button>
                <button class="btn btn-danger btn-small">
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">
              This is the CMS Posts management page. In a real application, this would connect to
              a database or API to manage blog posts, articles, or other content.
            </p>
            
            <div class="button-group">
              <NuxtLink to="/cms" class="btn btn-purple">
                CMS Dashboard
              </NuxtLink>
              <NuxtLink to="/cms/pages" class="btn btn-info">
                Manage Pages
              </NuxtLink>
              <NuxtLink to="/" class="btn btn-secondary">
                Main App
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Posts Management - CMS',
  meta: [
    { name: 'description', content: 'Manage blog posts and articles' }
  ]
})

// Sample data for demonstration
const samplePosts = ref([
  {
    id: 1,
    title: "Getting Started with Nuxt 4 Modules",
    excerpt: "Learn how to create modular applications with Nuxt 4's powerful module system.",
    author: "CMS Team",
    date: "2025-01-15"
  },
  {
    id: 2,
    title: "Building Scalable Vue Applications",
    excerpt: "Best practices for creating large-scale Vue.js applications with multiple teams.",
    author: "Development Team",
    date: "2025-01-10"
  },
  {
    id: 3,
    title: "Content Management Best Practices",
    excerpt: "How to design and implement effective content management workflows.",
    author: "Content Team",
    date: "2025-01-05"
  }
])
</script>
