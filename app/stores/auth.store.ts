
import { defineStore } from 'pinia';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  birthDate?: string;
  image?: {
    url: string;
    id: string;
  };
  ubicacion?: {
    type: 'Point';
    coordinates: number[];
  };
  onesignalId?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
  }),
  actions: {
    async initialize() {
      const tokenCookie = useCookie('auth_token');
      const userCookie = useCookie<User>('user_session');

      if (tokenCookie.value && userCookie.value) {
        this.user = userCookie.value;
      }
    },

    async login(email: string, pass: string, captchaToken?: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      this.loading = true;
      try {
        const response: any = await $fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          body: {
            correo: email,
            contrasena: pass,
            tokenCloudfare: captchaToken || 'skipped-for-now', // TODO: Implement Cloudflare Turnstile if needed
          },
        });

        const { user: data, access_token } = response;

        const user: User = {
          uid: data._id,
          email: data.correo,
          displayName: data.nombre || data.correo.split('@')[0],
          photoURL: data.image?.url || data.foto,
          birthDate: data.fechanacimineto,
          image: data.image,
          ubicacion: data.ubicacion,
          token: access_token,
        };

        // Persist using Nuxt Cookies
        const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        const userCookie = useCookie('user_session', { maxAge: 60 * 60 * 24 * 7 });

        tokenCookie.value = access_token;
        userCookie.value = JSON.stringify(user);

        this.user = user;
      } catch (error: any) {
        throw new Error(
          error.data?.messageUser ||
          error.data?.message ||
          error.message ||
          'Error al iniciar sesión'
        );
      } finally {
        this.loading = false;
      }
    },

    async register(email: string, pass: string, name: string, captchaToken?: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      this.loading = true;
      try {
        const response: any = await $fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          body: {
            correo: email,
            contrasena: pass,
            nombre: name,
            tokenCloudfare: captchaToken || 'skipped-for-now',
          },
        });

        const { access_token } = response;
        const data = response; // Sometimes register returns different structure, adjusting based on mobile

        const user: User = {
          uid: data._id,
          email: data.correo,
          displayName: data.nombre || data.correo.split('@')[0],
          photoURL: data.image?.url || data.foto,
          birthDate: data.fechanacimineto,
          image: data.image,
          ubicacion: data.ubicacion,
          token: access_token,
        };

        const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 });
        const userCookie = useCookie('user_session', { maxAge: 60 * 60 * 24 * 7 });

        tokenCookie.value = access_token;
        userCookie.value = JSON.stringify(user);

        this.user = user;
      } catch (error: any) {
        throw new Error(
          error.data?.messageUser ||
          error.data?.message ||
          error.message ||
          'Error al registrarse'
        );
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const tokenCookie = useCookie('auth_token');
      const userCookie = useCookie('user_session');

      tokenCookie.value = null;
      userCookie.value = null;
      this.user = null;
      
      // Cleanup other stores
      const { useCommunityStore } = await import('@/stores/community.store');
      const communityStore = useCommunityStore();
      communityStore.resetState();

      // Optional: Redirect to home
      const router = useRouter();
      router.push('/');
    },

    async updateProfile(updates: Partial<User>, imageFile?: File) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      this.loading = true;

      try {
        if (!this.user?.token) throw new Error("No user session");

        const formData = new FormData();
        
        // Critical: Backend identifies user by email in valid_data
        formData.append('correo', this.user.email);

        // Name: Use update or current
        const name = updates.displayName || this.user.displayName;
        formData.append('nombre', name);

        // Birthdate: Only append if it exists and is not empty
        // If updates.birthDate is provided, use it. If not, don't send it unless we want to keep current? 
        // Mobile only sends if updateData.fechanacimineto exists.
        // Web UI sends existing value if not changed, so it might be in updates.
        if (updates.birthDate) {
             formData.append('fechanacimineto', updates.birthDate);
        }

        // Image
        if (imageFile) {
           formData.append('foto', imageFile);
        }

        // Location - if we were updating it here, but typically handled elsewhere
        // if (updates.ubicacion) formData.append('ubicacion', JSON.stringify(updates.ubicacion));

        const response: any = await $fetch(`${API_BASE}/users/update`, {
          method: 'POST',
          body: formData,
          headers: {
             Authorization: `Bearer ${this.user.token}`
             // FormData content-type is handled automatically by fetch
          }
        });

        const data = response; // Response structure might be direct or { user: ... } depending on backend return for this specific endpoint

        // Mobile: const updatedUser = { ...currentUser, displayName: data.nombre ... }
        // We assume backend returns the updated user object or we merge manually.
        // Let's check mobile again: const data = response.data; then maps it.
        
        if (this.user) {
             const updatedUser: User = {
                ...this.user,
                displayName: data.nombre || this.user.displayName,
                birthDate: data.fechanacimineto || this.user.birthDate,
                image: data.image || this.user.image,
                photoURL: data.image?.url || data.foto || this.user.photoURL,
                // Add other fields as necessary
             };

             this.user = updatedUser;
             // Update cookie
             const userCookie = useCookie('user_session', { maxAge: 60 * 60 * 24 * 7 });
             userCookie.value = JSON.stringify(this.user);
        }

        return this.user;

      } catch (error: any) {
        console.error('Update Profile Error:', error);
        throw new Error(error.data?.message || error.message || 'Error al actualizar perfil');
      } finally {
        this.loading = false;
      }
    },

    async fetchMyPublications() {
       if (!this.user?.uid) return [];
       
       this.loading = true;
       try {
         const { obtenerMisNegocios } = await import('~/services/negocio');
         const negocios = await obtenerMisNegocios(this.user.uid);
         return negocios;
       } catch (error: any) {
         console.error('Error fetching my publications:', error);
         throw error;
       } finally {
         this.loading = false;
       }
    },

    async socialLogin(socialData: {
      correo: string;
      nombre: string;
      socialId: string;
      proveedor: 'google' | 'facebook' | 'apple';
      image?: string;
    }) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      this.loading = true;
      try {
        const response: any = await $fetch(`${API_BASE}/auth/social-login`, {
          method: 'POST',
          body: socialData,
        });

        const { user: data, access_token } = response;

        const user: User = {
          uid: data._id,
          email: data.correo,
          displayName: data.nombre || data.correo.split('@')[0],
          photoURL: data.image?.url || data.foto,
          birthDate: data.fechanacimineto,
          image: data.image,
          ubicacion: data.ubicacion,
          token: access_token,
        };

        const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 });
        const userCookie = useCookie('user_session', { maxAge: 60 * 60 * 24 * 7 });

        tokenCookie.value = access_token;
        userCookie.value = JSON.stringify(user);

        this.user = user;
      } catch (error: any) {
        throw new Error(
          error.data?.messageUser ||
          error.data?.message ||
          error.message ||
          'Error al iniciar sesión con red social'
        );
      } finally {
        this.loading = false;
      }
    },

    // Stub for social login - simplified for now
    async socialLoginStub(provider: string) {
      console.warn(`Social login for ${provider} not fully implemented yet.`);
      alert(`El inicio de sesión con ${provider} requiere configuración adicional.`);
    }
  },
});
