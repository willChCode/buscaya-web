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
          {{ resumen }}
        </p>
      </template>
    </HeroBanner>

    <div class="mt-6 md:mt-8">
      <!-- Listado de negocios -->
      <!-- Esqueletos solo en la primera carga; al cambiar de página se mantiene la lista atenuada -->
      <div v-if="pending && !response" class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
         <!-- Skeletons -->
         <BusinessSkeleton v-for="n in 10" :key="n" />
      </div>

      <div v-else-if="total === 0 && cercanos.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
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

      <template v-else>
        <!-- Negocios que están EN el municipio -->
        <section
          v-if="total"
          ref="seccionPropios"
          class="scroll-mt-28 transition-opacity"
          :class="{ 'opacity-50 pointer-events-none': pending }"
        >
          <h2 class="text-lg md:text-xl font-extrabold text-gray-900 mb-4">
            {{ categoria.nombrePlural }} en {{ municipio.nombre }}
            <span class="text-gray-400 font-medium">({{ total }})</span>
          </h2>
          <p v-if="totalPaginas > 1" class="text-sm text-gray-500 -mt-2 mb-4">
            Página {{ paginaActual }} de {{ totalPaginas }}
          </p>
          <div class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <component
              :is="getCardComponent(negocio)"
              v-for="(negocio, idx) in propiosPagina"
              :key="negocio._id"
              :negocio="negocio"
              fullWidth
              :compactMode="true"
              class="w-full mx-auto animate-fade-in-up"
              :style="{ animationDelay: `${idx * 60}ms` }"
            />
          </div>

          <!-- Paginación: enlaces reales (?pagina=N) para que Google llegue a todos los negocios.
               `custom`: el router ignora el query al marcar el enlace activo, así que lo marcamos nosotros -->
          <nav
            v-if="totalPaginas > 1"
            class="flex flex-wrap items-center justify-center gap-2 mt-8"
            aria-label="Paginación"
          >
            <NuxtLink
              v-if="paginaActual > 1"
              :to="urlPagina(paginaActual - 1)"
              custom
              v-slot="{ href, navigate }"
            >
              <a
                :href="href"
                rel="prev"
                class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                @click="irAPagina($event, navigate)"
              >
                ← Anterior
              </a>
            </NuxtLink>
            <template v-for="n in numerosPagina" :key="n">
              <span v-if="n === '…'" class="px-2 text-gray-400">…</span>
              <NuxtLink v-else :to="urlPagina(n)" custom v-slot="{ href, navigate }">
                <a
                  :href="href"
                  :aria-current="n === paginaActual ? 'page' : undefined"
                  class="min-w-[40px] text-center px-3 py-2 rounded-xl text-sm font-bold transition-colors"
                  :class="n === paginaActual
                    ? 'bg-primary-500 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'"
                  @click="irAPagina($event, navigate)"
                >
                  {{ n }}
                </a>
              </NuxtLink>
            </template>
            <NuxtLink
              v-if="paginaActual < totalPaginas"
              :to="urlPagina(paginaActual + 1)"
              custom
              v-slot="{ href, navigate }"
            >
              <a
                :href="href"
                rel="next"
                class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                @click="irAPagina($event, navigate)"
              >
                Siguiente →
              </a>
            </NuxtLink>
          </nav>
        </section>

        <div
          v-else
          class="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm text-gray-600"
        >
          Aún no hay {{ categoria.nombrePlural.toLowerCase() }} registrados dentro de {{ municipio.nombre }}.
          Estos son los más cercanos.
        </div>

        <!-- Negocios de municipios vecinos (solo en la primera página) -->
        <section v-if="cercanos.length && paginaActual === 1" class="mt-10">
          <h2 class="text-lg md:text-xl font-extrabold text-gray-900">
            También cerca de {{ municipio.nombre }}
          </h2>
          <p class="text-sm text-gray-500 mt-1 mb-4">
            {{ categoria.nombrePlural }} de municipios vecinos, a menos de 15 km.
          </p>
          <div class="grid gap-[6px] md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <component
              :is="getCardComponent(negocio)"
              v-for="negocio in cercanos"
              :key="negocio._id"
              :negocio="negocio"
              fullWidth
              :compactMode="true"
              class="w-full mx-auto"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { SEOMunicipios, SEOCategorias } from '~/utils/seo-data';
import Card from '~/components/Card.vue';
import CardPremium from '~/components/CardPremium.vue';
import BusinessSkeleton from '~/components/BusinessSkeleton.vue';
import HeroBanner from '~/components/home/HeroBanner.vue';
import { urlNegocio, SITE_URL } from '~/utils/helpers';
import { useRoute, createError, useSeoMeta, useHead, useFetch, computed, ref } from '#imports';

const route = useRoute();

// Remove default layout padding to match /negocios
definePageMeta({
  paddingClass: 'p-0',
});

const categoriaSlug = route.params.categoria;
const municipioSlug = route.params.municipio;

// Categorías fijas + las que salen de los negocios registrados
const { data: categorias } = await useFetch('/api/seo/categorias', { key: 'seo-categorias' });
const categoria = (categorias.value || SEOCategorias).find(c => c.slug === categoriaSlug);
const municipio = SEOMunicipios.find(m => m.slug === municipioSlug);

if (!categoria || !municipio) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada', fatal: true });
}

const paginaActual = computed(() => {
  const n = parseInt(route.query.pagina, 10);
  return Number.isFinite(n) && n > 1 ? n : 1;
});

