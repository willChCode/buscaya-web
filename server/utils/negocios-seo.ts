import { SEOCategorias, SEOMunicipios, type SEOCategoria } from '../../app/utils/seo-data';
import { crearSlug, normalizarTexto } from '../../app/utils/helpers';
import { negocioVisible } from '../../app/utils/seo-negocio';
import { municipioDeNegocio } from '../../app/utils/municipio';

export interface NegocioSeo {
  _id: string;
  nombre: string;
  categoria?: string;
  direccion?: string | null;
  municipio?: string | null;
  ubicacion?: { coordinates: [number, number] };
  updatedAt?: string;
}

const UNA_HORA = 60 * 60;

// Mínimo de negocios para que una categoría salida de los datos tenga página propia
const MIN_NEGOCIOS_CATEGORIA = 3;

// Slugs que ya son páginas del sitio y no pueden ser categorías
const RUTAS_RESERVADAS = new Set([
  'admin', 'comunidad', 'contacto', 'negocio', 'negocios', 'perfil',
  'privacidad', 'publicacion', 'revista', 'soporte', 'splash', 'terminos', 'api',
]);

/**
 * Lista ligera de negocios visibles. Usa GET /negocios/sitemap y, si el backend
 * aún no tiene ese endpoint, recorre GET /negocios página por página.
 */
export const obtenerNegociosSeo = defineCachedFunction(
  async (): Promise<NegocioSeo[]> => {
    const { apiBase } = useRuntimeConfig().public;

    try {
      return await $fetch<NegocioSeo[]>(`${apiBase}/negocios/sitemap`);
    } catch {
      const primera: any = await $fetch(`${apiBase}/negocios`, { query: { page: 1 } });
      const paginas: any[] = [primera];
      const lastPage = primera?.meta?.lastPage || 1;

      // De 5 en 5 para no saturar el backend
      for (let page = 2; page <= lastPage; page += 5) {
        const lote = [];
        for (let p = page; p < page + 5 && p <= lastPage; p++) {
          lote.push($fetch(`${apiBase}/negocios`, { query: { page: p } }));
        }
        paginas.push(...(await Promise.all(lote)));
      }

      return paginas.flatMap((r) => r?.data || []).filter(negocioVisible);
    }
  },
  {
    name: 'negocios-seo',
    maxAge: UNA_HORA,
    swr: true,
    // En desarrollo siempre datos frescos
    shouldBypassCache: () => import.meta.dev,
  }
);

/**
 * Categorías SEO: las fijas de seo-data más las que salen de los datos reales
 * (cualquier categoría con suficientes negocios).
 */
export const obtenerCategoriasSeo = defineCachedFunction(
  async (): Promise<SEOCategoria[]> => {
    let negocios: NegocioSeo[] = [];
    try {
      negocios = await obtenerNegociosSeo();
    } catch (e) {
      console.error('[seo] No se pudieron cargar negocios para categorías:', e);
      return SEOCategorias;
    }

    const ocupados = new Set(SEOCategorias.flatMap((c) => [c.slug, c.slugSingular]));
    const conteo = new Map<string, { nombres: Map<string, number>; total: number }>();

    for (const n of negocios) {
      const nombre = (n.categoria || '').trim();
      const slug = crearSlug(nombre);
      if (!slug || ocupados.has(slug) || RUTAS_RESERVADAS.has(slug)) continue;

      const item = conteo.get(slug) || { nombres: new Map(), total: 0 };
      item.total++;
      item.nombres.set(nombre, (item.nombres.get(nombre) || 0) + 1);
      conteo.set(slug, item);
    }

    const dinamicas: SEOCategoria[] = [];
    for (const [slug, { nombres, total }] of conteo) {
      if (total < MIN_NEGOCIOS_CATEGORIA) continue;
      // La forma más común de escribir la categoría, con mayúscula inicial
      const masComun = [...nombres.entries()].sort((a, b) => b[1] - a[1])[0]![0];
      const nombre = masComun.charAt(0).toUpperCase() + masComun.slice(1);
      dinamicas.push({ nombre, nombrePlural: nombre, slug, slugSingular: '', term: nombre });
    }

    dinamicas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return [...SEOCategorias, ...dinamicas];
  },
  {
    name: 'categorias-seo',
    maxAge: UNA_HORA,
    swr: true,
    // En desarrollo siempre datos frescos
    shouldBypassCache: () => import.meta.dev,
  }
);

/**
 * Combinaciones categoría × municipio con al menos un negocio DENTRO del municipio
 * (mismo criterio que la página /[categoria]/[municipio] para indexarse).
 */
export const combinacionesConNegocios = (
  categorias: SEOCategoria[],
  negocios: NegocioSeo[]
) => {
  const combos: {
    categoria: SEOCategoria;
    municipio: (typeof SEOMunicipios)[number];
    total: number;
  }[] = [];

  for (const categoria of categorias) {
    const term = normalizarTexto(categoria.term);
    const porMunicipio = new Map<string, number>();

    for (const n of negocios) {
      if (!normalizarTexto(`${n.categoria || ''} ${n.nombre || ''}`).includes(term)) continue;
      const m = municipioDeNegocio(n);
      if (m) porMunicipio.set(m.slug, (porMunicipio.get(m.slug) || 0) + 1);
    }

    for (const municipio of SEOMunicipios) {
      const total = porMunicipio.get(municipio.slug);
      if (total) combos.push({ categoria, municipio, total });
    }
  }

  return combos;
};
