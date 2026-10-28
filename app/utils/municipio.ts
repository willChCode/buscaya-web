import { SEOMunicipios, type SEOMunicipio } from './seo-data';
import { normalizarTexto } from './helpers';

// Si no hay municipio en los datos ni en la dirección, se usa el centro más cercano hasta esta distancia
const MAX_DISTANCIA_CENTRO_M = 20000;

// Municipios cuyo nombre también es nombre de persona o calle ("Farmacia Benito Juárez"):
// no se buscan dentro del nombre del negocio
const AMBIGUOS_EN_NOMBRE = new Set(['juarez', 'garcia', 'santiago', 'guadalupe']);

const limpiar = (s: string) =>
  normalizarTexto(s)
    .replace(/\b\d{5}\b/g, '') // código postal
    .replace(/\b(cd|cdad|ciudad|mpio|municipio)\b\.?/g, '')
    .replace(/[.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const nombresMunicipio = (m: SEOMunicipio) =>
  [m.nombre, ...(m.alias || [])].map(limpiar);

const buscarPorNombre = (texto: string): SEOMunicipio | null => {
  const t = limpiar(texto);
  if (!t) return null;
  return SEOMunicipios.find((m) => nombresMunicipio(m).includes(t)) || null;
};

export const distanciaMetros = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Municipio de un negocio, en este orden:
 * 1. campo `municipio` (lo que guarde el scraping)
 * 2. la dirección de Google: "Calle 123, Colonia, 67198 Guadalupe, N.L., México"
 *    (se revisan los últimos tramos para no confundir calles como "Av. Benito Juárez")
 * 3. el nombre del negocio, si menciona un municipio ("Los Dentistas Apodaca")
 * 4. el centro de municipio más cercano
 */
export const municipioDeNegocio = (negocio: {
  nombre?: string | null;
  municipio?: string | null;
  direccion?: string | null;
  ubicacion?: { coordinates?: [number, number] } | null;
}): SEOMunicipio | null => {
  if (negocio.municipio) {
    const m = buscarPorNombre(negocio.municipio);
    if (m) return m;
  }

  if (negocio.direccion) {
    const tramos = negocio.direccion.split(',').map((t) => t.trim()).filter(Boolean);
    for (const tramo of tramos.slice(-3).reverse()) {
      const m = buscarPorNombre(tramo);
      if (m) return m;
    }
  }

  if (negocio.nombre) {
    const nombre = ` ${limpiar(negocio.nombre)} `;
    const enNombre = SEOMunicipios.filter(
      (m) =>
        !AMBIGUOS_EN_NOMBRE.has(m.slug) &&
        nombresMunicipio(m).some((n) => nombre.includes(` ${n} `))
    );
    if (enNombre.length === 1) return enNombre[0]!;
  }

  const [lon, lat] = negocio.ubicacion?.coordinates || [];
  if (lat === undefined || lon === undefined) return null;

  let cercano: SEOMunicipio | null = null;
  let menor = Infinity;
  for (const m of SEOMunicipios) {
    const d = distanciaMetros(lat, lon, m.lat, m.lon);
    if (d < menor) {
      menor = d;
      cercano = m;
    }
  }
  return menor <= MAX_DISTANCIA_CENTRO_M ? cercano : null;
};

/**
 * Colonia a partir de la dirección de Google: el tramo anterior a "CP Municipio".
 */
export const coloniaDeNegocio = (negocio: { colonia?: string | null; direccion?: string | null }) => {
  if (negocio.colonia) return negocio.colonia;
  const tramos = (negocio.direccion || '').split(',').map((t) => t.trim());
  const iMunicipio = tramos.findIndex((t) => /\b\d{5}\b/.test(t));
  if (iMunicipio < 2) return null;
  const candidato = tramos[iMunicipio - 1]!;
  // Si el tramo parece calle o número ("Av. Venustiano Carranza 500-Local 37"), no es colonia
  if (/\d/.test(candidato) || /^(av|avenida|calle|c|blvd|bulevar|carr|carretera|calz|calzada|priv|privada|local|loc)\b\.?/i.test(candidato)) {
    return null;
  }
  return candidato;
};
