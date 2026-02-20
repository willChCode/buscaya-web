
<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { useRevistaStore } from '@/stores/revista.store';
import Dialog from '~/components/Dialog.vue';
import RevistaSkeleton from '~/components/RevistaSkeleton.vue';

const locationStore = useUbicacionNegocios();
const revistaStore = useRevistaStore();

const isDialogOpen = ref(false);
const selectedImage = ref('');

const openImage = (image: string) => {
  selectedImage.value = image;
  isDialogOpen.value = true;
};

// --- DATA FETCHING ---
const loadData = async () => {
  if (locationStore.ubicacion) {
    const { lat, lng } = locationStore.ubicacion;
    await revistaStore.fetchRevistas(lat, lng);
  }
};

// Watch for location changes to refetch ads
watch(() => locationStore.ubicacion, () => {
  loadData();
}, { deep: true });

// Watch for radius changes
watch(() => locationStore.filtros.radius, () => {
  loadData();
});

// --- COMPUTED ---
const ads = computed(() => {
  return revistaStore.revistas;
});

onMounted(() => {
  loadData();
});

definePageMeta({
  paddingClass: 'px-0'
});
</script>

<template>
  <div class="w-full px-0 pb-20 pt-6 md:px-4">
    
    <!-- Title / Header -->
    <!-- <div class="max-w-[1700px] mx-auto mb-8 pl-2">
       <h1 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
         Revista <span class="text-primary-500">Digital</span>
       </h1>
       <p class="text-gray-500 mt-2 text-lg">Descubre las mejores promociones y negocios de tu zona.</p>
    </div> -->

    <!-- Loading State -->
    <div v-if="revistaStore.loading && revistaStore.revistas.length === 0" class="w-full max-w-[1700px] mx-auto min-h-[500px] flex items-center justify-center">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!revistaStore.loading && revistaStore.revistas.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-6">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
         </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Sin contenido por ahora</h3>
      <p class="text-gray-500 max-w-sm mx-auto">No hay revistas disponibles en esta ubicación. Intenta cambiar el radio de búsqueda.</p>
    </div>

    <div v-else class="w-full max-w-[1700px] mx-auto">
      
      <!-- UNIFIED SEQUENTIAL GRID with Mixed Sizes -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-[6px] md:gap-3">
          <div 
            v-for="ad in ads"
            :key="ad._id"
            @click="openImage(ad.imagen.url)"
            :class="[
              'group relative rounded-[15px] md:rounded-[1.3rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-[250px] md:h-[450px]',
              ad.plan === 'premium' ? 'col-span-2' : 'col-span-1'
            ]"
          >
              <img 
                :src="ad.imagen.url" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                :alt="ad.plan"
              />
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <!-- Badges -->
              <div class="absolute top-4 right-4 md:top-6 md:right-6">
                <!-- Premium Badge -->
                <span 
                  v-if="ad.plan === 'premium'" 
                  class="bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-[10px] md:text-[11px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl uppercase tracking-widest shadow-lg border border-yellow-200/20"
                >
                  Premium
                </span>
                
                <!-- Gold Badge -->
                <span 
                   v-else-if="ad.plan === 'gold'" 
                   class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg uppercase tracking-widest shadow-lg"
                 >
                   Gold
                 </span>

                 <!-- Silver Badge -->
                  <span 
                   v-else
                   class="bg-gray-800/80 backdrop-blur text-white text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg uppercase tracking-widest border border-white/10"
                 >
                   Silver
                 </span>
              </div>

              <!-- Optional: Bottom Content for context -->
               <div class="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="flex justify-end">
                     <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                     </div>
                  </div>
               </div>
          </div>
      </div>

    </div>

    <!-- Dialog -->
    <Dialog
      v-model="isDialogOpen"
      widthClass="w-auto max-w-6xl mx-auto p-0 bg-transparent shadow-none"
    >
      <div
        class="relative bg-black rounded-[12px] overflow-hidden flex items-center justify-center"
      >
        <img
          :src="selectedImage"
          class="max-w-full max-h-[90vh] object-contain"
          alt="Publicidad Completa"
        />
      </div>
    </Dialog>
  </div>
</template>
