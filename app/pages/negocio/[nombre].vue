<template>
  <div
    class="bg-gray-50 pb-20 pt-4 md:pt-8 lg:pb-0 lg:h-[calc(100vh-110px)] lg:overflow-hidden lg:flex lg:flex-col"
  >
    <div class="px-3 md:px-8 w-full flex-1 min-h-0 flex flex-col">
      <!-- Error State -->
      <div
        v-if="error"
        class="bg-red-50 text-red-500 p-6 rounded-2xl text-center"
      >
        <p class="font-bold text-lg">No se pudo cargar el negocio</p>
        <p class="text-sm mt-2">{{ error.statusMessage || error.message }}</p>
        <button @click="refresh()" class="mt-4 text-primary-600 underline">
          Reintentar
        </button>
      </div>

      <!-- Content -->
      <div
        v-else-if="negocio"
        class="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr_0.95fr] gap-8 relative flex-1 min-h-0"
      >
        <!-- Columna Izquierda: Info, Contacto, Horarios -->
        <div
          class="flex flex-col gap-0 lg:h-full lg:overflow-y-auto no-scrollbar pb-6 lg:pb-[70px]"
        >
          <NegocioHeader :negocio="negocio" />
          <NegocioLocation :negocio="negocio" />
          <NegocioHours :negocio="negocio" />
          <NegocioContact :negocio="negocio" @rate="handleRate" />

          <!-- Reclamar negocio (solo si aún no tiene dueño) -->
          <div
            v-if="!negocio.tieneDueno"
            class="mt-4 bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-center gap-3"
          >
            <div class="flex-1">
              <p class="font-bold text-gray-800 text-sm">¿Es tu negocio?</p>
              <p class="text-xs text-gray-500 mt-0.5">
                Reclámalo gratis para editar tu información y ver cuántas personas te visitan.
              </p>
            </div>
            <a
              :href="urlReclamar"
              target="_blank"
              rel="noopener"
              class="shrink-0 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Reclamar
            </a>
          </div>
        </div>

        <!-- Columna Central: Menú -->
        <div
          class="lg:h-full lg:overflow-y-auto no-scrollbar pb-6 lg:pb-[70px]"
        >
          <NegocioMenu :negocio="negocio" class="h-full" />
        </div>

        <!-- Columna Derecha: Reseñas -->
        <div
          class="lg:h-full lg:overflow-y-auto no-scrollbar pb-6 lg:pb-[70px]"
        >
          <NegocioReviews
            :negocio="negocio"
            class="h-full"
            @write-review="handleRate"
          />
        </div>
      </div>
      
      <!-- Espaciador global para que la barra flotante no tape contenido en móvil -->
      <div class="h-32 md:hidden"></div>
    </div>

    <!-- Modals -->
    <Dialog v-model="showReviewModal" widthClass="w-full mx-auto max-w-lg">
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
              @click="enviarResena(negocio)"
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
              <span v-else>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
    <LoginModal v-model:isOpen="showLoginModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth.store';
import { obtenerNegocioPorId, registrarVisita } from '~/services/negocio';
import { urlNegocio, extraerIdDeSlug, SITE_URL } from '~/utils/helpers';
import { negocioVisible, schemaLocalBusiness } from '~/utils/seo-negocio';
import Dialog from '~/components/Dialog.vue';
import NegocioHeader from '~/components/negocio/NegocioHeader.vue';
import NegocioContact from '~/components/negocio/NegocioContact.vue';
import NegocioHours from '~/components/negocio/NegocioHours.vue';
import NegocioMenu from '~/components/negocio/NegocioMenu.vue';
import NegocioLocation from '~/components/negocio/NegocioLocation.vue';
import NegocioReviews from '~/components/negocio/NegocioReviews.vue';
import LoginModal from '~/components/auth/LoginModal.vue';
import { useNegocioReviews } from '~/composables/useNegocioReviews';

const route = useRoute();
const authStore = useAuthStore();

definePageMeta({
  paddingClass: 'p-0',
});

