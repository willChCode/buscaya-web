<template>
  <div
    ref="searchContainer"
    class="w-full max-w-[790px] mx-auto sm:mx-0 relative"
  >
    <div
      class="bg-white rounded-xl shadow-2xl relative h-[72px] flex items-center transition-all z-20 overflow-hidden"
      :class="{
        'focus-within:ring-4 ring-primary-500/30': isGoogleReady,
        'bg-gray-100': !isGoogleReady,
      }"
    >
      <div
        class="absolute left-4 z-10 pointer-events-none flex items-center justify-center w-6 h-6"
      >
        <div
          v-if="loadingPredictions"
          class="w-5 h-5 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"
        ></div>
        <svg
          v-else-if="!isGoogleReady"
          class="animate-spin h-5 w-5 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>

      <input
        v-model="addressQuery"
        @input="handleInput"
        @focus="onFocus"
        type="text"
        :disabled="!isGoogleReady"
        :placeholder="
          !isGoogleReady ? 'Cargando mapa...' : 'Ej. Av. constitucion 2050, N.L'
        "
        class="w-full h-full rounded-xl text-gray-800 placeholder-gray-400 text-[15px] sm:text-lg font-medium border-none outline-none bg-transparent pl-12 sm:pl-14 pr-28 sm:pr-[255px] disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-gray-100 transition-colors truncate"
      />
      <div class="absolute right-2 top-2 bottom-2 flex items-center gap-2">
        <button
          v-if="addressQuery && isGoogleReady"
          @click="clearInput"
          class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Borrar"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button
          @click="onSearch"
          :disabled="!isPredictionSelected || isSearching || !isGoogleReady"
          class="h-full px-4 sm:px-8 bg-primary-500 text-white font-bold text-lg rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center min-w-[60px] sm:min-w-[160px]"
        >
          <span v-if="!isSearching" class="hidden sm:inline"
            >Buscar negocios</span
          >
          <span v-if="!isSearching" class="sm:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
          <svg
            v-if="isSearching"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div
      v-show="showDropdown && predictions.length > 0"
      class="absolute top-full left-0 w-full bg-white rounded-b-xl shadow-2xl mt-1 overflow-hidden z-10 max-h-[240px] overflow-y-auto custom-scrollbar"
    >
      <div
        v-for="item in predictions"
        :key="item.place_id"
        @click="selectPrediction(item)"
        class="px-5 py-4 cursor-pointer hover:bg-gray-50 border-t border-gray-100 flex items-center transition-colors"
      >
        <div class="flex flex-col">
          <span class="text-[17px] font-bold text-primary-500">
            {{ item.structured_formatting.main_text }}
          </span>
          <span class="text-[15px] text-gray-500">
            {{ item.structured_formatting.secondary_text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useGoogleMaps } from '~/composables/useGoogleMaps';

const props = defineProps<{
  apiKey: string;
}>();

const emit = defineEmits(['search']);

const {
  isGoogleReady,
  predictions,
  initGoogleMaps,
  getPlacePredictions,
  getPlaceDetails,
} = useGoogleMaps(props.apiKey);

const addressQuery = ref('');
const showDropdown = ref(false);
const isPredictionSelected = ref(false);
const isSearching = ref(false);
const selectedPlaceId = ref<string | null>(null);
const searchContainer = ref<HTMLElement | null>(null);
const loadingPredictions = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  initGoogleMaps();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target as Node)
  ) {
    showDropdown.value = false;
  }
};

const handleInput = () => {
  isPredictionSelected.value = false;
  if (!addressQuery.value) {
    predictions.value = [];
    showDropdown.value = false;
    loadingPredictions.value = false;
    if (debounceTimer) clearTimeout(debounceTimer);
    return;
  }

  // Debounce logic: wait 800ms after typing stops
  loadingPredictions.value = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    getPlacePredictions(addressQuery.value);
    showDropdown.value = true;
    loadingPredictions.value = false;
  }, 1000);
};

const onFocus = () => {
  if (predictions.value.length) showDropdown.value = true;
};

const selectPrediction = (
  prediction: google.maps.places.AutocompletePrediction
) => {
  addressQuery.value = prediction.description;
  showDropdown.value = false;
  isPredictionSelected.value = true;
  selectedPlaceId.value = prediction.place_id;
};

const clearInput = () => {
  addressQuery.value = '';
  predictions.value = [];
  showDropdown.value = false;
  isPredictionSelected.value = false;
  selectedPlaceId.value = null;
};

const onSearch = async () => {
  if (!isPredictionSelected.value || !selectedPlaceId.value) return;

  isSearching.value = true;
  try {
    const place = await getPlaceDetails(selectedPlaceId.value);
    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      emit('search', { lat, lng });
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  } finally {
    isSearching.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
