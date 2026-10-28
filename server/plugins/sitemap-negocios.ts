import { NEGOCIOS_POR_SITEMAP } from '../../app/utils/seo-data';

// Deja en /sitemap_index.xml solo los sitemaps de negocios que tienen URLs:
// hasta 5,000 negocios → negocios.xml; de 5,001 a 10,000 → + negocios-2.xml; etc.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:index-resolved', async (ctx: any) => {
    let total = 0;
    try {
      total = (await obtenerNegociosSeo()).length;
    } catch {
      return;
    }
    const necesarios = Math.max(1, Math.ceil(total / NEGOCIOS_POR_SITEMAP));

    ctx.sitemaps = ctx.sitemaps.filter((s: any) => {
      const match = /^negocios-(\d+)$/.exec(s._sitemapName || '');
      return !match || Number(match[1]) <= necesarios;
    });
  });
});
