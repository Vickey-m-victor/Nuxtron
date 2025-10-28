export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initStore()
})
