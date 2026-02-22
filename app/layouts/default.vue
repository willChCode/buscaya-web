<template>
  <!-- Mobile Header -->
  <div
    class="sticky top-0 flex md:hidden flex-col w-full bg-white shadow-sm z-50"
  >
    <!-- Top Bar: Hamburger, Search, User -->
    <div
      class="flex items-center justify-between h-[75px] px-4 border-b border-gray-100 gap-3"
    >
      <!-- Logo Mobile (Optional placeholder or just empty) -->
      <!-- Search Bar is next -->

      <!-- Logo Mobile (Left) -->
      <NuxtLink to="/" class="-ml-2 flex items-center pl-1">
        <img
          src="~/assets/images/logo/logo-navegador.png"
          alt="Buscaya"
          class="h-[50px] w-auto object-contain"
        />
      </NuxtLink>

      <!-- Search Bar -->
      <div class="flex-1 max-w-2xl">
        <div
          class="relative flex items-center bg-gray-50 h-11 rounded-lg overflow-hidden border border-gray-100 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all"
        >
          <div class="pl-3 text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Comida, restaurante..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="w-full h-full bg-transparent text-sm text-gray-700 pl-2 pr-20 focus:outline-none placeholder-gray-400"
          />
          <button
            v-if="searchQuery"
            @click="handleClearSearch"
            class="absolute right-10 h-full w-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            @click="handleSearch"
            class="absolute right-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Hamburger Menu (Moved to Right) -->
      <button
        @click="showMenu = true"
        class="p-2 -mr-2 text-gray-600 hover:text-primary-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Sub Bar: Location -->
    <div class="px-4 py-2 bg-white border-b border-gray-100">
      <div
        @click="showLocationModal = true"
        class="flex items-center text-sm text-primary-500 cursor-pointer hover:text-primary-700 select-none truncate"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="truncate font-medium">
          {{
            store.ubicacion
              ? store.ubicacion?.direccion
              : 'Seleccionar ubicación...'
          }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 8l5 5 5-5H5z" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Mobile Sidebar (Right aligned) -->
  <div v-if="showMenu" class="fixed inset-0 z-[60] flex justify-end md:hidden">
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/50 transition-opacity"
      @click="showMenu = false"
    ></div>

    <!-- Sidebar Content -->
    <div
      class="relative bg-white w-[85vw] h-full shadow-xl flex flex-col p-6 transform transition-transform"
    >
      <div class="flex items-center justify-between mb-8">
        <img
          src="~assets/images/logo/logo-color.svg"
          alt="Logo de la aplicación"
          class="h-7 w-auto"
        />
        <button
          @click="showMenu = false"
          class="text-gray-500 hover:text-primary-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav class="flex flex-col space-y-4">
        <NuxtLink
          to="/negocios"
          @click="showMenu = false"
          class="text-lg font-medium text-gray-700 hover:text-primary-500 transition-colors"
          :class="{ 'text-primary-500': route.path.startsWith('/negocios') }"
        >
          Negocios
        </NuxtLink>
        <NuxtLink
          to="/revista"
          @click="showMenu = false"
          class="text-lg font-medium text-gray-700 hover:text-primary-500 transition-colors"
          :class="{ 'text-primary-500': route.path.startsWith('/revista') }"
        >
          Revista
        </NuxtLink>
        <NuxtLink
          to="/comunidad"
          @click="showMenu = false"
          class="text-lg font-medium text-gray-700 hover:text-primary-500 transition-colors"
          :class="{ 'text-primary-500': route.path.startsWith('/comunidad') }"
        >
          Comunidad
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-6 border-t border-gray-100">
        <button
          @click="handleAuthAction"
          class="flex items-center text-gray-700 hover:text-primary-500 transition-colors w-full"
        >
          <img
            v-if="!authStore.user"
            class="h-6 w-6 mr-3"
            src="http://solutiai.com/wp-content/uploads/2025/11/user-alt-1-svgrepo-com.svg"
            alt=""
          />
          <img
            v-else
            :src="
              authStore.user?.photoURL ||
              'https://ui-avatars.com/api/?name=' + authStore.user?.displayName
            "
            class="h-8 w-8 rounded-full mr-3 border border-gray-200"
            alt="Avatar"
          />
          <span class="font-medium text-lg">
            {{
              authStore.user
                ? truncateName(authStore.user.displayName)
                : 'Ingreso'
            }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <nav
    class="sticky top-0 z-40 hidden md:flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white shadow-sm"
  >
    <div class="flex items-center space-x-4 shrink-0">
      <NuxtLink to="/negocios">
        <img
          src="~assets/images/logo/logo-color.svg"
          alt="Logo de la aplicación"
          class="h-7 w-auto"
        />
      </NuxtLink>
      <div class="h-6 border-r border-gray-200"></div>
      <div
        @click="showLocationModal = true"
        class="flex gap-1 items-center text-sm font-semibold text-primary-500 cursor-pointer hover:text-primary-700 select-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1 text-primary-500 -mt-[1px]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="truncate max-w-[200px]">
          {{ store.ubicacion ? store.ubicacion?.direccion : 'cargando...' }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-1 text-primary-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 8l5 5 5-5H5z" />
        </svg>
      </div>
      <!-- <div class="h-6 border-r border-gray-200"></div> -->
    </div>

    <div class="flex-1 max-w-xl mx-auto px-4">
      <div
        class="relative flex items-center bg-gray-50 h-10 rounded-full overflow-hidden border border-gray-100"
      >
        <input
          type="text"
          placeholder="Buscar negocios"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          class="w-full h-full bg-transparent text-base text-gray-500 pl-6 pr-20 focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="handleClearSearch"
          class="absolute right-12 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          @click="handleSearch"
          class="absolute right-0 h-full w-12 bg-primary-500 flex items-center justify-center hover:bg-primary-700 transition duration-150"
        >
          <img
            class="h-[26px] w-[26px]"
            src="http://solutiai.com/wp-content/uploads/2025/11/search-svgrepo-com-1.svg"
            alt=""
          />
        </button>
      </div>
    </div>

    <div class="flex items-center space-x-5 shrink-0">
      <!-- <div class="h-6 border-r border-gray-200"></div> -->
      <nav class="hidden md:flex items-center space-x-5 text-sm">
        <NuxtLink
          to="/negocios"
          :class="[
            route.path.startsWith('/negocios')
              ? 'text-primary-500 font-semibold'
              : 'text-gray-700',
            'hover:text-primary-500 transition duration-150 font-medium',
          ]"
          >Negocios</NuxtLink
        >
        <NuxtLink
          to="/revista"
          :class="[
            route.path.startsWith('/revista')
              ? 'text-primary-500 font-semibold'
              : 'text-gray-700',
            'hover:text-primary-500 transition duration-150 font-medium',
          ]"
          >Revista</NuxtLink
        >
        <NuxtLink
          to="/comunidad"
          :class="[
            route.path.startsWith('/comunidad')
              ? 'text-primary-500 font-semibold'
              : 'text-gray-700',
            'hover:text-primary-500 transition duration-150 font-medium',
          ]"
          >Comunidad</NuxtLink
        >
      </nav>
      <div class="h-6 border-r border-gray-200"></div>
      <span class="ml-4">
        <button
          @click="handleAuthAction"
          class="flex items-center text-gray-700 hover:text-primary-500 transition duration-150"
        >
          <img
            v-if="!authStore.user"
            class="h-[20px] w-[20px] mr-1"
            src="http://solutiai.com/wp-content/uploads/2025/11/user-alt-1-svgrepo-com.svg"
            alt=""
          />
          <img
            v-else
            :src="
              authStore.user?.photoURL ||
              'https://ui-avatars.com/api/?name=' + authStore.user?.displayName
            "
            class="h-8 w-8 rounded-full mr-2 border border-gray-200"
            alt="Avatar"
          />
          <span class="font-medium">
            {{
              authStore.user
                ? truncateName(authStore.user.displayName)
                : 'Ingreso'
            }}
          </span>
        </button>
      </span>
    </div>
  </nav>

  <main class="min-h-screen" :class="route.meta.paddingClass || 'px-3 md:px-6'">
    <slot />
  </main>

  <Dialog v-model="showLocationModal">
    <div
      class="w-full flex flex-col min-h-[400px] bg-white rounded-xl overflow-hidden relative px-3 py-3"
    >
      <div v-if="step === 1" class="px-2 pt-2 w-full flex flex-col h-[400px]">
        <div>
          <h2 class="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Ingresa tu dirección
          </h2>

          <div class="relative group">
            <input
              type="text"
              v-model="addressQuery"
              @input="handleAddressInput"
              placeholder="Dirección o punto de referencia"
              class="w-full bg-gray-100 text-gray-700 text-sm placeholder-gray-500 rounded-full py-3.5 pl-6 pr-12 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all duration-200"
            />

            <button
              v-if="addressQuery"
              @click="
                addressQuery = '';
                predictions = [];
              "
              class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            >
              <svg
                v-if="!loadingPredictions"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div
                v-else
                class="w-5 h-5 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"
              ></div>
            </div>
          </div>

          <div
            v-if="predictions.length > 0"
            class="mt-4 flex flex-col divide-y divide-gray-100 max-h-64 overflow-y-auto px-2"
          >
            <div
              v-for="item in predictions"
              :key="item.place_id"
              @click="goToMapStep(item)"
              class="flex items-start gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="mt-1 shrink-0 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div class="flex flex-col text-left">
                <span class="text-sm font-semibold text-gray-800 leading-tight">
                  {{ item.structured_formatting.main_text }}
                </span>
                <span class="text-xs text-gray-500 mt-0.5">
                  {{ item.structured_formatting.secondary_text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="predictions.length === 0" class="mt-auto px-2 pb-2">
          <div
            @click="detectarUbicacionActual"
            class="flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 p-3 -mx-2 rounded-xl transition-colors group border-t border-transparent hover:border-gray-100"
          >
            <div
              class="text-gray-900 group-hover:text-primary-500 transition-colors"
            >
              <img
                class="h-6 w-6"
                src="http://solutiai.com/wp-content/uploads/2025/11/location-arrow-svgrepo-com.svg"
                alt=""
              />
            </div>
            <span
              class="text-black font-semibold text-md group-hover:text-primary-500 transition-colors"
            >
              Mi ubicación actual
            </span>
          </div>
        </div>
      </div>

      <div v-else-if="step === 2" class="flex flex-col h-full relative">
        <div
          class="absolute top-0 left-0 w-full z-10 bg-white/95 backdrop-blur-sm p-3 flex items-center"
        >
          <button
            @click="step = 1"
            class="mr-3 text-gray-600 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 class="text-lg font-bold text-gray-800">Verifica la ubicación</h2>
        </div>

        <div
          id="map"
          ref="mapContainer"
          class="w-full flex-grow bg-gray-200 min-h-[280px] mt-14 rounded-xl"
        ></div>

        <div class="bg-white border-t border-gray-100 z-20">
          <div class="flex items-start justify-between mb-4 p-4">
            <div class="text-sm text-gray-700">
              {{ selectedAddressText }}
            </div>
            <button
              @click="step = 1"
              class="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          </div>

          <div class="px-2 pb-2">
            <button
              @click="confirmarDireccion"
              class="w-full bg-primary-500 hover:bg-primary-600 text-white py-3.5 rounded-xl transition shadow-lg shadow-primary-100 font-semibold text-md"
            >
              Confirmar dirección
            </button>
          </div>
        </div>
      </div>
    </div>
  </Dialog>

  <LoginModal v-model:isOpen="showLoginModal" />
  <ChatWidget />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { useAuthStore } from '@/stores/auth.store';
import LoginModal from '@/components/auth/LoginModal.vue';
import ChatWidget from '@/components/ChatWidget.vue';

const store = useUbicacionNegocios();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Variables Principales
const searchQuery = ref('');
const showMenu = ref(false);
const showLocationModal = ref(false);
const showLoginModal = ref(false);
const step = ref(1); // 1 = Buscador, 2 = Mapa
const truncateName = (name, maxLength = 10) => {
  if (!name) return '';
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};

// Sync searchQuery with route query on mount and change
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
});

