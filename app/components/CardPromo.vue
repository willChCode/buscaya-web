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
    class="rounded-md w-[320px] md:w-[350px] flex-shrink-0 cursor-pointer hover:shadow-lg transition duration-300"
  >
    <img
      :src="promocion.imagen"
      alt=""
      class="h-[195px] md:h-[210px] w-full object-cover rounded-lg"
    />
  </div>
</template>
