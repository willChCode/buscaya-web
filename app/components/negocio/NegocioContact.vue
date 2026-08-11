<template>
  <div>
    <!-- Espaciador para que la barra flotante no tape contenido al final -->
    <div class="h-32 md:hidden"></div>

    <!-- Contenedor fijo: Abajo completo en todas las pantallas -->
    <div class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div
        class="bg-white border-t border-gray-100 rounded-t-3xl md:rounded-none shadow-[0_-8px_20px_-3px_rgba(0,0,0,0.15)] p-4 pb-6 md:pb-4 w-full pointer-events-auto"
      >
        <div
          class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div class="mb-1 md:mb-0">
            <h3 class="font-bold text-gray-800 text-base">
              ¿Te interesa este negocio?
            </h3>
            <p class="text-xs text-gray-500">
              Llama, califica o contacta por WhatsApp.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Facebook -->
            <a
              v-if="negocio.contacto?.facebook"
              :href="negocio.contacto.facebook"
              target="_blank"
              class="shrink-0 w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-[#1877F2] text-white hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-[18px] w-[18px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                />
              </svg>
            </a>

            <!-- Instagram -->
            <a
              v-if="negocio.contacto?.instagram"
              :href="negocio.contacto.instagram"
              target="_blank"
              class="shrink-0 w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-[18px] w-[18px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>

            <!-- TikTok -->
            <a
              v-if="negocio.contacto?.tiktok"
              :href="negocio.contacto.tiktok"
              target="_blank"
              class="shrink-0 w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-black text-white hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-[18px] w-[18px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.39-2.92 5.61-1.77 1.22-4.05 1.5-6.08.75-2.03-.74-3.61-2.43-4.2-4.48-.59-2.05-.2-4.291 1.07-5.981 1.27-1.691 3.32-2.611 5.4-2.521V14.3c-1.391-.07-2.771.55-3.561 1.66-.8 1.11-.96 2.63-.39 3.86.57 1.23 1.83 2.1 3.19 2.2 1.36.1 2.76-.44 3.55-1.54.79-1.1.96-2.59.88-3.95V.02h-1.02Z"
                />
              </svg>
            </a>

            <!-- Sitio Web -->
            <a
              v-if="negocio.contacto?.pagina_web || negocio.contacto?.web"
              :href="negocio.contacto.pagina_web || negocio.contacto.web"
              target="_blank"
              class="shrink-0 w-11 h-11 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-slate-700 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Sitio Web"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </a>

            <!-- Separador visual -->
            <div
              v-if="negocio.contacto?.facebook || negocio.contacto?.instagram || negocio.contacto?.tiktok || negocio.contacto?.pagina_web || negocio.contacto?.web"
              class="w-px h-8 bg-gray-200 mx-1 md:mx-2 shrink-0"
            ></div>
            
            <!-- Llamar -->
            <a
              :href="`tel:${negocio.contacto?.telefono}`"
              class="shrink-0 h-11 md:h-12 px-3 md:px-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Llamar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span class="text-sm">Llamar</span>
            </a>


            <!-- Calificar -->
            <button
              @click="$emit('rate')"
              class="shrink-0 h-11 md:h-12 px-3 md:px-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Calificar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span class="text-sm">Calificar</span>
            </button>

            <!-- WhatsApp -->
            <a
              :href="`https://wa.me/52${negocio.contacto?.whatsapp}`"
              target="_blank"
              class="flex-1 md:flex-none md:px-8 h-12 flex items-center justify-center gap-2 rounded-xl bg-[#00d072] text-white font-bold hover:bg-[#00b563] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  negocio: any;
}>();

defineEmits(['rate']);

const abrirMapa = (coordinates: number[]) => {
  if (!coordinates || coordinates.length < 2) return;
  const lng = coordinates[0];
  const lat = coordinates[1];
  const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
  if (isApple) {
    window.open(`http://maps.apple.com/?daddr=${lat},${lng}`, '_blank');
  } else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  }
};
</script>
