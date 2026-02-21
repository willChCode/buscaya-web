import { useUbicacionNegocios } from '@/store/ubicacion.store';

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useUbicacionNegocios();

  // Permite siempre la landing page
  if (to.path === '/') return;

  // Si no hay ubicación establecida, redirigir a la landing
  if (!store.ubicacion || !store.ubicacion.direccion) {
    console.log(
      '🚩 [GUARD] Sin ubicación detectada, redirigiendo a la landing...'
    );
    return navigateTo('/');
  }
});
