<script setup lang="ts">
import type { Profile } from '../../types/entities/profile.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

const { data, pending, error, refresh } = await useFetch<{
  dataPayload: {
    data: Profile[]
    totalCount: number
    currentPage: number
  }
}>(`/v1/admin/profiles`, {
  query: route.query,
  watch: [() => route.query]
})

const profiles = computed(() => data.value?.dataPayload?.data || [])

const handleView = (id: number) => {
  router.push(`/admin/profiles/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/admin/profiles/${id}/edit`)
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await $fetch(`/v1/admin/profiles/${id}`, {
        method: 'DELETE'
      })
      await refresh()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Profile List'">
      <template #extra>
        <NuxtLink 
          :to="`/admin/profiles/create`"
          class="btn btn-primary"
        >
          <i class="fa fa-plus me-1"></i>
          Create New
        </NuxtLink>
      </template>
    </BasePageHeading>

    <BaseBlock>
      <div v-if="pending" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        Error loading data: {{ error.message }}
      </div>

      <div v-else-if="profiles.length === 0" class="text-center py-4">
        <p class="text-muted">No items found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in profiles" :key="item.id">
              <td>{{ item.first_name }}</td>
              <td>{{ item.middle_name }}</td>
              <td>{{ item.last_name }}</td>
              <td>{{ item.email_address }}</td>
              <td>{{ item.phone_number }}</td>
              <td class="text-end">
                <button
                  @click="handleView(item.id)"
                  class="btn btn-sm btn-info me-1"
                  title="View"
                >
                  <i class="fa fa-eye"></i>
                </button>
                <button
                  @click="handleEdit(item.id)"
                  class="btn btn-sm btn-warning me-1"
                  title="Edit"
                >
                  <i class="fa fa-pencil"></i>
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="btn btn-sm btn-danger"
                  title="Delete"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseBlock>
  </div>
</template>
