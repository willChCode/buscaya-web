import { defineSitemapEventHandler } from '#imports';
import { SEOCategorias } from '../../../app/utils/seo-data';

// Páginas de categoría y categoría × municipio (solo las que tienen negocios)
export default defineSitemapEventHandler(async () => {
  const categorias = await obtenerCategoriasSeo();

  let negocios: NegocioSeo[] = [];
  try {
    negocios = await obtenerNegociosSeo();
  } catch (e) {
    console.error('[sitemap] No se pudieron cargar negocios:', e);
  }

  const combos = combinacionesConNegocios(categorias, negocios);
  const categoriasConNegocios = new Set(combos.map((c) => c.categoria.slug));
  const fijas = new Set(SEOCategorias.map((c) => c.slug));

  return [
    // Las categorías fijas siempre (su página lista las ciudades); las dinámicas solo si tienen negocios
    ...categorias
      .filter((c) => fijas.has(c.slug) || categoriasConNegocios.has(c.slug))
      .map((c) => ({ loc: `/${c.slug}`, _sitemap: 'paginas' })),
    ...combos.map(({ categoria, municipio }) => ({
      loc: `/${categoria.slug}/${municipio.slug}`,
      _sitemap: 'paginas',
    })),
  ];
});
