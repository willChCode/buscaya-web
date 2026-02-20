<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from '#app';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import LocationSearch from '~/components/home/LocationSearch.vue';

definePageMeta({
  layout: false,
});

const router = useRouter();
const store = useUbicacionNegocios();

// TU API KEY
const GOOGLE_API_KEY = 'AIzaSyCNNlqDH6daeLe_UCCWRWQy8tIOhZ0BwZk';

const isSearching = ref(false);

onMounted(async () => {
  if (store.ubicacion && store.ubicacion.direccion) {
    router.push('/negocios');
  }
});

const handleSearch = async ({ lat, lng }: { lat: number; lng: number }) => {
  await store.establecerUbicacionManual(lat, lng);
  router.push('/negocios');
};

const handleCurrentLocation = async () => {
  isSearching.value = true;
  try {
    await store.actualizarDatos(true);
    if (store.ubicacion?.direccion !== null) {
      router.push('/negocios');
    }
  } catch (error) {
    console.error('Error obteniendo ubicación actual:', error);
    alert('No se pudo obtener tu ubicación. Por favor verifica tus permisos.');
  } finally {
    isSearching.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 z-[9999] overflow-hidden font-sans bg-gray-900">
    <div
      class="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 transform hover:scale-105"
      style="
        background-image: url('https://www.ubereats.com/_static/c413f20400e04805.webp');
      "
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"
    ></div>

    <div
      class="relative z-10 flex flex-col h-full w-full max-w-[90%] mx-auto px-6"
    >
      <nav class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <span
            class="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
            >DiDi Food</span
          >
        </div>
        <button
          class="flex items-center gap-2 text-white font-semibold hover:bg-white/20 px-5 py-2.5 rounded-full transition-all border border-white/30 hover:border-white backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Iniciar sesión
        </button>
      </nav>

      <main class="flex-1 flex flex-col justify-center pb-20">
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10 drop-shadow-xl leading-none text-center sm:text-left"
        >
          Encuentra negocios <br />
          en tu colonia
        </h1>

        <LocationSearch :api-key="GOOGLE_API_KEY" @search="handleSearch" />

        <div class="mt-4 flex justify-center sm:justify-start">
          <button
            @click="handleCurrentLocation"
            class="flex items-center gap-2 text-white font-medium hover:text-primary-500 transition-colors group"
          >
            <div
              class="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span v-if="!isSearching">Usar mi ubicación actual</span>
            <span v-else>Obteniendo ubicación...</span>
          </button>
        </div>

        <p
          class="mt-6 text-white font-medium text-base drop-shadow-md text-center sm:text-left"
        >
          ¿Ya tienes cuenta?
          <span
            class="underline cursor-pointer hover:text-primary-500 transition-colors"
            >Inicia sesión</span
          >
          para ver tus direcciones
        </p>
      </main>
    </div>
  </div>
</template>
