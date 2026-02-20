<template>
  <div class="-mx-4 md:-mx-6 px-3 md:px-6 flex justify-between py-5 bg-gray-100 transition-all duration-300">
    <div class="px-4 md:px-0 flex justify-between w-full">
      <span class="flex gap-2 justify-center items-center">
        <h1 class="text-xl font-bold">{{ pageTitle }}</h1>
        <p class="text-lg text-gray-700 mt-[1px] hidden md:block">
          ({{ store.negociosFitlrados?.length }} Resultados)
        </p>
      </span>

      <div class="flex items-center gap-3">
        <button
          @click="handleSeeAll"
          class="text-sm font-semibold text-gray-500 hover:text-primary-500 transition-colors"
        >
          Ver todos
        </button>
        <button
          type="button"
          @click="isFilterOpen = true"
          class="group flex items-center gap-2 rounded-full bg-white px-4 py-2 transition-colors hover:bg-gray-200 cursor-pointer"
        >
          <span class="text-sm font-bold"> Filtros </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-slate-900"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle
              cx="8"
              cy="6"
              r="2"
              class="fill-[#EBECEF] stroke-slate-900 transition-colors group-hover:fill-[#d1d5db]"
            />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle
              cx="16"
              cy="12"
              r="2"
              class="fill-[#EBECEF] stroke-slate-900 transition-colors group-hover:fill-[#d1d5db]"
            />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle
              cx="8"
              cy="18"
              r="2"
              class="fill-[#EBECEF] stroke-slate-900 transition-colors group-hover:fill-[#d1d5db]"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="py-4">
    <!-- Loading State -->
    <div
      v-if="store.cargando"
      class="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] px-3 md:px-0"
    >
      <BusinessSkeleton v-for="n in 8" :key="n" class="w-full mx-auto" />
    </div>

    <!-- Empty State (Only if not loading) -->
    <div v-else-if="store.negociosFitlrados?.length === 0" class="text-center py-10">
      <p>No se encontraron resultados para tu búsqueda.</p>
    </div>

    <!-- Results (Only if not loading) -->
    <div
      v-else
      v-if="store.negociosFitlrados?.length > 0"
      class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] px-[9px] md:px-0"
    >
      <component
        :is="getCardComponent(negocio)"
        v-for="negocio in store.negociosFitlrados"
        :key="negocio._id"
        :negocio="negocio"
        fullWidth
        :compactMode="true"
        class="w-full mx-auto"
        @click="openBusiness(negocio)"
      />
    </div>
  </div>

  <!-- Drawer Reutilizable -->
  <DrawerNegocio v-model:isOpen="isOpen" :negocio="selectedNegocio" />
  <DrawerFiltro v-model:isOpen="isFilterOpen" @apply="handleApplyFilters" />
</template>

<script setup lang="ts">
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { computed, onMounted, watch, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '~/components/Card.vue';
import CardPremium from '~/components/CardPremium.vue';
import DrawerNegocio from '~/components/DrawerNegocio.vue';
import DrawerFiltro from '~/components/DrawerFiltro.vue';
import BusinessSkeleton from '~/components/BusinessSkeleton.vue';

const getCardComponent = (negocio: any) => {
    const plan = negocio.membresia?.plan?.toLowerCase();
    if (plan === 'premium' || plan === 'gold') {
        return CardPremium;
    }
    return Card;
};

const route = useRoute();
const router = useRouter();
const store = useUbicacionNegocios();
const selectedNegocio = ref<any>(null);

definePageMeta({
    paddingClass: 'px-0 md:px-6'
});
const isOpen = ref(false);
const isFilterOpen = ref(false);

// Función que llama el @click de la Card
const openBusiness = (negocio: any) => {
  selectedNegocio.value = negocio;
  isOpen.value = true;
};

// --- Helper: Normalización de Texto ---
const limpiarTexto = (texto: any) => {
  if (!texto) return '';
  const str = typeof texto === 'object' ? JSON.stringify(texto) : String(texto);

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// --- Params de URL ---
const queryParam = computed(() => limpiarTexto(route.query.search));
const catParam = computed(() =>
  //@ts-ignore
  limpiarTexto(route.query.category?.replace(/-/g, ' '))
);

// --- Título Dinámico ---
const pageTitle = computed(() => {
  const rawQuery = route.query.search as string;
  const rawCat = route.query.category as string;

  const texto = rawCat?.replace(/-/g, ' ') || rawQuery || 'Resultados';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
});

// --- Helper de Coincidencia ---
const coincide = (fuente: any, terminoLimpio: string) => {
  return limpiarTexto(fuente).includes(terminoLimpio);
};

// --- Lógica Principal ---
const handleApplyFilters = async () => {
  await store.actualizarDatos(true); 
  // handleFilter(); // Ya no es necesario filtrar localmente si confiamos en el backend
};

const handleSeeAll = async () => {
  // store.resetFiltros(); // Don't reset all filters, user wants to keep radius/etc.
  await router.push({ query: { ...route.query, search: undefined } });
  // The route watcher will trigger store update
};

const handleFilter = async () => {
  store.lastFilterQuery = JSON.parse(JSON.stringify(route.query));
  
  const search = route.query.search as string || '';
  
  // Update store filter
  if (store.filtros.search !== search) {
      store.setFiltros({ search });
      // Trigger fetch because search changed
      await store.actualizarDatos(true);
  } else {
     // If search didn't change, but maybe we just navigated here, ensure we have data.
     // store.actualizarDatos() checks cache.
     await store.actualizarDatos();
  }
};

onMounted(() => {
  const search = route.query.search as string || '';
  store.setFiltros({ search });
  store.actualizarDatos(true); // Force fetch on mount to be sure
});

watch(
  () => route.query.search,
  (newVal) => {
    const search = newVal as string || '';
    store.setFiltros({ search });
    store.actualizarDatos(true);
  }
);
</script>

<style scoped>
/* === SCROLLBAR MINIMALISTA === */

/* 1. Ancho de la barra (Vertical y Horizontal) */
::-webkit-scrollbar {
  width: 6px; /* Muy delgada */
  height: 6px;
}

/* 2. El riel (Fondo) - Lo hacemos transparente */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 3. La barra (Thumb) - Gris suave y redondeada */
::-webkit-scrollbar-thumb {
  background-color: #e2e8f0; /* un gris muy sutil (slate-200) */
  border-radius: 9999px; /* totalmente redonda */
  border: 2px solid transparent; /* espacio para que flote */
  background-clip: content-box;
}

/* 4. Al pasar el mouse por encima */
::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1; /* un poco más oscuro (slate-300) */
}

/* Compatibilidad con Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
</style>
