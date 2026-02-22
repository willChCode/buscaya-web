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
    class="rounded-md w-[90px] md:w-[135px] flex-shrink-0 cursor-pointer transition duration-300"
  >
    <img
      :src="grupo.imagen"
      alt=""
      class="h-16 md:h-20 m-auto object-cover rounded-lg"
    />
    <p
      class="text-center text-[12px] md:text-[13px] font-semibold leading-[1.3] py-1"
    >
      {{ grupo.nombre }}
    </p>
  </div>
</template>
