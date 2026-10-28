import { SEOCategorias, NEGOCIOS_POR_SITEMAP } from './app/utils/seo-data';
import { GRUPOS_CATEGORIAS_UNIFICADOS } from './app/utils/categories';

// Íconos que se arman dinámicamente ('ion:' + sub.icono) y el escáner no puede detectar
const iconosCategorias = [
  ...new Set(
    GRUPOS_CATEGORIAS_UNIFICADOS.flatMap((g) => [g.icono, ...g.subcategorias.map((s) => s.icono)])
      .filter(Boolean)
      .map((icono) => `ion:${icono}`)
  ),
];

// Sitemaps de negocios de 5,000 URLs: negocios.xml, negocios-2.xml, negocios-3.xml…
// Los vacíos se quitan del índice en server/plugins/sitemap-negocios.ts.
// 20 archivos = hasta 100,000 negocios.
const MAX_SITEMAPS_NEGOCIOS = 20;
const sitemapsNegocios = Object.fromEntries(
  Array.from({ length: MAX_SITEMAPS_NEGOCIOS }, (_, i) => [
    i === 0 ? 'negocios' : `negocios-${i + 1}`,
    { sources: [`/api/__sitemap__/negocios?pagina=${i + 1}`] },
  ])
);

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
  // Íconos desde @iconify-json/ion instalado (sin pedirlos a api.iconify.design en cada visita).
  // clientBundle: los usados en el código + los de categorías van incluidos en el JS.
  icon: {
    serverBundle: 'local',
    clientBundle: {
      scan: true,
      icons: iconosCategorias,
      sizeLimitKb: 256,
    },
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: false,
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
    // Índice en /sitemap_index.xml con dos sitemaps: páginas y negocios
    sitemaps: {
      paginas: {
        includeAppSources: true,
        exclude: ['/perfil', '/perfil/**', '/splash', '/admin', '/admin/**', '/negocios'],
        sources: ['/api/__sitemap__/paginas'],
      },
      ...sitemapsNegocios,
    },
  },
  routeRules: {
    // Buscador interno: depende de la ubicación del visitante. Google sigue sus enlaces
    // pero no la indexa (para Google están /categoria/municipio y las fichas).
    '/negocios': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, follow' } },
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/perfil': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/perfil/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
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
      link: [
        // Poppins: pesos que realmente usa el sitio (font-medium … font-black)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
        },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/favicon-144x144.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
      ],
    },
  },
  devServer: {
    port: 3002,
  },
});
