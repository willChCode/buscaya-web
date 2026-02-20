<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/30 backdrop-blur-sm"
          @click="$emit('update:isOpen', false)"
          aria-hidden="true"
        ></div>

        <!-- Drawer Content -->
        <transition name="slide-right">
          <div
            v-if="isOpen"
            class="relative w-[90vw] md:w-full md:max-w-md bg-white h-full shadow-xl flex flex-col transform transition-transform duration-300"
          >
            <div class="p-6 flex flex-col h-full">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Filtros</h2>
                <button
                  @click="$emit('update:isOpen', false)"
                  class="p-2 -mr-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Filter Options -->
              <div class="flex-1 overflow-y-auto space-y-6 px-1">
                <!-- Radius Section -->
                <div>
                  <h3 class="font-semibold text-gray-700 mb-3">
                    Radio de búsqueda
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="opt in [3000, 5000, 10000, 20000]"
                      :key="opt"
                      @click="filtros.radius = opt"
                      :class="
                        filtros.radius === opt
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      "
                      class="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                    >
                      {{ opt < 1000 ? `${opt}m` : `${opt / 1000}km` }}
                    </button>
                  </div>
                </div>

                <!-- Availability Section -->
                <div>
                  <h3 class="font-semibold text-gray-700 mb-3">
                    Disponibilidad
                  </h3>
                  <button
                    @click="
                      filtros.abierto =
                        filtros.abierto === 'abierto' ? '' : 'abierto'
                    "
                    :class="
                      filtros.abierto === 'abierto'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white'
                    "
                    class="w-full flex items-center justify-between p-4 rounded-2xl border transition-all"
                  >
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        :class="
                          filtros.abierto === 'abierto'
                            ? 'text-primary-500'
                            : 'text-gray-400'
                        "
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        :class="
                          filtros.abierto === 'abierto'
                            ? 'text-primary-600 font-semibold text-sm md:text-base'
                            : 'text-gray-700 font-medium text-sm md:text-base'
                        "
                        >Abierto ahora</span
                      >
                    </div>
                    <div
                      class="w-11 h-6 rounded-full relative transition-colors"
                      :class="
                        filtros.abierto === 'abierto'
                          ? 'bg-primary-500'
                          : 'bg-gray-200'
                      "
                    >
                      <div
                        class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform"
                        :class="
                          filtros.abierto === 'abierto'
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        "
                      ></div>
                    </div>
                  </button>
                </div>

                <!-- Rating Section -->
                <div>
                  <h3 class="font-semibold text-gray-700 mb-3">Valoración</h3>
                  <button
                    @click="filtros.rating = filtros.rating === 4 ? 0 : 4"
                    :class="
                      filtros.rating === 4
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 bg-white'
                    "
                    class="w-full flex items-center justify-between p-4 rounded-2xl border transition-all"
                  >
                    <div class="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        :class="
                          filtros.rating === 4
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        "
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                      <span
                        :class="
                          filtros.rating === 4
                            ? 'text-yellow-600 font-semibold text-sm md:text-base'
                            : 'text-gray-700 font-medium text-sm md:text-base'
                        "
                        >Mejor valorados (4.0+)</span
                      >
                    </div>
                    <div
                      class="w-11 h-6 rounded-full relative transition-colors"
                      :class="
                        filtros.rating === 4 ? 'bg-yellow-400' : 'bg-gray-200'
                      "
                    >
                      <div
                        class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform"
                        :class="
                          filtros.rating === 4
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        "
                      ></div>
                    </div>
                  </button>
                </div>

                <!-- Categories -->
                <div>
                  <h3 class="font-semibold text-gray-700 mb-3">Categorías</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="cat in categorias"
                      :key="cat.id"
                      @click="toggleCategoria(cat.nombre)"
                      :class="
                        filtros.giro === cat.nombre
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      "
                      class="px-3 py-2 rounded-lg border text-sm text-left transition-colors truncate"
                      :title="cat.nombre"
                    >
                      {{ cat.nombre }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  @click="limpiarFiltros"
                  class="flex-1 py-2.5 md:py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Limpiar
                </button>
                <button
                  @click="aplicarFiltros"
                  class="flex-1 py-2.5 md:py-3 px-4 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30 text-sm md:text-base"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
// import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
// REMOVED Headless UI because it is not installed. Using standard Vue Transitions.

import { useUbicacionNegocios } from '@/store/ubicacion.store';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen', 'apply']);

const store = useUbicacionNegocios();

// Local state for filters before applying
const filtros = ref({
  abierto: '',
  giro: '',
  radius: 3000,
  rating: 0,
});

// Sync with store on open
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      filtros.value = {
        abierto: (store.filtros.abierto || '') as string,
        giro: store.filtros.giro || '',
        radius: store.filtros.radius || 3000,
        rating: store.filtros.rating || 0,
      };
    }
  }
);

const categorias = [
  { id: 1, nombre: 'Servicios Profesionales' },
  { id: 2, nombre: 'Comida y Bebida' },
  { id: 3, nombre: 'Hogar y Construcción' },
  { id: 4, nombre: 'Tiendas Locales' },
  { id: 5, nombre: 'Salud y Médicos' },
  { id: 6, nombre: 'Belleza y Estética' },
  { id: 7, nombre: 'Fiestas y Eventos' },
  { id: 8, nombre: 'Automotriz' },
  { id: 9, nombre: 'Mascotas' },
  { id: 10, nombre: 'Ropa y Accesorios' },
  { id: 11, nombre: 'Papelerías y Oficinas' },
  { id: 12, nombre: 'Alojamiento y Transporte' },
  { id: 13, nombre: 'Bancos y Finanzas' },
  { id: 14, nombre: 'Deporte y Gimnasios' },
  { id: 15, nombre: 'Muebles y Decoración' },
];

const toggleCategoria = (nombre: string) => {
  if (filtros.value.giro === nombre) {
    filtros.value.giro = '';
  } else {
    filtros.value.giro = nombre;
  }
};

const limpiarFiltros = () => {
  filtros.value = {
    abierto: '',
    giro: '',
    radius: 3000,
    rating: 0,
  };
};

const aplicarFiltros = () => {
  const filtersToApply: any = { ...filtros.value };

  // Mobile App Logic for Open Now
  if (filtros.value.abierto === 'abierto') {
    const now = new Date();
    const days = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];
    filtersToApply.day = days[now.getDay()];
    filtersToApply.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    filtersToApply.openNow = true;
  } else {
    filtersToApply.openNow = false;
    filtersToApply.day = undefined;
    filtersToApply.time = undefined;
  }

  store.setFiltros(filtersToApply);
  emit('apply');
  emit('update:isOpen', false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
