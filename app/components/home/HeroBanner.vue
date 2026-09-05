<template>
  <div
    class="relative overflow-hidden rounded-2xl md:rounded-3xl px-6 md:px-10 bg-primary-950"
    :class="showSearch ? 'pt-12 pb-32 md:pt-14 md:pb-40' : 'py-8 md:py-12'"
  >
    <img
      src="~/assets/images/banner/fondo-buscaya.jpg"
      alt="Fondo Buscaya"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
    />

    <div
      class="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/60 to-transparent"
    ></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-xl animate-fade-in-up">
      <slot name="title">
        <h1
          class="text-xl md:text-3xl font-extrabold text-white leading-tight mb-3"
        >
          El Directorio de Negocios y Servicios<br class="hidden md:block" />
          Más Grande Cerca de Ti
        </h1>
      </slot>

      <slot name="description">
        <p class="text-primary-100/90 text-sm mb-6 max-w-md">
          Encuentra tiendas, explora promociones locales y elige los mejores
          negocios en tu zona.
        </p>
      </slot>

      <form
        v-if="showSearch"
        @submit.prevent="handleSearch"
        class="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-md"
      >
        <input
          v-model="query"
          type="text"
          placeholder="¿Qué estás buscando hoy?"
          class="flex-1 h-10 md:h-12 bg-transparent text-sm text-gray-700 pl-5 pr-2 focus:outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          class="h-10 md:h-12 px-5 md:px-7 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors flex items-center justify-center shrink-0"
        >
          <span>Buscar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUbicacionNegocios } from '~/store/ubicacion.store';

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();
const store = useUbicacionNegocios();
const query = ref('');
const handleSearch = () => {
  if (query.value.trim() !== '') {
    // Limpiamos los filtros de categoría al hacer una búsqueda de texto libre
    store.setFiltros({
      giro: '',
      categoria: '',
      search: query.value.trim(),
    });

    router.push({
      path: '/negocios',
      query: { search: query.value.trim() },
    });
  }
};
</script>
