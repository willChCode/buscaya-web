import { defineStore } from 'pinia';
import { obtenerCoordenadas, obtenerDireccion } from '@/services/ubicacion';
import { obtenerNegociosCercanos } from '@/services/negocio';
import { normalizarTexto, extraerValor } from '@/utils/helpers';
import type { Ubicacion } from '@/interfaces/location.type';
import type { Negocio } from '@/interfaces/negocio.type';

export const useUbicacionNegocios = defineStore('ubicacionNegocios', {
  state: () => ({
    ubicacion: null as Ubicacion | null,
    // colonias: [] as Colonia[],
    cargando: false,
    error: null as string | null,
    lastUpdate: 0,
    // negocios2: negocios2,
    filtros: {
      search: '',
      giro: '',
      abierto: '' as '' | 'abierto' | 'cerrado',
      radius: 3000,
      rating: 0,
      openNow: false,
      day: undefined as string | undefined,
      time: undefined as string | undefined,
    },
    drawerFiltro: false,
    // test local
    colonia: '' as string,
    colonias: [] as string[],
    negocios: [] as Negocio[],
    negociosFitlrados: [] as Negocio[],
    totalNegocios: 0,
    
    // Separated state for Home Page (Unfiltered)
    negociosHome: [] as Negocio[],
    totalNegociosHome: 0,
    
    lastFilterQuery: null as any,
  }),
  persist: {
    debug: true,
  },

  getters: {},

  actions: {
    async actualizarDatos(force = false) {
      // console.log('first');
      const ahora = Date.now();
      const expiracion = 2 * 60 * 1000; // 2 minutos

      // ✅ Usa cache si ya existe y no está vencido (y no han cambiado los filtros relevantes para fetch)
      // Nota: Si cambian filtros como 'radio' o 'openNow', deberíamos forzar fetch. 
      // Por ahora confiamos en que 'force' viene true desde el UI cuando se aplican filtros.
      if (
        !force &&
        this.ubicacion &&
        this.negocios.length > 0 &&
        ahora - this.lastUpdate < expiracion
      ) {
        console.log('⏩ Usando datos en cache');
        return;
      }

      // Si no tenemos ubicación válida (falta obj o lat/lng), intentamos obtenerla
      if (!this.ubicacion || typeof this.ubicacion.lat === 'undefined' || typeof this.ubicacion.lng === 'undefined') {
        console.warn('⚠️ Ubicación inválida o incompleta stored, intentando obtener GPS...');
        try {
          const coords = await obtenerCoordenadas();
          const { latitude, longitude } = coords.coords;
          await this.establecerUbicacionManual(latitude, longitude); // Esto ya guarda y actualiza datos
          return;
        } catch (e) {
          this.error = 'No se pudo obtener ubicación. Por favor actívala manual.';
          return;
        }
      }

      this.cargando = true;
      this.error = null;

      try {
        if (!this.ubicacion) throw new Error('No hay ubicación para actualizar');

        const { lat, lng } = this.ubicacion;

        // base de datos
        const distanciaEnMetros = this.filtros.radius || 3000;
        const apiFilters = {
             rating: this.filtros.rating > 0 ? this.filtros.rating : undefined,
             group: this.filtros.giro || undefined,
             openNow: this.filtros.abierto === 'abierto',
             day: this.filtros.abierto === 'abierto' ? this.filtros.day : undefined,
             time: this.filtros.abierto === 'abierto' ? this.filtros.time : undefined,
             search: this.filtros.search || undefined
        };
        
        console.log('📡 [STORE] Fetching negocios with params:', { lat, lng, distanciaEnMetros, ...apiFilters });

        const res = await obtenerNegociosCercanos(
          lat,
          lng,
          distanciaEnMetros,
          apiFilters
        );
        this.negocios = res.data;
        // Also update local filtered list to full list initially, 
        // as the backend has already filtered them.
        this.negociosFitlrados = res.data; 
        this.totalNegocios = res.meta.total;
        console.log('✅ NEGOCIOS:', this.negocios.length, 'TOTAL:', this.totalNegocios);

        this.lastUpdate = Date.now();
      } catch (e: any) {
        this.error = e.message;
        console.error('Error actualizarDatos:', e);
      } finally {
        this.cargando = false;
      }
    },
    
    // Accion especifica para la HOME (ignora filtros de categoria/search, solo usa radio)
    async fetchHomeNegocios(force = false) {
       if (!this.ubicacion || typeof this.ubicacion.lat === 'undefined') return;
       
       // Simple cache check specific to home? For now let's reuse logic or just simple check
       if (!force && this.negociosHome.length > 0) return;

       this.cargando = true;
       try {
          const { lat, lng } = this.ubicacion;
          const distanciaEnMetros = 4000; // radio para negocios home
          
          // Solo filtros basicos "Home": Sin categoria, sin search
          // Tal vez si queremos respetar "Abierto ahora" si es muy importante, pero el usuario pidio que no afecte.
          // Asumiremos que HOME = Discovery puro (solo radio).
          const apiFilters = {
              // No group, No search, No openNow per default discovery? 
              // Or maybe keep openNow if it's a global preference? 
              // User said "solo afecte a resultados... que siempre tenga el mismo dato que solicito de 5km".
              // So literally just Radius.
          };

          console.log('🏠 [STORE] Fetching HOME negocios (Radius only):', { lat, lng, distanciaEnMetros });
          const res = await obtenerNegociosCercanos(lat, lng, distanciaEnMetros, apiFilters);
          
          this.negociosHome = res.data;
          this.totalNegociosHome = res.meta.total;
       } catch (e) {
          console.error('Error fetching home negocios:', e);
       } finally {
          this.cargando = false;
       }
    },
    abrirDrawer() {
      this.drawerFiltro = true;
    },
    cerrarDrawer() {
      this.drawerFiltro = false;
    },
    toggleDrawer() {
      this.drawerFiltro = !this.drawerFiltro;
    },
    setFiltros(filtros: Partial<typeof this.filtros>) {
      this.filtros = { ...this.filtros, ...filtros };
    },
    resetFiltros() {
      this.filtros = { search: '', giro: '', abierto: '', radius: 3000, rating: 0, openNow: false, day: undefined, time: undefined };
    },
    async establecerUbicacionManual(lat: number, lng: number) {
      this.cargando = true;
      this.error = null;
      try {
        // 1. Obtener dirección desde coordenadas
        const direccionData = await obtenerDireccion(lat, lng);
        const datosUbicacion = direccionData.address_components;
        console.log('DATOS UBICACION', datosUbicacion);

        this.ubicacion = {
          lat,
          lng,
          colonia: extraerValor(datosUbicacion, [
            'sublocality_level_1',
            'neighborhood',
            'sublocality',
          ]),
          municipio: extraerValor(datosUbicacion, [
            'administrative_area_level_2',
            'locality',
          ]),
          cp: extraerValor(datosUbicacion, 'postal_code'),
          direccion: direccionData.formatted_address,
        };
        console.log('UBICACION MANUAL GUARDADA', this.ubicacion);

        // 2. Actualizar datos usando la nueva ubicación
        await Promise.all([
           this.actualizarDatos(true),
           this.fetchHomeNegocios(true)
        ]);
      } catch (e: any) {
        this.error = e.message;
        console.error('Error al establecer ubicación manual:', e);
        this.cargando = false; 
      }
    },
  },
});
