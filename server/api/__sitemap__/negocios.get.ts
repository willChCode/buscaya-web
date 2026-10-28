import { defineSitemapEventHandler } from '#imports';
import { urlNegocio } from '../../../app/utils/helpers';
import { NEGOCIOS_POR_SITEMAP } from '../../../app/utils/seo-data';

// Una URL por negocio visible, con su fecha de última actualización.
// ?pagina=N → cada sitemap de negocios recibe su tramo de NEGOCIOS_POR_SITEMAP.
export default defineSitemapEventHandler(async (event) => {
  const pagina = Math.max(Number(getQuery(event).pagina) || 1, 1);
  const inicio = (pagina - 1) * NEGOCIOS_POR_SITEMAP;

  const negocios = await obtenerNegociosSeo();
  return negocios.slice(inicio, inicio + NEGOCIOS_POR_SITEMAP).map((n) => ({
    loc: urlNegocio(n),
    lastmod: n.updatedAt,
  }));
});
