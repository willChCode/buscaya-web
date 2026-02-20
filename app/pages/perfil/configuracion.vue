<template>
  <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-8 min-h-[400px]">
    
    <div class="flex items-center gap-4 mb-8">
         <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
        <div>
            <h1 class="text-[22px] sm:text-2xl font-bold text-gray-900">Configuración</h1>
            <p class="text-gray-500 text-sm">Ajusta tus preferencias de búsqueda y aplicación.</p>
        </div>
    </div>

    <div class="space-y-8 max-w-3xl">
        
        <!-- Rango de Búsqueda -->
        <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Rango de Búsqueda</h3>
            <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <button 
                    v-for="dist in searchDistances" 
                    :key="dist"
                    @click="setSearchRadius(dist)"
                    class="w-full flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left"
                >
                    <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg v-if="dist === 20000" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span class="font-medium" :class="localRadius === dist ? 'text-primary-600' : 'text-gray-900'">
                            {{ dist === 20000 ? 'Área Metropolitana (20km)' : `${dist / 1000} km a la redonda` }}
                        </span>
                    </div>
                    <svg v-if="localRadius === dist" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </section>

        <!-- Unidades de Medida -->
         <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Unidades de Medida</h3>
            <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <button @click="setDistanceUnit('km')" class="w-full flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-left">
                     <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                             <span class="block font-medium" :class="localUnit === 'km' ? 'text-primary-600' : 'text-gray-900'">Kilómetros (km/m)</span>
                             <span class="text-xs text-gray-500">Sistema métrico</span>
                        </div>
                    </div>
                     <svg v-if="localUnit === 'km'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </button>
                 <button @click="setDistanceUnit('mi')" class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
                     <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                         <div>
                             <span class="block font-medium" :class="localUnit === 'mi' ? 'text-primary-600' : 'text-gray-900'">Millas (millas/pies)</span>
                             <span class="text-xs text-gray-500">Sistema imperial</span>
                        </div>
                    </div>
                     <svg v-if="localUnit === 'mi'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </button>

            </div>
        </section>

        <!-- Rendimiento -->
         <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Rendimiento</h3>
             <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <div class="flex items-center justify-between p-4 bg-white">
                    <div class="flex items-center gap-4 flex-1">
                         <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <span class="block font-medium text-gray-900">Caché de Imágenes</span>
                            <span class="text-xs text-gray-500 block">Guardar imágenes para cargar más rápido (Simulado en Web)</span>
                        </div>
                    </div>
                     <button 
                        @click="settingsStore.toggleImageCache()"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        :class="settingsStore.imageCacheEnabled ? 'bg-primary-500' : 'bg-gray-200'"
                     >
                        <span 
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="settingsStore.imageCacheEnabled ? 'translate-x-5' : 'translate-x-0'"
                        />
                     </button>
                </div>
             </div>
         </section>

         <!-- Información Legal -->
         <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Información Legal</h3>
             <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
                <NuxtLink to="/terminos" class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
                     <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                         <div>
                             <span class="block font-medium text-gray-900">Términos y Condiciones</span>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </NuxtLink>
                 <NuxtLink to="/privacidad" class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
                     <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                         <div>
                             <span class="block font-medium text-gray-900">Política de Privacidad</span>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </NuxtLink>
             </div>
         </section>

         <!-- Zona de Peligro -->
         <section>
            <h3 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 ml-1">Zona de Peligro</h3>
             <div class="bg-red-50 rounded-2xl overflow-hidden border border-red-100">
                <button @click="handleDeleteAccount" class="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 transition-colors text-left group">
                     <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <span class="block font-medium text-red-600">Eliminar Cuenta</span>
                            <span class="text-xs text-red-400 block">Esta acción no se puede deshacer</span>
                        </div>
                    </div>
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-300 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
             </div>
         </section>

    </div>
    
    <!-- Save Actions -->
    <div class="sticky bottom-0 mt-8 -mb-4 -mx-4 sm:-mb-8 sm:-mx-8 p-4 bg-white border-t border-gray-100 flex justify-end">
        <button 
            @click="saveChanges" 
            :disabled="isSaving"
            class="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            <svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings.store';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { ref } from 'vue';

const settingsStore = useSettingsStore();
const ubicacionStore = useUbicacionNegocios();

// Local state for batch updates
const localRadius = ref(ubicacionStore.filtros.radius || 20000);
const localUnit = ref(settingsStore.distanceUnit);
const isSaving = ref(false);

const searchDistances = [3000, 5000, 10000, 20000];

// Only update local state
const setSearchRadius = (radius: number) => {
    localRadius.value = radius;
};

const setDistanceUnit = (unit: 'km' | 'mi') => {
    localUnit.value = unit;
};

const saveChanges = async () => {
    isSaving.value = true;
    
    // Commit changes to stores
    ubicacionStore.setFiltros({ radius: localRadius.value });
    settingsStore.setDistanceUnit(localUnit.value);
    
    // Optional: force data refresh if radius changed
    if (ubicacionStore.filtros.radius !== localRadius.value) {
         // ubicacionStore.actualizarDatos(true); // Let watchers handle it
    }

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    isSaving.value = false;
    alert('Cambios guardados correctamente.');
};

const handleDeleteAccount = async () => {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar tu cuenta permanentemente? Esta acción no se puede deshacer.');
    if (confirmed) {
        // TODO: Implement delete account API call
        alert('Funcionalidad de eliminar cuenta en desarrollo (Seguridad).');
    }
}

definePageMeta({
  middleware: ['auth']
});
</script>
