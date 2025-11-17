<template>
  <button 
    :type="type"
    :class="buttonClasses" 
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <i v-if="icon && !loading" :class="icon" class="me-2"></i>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
  outlined?: boolean
  alt?: boolean // OneUI alt button style
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  outlined: false,
  alt: false,
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn']
  
  // Variant
  if (props.alt) {
    classes.push(`btn-alt-${props.variant}`)
  } else if (props.outlined) {
    classes.push(`btn-outline-${props.variant}`)
  } else {
    classes.push(`btn-${props.variant}`)
  }
  
  // Size
  if (props.size === 'sm') {
    classes.push('btn-sm')
  } else if (props.size === 'lg') {
    classes.push('btn-lg')
  }
  
  // Block
  if (props.block) {
    classes.push('w-100')
  }
  
  return classes
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