watch(
  () => route.query.search,
  (newVal) => {
    if (newVal) {
      searchQuery.value = newVal;
    } else if (route.path !== '/resultados') {
      searchQuery.value = '';
    }
  }
);

// Variables Google Maps
const addressQuery = ref('');
const predictions = ref([]);
const selectedAddressText = ref('');
const selectedLocation = ref(null); // { lat, lng }
const mapContainer = ref(null); // Ref al div del mapa
const loadingPredictions = ref(false);
let debounceTimer = null;

// API KEY
const GOOGLE_API_KEY = useRuntimeConfig().public.googleMapsKey;

let autocompleteService = null;
let geocoder = null;
let mapInstance = null;
let markerInstance = null;

// --- Login / Auth Handling ---
const handleAuthAction = () => {
  showMenu.value = false;
  if (authStore.user) {
    // Navigate to profile instead of logout confirmation
    navigateTo('/perfil');
  } else {
    showLoginModal.value = true;
  }
};

// --- Lógica del Buscador Principal ---
const handleSearch = () => {
  if (searchQuery.value.trim() !== '') {
    router.push({
      path: '/resultados',
      query: { search: searchQuery.value.trim() },
    });
  }
};

const handleClearSearch = () => {
  searchQuery.value = '';
  if (route.path.startsWith('/resultados')) {
    router.push({
      path: '/resultados',
      query: { ...route.query, search: undefined },
    });
  }
};

