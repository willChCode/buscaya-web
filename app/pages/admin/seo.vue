<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header Admin -->
    <div class="bg-primary-600 text-white pt-6 pb-12 px-4 md:px-8 rounded-b-[24px] shadow-sm">
      <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-xl md:text-3xl font-extrabold leading-tight mb-1">Auditoría SEO</h1>
          <p class="text-primary-100/90 text-sm max-w-xl">
            Panel de control empresarial para previsualizar cómo Google y tus usuarios ven tus rutas programáticas.
          </p>
        </div>
      </div>
    </div>

    <!-- Cards Stats -->
    <div class="w-full px-4 md:px-8 -mt-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div class="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <p class="text-[13px] text-gray-500 font-medium leading-none mb-1">Total de Rutas Generadas</p>
            <p class="text-xl font-bold text-gray-800 leading-none">{{ seoRoutes.length }}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p class="text-[13px] text-gray-500 font-medium leading-none mb-1">Categorías Base</p>
            <p class="text-xl font-bold text-gray-800 leading-none">{{ SEOCategorias.length }}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="text-[13px] text-gray-500 font-medium leading-none mb-1">Municipios Cobertos</p>
            <p class="text-xl font-bold text-gray-800 leading-none">{{ SEOMunicipios.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="w-full px-4 md:px-8 mt-6">
      <div class="bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden">
        <!-- Search bar inside table header -->
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            Rutas de Búsqueda Indexables
          </h2>
          <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <!-- Filtro de Categoría -->
            <select 
              v-model="selectedCategory" 
              class="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white text-sm text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center] pr-10"
            >
              <option value="">Todas las Categorías</option>
              <option v-for="cat in SEOCategorias" :key="cat.slug" :value="cat.slug">
                {{ cat.nombrePlural }}
              </option>
            </select>

            <!-- Filtro de Municipio -->
            <select 
              v-model="selectedMunicipality" 
              class="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white text-sm text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center] pr-10"
            >
              <option value="">Todas las Ciudades</option>
              <option v-for="mun in SEOMunicipios" :key="mun.slug" :value="mun.slug">
                {{ mun.nombre }}
              </option>
            </select>

            <!-- Búsqueda de texto -->
            <div class="relative w-full md:w-64">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Buscar por palabra..." 
                class="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white text-sm"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th scope="col" class="px-6 py-4 rounded-tl-lg">URL (Ruta)</th>
                <th scope="col" class="px-6 py-4">Meta Title (Google)</th>
                <th scope="col" class="px-6 py-4">Meta Description (Google)</th>
                <th scope="col" class="px-6 py-4 rounded-tr-lg">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="route in filteredRoutes" :key="route.url" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 align-top">
                  <div class="font-mono text-[13px] font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg inline-block break-all">
                    {{ route.url }}
                  </div>
                </td>
                <td class="px-6 py-4 align-top">
                  <span class="font-semibold text-gray-800">{{ route.title }}</span>
                  <div class="text-xs text-gray-400 mt-1">
                    Longitud: {{ route.title.length }} caracteres
                  </div>
                </td>
                <td class="px-6 py-4 align-top max-w-md">
                  <p class="text-gray-600 leading-relaxed">{{ route.description }}</p>
                  <div class="text-xs text-gray-400 mt-1">
                    Longitud: {{ route.description.length }} caracteres
                  </div>
                </td>
                <td class="px-6 py-4 align-top">
                  <span 
                    class="px-3 py-1 text-[11px] font-bold uppercase rounded-full whitespace-nowrap"
                    :class="{
                      'bg-blue-100 text-blue-700': route.type === 'Categoría Base',
                      'bg-purple-100 text-purple-700': route.type === 'Combinación Local',
                      'bg-gray-100 text-gray-700': route.type === 'Página Estática (Global)'
                    }"
                  >
                    {{ route.type }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredRoutes.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                  No se encontraron rutas que coincidan con tu búsqueda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          Mostrando {{ filteredRoutes.length }} de {{ seoRoutes.length }} rutas
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SEOCategorias, SEOMunicipios } from '~/utils/seo-data';

// Usamos el layout default
definePageMeta({
  layout: 'default'
});

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedMunicipality = ref('');

const seoRoutes = computed(() => {
  const routes = [
    {
      url: '/',
      title: 'BuscaYa — Directorio comercial de negocios en México',
      description: 'La sección amarilla digital más grande de México. Encuentra los mejores negocios, servicios y productos locales cerca de ti con BuscaYa.',
      type: 'Página Estática (Global)'
    },
    {
      url: '/negocios',
      title: 'Directorio de Negocios y Empresas Locales en México | BuscaYa',
      description: 'Explora nuestro directorio de negocios y encuentra empresas, servicios profesionales, restaurantes y tiendas locales cerca de ti. ¡Descubre las mejores opciones en BuscaYa!',
      type: 'Página Estática (Global)'
    },
    {
      url: '/revista',
      title: 'Revista Comercial: Promociones y Ofertas de Negocios Locales | BuscaYa',
      description: 'Descubre las mejores promociones, descuentos y ofertas de negocios locales en nuestra revista digital. Ahorra en servicios y productos cerca de ti.',
      type: 'Página Estática (Global)'
    },
    {
      url: '/comunidad',
      title: 'Comunidad BuscaYa: Opiniones y Recomendaciones de Negocios',
      description: 'Únete a la comunidad de BuscaYa. Lee opiniones reales, comparte recomendaciones y descubre los negocios locales mejor valorados por otros usuarios.',
      type: 'Página Estática (Global)'
    }
  ];
  
  // Rutas base (Categorías)
  for (const cat of SEOCategorias) {
    routes.push({
      url: `/${cat.slug}`,
      title: `Mejores ${cat.nombrePlural} cerca de ti - Buscaya`,
      description: `Encuentra y contacta a los mejores especialistas en ${cat.nombrePlural.toLowerCase()} en tu ciudad. Explora valoraciones y comunícate directamente por WhatsApp.`,
      type: 'Categoría Base'
    });
    
    // Combinaciones (Municipios)
    for (const mun of SEOMunicipios) {
      routes.push({
        url: `/${cat.slug}/${mun.slug}`,
        title: `Mejores ${cat.nombrePlural} en ${mun.nombre} - Buscaya`,
        description: `Encuentra y contacta a los mejores especialistas en ${cat.nombrePlural.toLowerCase()} ubicados en ${mun.nombre}. Revisa sus valoraciones, horarios de atención y comunícate directamente por WhatsApp.`,
        type: 'Combinación Local',
        categorySlug: cat.slug,
        municipalitySlug: mun.slug
      });
    }
  }
  return routes;
});

const filteredRoutes = computed(() => {
  let result = seoRoutes.value;

  // Filtrar por Categoría
  if (selectedCategory.value) {
    result = result.filter(route => route.url.startsWith(`/${selectedCategory.value}`));
  }

  // Filtrar por Municipio
  if (selectedMunicipality.value) {
    result = result.filter(route => route.municipalitySlug === selectedMunicipality.value);
  }

  // Filtrar por texto
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(route => 
      route.url.toLowerCase().includes(query) || 
      route.title.toLowerCase().includes(query) ||
      route.description.toLowerCase().includes(query)
    );
  }

  return result;
});
</script>
