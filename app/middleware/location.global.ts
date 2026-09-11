import { useUbicacionNegocios } from '~/store/ubicacion.store';

export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente para evitar falsos positivos en SSR
  if (!process.client) return;

  const store = useUbicacionNegocios();

  // Permite siempre la landing page y soporte
  if (to.path === '/' || to.path === '/soporte') return;

  // En lugar de redirigir a la landing, simplemente abrimos el modal de ubicación
  // para que el usuario se quede en la URL exacta a la que entró (ej. /abogados/guadalupe)
  const showLocationModal = useState('showLocationModal');
  if (!store.ubicacion || !store.ubicacion.direccion) {
    showLocationModal.value = true;
  }
});
