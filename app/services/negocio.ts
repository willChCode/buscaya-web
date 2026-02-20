import type { Negocio } from '@/interfaces/negocio.type'


/**
 * Obtiene todas las colonias desde la base de datos
 */
// export async function obtenerColonias(): Promise<Colonia[]> {
//   const res = await fetch(`${API_BASE}/colonias`);
//   if (!res.ok) throw new Error('Error cargando colonias');
//   return res.json() as Promise<Colonia[]>;
// }

/**
 * Obtiene negocios cercanos a una ubicación específica.
 * @param lat - Latitud del centro de la búsqueda
 * @param lon - Longitud del centro de la búsqueda
 * @param dist - Distancia máxima en metros (ej. 4000 para 4km)
 */
export async function obtenerNegociosCercanos(
  lat: number,
  lon: number,
  dist: number,
  filters: {
    rating?: number;
    group?: string;
    openNow?: boolean;
    day?: string;
    time?: string;
    search?: string;
  } = {}
): Promise<{ data: Negocio[]; meta: any }> {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  // Usamos URLSearchParams para construir la query de forma segura
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    dist: dist.toString(),
  })

  if (filters.rating) params.append('rating', filters.rating.toString());
  if (filters.group) params.append('group', filters.group);
  if (filters.openNow) params.append('openNow', 'true');
  if (filters.day) params.append('day', filters.day);
  if (filters.time) params.append('time', filters.time);
  if (filters.search) params.append('search', filters.search);

  const url = `${API_BASE}/negocios/cercanos?${params.toString()}`;

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Error cargando negocios cercanos')
  }
  
  const data = await res.json()

  // The backend likely returns { data: Negocio[], meta: ... }
  // We return the full object to access meta
  return { 
    data: (data.data || []) as Negocio[], 
    meta: data.meta || { total: 0, page: 1, lastPage: 1 } 
  };
}

/**
 * Agrega una nueva reseña a un negocio.
 * Endpoint: POST /negocios/:id/resenas
 */
export async function agregarResena(
  negocioId: string,
  datos: { calificacion: number; comentario: string },
  token: string
): Promise<Negocio> {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase
  
  const url = `${API_BASE}/negocios/${negocioId}/resenas`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  })

  if (!res.ok) {
    // Intentamos leer el error del backend para saber qué pasó (ej. validación fallida)
    const errorData = await res.json().catch(() => null)
    const mensaje = errorData?.message
      ? Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message
      : 'Error al publicar la reseña'

    throw new Error(mensaje)
  }

  // Devuelve el negocio actualizado con la nueva reseña
  return res.json() as Promise<Negocio>
}

/**
 * Obtiene los negocios de un usuario específico.
 * Endpoint: GET /negocios/usuario/:id
 */
export async function obtenerMisNegocios(userId: string): Promise<Negocio[]> {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;

  const res = await fetch(`${API_BASE}/negocios/usuario/${userId}`);

  if (!res.ok) {
    throw new Error('Error cargando mis negocios');
  }

  const data = await res.json();
  // Adjust based on backend response structure (likely similar to obtenerNegociosCercanos)
  return (data.data || data) as Negocio[];
}
/**
 * Registra una visita a un negocio para métricas.
 * Endpoint: POST /metricas/visita
 */
export async function registrarVisita(negocioId: string): Promise<{ ok: boolean }> {
  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;
  
  const url = `${API_BASE}/metricas/visita`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ negocioId }),
    });

    if (!res.ok) {
      console.error('Error al registrar visita:', res.statusText);
      return { ok: false };
    }

    return await res.json();
  } catch (error) {
    console.error('Error de red al registrar visita:', error);
    return { ok: false };
  }
}
