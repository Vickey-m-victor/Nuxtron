<script setup lang="ts">
import type { MailSettings } from '../../types/entities/mail-settings.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const { data, pending, error, refresh} = await useFetch<{
  dataPayload: {
    data: MailSettings[]
    totalCount: number
    currentPage: number
  }
}>(`/api/v1/admin/mail-settings`, {
  query: route.query,
  watch: [() => route.query],
  $fetch: $api
})

const mailSettings = computed(() => data.value?.dataPayload?.data || [])

const handleView = (id: number) => {
  router.push(`/admin/mail-settings/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/admin/mail-settings/${id}/edit`)
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await $api(`/api/v1/admin/mail-settings/${id}`, {
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
    <BasePageHeading :title="'MailSettings List'">
      <template #extra>
        <NuxtLink 
          :to="`/admin/mail-settings/create`"
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

      <div v-else-if="mailSettings.length === 0" class="text-center py-4">
        <p class="text-muted">No items found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Smtp Server</th>
              <th>Smtp Port</th>
              <th>Smtp Username</th>
              <th>Smtp Password</th>
              <th>Email Encryption</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mailSettings" :key="item.id">
              <td>{{ item.smtp_server }}</td>
              <td>{{ item.smtp_port }}</td>
              <td>{{ item.smtp_username }}</td>
              <td>{{ item.smtp_password }}</td>
              <td>{{ item.email_encryption }}</td>
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
