export interface Subcategoria {
  nombre: string;
  icono: string; // Nombre del icono de Ionicons
}

export interface GrupoCategoria {
  nombre: string;
  icono: string; // Nombre del icono de Ionicons del Grupo
  imagen: string; // ruta al asset estatico
  subcategorias: Subcategoria[];
}

/**
 * SOURCE OF TRUTH (FUENTE ÚNICA DE VERDAD UNIFICADA)
 * Toda la estructura de categorías, grupos, iconos y banners del sistema
 * se administra de forma ordenada desde esta única colección de datos.
 */
export const GRUPOS_CATEGORIAS_UNIFICADOS: GrupoCategoria[] = [
  {
    nombre: "Servicios Profesionales",
    icono: "briefcase",
    imagen: "/categorias/profesionistas.png",
    subcategorias: [
      { nombre: "Abogado", icono: "briefcase-outline" },
      { nombre: "Contador", icono: "calculator-outline" },
      { nombre: "Arquitecto", icono: "business-outline" },
      { nombre: "Ingeniero", icono: "construct-outline" },
      { nombre: "Psicólogo", icono: "people-outline" },
      { nombre: "Consultor", icono: "chatbubbles-outline" },
      { nombre: "Diseñador", icono: "color-palette-outline" },
      { nombre: "Marketing", icono: "megaphone-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Salud y Medicina",
    icono: "medkit",
    imagen: "/categorias/Salud.png",
    subcategorias: [
      { nombre: "Dentista", icono: "medkit-outline" },
      { nombre: "Médico General", icono: "fitness-outline" },
      { nombre: "Pediatra", icono: "happy-outline" },
      { nombre: "Ginecólogo", icono: "woman-outline" },
      { nombre: "Laboratorio", icono: "flask-outline" },
      { nombre: "Óptica", icono: "glasses-outline" },
      { nombre: "Nutriólogo", icono: "nutrition-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Comida y Bebida",
    icono: "restaurant",
    imagen: "/categorias/Comida.png",
    subcategorias: [
      { nombre: "Tacos", icono: "restaurant-outline" },
      { nombre: "Hamburguesas", icono: "fast-food-outline" },
      { nombre: "Pizza", icono: "pizza-outline" },
      { nombre: "Sushi", icono: "fish-outline" },
      { nombre: "Cafetería", icono: "cafe-outline" },
      { nombre: "Postres", icono: "ice-cream-outline" },
      { nombre: "Comida Corrida", icono: "restaurant-outline" },
      { nombre: "Restaurante", icono: "restaurant-outline" },
      { nombre: "Antojitos", icono: "fast-food-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Comercio Local",
    icono: "storefront",
    imagen: "/categorias/Tiendas.png",
    subcategorias: [
      { nombre: "Abarrotes", icono: "basket-outline" },
      { nombre: "Carnicería", icono: "restaurant-outline" },
      { nombre: "Frutería", icono: "nutrition-outline" },
      { nombre: "Farmacia", icono: "medical-outline" },
      { nombre: "Papelería", icono: "pencil-outline" },
      { nombre: "Regalos", icono: "gift-outline" },
      { nombre: "Zapatería", icono: "walk-outline" },
      { nombre: "Mercería", icono: "cut-outline" },
      { nombre: "Florería", icono: "rose-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Mascotas y Veterinaria",
    icono: "paw",
    imagen: "/categorias/Mascotas.png",
    subcategorias: [
      { nombre: "Veterinaria", icono: "paw-outline" },
      { nombre: "Estética Canina", icono: "cut-outline" },
      { nombre: "Alimentos", icono: "basket-outline" },
      { nombre: "Entrenamiento", icono: "walk-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Moda y Estilo",
    icono: "shirt",
    imagen: "/categorias/ropa.png",
    subcategorias: [
      { nombre: "Ropa", icono: "shirt-outline" },
      { nombre: "Calzado", icono: "walk-outline" },
      { nombre: "Accesorios", icono: "watch-outline" },
      { nombre: "Joyería", icono: "diamond-outline" },
      { nombre: "Boutique", icono: "storefront-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Tecnología y Oficina",
    icono: "laptop",
    imagen: "/categorias/papelerias.png",
    subcategorias: [
      { nombre: "Computación", icono: "desktop-outline" },
      { nombre: "Celulares", icono: "phone-portrait-outline" },
      { nombre: "Reparación", icono: "build-outline" },
      { nombre: "Software", icono: "code-slash-outline" },
      { nombre: "Oficina", icono: "briefcase-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Viajes y Hospedaje",
    icono: "airplane",
    imagen: "/categorias/Hospedajes.png",
    subcategorias: [
      { nombre: "Hotel", icono: "bed-outline" },
      { nombre: "Airbnb", icono: "home-outline" },
      { nombre: "Agencia de Viajes", icono: "airplane-outline" },
      { nombre: "Transporte", icono: "bus-outline" },
      { nombre: "Renta de Autos", icono: "car-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Mundo Automotriz",
    icono: "car",
    imagen: "/categorias/Mecanico.png",
    subcategorias: [
      { nombre: "Mecánico", icono: "car-sport-outline" },
      { nombre: "Llantas", icono: "disc-outline" },
      { nombre: "Autolavado", icono: "water-outline" },
      { nombre: "Refacciones", icono: "settings-outline" },
      { nombre: "Carrocería", icono: "hammer-outline" },
      { nombre: "Baterías", icono: "battery-charging-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Servicios Técnicos",
    icono: "construct",
    imagen: "/categorias/Hogar.png",
    subcategorias: [
      { nombre: "Plomero", icono: "water-outline" },
      { nombre: "Electricista", icono: "flash-outline" },
      { nombre: "Carpintero", icono: "hammer-outline" },
      { nombre: "Pintor", icono: "color-fill-outline" },
      { nombre: "Climas", icono: "snow-outline" },
      { nombre: "Ferretería", icono: "construct-outline" },
      { nombre: "Limpieza", icono: "sparkles-outline" },
      { nombre: "Cerrajería", icono: "key-outline" },
      { nombre: "Costurería", icono: "shirt-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Estética y Belleza",
    icono: "cut",
    imagen: "/categorias/Belleza.png",
    subcategorias: [
      { nombre: "Barbería", icono: "cut-outline" },
      { nombre: "Estética", icono: "color-wand-outline" },
      { nombre: "Uñas", icono: "hand-left-outline" },
      { nombre: "Spa", icono: "leaf-outline" },
      { nombre: "Maquillaje", icono: "color-palette-outline" },
      { nombre: "Depilación", icono: "cut-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Eventos y Fiestas",
    icono: "calendar",
    imagen: "/categorias/Eventos.png",
    subcategorias: [
      { nombre: "Salón de Eventos", icono: "storefront-outline" },
      { nombre: "Pastelería", icono: "fast-food-outline" },
      { nombre: "Decoración", icono: "color-palette-outline" },
      { nombre: "Música/DJ", icono: "musical-notes-outline" },
      { nombre: "Fotografía", icono: "camera-outline" },
      { nombre: "Inflables", icono: "balloon-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Finanzas y Seguros",
    icono: "wallet",
    imagen: "/categorias/bancos.png",
    subcategorias: [
      { nombre: "Caja de Ahorro", icono: "wallet-outline" },
      { nombre: "Seguros", icono: "shield-checkmark-outline" },
      { nombre: "Casa de Cambio", icono: "cash-outline" },
      { nombre: "Préstamos", icono: "card-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Fitness y Deportes",
    icono: "barbell",
    imagen: "/categorias/deportes.png",
    subcategorias: [
      { nombre: "Gimnasio", icono: "barbell-outline" },
      { nombre: "Crossfit", icono: "bicycle-outline" },
      { nombre: "Yoga", icono: "body-outline" },
      { nombre: "Natación", icono: "water-outline" },
      { nombre: "Artículos Deportivos", icono: "football-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
  {
    nombre: "Hogar y Muebles",
    icono: "home",
    imagen: "/categorias/muebles.png",
    subcategorias: [
      { nombre: "Mueblería", icono: "bed-outline" },
      { nombre: "Decoración", icono: "color-palette-outline" },
      { nombre: "Blancos", icono: "shirt-outline" },
      { nombre: "Electrodomésticos", icono: "tv-outline" },
      { nombre: "Cocinas", icono: "restaurant-outline" },
      { nombre: "Otro", icono: "grid-outline" },
    ],
  },
];

// --- COMPATIBILIDAD RETROACTIVA ---
// Auto-generamos las antiguas estructuras del sistema a partir de la fuente unificada
// Esto evita tener que modificar archivos en cascada por todo el proyecto.

export const GRUPOS_CATEGORIAS: Record<string, string[]> = {};
export const CATEGORY_ICONS: Record<string, string> = {};
export const GROUP_IMAGES: Record<string, any> = {};
export const GROUP_ICONS: Record<string, string> = {};

GRUPOS_CATEGORIAS_UNIFICADOS.forEach((grupo) => {
  GRUPOS_CATEGORIAS[grupo.nombre] = grupo.subcategorias.map((s) => s.nombre);
  GROUP_IMAGES[grupo.nombre] = grupo.imagen;
  GROUP_ICONS[grupo.nombre] = grupo.icono;
  grupo.subcategorias.forEach((sub) => {
    CATEGORY_ICONS[sub.nombre] = sub.icono;
  });
});

export const GRUPOS = Object.keys(GRUPOS_CATEGORIAS);

export const getCategoryIcon = (category: string) =>
  CATEGORY_ICONS[category] || "grid-outline";

export const getGroupIcon = (groupName: string) =>
  GROUP_ICONS[groupName] || "grid";
