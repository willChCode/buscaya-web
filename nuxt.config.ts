import { SEOMunicipios, SEOCategorias } from './app/utils/seo-data';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Trigger fresh build v2
  compatibilityDate: '2025-07-20',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      googleMapsKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    },
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY || '',
  },
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@nuxtjs/sitemap'
  ],
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true,
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['google.maps'],
      },
    },
  },
  site: {
    url: 'https://buscaya.mx',
    name: 'Buscaya'
  },
  sitemap: {
    exclude: ['/perfil', '/perfil/**', '/splash', '/admin', '/admin/**'],
    urls: () => {
      const urls = [];
      for (const cat of SEOCategorias) {
        urls.push(`/${cat.slug}`);
        for (const mun of SEOMunicipios) {
          urls.push(`/${cat.slug}/${mun.slug}`);
        }
      }
      return urls;
    }
  },
  routeRules: {
    '/negocios': { ssr: false },
    ...(() => {
      const rules: Record<string, any> = {};
      for (const cat of SEOCategorias) {
        if (cat.slugSingular) {
          rules[`/${cat.slugSingular}`] = { redirect: { to: `/${cat.slug}`, statusCode: 301 } };
          rules[`/${cat.slugSingular}/**`] = { redirect: { to: `/${cat.slug}/**`, statusCode: 301 } };
        }
      }
      return rules;
    })()
  },
  app: {
    head: {
      title: 'BuscaYa — Directorio comercial de negocios en México',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'La sección amarilla digital más grande de México. Encuentra los mejores negocios, servicios y productos locales cerca de ti con BuscaYa.',
        },
        { property: 'og:image', content: 'https://buscaya.mx/seo-buscaya.jpg' },
        { name: 'twitter:image', content: 'https://buscaya.mx/seo-buscaya.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/logo-navegador.png' }],
    },
  },
  devServer: {
    port: 3002,
  },
});
