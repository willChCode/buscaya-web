<template>
  <NuxtLayout>
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full text-center">
        <p class="text-7xl font-extrabold text-primary-500">
          {{ es404 ? '404' : error?.statusCode || 500 }}
        </p>
        <h1 class="mt-4 text-2xl font-extrabold text-gray-900">
          {{ es404 ? 'No encontramos esta página' : 'Algo salió mal' }}
        </h1>
        <p class="mt-2 text-gray-500">
          {{
            es404
              ? 'Puede que el negocio ya no esté disponible o que el enlace esté mal escrito.'
              : 'Tuvimos un problema al cargar la página. Intenta de nuevo en unos segundos.'
          }}
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            @click="irA('/')"
          >
            Ir al inicio
          </button>
          <button
            class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
            @click="irA('/negocios')"
          >
            Explorar negocios
          </button>
        </div>

        <div v-if="es404" class="mt-10">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Búsquedas populares
          </p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="cat in populares"
              :key="cat.slug"
              class="text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-colors"
              @click="irA(`/${cat.slug}`)"
            >
              {{ cat.nombrePlural }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { SEOCategorias } from '~/utils/seo-data';

const props = defineProps<{ error: NuxtError }>();

const es404 = computed(() => props.error?.statusCode === 404);
const populares = SEOCategorias.slice(0, 6);

useSeoMeta({
  title: () => (es404.value ? 'Página no encontrada | Buscaya' : 'Error | Buscaya'),
  robots: 'noindex, follow',
});

const irA = (ruta: string) => clearError({ redirect: ruta });
</script>
