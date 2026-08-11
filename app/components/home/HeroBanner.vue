<template>
  <div
    class="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 pt-12 pb-32 md:pt-14 md:pb-40 px-6 md:px-10"
  >
    <!-- Ilustración de ciudad -->
    <svg
      class="pointer-events-none select-none absolute bottom-0 right-0 h-full w-3/5 md:w-1/2"
      viewBox="0 0 520 320"
      preserveAspectRatio="xMaxYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- suelo -->
      <rect x="0" y="290" width="520" height="30" class="fill-primary-800/40" />

      <!-- nubes -->
      <g class="fill-primary-300/30">
        <g class="animate-float-slow" style="transform-origin: 135px 37px">
          <ellipse cx="120" cy="40" rx="34" ry="14" />
          <ellipse cx="150" cy="34" rx="24" ry="12" />
        </g>
        <ellipse
          cx="330"
          cy="60"
          rx="28"
          ry="11"
          class="animate-float-slower"
          style="transform-origin: 330px 60px"
        />
      </g>

      <!-- edificios de fondo -->
      <g class="fill-primary-700/70">
        <rect x="20" y="150" width="50" height="150" rx="4" />
        <rect x="440" y="120" width="55" height="180" rx="4" />
      </g>

      <!-- edificios principales -->
      <g class="fill-primary-600">
        <rect x="80" y="110" width="60" height="190" rx="6" />
        <rect x="150" y="160" width="46" height="140" rx="6" />
        <rect x="205" y="70" width="66" height="230" rx="6" />
        <rect x="280" y="130" width="52" height="170" rx="6" />
        <rect x="340" y="95" width="60" height="205" rx="6" />
      </g>

      <!-- bandera -->
      <g class="fill-yellow-300">
        <rect x="236" y="52" width="3" height="20" />
        <path d="M239 53 L256 60 L239 67 Z" />
      </g>

      <!-- ventanas -->
      <g class="fill-primary-200/70">
        <g v-for="(_row, ri) in 5" :key="'r1-' + ri">
          <rect
            v-for="(_col, ci) in 3"
            :key="'c1-' + ri + ci"
            :x="90 + ci * 16"
            :y="128 + ri * 30"
            width="8"
            height="12"
            rx="1.5"
          />
        </g>
        <g v-for="(_row, ri) in 6" :key="'r2-' + ri">
          <rect
            v-for="(_col, ci) in 3"
            :key="'c2-' + ri + ci"
            :x="215 + ci * 17"
            :y="90 + ri * 30"
            width="9"
            height="13"
            rx="1.5"
          />
        </g>
        <g v-for="(_row, ri) in 5" :key="'r3-' + ri">
          <rect
            v-for="(_col, ci) in 3"
            :key="'c3-' + ri + ci"
            :x="349 + ci * 15"
            :y="112 + ri * 30"
            width="8"
            height="12"
            rx="1.5"
          />
        </g>
      </g>

      <!-- arboles -->
      <g>
        <rect x="30" y="278" width="6" height="22" class="fill-primary-800" />
        <circle cx="33" cy="266" r="18" class="fill-primary-400" />

        <rect x="410" y="270" width="6" height="30" class="fill-primary-800" />
        <circle cx="413" cy="256" r="22" class="fill-primary-400" />

        <rect x="465" y="278" width="6" height="22" class="fill-primary-800" />
        <circle cx="468" cy="266" r="18" class="fill-primary-300" />
      </g>
    </svg>

    <div
      class="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/60 to-transparent"
    ></div>

    <!-- Contenido -->
    <div class="relative z-10 max-w-xl animate-fade-in-up">
      <h1
        class="text-xl md:text-3xl font-extrabold text-white leading-tight mb-3"
      >
        Encuentra cualquier negocio<br class="hidden md:block" />
        o servicio cerca de ti
      </h1>
      <p class="text-primary-100/90 text-sm mb-6 max-w-md">
        Explora, compara y elige lo mejor.
      </p>

      <form
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
      path: '/resultados',
      query: { search: query.value.trim() },
    });
  }
};
</script>
