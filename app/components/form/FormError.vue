<template>
  <div class="invalid-feedback d-block" v-if="message">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>