// --- Inicialización de Google Maps ---
const loadGoogleMaps = () => {
  if (
    typeof window !== 'undefined' &&
    window.google &&
    window.google.maps &&
    window.google.maps.places
  ) {
    initServices();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => initServices();
  document.head.appendChild(script);
};

const initServices = () => {
  if (!window.google) return;
  autocompleteService = new window.google.maps.places.AutocompleteService();
  geocoder = new window.google.maps.Geocoder();
};

// --- Paso 1: Buscar Direcciones ---
const handleAddressInput = () => {
  if (!addressQuery.value || !autocompleteService) {
    predictions.value = [];
    loadingPredictions.value = false;
    if (debounceTimer) clearTimeout(debounceTimer);
    return;
  }

  loadingPredictions.value = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const request = {
      input: addressQuery.value,
      componentRestrictions: { country: 'mx' },
      types: ['geocode', 'establishment'],
    };

    autocompleteService.getPlacePredictions(request, (results, status) => {
      loadingPredictions.value = false;
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        predictions.value = results;
      } else {
        predictions.value = [];
      }
    });
  }, 1000);
};

// --- Transición: De Lista -> Mapa ---
const goToMapStep = (prediction) => {
  selectedAddressText.value = prediction.description; // Texto bonito

  // Convertir place_id a Coordenadas
  geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;
      // Guardamos como objeto plano para evitar problemas con la instancia de Google Maps
      selectedLocation.value = {
        lat: typeof location.lat === 'function' ? location.lat() : location.lat,
        lng: typeof location.lng === 'function' ? location.lng() : location.lng,
      };

      step.value = 2; // Cambiamos vista

      // Esperamos a que Vue renderice el div #map para inicializarlo
      nextTick(() => {
        initMap(location);
      });
    }
  });
};

