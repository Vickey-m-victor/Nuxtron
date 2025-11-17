<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'dark' | 'light'
  pill?: boolean
  light?: boolean // OneUI light variant (bg-{variant}-light text-{variant})
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  pill: false,
  light: false
})

const badgeClasses = computed(() => {
  const classes = []
  
  if (props.light) {
    // OneUI light style
    classes.push(
      'fs-xs',
      'fw-semibold',
      'd-inline-block',
      'py-1',
      'px-3',
      `bg-${props.variant}-light`,
      `text-${props.variant}`
    )
    if (props.pill) {
      classes.push('rounded-pill')
    }
  } else {
    // Standard Bootstrap badge
    classes.push('badge', `bg-${props.variant}`)
    if (props.pill) {
      classes.push('rounded-pill')
    }
  }
  
  return classes
})
</script>
