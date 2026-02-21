<template>
  <div class="min-h-screen bg-gray-50 -mx-6 py-0 md:py-10">
    <!-- Changed max-w-7xl to w-full and added larger padding config for 'full width' feel -->
    <div class="px-0 sm:px-0 lg:px-12 w-[95%] mx-auto">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Sidebar Navigation (Desktop) / Menu (Mobile) -->
        <div
          class="lg:col-span-4 relative"
          :class="$route.path !== '/perfil' ? 'hidden lg:block' : 'block'"
        >
          <div class="sticky top-28">
            <!-- User Short Info (Desktop Sidebar) -->
            <div
              class="hidden lg:flex flex-col items-center bg-white rounded-2xl shadow-sm p-6 mb-6"
            >
              <div
                class="w-20 h-20 bg-gray-100 rounded-full p-1 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center mb-3"
              >
                <img
                  v-if="user?.photoURL"
                  :src="user.photoURL"
                  class="w-full h-full rounded-full object-cover"
                  alt="Profile"
                />
                <img
                  v-else
                  :src="`https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`"
                  class="w-full h-full rounded-full object-cover"
                  alt="Profile"
                />
              </div>
              <h2 class="font-bold text-gray-900 text-lg text-center">
                {{ user?.displayName || 'Usuario' }}
              </h2>
              <p class="text-gray-500 text-sm text-center">{{ user?.email }}</p>
            </div>

            <!-- Navigation Menu -->
            <nav class="space-y-1">
              <!-- Mobile Header (Only visible on Mobile inside nav for now - hidden on LG so sticky won't affect it much but good to keep structure) -->
              <div
                class="lg:hidden mb-6 bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center"
              >
                <div class="relative w-24 h-24 mb-3">
                  <div
                    class="w-full h-full bg-gray-100 rounded-full p-1 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center"
                  >
                    <img
                      v-if="user?.photoURL"
                      :src="user.photoURL"
                      class="w-full h-full rounded-full object-cover"
                      alt="Profile"
                    />
                    <img
                      v-else
                      :src="`https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`"
                      class="w-full h-full rounded-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <button
                    class="absolute bottom-0 right-0 bg-primary-500 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                    </svg>
                  </button>
                </div>
                <h1 class="text-xl font-bold text-gray-900 mb-1">
                  {{ user?.displayName || 'Usuario' }}
                </h1>
                <p class="text-gray-500 text-sm font-medium mb-4">
                  {{ user?.email }}
                </p>
              </div>

              <div
                class="bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-sm lg:shadow-none overflow-hidden lg:overflow-visible mx-4 md:mx-0"
              >
                <h3
                  class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider lg:mb-2 text-center lg:text-left"
                >
                  Mi Actividad
                </h3>
                <div class="space-y-1">
                  <NuxtLink
                    to="/perfil/informacion"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                    active-class=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500':
                          $route.path === '/perfil/informacion',
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Información Personal
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/perfil/publicaciones"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500':
                          $route.path.includes('publicaciones'),
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    Publicaciones
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/perfil/comentarios"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500': $route.path.includes('comentarios'),
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Comentarios
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/perfil/notificaciones"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500':
                          $route.path.includes('notificaciones'),
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Notificaciones
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>
                </div>

                <h3
                  class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 lg:mb-2 text-center lg:text-left"
                >
                  General
                </h3>
                <div class="space-y-1">
                  <NuxtLink
                    to="/perfil/configuracion"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500':
                          $route.path.includes('configuracion'),
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Configuración
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/contacto"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    exact-active-class="text-gray-900 bg-white border-l-4 border-primary-500 lg:border-l-0 lg:ring-1 lg:ring-gray-200 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      :class="{
                        'text-primary-500': $route.path.includes('contacto'),
                      }"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contáctanos
                    <span class="ml-auto lg:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </NuxtLink>

                  <button
                    @click="handleLogout"
                    class="w-full group flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl lg:ring-1 lg:ring-transparent lg:hover:ring-red-100 lg:bg-transparent transition-all mb-4 lg:mb-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-3 h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <!-- Main Content (Dynamic) -->
        <div
          class="lg:col-span-8"
          :class="$route.path === '/perfil' ? 'hidden lg:block' : 'block'"
        >
          <div
            class="lg:hidden mb-4 pt-4 pl-3"
            v-if="$route.path !== '/perfil'"
          >
            <NuxtLink
              to="/perfil"
              class="flex items-center text-gray-600 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al menú
            </NuxtLink>
          </div>
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth.store';
import { useRouter } from '#app';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const handleLogout = async () => {
  const confirmed = confirm('¿Estás seguro de que quieres cerrar tu sesión?');
  if (confirmed) {
    await authStore.logout();
    router.push('/');
  }
};

definePageMeta({
  middleware: ['auth'],
});
</script>
