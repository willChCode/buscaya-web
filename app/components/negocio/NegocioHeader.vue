<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { obtenerEstadoNegocio } from '@/utils/horarios';

const props = defineProps<{
  negocio: any;
}>();

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
  return images.length > 0 ? images : [{ url: 'https://placehold.co/600x400?text=Sin+Imagen' }];
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
  <div class="flex flex-col gap-0">
    <div
      class="relative w-full h-52 lg:h-60 md:rounded-xl overflow-hidden md:shadow-lg group shrink-0 mb-2"
    >
      <!-- Gallery Container -->
      <div
        ref="scrollContainer"
        @scroll="handleScroll"
        class="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
        style="scrollbar-width: none; -ms-overflow-style: none;"
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
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"
          ></div>
        </div>
      </div>

      <!-- Dots Indicators -->
      <div
        v-if="galleryImages.length > 1"
        class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10"
      >
        <button
          v-for="(_, idx) in galleryImages"
          :key="idx"
          @click.stop="scrollTo(idx)"
          class="w-2 h-2 rounded-full transition-all duration-300 shadow-sm"
          :class="activeIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'"
        ></button>
      </div>

      <!-- Status Badge -->
      <div
        class="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 transition-colors z-20"
      >
        <span
          class="w-2.5 h-2.5 rounded-full animate-pulse"
          :class="estadoNegocio?.clase"
        ></span>
        {{ estadoNegocio?.texto }}
      </div>
    </div>

    <div class="shrink-0 mb-3 px-4 md:px-0">
      <h2
        class="text-2xl font-bold text-gray-900 leading-tight tracking-tight"
      >
        {{ negocio.nombre?.charAt(0).toUpperCase() + negocio.nombre?.slice(1) }}
      </h2>
      <p class="text-gray-500 text-sm mt-1 leading-relaxed">
        {{ negocio.descripcionCorta || negocio.descripcion }}
      </p>
    </div>
  </div>
</template>
