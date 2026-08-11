<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { obtenerEstadoNegocio } from '@/utils/horarios';

const props = defineProps<{
  negocio: any;
}>();

const router = useRouter();
const goBack = () => {
  router.back();
};

const activeIndex = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);

const galleryImages = computed(() => {
  const images = [];
  if (props.negocio?.portada) {
    images.push(props.negocio.portada);
  }
  if (props.negocio?.galeria && Array.isArray(props.negocio.galeria)) {
    images.push(...props.negocio.galeria);
  }
  return images.length > 0
    ? images
    : [{ url: 'https://placehold.co/600x400?text=Sin+Imagen' }];
});

const estadoNegocio = computed(() => {
  if (!props.negocio || !props.negocio.horarios) return null;
  return obtenerEstadoNegocio(props.negocio.horarios);
});

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const scrollLeft = scrollContainer.value.scrollLeft;
  const width = scrollContainer.value.offsetWidth;
  activeIndex.value = Math.round(scrollLeft / width);
};

const scrollTo = (index: number) => {
  if (!scrollContainer.value) return;
  const width = scrollContainer.value.offsetWidth;
  scrollContainer.value.scrollTo({
    left: width * index,
    behavior: 'smooth',
  });
  activeIndex.value = index;
};
</script>

<template>
  <div class="flex flex-col gap-0 mb-5">
    <!-- Image Header -->
    <div
      class="relative w-full h-52 lg:h-[280px] rounded-2xl overflow-hidden group shrink-0 mb-1.5"
    >
      <!-- Gallery Container -->
      <div
        ref="scrollContainer"
        @scroll="handleScroll"
        class="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <div
          v-for="(img, idx) in galleryImages"
          :key="idx"
          class="w-full h-full shrink-0 snap-center relative"
        >
          <img
            :src="img.url || 'https://placehold.co/600x400?text=Sin+Imagen'"
            class="w-full h-full object-cover"
            alt="Imagen del negocio"
          />
        </div>
      </div>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all z-20 active:scale-95"
        aria-label="Volver"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- Status Badge (Top Right) -->
      <div
        v-if="estadoNegocio"
        class="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 transition-colors z-20"
      >
        <span
          class="w-2.5 h-2.5 rounded-full animate-pulse"
          :class="estadoNegocio?.clase"
        ></span>
        {{ estadoNegocio?.texto }}
      </div>
    </div>

    <!-- Thumbnails Gallery -->
    <div
      v-if="galleryImages.length > 1"
      class="flex gap-2 overflow-x-auto mb-3 px-4 md:px-0 scrollbar-hide py-1"
    >
      <button
        v-for="(img, idx) in galleryImages"
        :key="idx"
        @click="scrollTo(idx)"
        class="relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors"
        :class="
          activeIndex === idx
            ? 'border-primary-500'
            : 'border-transparent hover:border-gray-200'
        "
      >
        <img
          :src="img.url || img"
          class="w-full h-full object-cover"
          alt="miniatura"
        />
        <div
          v-if="activeIndex !== idx"
          class="absolute inset-0 bg-black/10"
        ></div>
      </button>
    </div>

    <!-- External Info -->
    <div class="shrink-0 mb-3 px-4 md:px-0 flex flex-col gap-3">
      <!-- Title -->
      <h2
        class="text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-800"
      >
        {{ negocio.nombre?.charAt(0).toUpperCase() + negocio.nombre?.slice(1) }}
      </h2>
      <!-- Categoria, Grupo y Badges (Modalidad) en una sola línea -->
      <div
        class="flex items-center justify-between gap-3 flex-wrap w-full -mt-3"
      >
        <div
          class="flex items-center gap-1.5 text-sm text-gray-500 font-medium"
        >
          <span v-if="negocio.grupo">{{ negocio.grupo }}</span>
          <span v-if="negocio.grupo && negocio.categoria">•</span>
          <span v-if="negocio.categoria">{{ negocio.categoria }}</span>
        </div>

        <div class="flex items-center gap-2">
          <div
            v-if="negocio.modalidad && negocio.modalidad.includes('local')"
            class="bg-primary-900 text-white shadow-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Local
          </div>
          <div
            v-if="negocio.modalidad && negocio.modalidad.includes('domicilio')"
            class="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            A domicilio
          </div>
        </div>
      </div>

      <!-- Info Pricing & Payment -->
      <div
        class="flex items-center justify-between border-y border-gray-100 py-3 mt-1"
      >
        <div>
          <p class="text-[10px] font-bold text-gray-400 tracking-wider mb-1">
            PRECIO ESTIMADO
          </p>
          <p class="text-sm font-bold text-emerald-600">
            <span v-if="negocio.rangoPrecio?.min || negocio.rangoPrecio?.max">
              ${{ negocio.rangoPrecio.min || 0 }} - ${{
                negocio.rangoPrecio.max || 0
              }}
            </span>
            <span v-else>No especificado</span>
          </p>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-bold text-gray-400 tracking-wider mb-1">
            ACEPTA
          </p>
          <div class="flex items-center justify-end gap-1.5 text-gray-500">
            <svg
              v-if="negocio.metodosPago?.includes('efectivo')"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              title="Efectivo"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <svg
              v-if="negocio.metodosPago?.includes('tarjeta')"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              title="Tarjeta"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <svg
              v-if="negocio.metodosPago?.includes('transferencia')"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              title="Transferencia"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span
              v-if="!negocio.metodosPago || negocio.metodosPago.length === 0"
              class="text-xs text-gray-400"
              >N/A</span
            >
          </div>
        </div>
      </div>

      <div v-if="negocio.descripcion" class="mt-2">
        <h3
          class="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2 uppercase tracking-wide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Acerca del negocio
        </h3>
        <p class="text-gray-500 text-sm leading-relaxed">
          {{ negocio.descripcion }}
        </p>
      </div>
    </div>
  </div>
</template>
