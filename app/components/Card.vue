<script setup lang="ts">
import type { Negocio } from '@/interfaces/negocio.type';
import { obtenerEstadoNegocio } from '@/utils/horarios';
import { computed } from 'vue';

import { useSettingsStore } from '@/stores/settings.store';

const props = defineProps<{
  negocio: Negocio;
  fullWidth?: boolean;
  compactMode?: boolean;
}>();
const settingsStore = useSettingsStore();

const estado = computed(() => obtenerEstadoNegocio(props.negocio.horarios));

// Helper to format distance
const formattedDistance = computed(() => {
    const dist = props.negocio.distancia || 0;
    const unit = settingsStore.distanceUnit;
    
    if (unit === 'mi') {
        const miles = dist * 0.000621371;
        if (miles < 0.1) return `${Math.round(dist * 3.28084)}ft`; // Show feet for very short distances
        return `${miles.toFixed(1)}mi`;
    }
    
    // Default km
    if (dist < 1000) return `${Math.round(dist)}m`;
    return `${(dist / 1000).toFixed(1)}km`;
});
</script>

<template>
  <div
    class="flex-shrink-0 cursor-pointer bg-white rounded-xl border border-gray-200 hover:shadow-lg transition duration-300"
    :class="fullWidth ? 'w-full' : 'w-[285px]'"
  >
    <div class="relative">
      <img
        :src="negocio?.portada?.url || 'https://placehold.co/600x400'"
        :alt="negocio?.nombre"
        :class="compactMode ? 'h-[130px] md:h-[155px]' : 'h-[155px]'"
        class="w-full object-cover rounded-t-xl bg-gray-100"
      />

      <!-- Status Badge - TOP RIGHT -->
       <div class="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
            <div 
                class="w-2 h-2 rounded-full"
                :class="estado.abierto ? 'bg-green-500' : 'bg-red-500'"
            ></div>
           <span class="text-gray-900 text-[10px] font-bold tracking-wide uppercase">{{ estado.texto }}</span>
       </div>

      <!-- Distance Badge - BOTTOM LEFT -->
      <div class="absolute bottom-3 left-3 bg-black/60 px-2 py-[2.2px] rounded-lg backdrop-blur-md flex items-center gap-0.5">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
         <span class="text-white text-[10px] font-medium">{{ formattedDistance }}</span>
      </div>
    </div>

    <!-- Info Section -->
    <div class="px-3 py-2">
      <!-- Title -->
      <h3 class="text-[16px] font-semibold text-gray-900 leading-tight truncate mb-1">
        {{ negocio.nombre?.charAt(0).toUpperCase() + negocio.nombre?.slice(1) }}
      </h3>

      <!-- Category & Ratings -->
      <div class="flex items-center justify-between">
           <!-- Category -->
        <p class="text-gray-500 text-xs font-medium truncate flex-1 mr-2">
            {{ negocio.grupo || 'Negocio' }}
        </p>

        <!-- Rating -->
        <div class="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-md">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span class="text-xs font-bold text-gray-900 ml-1">{{ Number(negocio.promedio || 0).toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
