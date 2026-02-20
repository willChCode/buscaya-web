import { defineStore } from 'pinia';
import { useUbicacionNegocios } from '@/store/ubicacion.store';

export interface Revista {
  _id: string;
  ubicacion: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  imagen: {
    url: string;
    id: string;
  };
  plan: 'premium' | 'gold' | 'silver';
  negocioId: string;
  nombre?: string;
  categoria?: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export const useRevistaStore = defineStore('revista', {
  state: () => ({
    revistas: [] as Revista[],
    loading: false,
    error: null as string | null,
    page: 1,
    hasMore: false,
  }),

  actions: {
    async fetchRevistas(lat: number, lng: number, radio?: number, page = 1) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      
      const ubicacionStore = useUbicacionNegocios();
      const finalRadio = radio || ubicacionStore.filtros.radius || 3000;

      try {
        this.loading = true;
        this.error = null;
        
        const url = `${API_BASE}/revista?lat=${lat}&lng=${lng}&radio=${finalRadio}&page=${page}`;
        console.log('🕵️ [REVISTA STORE] Fetching:', url);
        
        const response = await fetch(url);

        if (response.ok) {
          const { data, meta } = await response.json();
          
          if (page === 1) {
            this.revistas = data;
          } else {
            this.revistas = [...this.revistas, ...data];
          }
          
          this.page = meta.page;
          this.hasMore = meta.page < meta.lastPage;
          console.log('✅ [REVISTA STORE] Loaded:', this.revistas.length);
        } else {
          const errorMsg = `Error: ${response.status}`;
          this.error = errorMsg;
          console.error('❌ [REVISTA STORE] Failed to fetch:', errorMsg);
        }
      } catch (error: any) {
        this.error = error.message || 'Error desconocido';
        console.error('❌ [REVISTA STORE] Error fetching:', error);
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.revistas = [];
      this.loading = false;
      this.error = null;
      this.page = 1;
      this.hasMore = false;
    },
  },
});
