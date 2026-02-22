<template>
  <div
    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-auto mb-4 shrink-0 mx-4 md:mx-0"
  >
    <h3
      class="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2 uppercase tracking-wide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clip-rule="evenodd"
        />
      </svg>
      Ubicación y Mapa
    </h3>

    <div class="rounded-xl overflow-hidden border border-gray-100 mb-4">
      <div class="relative group">
        <!-- Mapa -->
        <div ref="mapContainer" class="w-full h-48 bg-gray-100"></div>

        <!-- Overlay interceptor -->
        <div
          @click="abrirEnMapaNativo"
          class="absolute inset-0 bg-transparent z-10 cursor-pointer"
          title="Abrir en mapas"
        ></div>
      </div>
    </div>

    <!-- Dirección Texto -->
    <div v-if="negocio.direccion" class="mb-4">
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ negocio.direccion }}
      </p>
    </div>

    <div class="flex gap-2">
      <button
        @click="abrirEnGoogleMaps"
        class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        Google Maps
      </button>
      <button
        @click="abrirEnWaze"
        class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        Waze
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  negocio: any;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let marker: google.maps.Marker | null = null;

const initMap = () => {
  if (!mapContainer.value || !props.negocio?.ubicacion?.coordinates) return;
  if (!window.google || !window.google.maps) return;

  const [lng, lat] = props.negocio.ubicacion.coordinates;
  const position = { lat, lng };

  map = new window.google.maps.Map(mapContainer.value, {
    center: position,
    zoom: 15,
    disableDefaultUI: true,
    zoomControl: false, // Disable zoom control UI
    gestureHandling: 'none', // Disable all gestures (zoom, pan, scroll)
    mapTypeControl: false,
    streetViewControl: false,
  });

  marker = new window.google.maps.Marker({
    position,
    map,
    title: props.negocio.nombre,
  });
};

const abrirEnMapaNativo = () => {
  if (!props.negocio?.ubicacion?.coordinates) return;
  const [lng, lat] = props.negocio.ubicacion.coordinates;
  const label = props.negocio.nombre || 'Ubicación';

  const isApple =
    /iPad|iPhone|iPod|Mac/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  if (isApple) {
    window.open(
      `maps://?q=${encodeURIComponent(label)}&ll=${lat},${lng}`,
      '_blank'
    );
  } else {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  }
};

const abrirEnGoogleMaps = () => {
  if (!props.negocio?.ubicacion?.coordinates) return;
  const [lng, lat] = props.negocio.ubicacion.coordinates;
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    '_blank'
  );
};

const abrirEnWaze = () => {
  if (!props.negocio?.ubicacion?.coordinates) return;
  const [lng, lat] = props.negocio.ubicacion.coordinates;
  window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
};

onMounted(() => {
  // Try to init map immediately
  initMap();

  // If google maps is not loaded yet, retry every 500ms for a few seconds
  if (!window.google || !window.google.maps) {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        initMap();
        clearInterval(interval);
      }
    }, 500);
    // Clear interval after 10 seconds to avoid infinite checking
    setTimeout(() => clearInterval(interval), 10000);
  }
});

watch(
  () => props.negocio,
  () => {
    initMap();
  },
  { deep: true }
);
</script>
