<template>
  <div class="row push">
    <div v-if="label || description" class="col-lg-4">
      <p v-if="label" class="fw-semibold">{{ label }}</p>
      <p v-if="description" class="fs-sm text-muted">
        {{ description }}
      </p>
    </div>
    <div :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  description?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  contentClass: 'col-lg-8 col-xl-5'
})
</script>
