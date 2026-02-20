// export interface Colonia {
//   // ... tus propiedades de Colonia
// }

/**
 * Define la estructura GeoJSON para la ubicación en MongoDB.
 */
export interface Ubicacion {
  type: 'Point'
  coordinates: [number, number] // Formato: [Longitud, Latitud]
}

/**
 * Define la estructura de una reseña.
 */
export interface Reseña {
  usuario: {
    id: string
    nombre: string
    image?: {
      url: string
      id: string
    }
  }
  comentario: string
  calificacion: number | string // Handle both just in case
  fecha?: string
}

/**
 * Define los métodos de contacto del negocio.
 * Se marcan como opcionales o 'null' ya que no todos los negocios los tendrán.
 */
export interface Contacto {
  telefono?: number | null
  whatsapp?: number | null
  facebook?: string | null
  instagram?: string | null
}

/**
 * Define un producto o servicio ofrecido por el negocio.
 */
export interface Producto {
  nombre: string
  precio: number
  descripcion: string
  descripcionCorta: string
  foto: string | { url: string }
}

/**
 * Define un tramo de horario (ej. 09:00 a 14:00)
 */
export interface TramoHorario {
  abre: string // "HH:mm"
  cierra: string // "HH:mm"
}

/**
 * Define el objeto de horarios principal
 */
export interface Horarios {
  lunes: TramoHorario[]
  martes: TramoHorario[]
  miercoles: TramoHorario[]
  jueves: TramoHorario[]
  viernes: TramoHorario[]
  sabado: TramoHorario[]
  domingo: TramoHorario[]
}

/**
 * Define los colores de marca del negocio
 */
export interface Colores {
  primario: string
  secundario: string | null
}

/**
 * Define la estructura principal del objeto Negocio.
 */
export interface Negocio {
  _id: string // El ID que asigna MongoDB
  // logo: string // DEPRECATED: Mobile uses portada
  portada: { url: string; id: string }
  nombre: string
  grupo: string 
  // categoria: string
  tag: string[]
  colonia: string // El nombre de la colonia

  // --- Campos nuevos ---
  descripcionCorta?: string
  descripcion?: string
  horarios: Horarios
  colores?: Colores
  // --------------------

  ubicacion: Ubicacion
  totalReseñas?: number
  sumaCalificaciones?: number
  promedio: number
  reseñas?: Reseña[]
  contacto: Contacto
  productos: Producto[]

  distancia: number
  membresia?: {
    plan?: string;
    fechaInicio?: string;
    fechaFin?: string;
  };
  galeria?: { url: string; id: string }[];
}
