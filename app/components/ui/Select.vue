<template>
  <select
    :class="selectClasses"
    :value="modelValue"
    :disabled="disabled"
    @change="onChange"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option 
      v-for="option in options" 
      :key="optionValue(option)" 
      :value="optionValue(option)"
    >
      {{ optionLabel(option) }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  options: any[]
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  optionLabel?: string
  optionValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
  error: false,
  optionLabel: 'label',
  optionValue: 'value'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectClasses = computed(() => {
  const classes = ['form-select']
  
  if (props.size === 'sm') {
    classes.push('form-select-sm')
  } else if (props.size === 'lg') {
    classes.push('form-select-lg')
  }
  
  if (props.error) {
    classes.push('is-invalid')
  }
  
  return classes
})

const optionLabel = (option: any) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionLabel]
}

const optionValue = (option: any) => {
  if (typeof option === 'string' || typeof option === 'number') {
    return option
  }
  return option[props.optionValue]
}

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
