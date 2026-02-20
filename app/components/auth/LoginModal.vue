<template>
  <Dialog :modelValue="isOpen" @update:modelValue="closeModal" widthClass="w-[98%] max-w-lg mx-auto">
    <div class="w-full bg-white rounded-3xl overflow-hidden relative flex flex-col max-h-[90vh]">
      
      <!-- Overlay for Progress Steps -->
      <div v-if="showProgress" class="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        
        <!-- Loading Spinner/Icon -->
        <div class="mb-6 relative">
           <div class="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
           <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-bold text-primary-600">{{ Math.min((currentStep + 1) * 33, 99) }}%</span>
           </div>
        </div>

        <!-- Step Title -->
        <h3 class="text-xl font-bold text-gray-900 mb-2 transition-all duration-300">
          {{ steps[currentStep]?.title }}
        </h3>
        
        <!-- Step Description -->
        <p class="text-gray-500 text-sm mb-6 max-w-xs mx-auto transition-all duration-300">
           {{ steps[currentStep]?.description }}
        </p>

        <!-- Dynamic Content for Specific Steps -->
        <!-- Step 2: Cloudflare Widget Container -->
        <div v-show="currentStep === 1 && !turnstileToken" class="min-h-[65px] flex justify-center w-full mb-4">
            <div ref="turnstileContainer"></div>
        </div>

        <!-- Steps Indicators -->
        <div class="flex items-center gap-2 mt-8">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="h-1.5 rounded-full transition-all duration-500"
            :class="index <= currentStep ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200'"
          ></div>
        </div>
        
        <!-- Error Message in Overlay -->
        <div v-if="errorMessage" class="text-red-500 text-sm font-medium mt-4 bg-red-50 p-3 rounded-lg border border-red-100 max-w-sm">
             {{ errorMessage }}
             <button @click="closeProgress" class="block w-full mt-2 text-xs font-bold text-red-600 underline">Volver al formulario</button>
        </div>

      </div>

      <!-- Form Content (Hidden/Background when progress is showing) -->
      <div class="flex flex-col h-full" :class="{ 'opacity-0 pointer-events-none': showProgress }">
          <!-- Header with Logo -->
          <div class="flex flex-col items-center pt-8 pb-4 px-6 bg-white">
            <img src="~/assets/images/logo/logo-color.svg" alt="Buscaya" class="h-8 md:h-12 w-auto mb-4" />
            <p class="text-gray-500 text-center text-sm mt-1 mb-2 font-medium">
              {{ mode === 'login' ? 'Ingresa a tu cuenta para continuar' : 'Únete a la comunidad de Buscaya' }}
            </p>
          </div>

          <!-- Mode Switcher -->
          <div class="flex px-6 mb-6 md:px-8">
            <div class="flex w-full bg-gray-100 p-1 rounded-xl">
              <button
                @click="setMode('login')"
                class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                :class="mode === 'login' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              >
                Ingresar
              </button>
              <button
                @click="setMode('register')"
                class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                :class="mode === 'register' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              >
                Registrarse
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="px-6 pb-8 flex-1 overflow-y-auto md:px-8">
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
              <!-- Name Field (Register only) -->
              <div v-if="mode === 'register'" class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Nombre Completo"
                  class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  required
                />
              </div>

              <!-- Email Field -->
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Correo electrónico"
                  class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  required
                />
              </div>

              <!-- Password Field -->
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Contraseña"
                  class="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>

              <!-- Confirm Password Field (Register only) -->
              <div v-if="mode === 'register'" class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirmar Contraseña"
                  class="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  required
                />
              </div>
              
              <div v-if="errorMessage && !showProgress" class="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg border border-red-100">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] mt-2 flex justify-center items-center"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>{{ mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}</span>
              </button>
              
              <div class="text-center mt-2">
                 <button type="button" @click="closeModal" class="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                   Cancelar
                 </button>
              </div>

              <div v-if="mode === 'login'" class="flex items-center gap-4 my-2">
                <div class="h-px bg-gray-200 flex-1"></div>
                <span class="text-xs text-gray-400 font-medium uppercase">O continuar con</span>
                <div class="h-px bg-gray-200 flex-1"></div>
              </div>

              <div v-if="mode === 'login'" class="flex flex-col gap-3">
                <button v-if="showGoogle" type="button" @click="handleGoogleLogin" class="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors relative group">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google" />
                  <span>Continuar con Google</span>
                </button>
                <button v-if="showApple" type="button" @click="handleAppleLogin" class="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors relative group">
                  <img src="https://www.svgrepo.com/show/511330/apple-173.svg" class="w-5 h-5 filter invert" alt="Apple" />
                  <span>Continuar con Apple</span>
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Dialog from '../Dialog.vue';
import { useAuthStore } from '~/stores/auth.store';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen', 'success']);