// URLs antiguas: /negocio/<slug>?id=<id>  →  /negocio/<slug>-<id>
const idLegacy = typeof route.query.id === 'string' ? route.query.id : null;
const id = extraerIdDeSlug(route.params.nombre) || idLegacy;

if (!id) {
  throw createError({ statusCode: 404, statusMessage: 'Negocio no encontrado', fatal: true });
}

const tokenCookie = useCookie('auth_token');

const { data: negocio, error, refresh } = await useAsyncData(
  `negocio-${id}`,
  () => obtenerNegocioPorId(id, tokenCookie.value),
  {
    // No mandamos al HTML los datos del dueño (nombre/correo), solo si existe
    transform: (n) => {
      if (!n) return n;
      const { usuarioId, ...resto } = n;
      return { ...resto, tieneDueno: !!usuarioId };
    },
  }
);

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: 'Negocio no encontrado', fatal: true });
}

// Redirección 301 si la URL no es la canónica (slug viejo, ?id=, nombre cambiado)
if (negocio.value) {
  const canonica = urlNegocio(negocio.value);
  if (route.path !== canonica || idLegacy) {
    await navigateTo(canonica, { redirectCode: 301, replace: true });
  }
}

// --- SEO ---
const urlCanonica = computed(() => negocio.value ? `${SITE_URL}${urlNegocio(negocio.value)}` : undefined);
const descripcionSeo = computed(() => {
  const n = negocio.value;
  if (!n) return '';
  if (n.descripcion) return n.descripcion.slice(0, 160);
  return `${n.nombre}: ${n.categoria || 'negocio local'}${n.colonia ? ` en ${n.colonia}` : ''}. Consulta horarios, teléfono, ubicación y reseñas en Buscaya.`;
});

useSeoMeta({
  title: () => negocio.value ? `${negocio.value.nombre} - ${negocio.value.categoria || 'Negocio'} | Buscaya` : 'Buscaya',
  description: descripcionSeo,
  ogTitle: () => negocio.value?.nombre,
  ogDescription: descripcionSeo,
  ogImage: () => negocio.value?.portada?.url || `${SITE_URL}/seo-buscaya.jpg`,
  ogUrl: urlCanonica,
  ogType: 'website',
  // Negocio con "derecho de piso" vencido: la ficha se ve, pero Google no la indexa
  robots: () => (negocio.value && !negocioVisible(negocio.value) ? 'noindex, follow' : undefined),
});

useHead({
  link: () => urlCanonica.value ? [{ rel: 'canonical', href: urlCanonica.value }] : [],
  script: () => negocio.value
    ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(schemaLocalBusiness(negocio.value)) }]
    : [],
});

// Botón "Reclamar": abre WhatsApp de Buscaya con los datos del negocio
const WHATSAPP_BUSCAYA = '528110720923';
const urlReclamar = computed(() => {
  const n = negocio.value;
  if (!n) return '#';
  const correo = authStore.user?.email ? ` Mi correo en Buscaya es ${authStore.user.email}.` : '';
  const texto = `Hola, soy el dueño de "${n.nombre}" (ID ${n._id}) y quiero reclamar mi negocio en Buscaya.${correo}`;
  return `https://wa.me/${WHATSAPP_BUSCAYA}?text=${encodeURIComponent(texto)}`;
});

// La visita se cuenta solo en el navegador (no en SSR ni bots)
onMounted(() => {
  if (negocio.value?._id) {
    registrarVisita(negocio.value._id).catch((err) =>
      console.error('Error tracking visit:', err)
    );
  }
});

const showLoginModal = ref(false);

const handleRate = () => {
  if (!authStore.user?.token) {
    showLoginModal.value = true;
    return;
  }
  showReviewModal.value = true;
};

const hoverRating = ref(0);

const {
  showReviewModal,
  nuevaResena,
  enviando,
  feedbackActual,
  esFormularioValido,
  closeReviewModal,
  enviarResena,
} = useNegocioReviews(negocio);
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
