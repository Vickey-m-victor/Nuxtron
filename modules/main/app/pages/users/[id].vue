<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">User Profile</h1>
      <p class="page-description">Dynamic route example</p>
    </div>

    <div class="content-section">
      <div class="card">
        <div class="user-profile">
          <h2>User ID: {{ $route.params.id }}</h2>
          <p>This page demonstrates dynamic routing: <code>/users/[id]</code></p>
          
          <div class="user-info" v-if="user">
            <h3>{{ user.name }}</h3>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Joined:</strong> {{ user.joinedDate }}</p>
          </div>
          
          <div v-else class="loading">
            Loading user information...
          </div>
        </div>
        
        <div class="actions">
          <NuxtLink to="/users" class="btn btn-secondary">
            ← Back to Users
          </NuxtLink>
          <button class="btn btn-primary" @click="refreshUser">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page meta
definePageMeta({
  title: 'User Profile',
  description: 'Dynamic user profile page'
})

// Get route params
const route = useRoute()
const userId = computed(() => route.params.id)

// Sample user data (would normally come from an API)
const user = ref(null)

// Load user data
const loadUser = () => {
  // Simulate API call
  setTimeout(() => {
    user.value = {
      id: userId.value,
      name: `User ${userId.value}`,
      email: `user${userId.value}@example.com`,
      role: 'Member',
      joinedDate: new Date().toLocaleDateString()
    }
  }, 500)
}

const refreshUser = () => {
  user.value = null
  loadUser()
}

// Load user on mount and when route changes
onMounted(loadUser)
watch(userId, loadUser)
</script>