import { SEOCategorias } from '../../../app/utils/seo-data';

// Enlaces para la sección "Busca por categoría y ciudad" de la portada:
// categorías con página y las combinaciones categoría × ciudad con más negocios.
export default defineEventHandler(async () => {
  const categorias = await obtenerCategoriasSeo();

  let negocios: NegocioSeo[] = [];
  try {
    negocios = await obtenerNegociosSeo();
  } catch (e) {
    console.error('[seo] No se pudieron cargar negocios para destacados:', e);
  }

  const combos = combinacionesConNegocios(categorias, negocios);
  const conNegocios = new Set(combos.map((c) => c.categoria.slug));
  const fijas = new Set(SEOCategorias.map((c) => c.slug));

  return {
    categorias: categorias
      .filter((c) => fijas.has(c.slug) || conNegocios.has(c.slug))
      .map((c) => ({ url: `/${c.slug}`, texto: c.nombrePlural })),
    combinaciones: combos
      .sort((a, b) => b.total - a.total)
      .slice(0, 24)
      .map((c) => ({
        url: `/${c.categoria.slug}/${c.municipio.slug}`,
        texto: `${c.categoria.nombrePlural} en ${c.municipio.nombre}`,
      })),
  };
});
