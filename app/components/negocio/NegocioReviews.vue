<template>
  <div class="lg:col-span-4 flex flex-col h-full overflow-hidden">
    <div class="mb-4 sticky top-0 bg-white z-10 pb-2 px-4 md:px-0">
      <h3 class="font-bold text-lg text-gray-800">Opiniones</h3>
      <div class="flex items-end gap-3 mt-2">
        <div class="text-5xl font-black text-gray-900">
          {{ negocio.promedio }}
        </div>
        <div class="pb-1">
          <div class="flex text-yellow-400 text-sm">★★★★★</div>
          <p class="text-xs text-gray-400 font-medium">
            {{ negocio.totalReseñas || 0 }} Opiniones
          </p>
        </div>
      </div>
    </div>

    <div class="mb-6 px-4 md:px-0">
      <button
        @click="$emit('write-review')"
        class="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-bold hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
        Escribir una opinión
      </button>
    </div>

    <div
      class="overflow-y-auto flex-1 min-h-0 px-4 md:px-0 pr-2 space-y-4 max-h-[400px] lg:max-h-full"
    >
      <div
        v-for="(review, idx) in reseñasOrdenadas"
        :key="idx"
        class="border-b border-gray-100 pb-4 last:border-0"
      >
        <div class="flex justify-between items-start mb-1">
          <div class="flex items-center gap-2">
             <img 
               v-if="review.usuario?.image?.url && !brokenImages[idx]" 
               :src="review.usuario.image.url" 
               class="w-6 h-6 rounded-full object-cover"
               alt="Avatar"
               @error="brokenImages[idx] = true"
             />
             <div v-else :class="['w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm', getAvatarBg()]">
                {{ review.usuario?.nombre?.charAt(0).toUpperCase() || 'A' }}
             </div>
             <span class="font-bold text-sm text-gray-800">{{
              review.usuario?.nombre || 'Anónimo'
            }}</span>
          </div>

          <span
            class="text-xs font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded"
            >★ {{ review.calificacion }}</span
          >
        </div>
        <p class="text-sm text-gray-600 leading-snug">
          "{{ review.comentario }}"
        </p>
      </div>

      <div
        v-if="!negocio.reseñas || negocio.reseñas.length === 0"
        class="text-sm text-gray-400 italic"
      >
        Sé el primero en opinar.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  negocio: any;
}>();

const brokenImages = ref<Record<number, boolean>>({});

const getAvatarBg = () => {
  return 'bg-gray-400';
};

const reseñasOrdenadas = computed(() => {
  if (!props.negocio?.reseñas) return [];
  return [...props.negocio.reseñas].sort((a: any, b: any) => {
    const dateA = new Date(a.fecha || a.createdAt || 0).getTime();
    const dateB = new Date(b.fecha || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
});

defineEmits(['write-review']);
</script>
