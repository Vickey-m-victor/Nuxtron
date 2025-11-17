<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header" :class="headerClass">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body" :class="bodyClass">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer" :class="footerClass">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'dark' | 'light'
  bordered?: boolean
  headerClass?: string
  bodyClass?: string
  footerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false
})

const cardClasses = computed(() => {
  const classes = ['card']
  
  if (props.variant) {
    classes.push(`bg-${props.variant}`)
    if (props.variant !== 'light') {
      classes.push('text-white')
    }
  }
  
  if (props.bordered) {
    classes.push('border')
  }
  
  return classes
})
</script>
