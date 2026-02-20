export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  
  // Initialize auth state from cookies before app mounts or navigation occurs
  await authStore.initialize();
});
