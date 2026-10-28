/**
 * Normaliza un string (quita acentos, espacios extra y pasa a minúsculas)
 */
export const normalizarTexto = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

/**
 * Crea un slug URL-friendly a partir de un string
 */
export const crearSlug = (s: string) =>
  normalizarTexto(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/**
 * Busca un valor dentro de address_components de Google Maps
 */
export function extraerValor(
  components: any[],
  keys: string | string[]
): string | null {
  const arr = Array.isArray(keys) ? keys : [keys];
  const item = components.find((c) =>
    c.types.some((t: string) => arr.includes(t))
  );
  return item ? item.long_name : null;
}

export const SITE_URL = 'https://buscaya.mx';

/**
 * URL canónica de un negocio: /negocio/<slug>-<id>
 */
export const urlNegocio = (negocio: { nombre?: string; _id?: string; id?: string }) => {
  const id = negocio._id || negocio.id || '';
  const slug = crearSlug(negocio.nombre || 'negocio');
  return `/negocio/${slug ? `${slug}-` : ''}${id}`;
};

/**
 * Extrae el ObjectId de MongoDB (24 hex) del final del slug
 */
export const extraerIdDeSlug = (param: string): string | null => {
  const match = (param || '').match(/([a-f0-9]{24})$/i);
  return match ? match[1]! : null;
};

/**
 * Pide a ImageKit la imagen redimensionada y en formato moderno (webp/avif).
 * Las URLs que no son de ImageKit se devuelven igual.
 */
export const imagenOptimizada = (url: string | undefined | null, ancho = 600) => {
  if (!url || !url.includes('ik.imagekit.io')) return url || '';
  const separador = url.includes('?') ? '&' : '?';
  return `${url}${separador}tr=w-${ancho},q-75,f-auto`;
};
