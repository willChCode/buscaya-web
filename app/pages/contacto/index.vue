<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from '#app';

definePageMeta({
  layout: false,
});

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  message: '',
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  // Simular envío
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isSubmitting.value = false;
  showSuccess.value = true;

  // Reset form after delay
  setTimeout(() => {
    showSuccess.value = false;
    form.value = { name: '', email: '', message: '' };
  }, 3000);
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="fixed inset-0 z-[9999] overflow-hidden font-sans bg-gray-900">
    <!-- Fondo con imagen y overlay (Igual que Home) -->
    <div
      class="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 transform hover:scale-105"
      style="
        background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
      "
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"
    ></div>

    <div
      class="relative z-10 flex flex-col h-full w-full max-w-6xl mx-auto px-6 py-6"
    >
      <!-- Header / Nav -->
      <nav class="flex justify-between items-center mb-8">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <div
            class="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </div>
          <span class="font-medium text-lg">Regresar</span>
        </button>

        <div class="flex items-center">
          <span
            class="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg"
          >
            Buscaya
          </span>
        </div>
      </nav>

      <!-- Main Content -->
      <main
        class="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center pb-10 overflow-y-auto custom-scrollbar"
      >
        <!-- Left Column: Info & Text -->
        <div class="w-full md:w-1/2 text-white space-y-8">
          <div>
            <h1
              class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl leading-tight"
            >
              Hablemos de <br />
              <span class="text-primary-500">tu negocio</span>
            </h1>
            <p
              class="text-lg md:text-xl text-gray-200 max-w-md leading-relaxed"
            >
              ¿Tienes dudas o quieres anunciarte con nosotros? Estamos aquí para
              ayudarte a crecer.
            </p>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-4 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm text-gray-400 uppercase tracking-wider font-semibold"
                >
                  Llámanos
                </p>
                <p class="text-lg font-medium">+52 (81) 1234-5678</p>
              </div>
            </div>

            <div class="flex items-center gap-4 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm text-gray-400 uppercase tracking-wider font-semibold"
                >
                  Escríbenos
                </p>
                <p class="text-lg font-medium">contacto@buscaya.com</p>
              </div>
            </div>

            <div class="flex items-center gap-4 group">
              <div
                class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-[#FA0050] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <p
                  class="text-sm text-gray-400 uppercase tracking-wider font-semibold"
                >
                  Visítanos
                </p>
                <p class="text-lg font-medium">Monterrey, Nuevo León</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Form -->
        <div class="w-full md:w-1/2">
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <h2 class="text-2xl font-bold text-white mb-6">
              Envíanos un mensaje
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-300 ml-1"
                  >Nombre Completo</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-300 ml-1"
                  >Correo Electrónico</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-300 ml-1"
                  >Mensaje</label
                >
                <textarea
                  v-model="form.message"
                  required
                  rows="4"
                  class="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FA0050] focus:border-transparent transition-all resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <span v-if="!isSubmitting">Enviar Mensaje</span>
                <svg
                  v-else
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>

              <div
                v-if="showSuccess"
                class="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-center text-sm font-medium animate-fade-in"
              >
                ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style>
