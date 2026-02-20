<template>
  <div class="pb-2 bg-white">
    <div class="flex items-center justify-between mb-4">
      <h1 class="font-bold text-gray-800 text-lg md:text-xl">
        {{ title }}
        <span v-if="count">({{ count }})</span>
      </h1>
      <div class="flex items-center space-x-4">
        <NuxtLink
          v-if="linkTo"
          :to="linkTo"
          class="text-sm font-semibold text-green-600 hover:text-green-700"
        >
          {{ linkText }}
        </NuxtLink>

        <div class="hidden md:flex space-x-2 text-gray-500">
          <button
            @click="scroll('left')"
            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="scroll('right')"
            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      ref="sliderRef"
      class="flex overflow-x-scroll scroll-smooth no-scrollbar"
      :class="gapClass"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  linkText: {
    type: String,
    default: 'Ver más',
  },
  linkTo: {
    type: String,
    default: '',
  },
  gapClass: {
    type: String,
    default: 'gap-3',
  },
});

const sliderRef = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (sliderRef.value) {
    const scrollAmount = 300;
    if (direction === 'left') {
      sliderRef.value.scrollLeft -= scrollAmount;
    } else {
      sliderRef.value.scrollLeft += scrollAmount;
    }
  }
};
</script>

<style>
/* 1. Ocultar scrollbar en navegadores basados en WebKit (Chrome, Safari, Edge) */
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important; /* Asegura fondo transparente */
}

/* 2. Ocultar scrollbar en Firefox */
.no-scrollbar {
  -ms-overflow-style: none !important; /* IE and Edge */
  scrollbar-width: none !important; /* Firefox */
}
</style>
