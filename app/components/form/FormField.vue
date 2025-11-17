<template>
  <div class="mb-4">
    <label v-if="label" :for="id" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <slot>
      <!-- Auto-detect input type based on field type -->
      <Input
        v-if="type === 'text' || type === 'email' || type === 'password' || type === 'tel' || type === 'url'"
        :id="id"
        :type="type"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :error="!!error"
      />
      
      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        class="form-control"
        :class="{ 'is-invalid': !!error }"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
      ></textarea>
      
      <Input
        v-else-if="type === 'number'"
        :id="id"
        type="number"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :error="!!error"
      />
      
      <Select
        v-else-if="type === 'select'"
        :id="id"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :options="options || []"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="!!error"
      />
      
      <div v-else-if="type === 'checkbox'" class="form-check">
        <input
          :id="id"
          type="checkbox"
          class="form-check-input"
          :checked="modelValue"
          @change="onCheckboxChange"
          :disabled="disabled"
        />
        <label v-if="checkboxLabel" class="form-check-label" :for="id">
          {{ checkboxLabel }}
        </label>
      </div>
      
      <Input
        v-else
        :id="id"
        type="text"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :error="!!error"
      />
    </slot>
    
    <FormError v-if="error" :message="error" />
    <small v-if="hint" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: any
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  id?: string
  rows?: number
  options?: any[]
  checkboxLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  rows: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const labelClasses = computed(() => [
  'form-label',
  'fw-semibold',
  'mb-2',
  'd-block'
])

const onCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
