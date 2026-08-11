<script setup>
import { defineProps } from 'vue';

// Define las propiedades que este componente recibirá
defineProps({
  promocion: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
</script>

<template>
  <div
    class="rounded-lg w-[320px] md:w-[350px] flex-shrink-0 cursor-pointer overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <img
      :src="promocion.imagen"
      alt=""
      class="h-[195px] md:h-[210px] w-full object-cover transition-transform duration-500 hover:scale-105"
    />
  </div>
</template>
