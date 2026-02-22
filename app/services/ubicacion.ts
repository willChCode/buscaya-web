/**
 * Servicio de ubicación
 * - obtenerCoordenadas: pide al navegador la posición del usuario
 * - obtenerDireccion: convierte lat/lng en una dirección con Google Maps
 */

/**
 * Pide al navegador las coordenadas actuales del usuario
 */
export async function obtenerCoordenadas(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

/**
 * Convierte coordenadas (lat, lng) en dirección con Google Maps
 */
export async function obtenerDireccion(lat: number, lng: number) {
  const GMAPS_API_KEY = useRuntimeConfig().public.googleMapsKey;
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GMAPS_API_KEY}`
  );
  const data = await resp.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    throw new Error('No se pudo obtener la dirección exacta');
  }

  // // 2️⃣ Buscar colonias cercanas (Places API con proxy para evitar CORS)
  // const radius = 1000; // metros = 1 km
  // const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GMAPS_API_KEY}`;

  // try {
  //   // 🔹 Usar proxy CORS (elige uno, ambos funcionan)
  //   // const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(placesUrl)}`;
  //   const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(placesUrl)}`;

  //   const placesResp = await fetch(proxyUrl);
  //   const rawData = await placesResp.json();

  //   // allorigins devuelve data dentro de contents
  //   const placesData = rawData.contents
  //     ? JSON.parse(rawData.contents)
  //     : rawData;

  //   console.log('📦 PLACES DATA:', placesData.results);

  //   if (placesData.status !== 'OK') {
  //     console.warn('⚠️ Error en Places API:', placesData.status);
  //   } else {
  //     const colonias = placesData.results?.map((p: any) => p.name) || [];
  //     console.log('✅ COLONIAS CERCANAS:', colonias);
  //   }
  // } catch (err) {
  //   console.error('❌ Error al obtener colonias cercanas:', err);
  // }

  return data.results[0]; // address_components + formatted_address
}
// export async function obtenerDireccion(lat: number, lng: number) {
//   const GMAPS_API_KEY = 'AIzaSyCNNlqDH6daeLe_UCCWRWQy8tIOhZ0BwZk'; // ⚠️ reemplaza con tu propia key

//   // 1️⃣ Obtener dirección base
//   const geoResp = await fetch(
//     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GMAPS_API_KEY}`
//   );
//   const geoData = await geoResp.json();

//   if (geoData.status !== 'OK' || geoData.results.length === 0) {
//     throw new Error('No se pudo obtener la dirección exacta');
//   }

//   const direccion = geoData.results[0];
//   console.log('DIRECCION', direccion);

//   // 2️⃣ Buscar colonias cercanas (Places API con tipo "sublocality" o "neighborhood")
//   const radius = 1000; // metros = 1 km
//   const placesResp = await fetch(
//     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=neighborhood&key=${GMAPS_API_KEY}`
//   );
//   console.log('PLACES RESPONSE', placesResp);
//   const placesData = await placesResp.json();
//   console.log('PLACES', placesData);

//   // 3️⃣ Extraer nombres de colonias cercanas
//   const coloniasCercas =
//     placesData.results?.map((place: any) => place.name).filter(Boolean) || [];
//   console.log('COLONIAS', coloniasCercas);

//   return {
//     direccionCompleta: direccion.formatted_address,
//     componentes: direccion.address_components,
//     coloniasCercas
//   };
// }
