<template>
  <div>
    <DrawerCard
      :modelValue="isOpen"
      @update:modelValue="$emit('update:isOpen', $event)"
    >
      <div v-if="negocio" class="h-full flex flex-col lg:h-[75vh]">
        <div
          class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full lg:overflow-hidden"
        >
          <!-- Columna Izquierda: Info, Contacto, Horarios -->
          <div
            class="lg:col-span-4 flex flex-col gap-0 lg:overflow-y-auto lg:pr-4 h-full"
          >
            <NegocioHeader :negocio="negocio" />
            <NegocioContact :negocio="negocio" @rate="handleRate" />
            <NegocioLocation :negocio="negocio" />
            <NegocioHours :negocio="negocio" />
          </div>

          <!-- Columna Central: Menú -->
          <NegocioMenu :negocio="negocio" />

          <!-- Columna Derecha: Reseñas -->
          <NegocioReviews
            :negocio="negocio"
            @write-review="handleRate"
          />
        </div>
      </div>
    </DrawerCard>

    <Dialog v-model="showReviewModal">
      <div
        class="bg-white w-full mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all border"
      >
        <div
          class="bg-gray-50 px-6 py-6 border-b border-gray-100 flex flex-col items-center text-center"
        >
          <h3 class="text-xl font-extrabold text-gray-800">¿Qué te pareció?</h3>
          <p class="text-sm text-gray-500 mt-1">
            Comparte tu experiencia con
            <span class="font-bold text-gray-700">{{ negocio?.nombre }}</span>
          </p>
        </div>

        <div class="p-6 space-y-6 pt-4">
          <div class="flex flex-col items-center gap-3">
            <div class="h-16 flex items-center justify-center relative">
              <Transition name="bounce" mode="out-in">
                <div
                  v-if="!feedbackActual"
                  key="empty"
                  class="opacity-20 grayscale"
                >
                  <span class="text-5xl">😶</span>
                </div>
                <div
                  v-else
                  :key="feedbackActual.emoji"
                  class="text-center relative"
                >
                  <div
                    class="absolute inset-0 bg-yellow-400 opacity-20 blur-xl rounded-full transform scale-150"
                  ></div>
                  <span class="text-6xl relative z-10 filter drop-shadow-sm">{{
                    feedbackActual.emoji
                  }}</span>
                </div>
              </Transition>
            </div>

            <div class="flex gap-0.5">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="nuevaResena.calificacion = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="transition-transform hover:scale-110 focus:outline-none p-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 transition-colors duration-200"
                  :class="
                    (hoverRating || nuevaResena.calificacion) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-100'
                  "
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="comment"
              class="text-xs font-bold uppercase tracking-wider text-gray-400 block"
            >
              Tu comentario
            </label>
            <div class="relative">
              <textarea
                id="comment"
                v-model="nuevaResena.comentario"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl p-3 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none placeholder-gray-400"
                placeholder="Ej: La comida estuvo deliciosa y el servicio muy rápido..."
              ></textarea>
              <div class="absolute bottom-2 right-2 text-[10px] text-gray-400">
                {{ nuevaResena.comentario.length }} caracteres
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <button
              @click="closeReviewModal"
              class="px-4 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors active:scale-95"
            >
              Cancelar
            </button>
            <button
              @click="enviarResena(props.negocio)"
              :disabled="!esFormularioValido || enviando"
              class="px-4 py-3 rounded-xl font-bold text-white bg-primary-500 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:bg-primary-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
            >
              <span v-if="enviando">
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              <span v-else>Publicar Opinión</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DrawerCard from '~/components/DrawerCard.vue';
import Dialog from '~/components/Dialog.vue';
import NegocioHeader from '~/components/negocio/NegocioHeader.vue';
import NegocioContact from '~/components/negocio/NegocioContact.vue';
import NegocioHours from '~/components/negocio/NegocioHours.vue';
import NegocioMenu from '~/components/negocio/NegocioMenu.vue';
import NegocioLocation from '~/components/negocio/NegocioLocation.vue';
import NegocioReviews from '~/components/negocio/NegocioReviews.vue';
import { useNegocioReviews } from '~/composables/useNegocioReviews';

const handleRate = () => {
  if (!authStore.user?.token) {
    alert('Debes iniciar sesión para publicar una opinión.');
    return;
  }
  showReviewModal.value = true;
};

const props = defineProps<{
  isOpen: boolean;
  negocio: any;
}>();

defineEmits(['update:isOpen']);

const hoverRating = ref(0);
const authStore = useAuthStore();

const {
  showReviewModal,
  nuevaResena,
  enviando,
  feedbackActual,
  esFormularioValido,
  closeReviewModal,
  enviarResena,
} = useNegocioReviews(props.negocio);

// Registrar visita al abrir el drawer
import { registrarVisita } from '~/services/negocio';
import { watch } from 'vue';

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.negocio) {
    const id = props.negocio._id || props.negocio.id;
    if (id) {
       // Fire and forget, no bloqueamos la UI
       registrarVisita(id).catch(err => console.error('Error tracking visit:', err));
    }
  }
});
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
