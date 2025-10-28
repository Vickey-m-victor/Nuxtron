<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Users</h1>
      <p class="page-description">User management page</p>
    </div>

    <div class="content-section">
      <div class="card">
        <h2>User List</h2>
        <p>This page demonstrates nested routing: <code>/users</code></p>
        
        <div class="user-grid">
          <div class="user-card" v-for="user in users" :key="user.id">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
            <NuxtLink :to="`/users/${user.id}`" class="btn btn-primary btn-sm">
              View Profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page meta
definePageMeta({
  title: 'Users',
  description: 'User management page'
})

// Sample users data
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
])
</script>