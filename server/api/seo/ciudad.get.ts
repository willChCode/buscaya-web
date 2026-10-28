import { SEOMunicipios } from '../../../app/utils/seo-data';
import { municipioDeNegocio, coloniaDeNegocio } from '../../../app/utils/municipio';

const RADIO_M = 15000;
const MAX_RESULTADOS = 300;
const POR_PAGINA = 20; // 5 columnas × 4 filas
const MAX_CERCANOS = 5; // una fila

// Solo los campos que usan las tarjetas y el JSON-LD (el HTML no carga reseñas, galería, etc.)
const resumirNegocio = (n: any) => ({
  _id: n._id,
  nombre: n.nombre,
  categoria: n.categoria,
  portada: n.portada,
  horarios: n.horarios,
  distancia: n.distancia,
  promedio: n.promedio,
  totalReseñas: n.totalReseñas,
  membresia: n.membresia,
  direccion: n.direccion,
  contacto: { whatsapp: n.contacto?.whatsapp || null },
  productos: (n.productos || []).map((p: any) => ({ precio: p.precio, precioOferta: p.precioOferta })),
});

/**
 * Negocios de una página /[categoria]/[municipio]: los que están DENTRO del municipio
 * (paginados) y algunos de municipios vecinos. Cacheado 10 min por combinación para no
 * pegarle al backend en cada visita (tiene límite de 60 peticiones/min por IP).
 */
export default defineCachedEventHandler(
  async (event) => {
    const q = getQuery(event) as Record<string, string>;
    const municipio = SEOMunicipios.find((m) => m.slug === q.municipio);
    const categoria = (await obtenerCategoriasSeo()).find((c) => c.slug === q.categoria);
    if (!municipio || !categoria) {
      throw createError({ statusCode: 404, statusMessage: 'Página no encontrada' });
    }

    const { apiBase } = useRuntimeConfig().public;
    const buscar = (extra: Record<string, any>) =>
      $fetch<any>(`${apiBase}/negocios/cercanos`, {
        query: { lat: municipio.lat, lon: municipio.lon, dist: RADIO_M, search: categoria.term, ...extra },
      });

    let todos: any[];
    try {
      todos = (await buscar({ limit: MAX_RESULTADOS })).data || [];
    } catch {
      // Backend sin el parámetro `limit`: páginas de 20, una por una
      todos = [];
      for (let page = 1; page <= MAX_RESULTADOS / 20; page++) {
        const r = await buscar({ page });
        todos.push(...(r.data || []));
        if (page >= (r.meta?.lastPage || 1)) break;
      }
    }

    const propios: any[] = [];
    const cercanos: any[] = [];
    for (const n of todos) {
      (municipioDeNegocio(n)?.slug === municipio.slug ? propios : cercanos).push(n);
    }

    const totalPaginas = Math.max(1, Math.ceil(propios.length / POR_PAGINA));
    const pagina = Math.max(parseInt(q.pagina, 10) || 1, 1);

    const calificados = propios.filter((n) => n.totalReseñas > 0);

    return {
      total: propios.length,
      pagina,
      totalPaginas,
      porPagina: POR_PAGINA,
      negocios: propios.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA).map(resumirNegocio),
      cercanos: pagina === 1 ? cercanos.slice(0, MAX_CERCANOS).map(resumirNegocio) : [],
      // Datos para el texto propio de la página
      colonias: [...new Set(propios.map(coloniaDeNegocio).filter(Boolean))].slice(0, 3),
      conWhatsapp: propios.filter((n) => n.contacto?.whatsapp).length,
      promedio: calificados.length
        ? Number((calificados.reduce((a, n) => a + Number(n.promedio || 0), 0) / calificados.length).toFixed(1))
        : null,
      destacados: propios.slice(0, 3).map((n) => n.nombre),
    };
  },
  {
    name: 'seo-ciudad',
    maxAge: 60 * 10,
    swr: true,
    getKey: (event) => {
      const q = getQuery(event);
      return `${q.categoria}-${q.municipio}-${q.pagina || 1}`;
    },
    shouldBypassCache: () => import.meta.dev,
  }
);
