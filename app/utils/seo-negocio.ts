import { SITE_URL, urlNegocio } from './helpers';

const DIAS_SCHEMA: Record<string, string> = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miercoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
  sabado: 'Saturday',
  domingo: 'Sunday',
};

/**
 * Mismo criterio que el backend en /negocios/cercanos:
 * activo y con "derecho de piso" vigente (fechaInicio <= hoy <= fechaFin).
 */
export const negocioVisible = (negocio: any) => {
  const estado = negocio?.estado;
  if (!estado || estado.activo === false) return false;
  const ahora = new Date();
  if (!estado.fechaInicio || new Date(estado.fechaInicio) > ahora) return false;
  if (!estado.fechaFin || new Date(estado.fechaFin) < ahora) return false;
  return true;
};

/**
 * JSON-LD LocalBusiness para la ficha de un negocio (rich results de Google).
 */
export const schemaLocalBusiness = (negocio: any) => {
  const [lon, lat] = negocio.ubicacion?.coordinates || [];
  const telefono = negocio.contacto?.telefono || negocio.contacto?.whatsapp;

  const horarios = Object.entries(negocio.horarios || {}).flatMap(
    ([dia, tramos]: [string, any]) =>
      DIAS_SCHEMA[dia] && Array.isArray(tramos)
        ? tramos.map((t: any) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: DIAS_SCHEMA[dia],
            opens: t.abre,
            closes: t.cierra,
          }))
        : []
  );

  const redes = [
    negocio.contacto?.facebook,
    negocio.contacto?.instagram,
    negocio.contacto?.tiktok,
    negocio.contacto?.web,
  ].filter((u) => typeof u === 'string' && u.startsWith('http'));

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}${urlNegocio(negocio)}`,
    name: negocio.nombre,
    url: `${SITE_URL}${urlNegocio(negocio)}`,
    description: negocio.descripcion || undefined,
    image: negocio.portada?.url || undefined,
    telephone: telefono ? `+52${telefono}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: negocio.direccion || undefined,
      addressLocality: negocio.colonia || undefined,
      addressCountry: 'MX',
    },
    geo:
      lat && lon
        ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lon }
        : undefined,
    openingHoursSpecification: horarios.length ? horarios : undefined,
    sameAs: redes.length ? redes : undefined,
    aggregateRating:
      negocio.totalReseñas > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(negocio.promedio),
            reviewCount: negocio.totalReseñas,
          }
        : undefined,
  };
};
