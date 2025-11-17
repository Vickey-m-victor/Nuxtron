<script setup lang="ts">
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()

defineProps({
  title: String,
  showFooter: { type: Boolean, default: false },
  bodyClass: { type: String, default: '' }
})

const backdropClick = () => {
  if (modalStore.closeOnBackdrop) {
    modalStore.closeModal()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modalStore.isOpen" 
        class="modal fade show d-block" 
        tabindex="-1" 
        role="dialog"
        @click.self="backdropClick"
      >
        <div 
          :class="[
            'modal-dialog',
            `modal-${modalStore.modalSize}`,
            modalStore.centered ? 'modal-dialog-centered' : '',
            modalStore.scrollable ? 'modal-dialog-scrollable' : '',
            modalStore.fullscreen ? 'modal-fullscreen' : ''
          ]" 
          role="document"
        >
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <h5 class="modal-title">{{ title || modalStore.title }}</h5>
              <button 
                type="button" 
                class="btn-close" 
                @click="modalStore.closeModal"
                aria-label="Close"
              ></button>
            </div>
            
            <!-- Body with dynamic component -->
            <div 
              :class="['modal-body', bodyClass || modalStore.bodyClass]"
            >
              <component 
                v-if="modalStore.component" 
                :is="modalStore.component" 
                v-bind="modalStore.props" 
              />
              <slot v-else name="component">
                <p>No component provided</p>
              </slot>
            </div>
            
            <!-- Footer (optional) -->
            <div 
              v-if="modalStore.showFooter || $slots.footer" 
              class="modal-footer"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div 
        v-if="modalStore.isOpen" 
        class="modal-backdrop fade show"
      ></div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.15s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