const authStore = useAuthStore();
const mode = ref<'login' | 'register'>('login');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const showGoogle = ref(false);
const showApple = ref(false);

// Progress Modal State
const showProgress = ref(false);
const currentStep = ref(0);
const steps = [
    { title: 'Verificando datos', description: 'Validando que tus credenciales sean correctas...' },
    { title: 'Escaneando actividad', description: 'Protegiendo tu cuenta con Cloudflare...' },
    { title: 'Iniciando sesión', description: 'Consultando base de datos y estableciendo conexión...' }
];

// Turnstile State
const turnstileToken = ref('');
const turnstileContainer = ref<HTMLElement | null>(null);
const turnstileWidgetId = ref<string | null>(null);

// Use Turnstile test key for development/nip.io domains
const SITE_KEY = '0x4AAAAAACJYPBnJ_eq7Excs'; 

const setMode = (newMode: 'login' | 'register') => {
  mode.value = newMode;
  errorMessage.value = '';
  showProgress.value = false;
  resetTurnstile();
};

const closeModal = () => {
  emit('update:isOpen', false);
  // Reset form after animation
  setTimeout(() => {
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    name.value = '';
    errorMessage.value = '';
    loading.value = false;
    showProgress.value = false;
    currentStep.value = 0;
    resetTurnstile();
  }, 300);
};

const closeProgress = () => {
    showProgress.value = false;
    loading.value = false;
    currentStep.value = 0;
    // Don't fully reset turnstile so user doesn't have to redo it if possible, 
    // but typically error means we should reset.
    resetTurnstile(); 
};

// --- Turnstile Logic ---
const loadTurnstile = () => {
  if (typeof window === 'undefined') return;

  if ((window as any).turnstile) {
    renderTurnstile();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    renderTurnstile();
  };
  document.head.appendChild(script);
};

const renderTurnstile = () => {
  if (!turnstileContainer.value || !(window as any).turnstile) return;

  if (turnstileWidgetId.value) {
    try {
        (window as any).turnstile.remove(turnstileWidgetId.value);
    } catch(e) {}
    turnstileWidgetId.value = null;
  }

  try {
    turnstileWidgetId.value = (window as any).turnstile.render(turnstileContainer.value, {
      sitekey: SITE_KEY,
      callback: (token: string) => {
        turnstileToken.value = token;
        console.log('Turnstile verified:', token);
        // Auto-advance if we are in the progress flow
        if (showProgress.value && currentStep.value === 1) {
             advanceToDbCheck();
        }
      },
      'expired-callback': () => {
        turnstileToken.value = '';
      },
      'error-callback': () => {
        console.error('Turnstile error');
        turnstileToken.value = '';
        errorMessage.value = 'Error en la verificación de seguridad. Intenta de nuevo.';
        // Don't close progress automatically, let user see error
      },
    });
  } catch (e) {
    console.error('Error rendering Turnstile:', e);
  }
};

const resetTurnstile = () => {
  turnstileToken.value = '';
  if (turnstileWidgetId.value && (window as any).turnstile) {
    try {
        (window as any).turnstile.reset(turnstileWidgetId.value);
    } catch(e) {}
  }
};

watch(() => props.isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      loadTurnstile();
    }, 100);
  }
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('edg');
    showApple.value = isSafari; 
    showGoogle.value = !isSafari; 
  }
  if (props.isOpen) {
    loadTurnstile();
  }
});

const handleSubmit = async () => {
  errorMessage.value = '';
  
  if (mode.value === 'register') {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden';
      return;
    }
    if (name.value.trim().length < 2) {
      errorMessage.value = 'Ingresa un nombre válido';
      return;
    }
  }

  // Start Multi-step progress
  showProgress.value = true;
  loading.value = true;
  currentStep.value = 0; // Step 1: Verificando datos

  // Simulate Step 1 delay (Verifying credentials format locally)
  setTimeout(() => {
      proceedToCloudflareCheck();
  }, 1200);
};