const detecting = ref(false); // Para mostrar estado de carga si quieres

const detectarUbicacionActual = () => {
  if (!navigator.geolocation)
    return alert('Navegador no soporta geolocalización');

  detecting.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Geocodificación inversa (Coords -> Texto Dirección)
      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === 'OK' && results[0]) {
          selectedAddressText.value = results[0].formatted_address;
        } else {
          selectedAddressText.value = 'Ubicación actual';
        }
        selectedLocation.value = pos;
        step.value = 2;
        detecting.value = false;
        nextTick(() => initMap(pos));
      });
    },
    (error) => {
      detecting.value = false;
      alert('Error al obtener ubicación');
    }
  );
};

// --- Paso 2: Dibujar Mapa ---
const initMap = (location) => {
  if (!mapContainer.value) return;

  mapInstance = new window.google.maps.Map(mapContainer.value, {
    center: location,
    zoom: 17,
    disableDefaultUI: true, // Mapa limpio
    zoomControl: true,
  });

  markerInstance = new window.google.maps.Marker({
    position: location,
    map: mapInstance,
    animation: window.google.maps.Animation.DROP,
  });
};

// --- Finalizar ---
const confirmarDireccion = async () => {
  if (!selectedLocation.value) return;

  // Usamos la acción del store que ya existe para actualizar todo (dirección y negocios)
  await store.establecerUbicacionManual(
    selectedLocation.value.lat,
    selectedLocation.value.lng
  );

  showLocationModal.value = false;

  // Opcional: Redirigir si no estamos en negocios
  if (route.path !== '/negocios') {
    router.push('/negocios');
  }
};

// Watchers
watch(showLocationModal, (val) => {
  if (!val) {
    // Resetear todo al cerrar
    setTimeout(() => {
      step.value = 1;
      addressQuery.value = '';
      predictions.value = [];
    }, 300);
  }
});

onMounted(async () => {
  await authStore.initialize(); // Check cookies
  store.actualizarDatos();
  loadGoogleMaps();
});
</script>
