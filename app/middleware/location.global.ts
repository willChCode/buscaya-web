import { useUbicacionNegocios } from '@/store/ubicacion.store';

export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente para evitar falsos positivos en SSR
  if (!process.client) return;

  const store = useUbicacionNegocios();

  // Permite siempre la landing page
  if (to.path === '/') return;

  // Si no hay ubicación establecida, redirigir a la landing
  if (!store.ubicacion || !store.ubicacion.direccion) {
    return navigateTo('/');
  }
});