const proceedToCloudflareCheck = () => {
    currentStep.value = 1; // Step 2: Cloudflare
    
    // Check if we already have a token
    if (turnstileToken.value) {
        // Already verified, just show the step briefly then advance
        setTimeout(() => {
            advanceToDbCheck();
        }, 1000);
    } else {
        // Need to render/wait for Turnstile
        // The widget is inside a v-show="currentStep === 1", so it becomes visible now
        // We rely on the 'callback' in renderTurnstile to call advanceToDbCheck
        
        // Ensure it's rendered if not already
        if (!turnstileWidgetId.value) {
            renderTurnstile();
        }
    }
}

const advanceToDbCheck = () => {
    currentStep.value = 2; // Step 3: Database / Login
    // Simulate connection time slightly or just go
    setTimeout(() => {
        handleFinalSubmit();
    }, 800);
}

const handleFinalSubmit = async () => {
    if (!turnstileToken.value) {
        errorMessage.value = "Error: Verificación de seguridad incompleta.";
        return;
    }

    try {
        if (mode.value === 'login') {
            await authStore.login(email.value, password.value, turnstileToken.value);
        } else {
            await authStore.register(email.value, password.value, name.value, turnstileToken.value);
        }
        
        // Success animation or delay could go here
        emit('success');
        closeModal();
    } catch (error: any) {
        errorMessage.value = error.message || 'Ocurrió un error inesperado';
        // Stay on error state in overlay
        // showProgress.value = false; // Optional: Keep showing progress with error so user can "Back"
    } finally {
        loading.value = false;
        // If successful, modal closes. If error, loading stops, error shows.
    }
};

// ... Social Login Logic (Unchanged) ...
const APPLE_CLIENT_ID = 'com.willch24.buscayamobile.web';
const APPLE_REDIRECT_URI = 'https://127.0.0.1.nip.io:3000'; 

const loadAppleSDK = () => {
  if (typeof window === 'undefined') return;
  if ((window as any).AppleID) return;

  const script = document.createElement('script');
  script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
  script.async = true;
  script.onload = () => {
    (window as any).AppleID.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: 'name email',
      redirectURI: APPLE_REDIRECT_URI,
      state: 'origin:web',
      usePopup: true
    });
  };
  document.head.appendChild(script);
};

const handleAppleLogin = async () => {
  if (!(window as any).AppleID) {
    loadAppleSDK();
    errorMessage.value = 'Iniciando Apple Sign In... intenta de nuevo en un segundo.';
    return;
  }

  try {
    loading.value = true;
    const response = await (window as any).AppleID.auth.signIn();
    const { user, authorization } = response;
    let emailStr = '';
    let nameStr = 'Usuario Apple';

    if (user) {
        emailStr = user.email;
        nameStr = user.name ? `${user.name.firstName} ${user.name.lastName}` : 'Usuario Apple';
    } else {
        const decodedToken = JSON.parse(atob(authorization.id_token.split('.')[1]));
        emailStr = decodedToken.email;
    }

    await authStore.socialLogin({
        correo: emailStr,
        nombre: nameStr,
        socialId: authorization.id_token, 
        proveedor: 'apple'
    });

    emit('success');
    closeModal();
  } catch (error: any) {
    console.error('Apple Sign In Error:', error);
    errorMessage.value = 'Error al iniciar sesión con Apple.';
  } finally {
    loading.value = false;
  }
};

const GOOGLE_CLIENT_ID = '270578527668-fo3alu7omc8hlca42n349heg9c6u89hu.apps.googleusercontent.com';

const loadGoogleSDK = () => {
  if (typeof window === 'undefined') return;
  
  if ((window as any).google?.accounts?.id) {
      initGoogleLogin();
      return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
      initGoogleLogin();
  };
  document.head.appendChild(script);
};

const initGoogleLogin = () => {
    if (!(window as any).google?.accounts?.id) return;
    
    (window as any).google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'use', 
      ux_mode: 'popup', 
    });
}

const handleGoogleLogin = () => {
    if (!(window as any).google?.accounts?.id) {
        loadGoogleSDK(); 
        errorMessage.value = 'Iniciando Google... intenta de nuevo.';
        return;
    }
    initGoogleLogin(); 
    (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google prompt skipped/not displayed:", notification.getNotDisplayedReason());
        }
    });
};

const handleGoogleResponse = async (response: any) => {
    loading.value = true;
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        await authStore.socialLogin({
            correo: payload.email,
            nombre: payload.name,
            socialId: payload.sub,
            proveedor: 'google',
            image: payload.picture
        });

        emit('success');
        closeModal();
    } catch (error: any) {
        console.error('Google Login Error:', error);
        errorMessage.value = 'Error al iniciar sesión con Google.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadAppleSDK();
    loadGoogleSDK(); 
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.cancel();
    }
});
</script>
