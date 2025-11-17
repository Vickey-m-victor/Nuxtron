<template>
  <div class="d-flex align-items-center justify-content-center gap-2">
    <i
      v-if="actions.includes('view')"
      class="fa fa-eye cursor-pointer text-primary"
      @click="$emit('view', rowData)"
      :title="'View'"
      style="font-size: 1.2rem"
    ></i>
    <i
      v-if="actions.includes('edit')"
      class="fa fa-pencil cursor-pointer text-success"
      @click="$emit('edit', rowData)"
      :title="'Edit'"
      style="font-size: 1.2rem"
    ></i>
    <i
      v-if="actions.includes('delete')"
      class="fa fa-trash cursor-pointer text-danger"
      @click="$emit('delete', rowData)"
      :title="'Delete'"
      style="font-size: 1.2rem"
    ></i>
    <!-- Custom actions as icons -->
    <i
      v-for="(action, index) in customActions"
      :key="index"
      :class="[action.icon || 'fa fa-cog', 'cursor-pointer', `text-${action.variant || 'secondary'}`]"
      @click="$emit('custom-action', { action: action.name, row: rowData })"
      :title="action.label"
      style="font-size: 1.2rem"
    ></i>
  </div>
</template>

<script setup lang="ts">
interface CustomAction {
  name: string
  label: string
  icon?: string
  variant?: string
}

interface Props {
  rowData: any
  actions?: ('view' | 'edit' | 'delete')[]
  customActions?: CustomAction[]
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => ['view', 'edit', 'delete'],
  customActions: () => []
})

defineEmits<{
  view: [data: any]
  edit: [data: any]
  delete: [data: any]
  'custom-action': [payload: { action: string, row: any }]
}>()
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Add hover effects */
i:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
