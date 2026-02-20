// Solo tipos del STATE
export type Coords = { lat: number; lng: number } | undefined

// export type Negocio = {
//   _id: string;
//   nombre: string;
//   tipo?: string;
// };

export interface ClienteState {
  // Ubicación / dirección
  coords: Coords
  direccion: string
  estado: string
  municipio: string
  colonia: string
  cp: string

  // Negocios
  negocios: Negocio[]
  coloniaElegidaNombre: string
  usandoFallback: boolean

  // Meta
  updatedAt: number
  loading: boolean
  status: string
  ok: boolean
}

// USEUBICACION TYPES
// types/ubicacion.ts (o en el mismo archivo arriba de todo)
export interface Ubicacion {
  lat: number
  lng: number
  colonia?: string | null
  cp?: string | null
  municipio?: string | null
  direccion?: string | null
}

// USENEGOCIOS TYPES
export type Negocio = {
  _id: string
  nombre: string
  tipo?: string
}

export type Colonia = {
  _id: string
  nombre: string
  negociosIDS: Negocio[]
}
