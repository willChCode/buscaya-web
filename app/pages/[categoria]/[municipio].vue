<template>
  <div class="pt-0 md:pt-5 px-4 md:px-6 pb-20">
    <HeroBanner :showSearch="false">
      <template #title>
        <h1 class="text-xl md:text-3xl font-extrabold text-white leading-tight mb-3">
          Mejores {{ categoria.nombrePlural }} en {{ municipio.nombre }}
        </h1>
      </template>
      <template #description>
        <p class="text-primary-100/90 text-sm mb-0 max-w-2xl">
          Encuentra y contacta a los mejores especialistas en {{ categoria.nombrePlural.toLowerCase() }} ubicados en {{ municipio.nombre }}. Revisa sus valoraciones, horarios de atención y comunícate directamente por WhatsApp.
        </p>
      </template>
    </HeroBanner>

    <div class="mt-6 md:mt-8">
      <!-- Listado de negocios -->
      <div v-if="pending" class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
         <!-- Skeletons -->
         <BusinessSkeleton v-for="n in 8" :key="n" />
      </div>
      
      <div v-else-if="negocios.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Aún no hay {{ categoria.nombrePlural.toLowerCase() }} registrados aquí</h3>
        <p class="text-gray-500 max-w-md mx-auto">Pronto agregaremos más negocios a {{ municipio.nombre }}. Mientras tanto, puedes explorar otras ciudades cercanas.</p>
        <NuxtLink :to="`/${categoria.slug}`" class="mt-6 inline-block bg-primary-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-600 transition-colors">
          Ver todas las ciudades
        </NuxtLink>
      </div>
      
      <div v-else class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
        <component
          :is="getCardComponent(negocio)"
          v-for="(negocio, idx) in negocios"
          :key="negocio.id || negocio._id"
          :negocio="negocio"
          fullWidth
          :compactMode="true"
          class="w-full mx-auto animate-fade-in-up"
          :style="{ animationDelay: `${idx * 60}ms` }"
          @click="openBusiness(negocio)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { SEOMunicipios, SEOCategorias } from '~/utils/seo-data';
import { obtenerNegociosCercanos } from '~/services/negocio';
import Card from '~/components/Card.vue';
import CardPremium from '~/components/CardPremium.vue';
import BusinessSkeleton from '~/components/BusinessSkeleton.vue';
import HeroBanner from '~/components/home/HeroBanner.vue';
import { crearSlug } from '~/utils/helpers';
import { useRoute, useRouter, createError, useSeoMeta, useHead, useAsyncData, computed } from '#imports';

const route = useRoute();
const router = useRouter();

// Remove default layout padding to match /negocios
definePageMeta({
  paddingClass: 'p-0',
});

const categoriaSlug = route.params.categoria;
const municipioSlug = route.params.municipio;

const categoria = SEOCategorias.find(c => c.slug === categoriaSlug);
const municipio = SEOMunicipios.find(m => m.slug === municipioSlug);

if (!categoria || !municipio) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada', fatal: true });
}

// Fetch datos en Server Side para SEO
const { data: response, pending } = await useAsyncData(`seo-${categoriaSlug}-${municipioSlug}`, () => {
  // Buscamos negocios cercanos al centro de la ciudad en un radio de 15km
  return obtenerNegociosCercanos(municipio.lat, municipio.lon, 15000, { search: categoria.term });
});

const negocios = computed(() => response.value?.data || []);

const getCardComponent = (negocio) => {
  const plan = negocio.membresia?.plan?.toLowerCase();
  if (plan === 'premium' || plan === 'gold') {
    return CardPremium;
  }
  return Card;
};

const openBusiness = (negocio) => {
  const slug = crearSlug(negocio.nombre);
  const id = negocio._id || negocio.id;
  router.push({ path: `/negocio/${slug}`, query: { id } });
};

// SEO Tags
useSeoMeta({
  title: `Mejores ${categoria.nombrePlural} en ${municipio.nombre} | Buscaya`,
  description: `Encuentra y contacta a los mejores especialistas en ${categoria.nombrePlural.toLowerCase()} ubicados en ${municipio.nombre}. Revisa sus valoraciones y horarios en Buscaya.`,
  ogTitle: `Mejores ${categoria.nombrePlural} en ${municipio.nombre} | Buscaya`,
  ogDescription: `Descubre los mejores negocios de ${categoria.nombrePlural.toLowerCase()} en ${municipio.nombre}. Opiniones reales de clientes.`,
});

// JSON-LD (Datos Estructurados para Rich Snippets en Google)
if (negocios.value.length > 0) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": negocios.value.map((neg, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "name": neg.nombre,
              "url": `https://buscaya.mx/negocio/${crearSlug(neg.nombre)}?id=${neg._id || neg.id}`,
              "image": neg.fotoPerfil || undefined,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": municipio.nombre,
                "addressRegion": "Nuevo León",
                "addressCountry": "MX"
              }
            }
          }))
        })
      }
    ]
  });
}
</script>
