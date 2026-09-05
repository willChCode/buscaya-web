export interface SEOMunicipio {
  nombre: string;
  slug: string;
  lat: number;
  lon: number;
}

export interface SEOCategoria {
  nombre: string;
  nombrePlural: string;
  slug: string;         // URL oficial en plural (ej. 'abogados')
  slugSingular: string; // URL antigua en singular para redirecciones (ej. 'abogado')
  term: string;         // Término de búsqueda que se envía al backend para filtrar la base de datos
}

export const SEOMunicipios: SEOMunicipio[] = [
  { nombre: 'Monterrey', slug: 'monterrey', lat: 25.6866, lon: -100.3161 },
  { nombre: 'Apodaca', slug: 'apodaca', lat: 25.7820, lon: -100.1889 },
  { nombre: 'San Pedro Garza García', slug: 'san-pedro-garza-garcia', lat: 25.6575, lon: -100.4021 },
  { nombre: 'San Nicolás de los Garza', slug: 'san-nicolas-de-los-garza', lat: 25.7485, lon: -100.2884 },
  { nombre: 'Guadalupe', slug: 'guadalupe', lat: 25.6791, lon: -100.2588 },
  { nombre: 'Santa Catarina', slug: 'santa-catarina', lat: 25.6738, lon: -100.4627 },
  { nombre: 'General Escobedo', slug: 'escobedo', lat: 25.7997, lon: -100.3204 },
  { nombre: 'Juárez', slug: 'juarez', lat: 25.6473, lon: -100.0963 },
  { nombre: 'García', slug: 'garcia', lat: 25.8118, lon: -100.5960 },
  { nombre: 'Santiago', slug: 'santiago', lat: 25.4243, lon: -100.1504 },
  { nombre: 'Cadereyta Jiménez', slug: 'cadereyta', lat: 25.5901, lon: -100.0033 },
  { nombre: 'Salinas Victoria', slug: 'salinas-victoria', lat: 25.9610, lon: -100.2872 },
];

export const SEOCategorias: SEOCategoria[] = [
  { nombre: 'Dermatólogo', nombrePlural: 'Dermatólogos', slug: 'dermatologos', slugSingular: 'dermatologo', term: 'dermatologo' },
  { nombre: 'Dentista', nombrePlural: 'Dentistas', slug: 'dentistas', slugSingular: 'dentista', term: 'dentista' },
  { nombre: 'Plomero', nombrePlural: 'Plomeros', slug: 'plomeros', slugSingular: 'plomero', term: 'plomero' },
  { nombre: 'Albañil', nombrePlural: 'Albañiles', slug: 'albaniles', slugSingular: 'albanil', term: 'albanil' },
  { nombre: 'Electricista', nombrePlural: 'Electricistas', slug: 'electricistas', slugSingular: 'electricista', term: 'electricista' },
  { nombre: 'Abogado', nombrePlural: 'Abogados', slug: 'abogados', slugSingular: 'abogado', term: 'abogado' },
  { nombre: 'Carpintero', nombrePlural: 'Carpinteros', slug: 'carpinteros', slugSingular: 'carpintero', term: 'carpintero' },
  { nombre: 'Mecánico', nombrePlural: 'Mecánicos', slug: 'mecanicos', slugSingular: 'mecanico', term: 'mecanico' },
  { nombre: 'Veterinario', nombrePlural: 'Veterinarios', slug: 'veterinarios', slugSingular: 'veterinario', term: 'veterinario' },
  { nombre: 'Estética', nombrePlural: 'Estéticas', slug: 'esteticas', slugSingular: 'estetica', term: 'estetica' },
  { nombre: 'Restaurante', nombrePlural: 'Restaurantes', slug: 'restaurantes', slugSingular: 'restaurante', term: 'restaurante' },
  { nombre: 'Ferretería', nombrePlural: 'Ferreterías', slug: 'ferreterias', slugSingular: 'ferreteria', term: 'ferreteria' },
  { nombre: 'Farmacia', nombrePlural: 'Farmacias', slug: 'farmacias', slugSingular: 'farmacia', term: 'farmacia' },
];
