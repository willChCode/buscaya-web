<template>
  <div class="grid grid-cols-4 gap-3 shrink-0 mb-6 px-4 md:px-0">
    <a
      :href="`tel:${negocio.contacto?.telefono}`"
      class="group flex flex-col items-center justify-center gap-1 py-2 rounded-xl shadow-sm bg-white hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      <div
        class="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <span
        class="text-[10px] font-bold text-gray-600 group-hover:text-blue-600"
        >Llamar</span
      >
    </a>

    <a
      :href="`https://wa.me/52${negocio.contacto?.whatsapp}`"
      target="_blank"
      class="group flex flex-col items-center justify-center gap-1 py-2 rounded-xl shadow-sm bg-white hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      <div
        class="p-2 rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"
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
      </div>
      <span
        class="text-[10px] font-bold text-gray-600 group-hover:text-green-600"
        >WhatsApp</span
      >
    </a>

    <button
      @click="$emit('rate')"
      class="group flex flex-col items-center justify-center gap-1 py-2 rounded-xl shadow-sm bg-white hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      <div
        class="p-2 rounded-full bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <span
        class="text-[10px] font-bold text-gray-600 group-hover:text-amber-500"
        >Calificar</span
      >
    </button>

    <button
      @click="abrirMapa(negocio.ubicacion?.coordinates)"
      class="group flex flex-col items-center justify-center gap-1 py-2 rounded-xl shadow-sm bg-white hover:shadow-md transition-all cursor-pointer active:scale-95"
    >
      <div
        class="p-2 rounded-full bg-primary-500/10 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <span
        class="text-[10px] font-bold text-gray-600 group-hover:text-primary-500"
        >Mapa</span
      >
    </button>
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
