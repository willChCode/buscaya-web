<template>
  <div class="pt-10 px-4 md:px-8 pb-20">
    <div class="container mx-auto">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
        Mejores {{ categoria.nombrePlural }} en Nuevo León
      </h1>
      <p class="text-gray-600 mb-10 max-w-2xl text-lg">
        Encuentra a los mejores expertos en {{ categoria.nombrePlural.toLowerCase() }} cerca de ti. Selecciona tu ciudad para ver la lista completa de negocios, leer opiniones y contactarlos directamente por WhatsApp.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="mun in SEOMunicipios"
          :key="mun.slug"
          :to="`/${categoria.slug}/${mun.slug}`"
          class="bg-white border border-gray-100 hover:border-primary-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div class="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-800">{{ mun.nombre }}</h3>
          <span class="text-sm text-primary-500 font-medium mt-1">Ver negocios →</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SEOMunicipios, SEOCategorias } from '~/utils/seo-data';
import { useRoute, createError, useSeoMeta } from '#imports';

const route = useRoute();
const categoriaSlug = route.params.categoria;

const categoria = SEOCategorias.find(c => c.slug === categoriaSlug);

if (!categoria) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada', fatal: true });
}

// SEO Tags
useSeoMeta({
  title: `${categoria.nombrePlural} en Nuevo León | Buscaya`,
  description: `Encuentra a los mejores especialistas en ${categoria.nombrePlural.toLowerCase()} en Nuevo León. Selecciona tu ciudad para ver horarios, reseñas y contactar negocios en Buscaya.`,
});
</script>
