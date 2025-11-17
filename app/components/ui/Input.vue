<template>
  <input 
    :type="type"
    :class="inputClasses"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  size: 'md',
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClasses = computed(() => {
  const classes = ['form-control']
  
  if (props.size === 'sm') {
    classes.push('form-control-sm')
  } else if (props.size === 'lg') {
    classes.push('form-control-lg')
  }
  
  if (props.error) {
    classes.push('is-invalid')
  }
  
  return classes
})

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const onFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
