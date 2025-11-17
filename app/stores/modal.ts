import { defineStore } from 'pinia'
import { ref, markRaw } from 'vue'
import type { Component } from 'vue'

export const useModalStore = defineStore('modalStore', () => {
  // State
  const isOpen = ref(false)
  const component = ref<Component | null>(null)
  const props = ref<Record<string, any>>({})
  const title = ref('')
  const useModal = ref(true) // Toggle between modal/page mode
  const modalSize = ref('lg')
  const showFooter = ref(false)
  const bodyClass = ref('modal-body-form')
  
  // Modal configuration
  const fullscreen = ref(false)
  const centered = ref(true)
  const scrollable = ref(false)
  const closeOnBackdrop = ref(false)

  // Actions
  function openModal(
    modalComponent: Component | null = null,
    modalProps: Record<string, any> = {},
    modalTitle: string = 'Modal Title',
    size: 'sm' | 'lg' | 'xl' = 'lg',
    footer: boolean = false,
    options: {
      centered?: boolean
      scrollable?: boolean
      fullscreen?: boolean
      closeOnBackdrop?: boolean
      bodyClass?: string
    } = {}
  ) {
    component.value = modalComponent ? markRaw(modalComponent) : null
    props.value = modalProps
    title.value = modalTitle
    isOpen.value = true
    showFooter.value = footer
    modalSize.value = size
    
    // Apply options
    centered.value = options.centered ?? true
    scrollable.value = options.scrollable ?? false
    fullscreen.value = options.fullscreen ?? false
    closeOnBackdrop.value = options.closeOnBackdrop ?? false
    bodyClass.value = options.bodyClass ?? 'modal-body-form'
  }

  function closeModal() {
    isOpen.value = false
    component.value = null
    props.value = {}
    title.value = ''
    showFooter.value = false
  }

  function toggleModalUsage(value: boolean) {
    useModal.value = value
  }

  return {
    // State
    isOpen,
    component,
    props,
    title,
    useModal,
    modalSize,
    showFooter,
    centered,
    scrollable,
    fullscreen,
    closeOnBackdrop,
    bodyClass,
    
    // Actions
    openModal,
    closeModal,
    toggleModalUsage
  }
})
