// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Trigger rebuild
  compatibilityDate: '2025-07-15',
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
  routeRules: {
    '/resultados': { ssr: false },
  },
  app: {
    head: {
      title: 'Buscaya - Encuentra negocios locales',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Encuentra los mejores negocios, servicios y productos en tu zona con Buscaya.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/logo-navegador.png' }],
    },
  },
  devServer: {
    port: 3002,
  },
});
