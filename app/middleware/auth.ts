export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // If no user, redirect to home
  if (!authStore.user) {
    return navigateTo('/');
  }
});
