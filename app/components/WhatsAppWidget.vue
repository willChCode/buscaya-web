<template>
  <div
    v-if="route.path === '/'"
    class="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-fade-in-up"
  >
    <!-- Premium Bubble text -->
    <div
      class="hidden sm:flex flex-col bg-[#25D366] px-5 py-3.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative cursor-pointer hover:scale-105 transition-transform duration-300 origin-right border border-primary-400 group"
      @click="goToWhatsapp"
    >
      <div class="font-extrabold text-[15px] text-white leading-tight">
        Registra tu negocio<br />
        <span class="text-yellow-300 text-[17px] tracking-wide font-black drop-shadow-sm"
          >GRATIS ahora</span
        >
        🚀
      </div>

      <!-- Triangle pointing right -->
      <div
        class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#25D366] transform rotate-45 border-t border-r border-primary-400"
      ></div>
    </div>

    <!-- WhatsApp Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      class="bg-[#25D366] hover:bg-[#20bd5a] p-3.5 md:p-3 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center relative group"
      aria-label="Registra tu negocio por WhatsApp"
    >
      <!-- Ping animation behind the image -->
      <span
        class="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-20"
      ></span>

      <!-- Icon Image -->
      <img
        src="~/assets/images/icon/whatsapp_icon.png"
        alt="WhatsApp"
        class="w-7 h-7 md:w-10 md:h-10 object-contain relative z-10"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

// Recuerda configurar este enlace con el número telefónico real de Buscaya
const whatsappUrl =
  'https://wa.me/528110720923?text=Hola%2C%20vengo%20de%20su%20p%C3%A1gina%20web%2C%20me%20gustar%C3%ADa%20registrar%20mi%20negocio%20gratis.';

const goToWhatsapp = () => {
  window.open(whatsappUrl, '_blank');
};
</script>
