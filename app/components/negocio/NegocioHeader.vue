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
      class="relative w-full h-auto lg:h-[280px] rounded-2xl overflow-hidden group shrink-0 mb-1.5"
    >
      <!-- Gallery Container -->
      <div
        ref="scrollContainer"
        @scroll="handleScroll"
        class="flex overflow-x-auto snap-x snap-mandatory w-full h-auto lg:h-full scrollbar-hide"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <div
          v-for="(img, idx) in galleryImages"
          :key="idx"
          class="w-full h-auto lg:h-full shrink-0 snap-center relative"
        >
          <img
            :src="img.url || 'https://placehold.co/600x400?text=Sin+Imagen'"
            class="w-full h-auto lg:h-full object-cover"
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
      class="flex gap-2 overflow-x-auto mb-1.5 scrollbar-hide py-1"
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
    <div class="shrink-0 mb-3 flex flex-col gap-3 mt-4">
      <!-- Title -->
      <h2
        class="text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-800"
      >
        {{ negocio.nombre?.charAt(0).toUpperCase() + negocio.nombre?.slice(1) }}
      </h2>
      <!-- Categoria, Grupo -->
      <div class="flex items-center gap-1.5 text-sm text-gray-500 font-medium w-full -mt-2">
        <span v-if="negocio.grupo">{{ negocio.grupo }}</span>
        <span v-if="negocio.grupo && negocio.categoria">•</span>
        <span v-if="negocio.categoria">{{ negocio.categoria }}</span>
      </div>

      <!-- Badges (Modalidad) y Redes Sociales (Móvil) -->
      <div class="flex items-center flex-wrap justify-start gap-3 w-full mt-1">
        <div v-if="negocio.modalidad && (negocio.modalidad.includes('local') || negocio.modalidad.includes('domicilio'))" class="flex items-center flex-wrap gap-2">
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
            class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
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
                d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M9 17h6M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
            A domicilio
          </div>
        </div>

        <!-- Redes Sociales (Solo Móvil - Tamaño mini) -->
        <div class="flex items-center gap-1.5 md:hidden">
            <a v-if="negocio.contacto?.facebook" :href="negocio.contacto.facebook" target="_blank" class="w-6 h-6 flex items-center justify-center rounded-full bg-[#1877F2] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a v-if="negocio.contacto?.instagram" :href="negocio.contacto.instagram" target="_blank" class="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a v-if="negocio.contacto?.tiktok" :href="negocio.contacto.tiktok" target="_blank" class="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.39-2.92 5.61-1.77 1.22-4.05 1.5-6.08.75-2.03-.74-3.61-2.43-4.2-4.48-.59-2.05-.2-4.291 1.07-5.981 1.27-1.691 3.32-2.611 5.4-2.521V14.3c-1.391-.07-2.771.55-3.561 1.66-.8 1.11-.96 2.63-.39 3.86.57 1.23 1.83 2.1 3.19 2.2 1.36.1 2.76-.44 3.55-1.54.79-1.1.96-2.59.88-3.95V.02h-1.02Z"/></svg>
            </a>
            <a v-if="negocio.contacto?.pagina_web || negocio.contacto?.web" :href="negocio.contacto.pagina_web || negocio.contacto.web" target="_blank" class="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            </a>
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
          class="font-bold text-gray-800 mb-4 text-lg md:text-sm md:uppercase md:tracking-wide flex items-center gap-2"
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
