<template>
  <NuxtLayout>
    <NuxtPage />
    <WhatsAppWidget />
  </NuxtLayout>
</template>

<script setup lang="ts">
import WhatsAppWidget from '~/components/WhatsAppWidget.vue';
import { SITE_URL } from '~/utils/helpers';

// Canonical y og:url por defecto (sin query params). Las páginas que definen
// su propio canonical (fichas, categorías) lo reemplazan.
const route = useRoute();
const urlActual = computed(() => `${SITE_URL}${route.path === '/' ? '' : route.path}`);

useHead({
  htmlAttrs: { lang: 'es-MX' },
  link: () => [{ rel: 'canonical', href: urlActual.value }],
});
useSeoMeta({
  ogUrl: urlActual,
  ogSiteName: 'Buscaya',
  ogLocale: 'es_MX',
});
</script>
