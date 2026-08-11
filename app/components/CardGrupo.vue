<script setup>
import { defineProps } from 'vue';

// Define las propiedades que este componente recibirá
defineProps({
  grupo: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const router = useRouter();
import { useUbicacionNegocios } from '@/store/ubicacion.store';

const store = useUbicacionNegocios();

/**
 * Función que maneja el clic en la tarjeta de grupo/categoría.
 * Navega a la página de resultados con el filtro aplicado en el store.
 */
const goToCategoryResults = (nombre) => {
  // Preserve radius to respect user config
  const currentRadius = store.filtros.radius;

  // Limpiar otros filtros y establecer el giro
  store.resetFiltros();
  store.setFiltros({
    giro: nombre,
    radius: currentRadius,
  });

  router.push({
    path: '/resultados',
  });
};
</script>

<template>
  <div
    @click="goToCategoryResults(grupo.nombre)"
    class="flex flex-col items-center gap-1.5 w-16 md:w-20 flex-shrink-0 cursor-pointer group animate-fade-in-up"
    :style="{ animationDelay: `${grupo.id * 40}ms` }"
  >
    <div
      class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-50 ring-1 ring-gray-100 group-hover:bg-gray-100 group-hover:ring-gray-200 group-hover:scale-105 group-hover:-translate-y-0.5 flex items-center justify-center overflow-hidden transition-all duration-200"
    >
      <img
        :src="grupo.imagen"
        alt=""
        class="h-8 w-8 md:h-14 md:w-14 object-contain"
      />
    </div>
    <p
      class="text-center text-[11px] md:text-xs font-semibold leading-tight text-gray-700 line-clamp-2"
    >
      {{ grupo.nombre }}
    </p>
  </div>
</template>
