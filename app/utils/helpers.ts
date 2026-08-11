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
