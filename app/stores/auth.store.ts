
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

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  sameSite: 'lax' as const,
};

const parseUserCookie = (cookieVal: any): User | null => {
  if (!cookieVal) return null;
  if (typeof cookieVal === 'object' && cookieVal !== null && (cookieVal.uid || cookieVal.email)) {
    return cookieVal as User;
  }
  if (typeof cookieVal === 'string') {
    try {
      let parsed = JSON.parse(cookieVal);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && typeof parsed === 'object' && (parsed.uid || parsed.email)) {
        return parsed as User;
      }
    } catch (e) {
      console.error('Error al parsear user_session cookie:', e);
    }
  }
  return null;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
  }),
  actions: {
    async initialize() {
      const tokenCookie = useCookie<string | null>('auth_token', { path: '/' });
      const userCookie = useCookie<any>('user_session', { path: '/' });

      if (tokenCookie.value) {
        // 1. Restaurar del cookie inmediatamente para evitar flicker
        const cachedUser = parseUserCookie(userCookie.value);
        if (cachedUser) {
          this.user = cachedUser;
          // Normalizar el cookie si estaba como string
          if (typeof userCookie.value === 'string') {
            userCookie.value = cachedUser;
          }
        }

        // 2. Sincronizar con el backend para tener los datos más actualizados y validar el token
        try {
          const config = useRuntimeConfig();
          const API_BASE = config.public.apiBase;
          const data: any = await $fetch(`${API_BASE}/users/profile`, {
            headers: {
              Authorization: `Bearer ${tokenCookie.value}`,
            },
          });

          if (data && data._id) {
            const freshUser: User = {
              uid: data._id,
              email: data.correo,
              displayName: data.nombre || data.correo?.split('@')[0] || 'Usuario',
              photoURL: data.image?.url || data.foto,
              birthDate: data.fechanacimineto,
              image: data.image,
              ubicacion: data.ubicacion,
              token: tokenCookie.value,
            };
            this.user = freshUser;
            userCookie.value = freshUser;
          }
        } catch (err: any) {
          if (err?.status === 401 || err?.statusCode === 401 || err?.status === 403 || err?.statusCode === 403) {
            console.warn('Token expirado o inválido, limpiando sesión.');
            this.user = null;
            tokenCookie.value = null;
            userCookie.value = null;
          }
        }
      } else {
        this.user = null;
        userCookie.value = null;
      }
    },

    async login(email: string, pass: string, captchaToken?: string) {
      if (!captchaToken) {
        throw new Error('Completa la verificación de seguridad para continuar');
      }

      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      this.loading = true;
      try {
        const response: any = await $fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          body: {
            correo: email,
            contrasena: pass,
            tokenCloudfare: captchaToken,
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

        const tokenCookie = useCookie('auth_token', COOKIE_OPTIONS);
        const userCookie = useCookie('user_session', COOKIE_OPTIONS);

        tokenCookie.value = access_token;
        userCookie.value = user;

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
      if (!captchaToken) {
        throw new Error('Completa la verificación de seguridad para continuar');
      }

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
            tokenCloudfare: captchaToken,
          },
        });

        const { access_token } = response;
        const data = response;

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

        const tokenCookie = useCookie('auth_token', COOKIE_OPTIONS);
        const userCookie = useCookie('user_session', COOKIE_OPTIONS);

        tokenCookie.value = access_token;
        userCookie.value = user;

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
      const tokenCookie = useCookie('auth_token', { path: '/' });
      const userCookie = useCookie('user_session', { path: '/' });

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
             const userCookie = useCookie('user_session', COOKIE_OPTIONS);
             userCookie.value = this.user;
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
       if (!this.user?.token) return [];
       
       this.loading = true;
       try {
         const { obtenerMisNegocios } = await import('~/services/negocio');
         const negocios = await obtenerMisNegocios(this.user.token);
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

        const tokenCookie = useCookie('auth_token', COOKIE_OPTIONS);
        const userCookie = useCookie('user_session', COOKIE_OPTIONS);

        tokenCookie.value = access_token;
        userCookie.value = user;

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