// Negocios DENTRO del municipio (paginados) + algunos de municipios vecinos.
// La ruta del servidor junta todo en una sola petición al backend y lo cachea.
const { data: response, pending } = await useFetch('/api/seo/ciudad', {
  query: { categoria: categoriaSlug, municipio: municipioSlug, pagina: paginaActual },
});

const total = computed(() => response.value?.total || 0);
const totalPaginas = computed(() => response.value?.totalPaginas || 1);
const propiosPagina = computed(() => response.value?.negocios || []);
const cercanos = computed(() => response.value?.cercanos || []);
const POR_PAGINA = computed(() => response.value?.porPagina || 20);

if (total.value > 0 && paginaActual.value > totalPaginas.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada', fatal: true });
}

const urlPagina = (n) => ({ query: n > 1 ? { pagina: n } : {} });

// 1 … 4 5 6 … 12
const numerosPagina = computed(() => {
  const totalP = totalPaginas.value;
  const actual = paginaActual.value;
  const visibles = new Set([1, totalP, actual - 1, actual, actual + 1].filter((n) => n >= 1 && n <= totalP));
  const ordenados = [...visibles].sort((a, b) => a - b);
  return ordenados.flatMap((n, i) => (i > 0 && n - ordenados[i - 1] > 1 ? ['…', n] : [n]));
});

// Al cambiar de página, subir al inicio de la lista (se queda atenuada mientras carga)
const seccionPropios = ref(null);
const irAPagina = async (event, navigate) => {
  await navigate(event);
  // Sin animación: el scroll suave se cancela cuando la lista se actualiza a mitad del recorrido
  seccionPropios.value?.scrollIntoView({ block: 'start' });
};

const getCardComponent = (negocio) => {
  const plan = negocio.membresia?.plan?.toLowerCase();
  if (plan === 'premium' || plan === 'gold') {
    return CardPremium;
  }
  return Card;
};

const listaNatural = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;

// Texto propio de cada página, armado con sus datos reales (evita páginas casi iguales)
const resumen = computed(() => {
  const r = response.value || {};
  const giro = categoria.nombrePlural.toLowerCase();

  if (!total.value) {
    return `Aún no hay ${giro} registrados dentro de ${municipio.nombre}. Te mostramos los más cercanos en municipios vecinos, con horarios, reseñas y contacto directo por WhatsApp.`;
  }

  const giroCantidad = total.value === 1 ? categoria.nombre.toLowerCase() : giro;
  const partes = [`Encontramos ${total.value} ${giroCantidad} en ${municipio.nombre}`];

  if (r.colonias?.length) partes[0] += `, en colonias como ${listaNatural(r.colonias)}`;
  partes[0] += '.';

  if (r.conWhatsapp) {
    partes.push(
      `${r.conWhatsapp === total.value ? 'Todos atienden' : `${r.conWhatsapp} atienden`} por WhatsApp${r.promedio ? ` y su calificación promedio es ${r.promedio} de 5` : ''}.`
    );
  } else if (r.promedio) {
    partes.push(`Su calificación promedio es ${r.promedio} de 5.`);
  }

  partes.push('Revisa horarios, reseñas y contáctalos directamente.');
  return partes.join(' ');
});

// SEO Tags
const descripcion = computed(() => {
  if (!total.value) {
    return `${categoria.nombrePlural} cerca de ${municipio.nombre}, N.L.: horarios, reseñas y contacto por WhatsApp en Buscaya.`;
  }
  const nombres = response.value?.destacados || [];
  return `${total.value} ${total.value === 1 ? categoria.nombre.toLowerCase() : categoria.nombrePlural.toLowerCase()} en ${municipio.nombre}, N.L.: ${listaNatural(nombres)}${total.value > 3 ? ' y más' : ''}. Horarios, reseñas y contacto por WhatsApp.`.slice(0, 300);
});

// Página 2 en adelante: título y canonical propios (cada página es indexable por sí misma)
const sufijoPagina = computed(() => (paginaActual.value > 1 ? ` - Página ${paginaActual.value}` : ''));
const tituloSeo = computed(
  () => `Mejores ${categoria.nombrePlural} en ${municipio.nombre}${sufijoPagina.value} | Buscaya`
);

useSeoMeta({
  title: tituloSeo,
  description: () =>
    paginaActual.value > 1
      ? `${descripcion.value.replace(/\.\s*$/, '')} (página ${paginaActual.value} de ${totalPaginas.value}).`
      : descripcion.value,
  ogTitle: tituloSeo,
  ogDescription: descripcion,
  // Solo se indexa si hay negocios DENTRO del municipio (evita páginas vacías o repetidas)
  robots: () => (total.value === 0 ? 'noindex, follow' : undefined),
});

useHead({
  link: () => [
    {
      rel: 'canonical',
      href: `${SITE_URL}/${categoria.slug}/${municipio.slug}${paginaActual.value > 1 ? `?pagina=${paginaActual.value}` : ''}`,
    },
  ],
});

// JSON-LD (Datos Estructurados para Rich Snippets en Google): los del municipio en esta página
useHead({
  script: () =>
    propiosPagina.value.length
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": propiosPagina.value.map((neg, index) => ({
                "@type": "ListItem",
                "position": (paginaActual.value - 1) * POR_PAGINA.value + index + 1,
                "item": {
                  "@type": "LocalBusiness",
                  "name": neg.nombre,
                  "url": `${SITE_URL}${urlNegocio(neg)}`,
                  "image": neg.portada?.url || undefined,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": neg.direccion || undefined,
                    "addressLocality": municipio.nombre,
                    "addressRegion": "Nuevo León",
                    "addressCountry": "MX"
                  }
                }
              }))
            })
          }
        ]
      : [],
});
</script>
