<script setup lang="ts">
import GlobalModal from '~/components/global/GlobalModal.vue'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    
    <!-- Global Modal - renders anywhere in the app -->
    <GlobalModal />
  </div>
</template>

<style>
/* Temporarily remove all complex imports to get the app running */
</style>
