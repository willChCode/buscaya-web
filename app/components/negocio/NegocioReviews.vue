<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl border border-gray-100 relative"
  >
    <div
      class="p-4 px-6 md:px-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex flex-col rounded-t-2xl"
    >
      <h3 class="font-bold text-lg text-gray-800">Opiniones</h3>
      <div class="flex items-end gap-3 mt-1">
        <div class="text-4xl font-black text-gray-900 leading-none">
          {{ negocio.promedio }}
        </div>
        <div class="pb-0.5">
          <div class="flex text-yellow-400 text-sm">★★★★★</div>
          <p class="text-xs text-gray-400 font-medium">
            {{ negocio.totalReseñas || 0 }} Opiniones
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 p-4 px-6 md:px-4 pb-[100px]">
      <div class="mb-5">
        <button
          @click="$emit('write-review')"
          class="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-bold hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white"
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

      <div class="space-y-4 pr-1">
        <div
          v-for="(review, idx) in reseñasOrdenadas"
          :key="idx"
          class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <img
                v-if="review.usuario?.image?.url && !brokenImages[idx]"
                :src="review.usuario.image.url"
                class="w-7 h-7 rounded-full object-cover shadow-sm"
                alt="Avatar"
                @error="brokenImages[idx] = true"
              />
              <div
                v-else
                :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm',
                  getAvatarBg(),
                ]"
              >
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
          v-if="reseñasOrdenadas.length === 0"
          class="text-sm text-gray-400 italic text-center py-6"
        >
          Sé el primero en opinar.
        </div>
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
  const reviews = props.negocio?.reseñas || props.negocio?.resenas;
  if (!reviews || !Array.isArray(reviews)) return [];
  return [...reviews].sort((a: any, b: any) => {
    const dateA = new Date(a.fecha || a.createdAt || 0).getTime();
    const dateB = new Date(b.fecha || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
});

defineEmits(['write-review']);
</script>
