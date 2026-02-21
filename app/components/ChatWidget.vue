<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { marked } from 'marked';

const store = useUbicacionNegocios();
const isOpen = ref(false);
const isLoading = ref(false);
const userInput = ref('');
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([
  {
    role: 'assistant',
    content:
      '¡Hola! 👋 Soy tu asistente de Buscaya. ¿Buscas algún servicio o negocio en particular? Puedo recomendarte los mejores cerca de ti.',
  },
]);

const messagesContainer = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const parseMarkdown = (text: string) => {
  return marked.parse(text);
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMsg = userInput.value.trim();
  messages.value.push({ role: 'user', content: userMsg });
  userInput.value = '';
  isLoading.value = true;
  scrollToBottom();

  try {
    // Prepare context: richer list of businesses
    const context = store.negocios
      .map((n) => ({
        nombre: n.nombre,
        categoria: n.grupo,
        descripcion: n.descripcionCorta,
        distancia: Math.round(n.distancia) + 'm',
        tags: n.tag,
        contacto: n.contacto, // Phone, whatsapp, etc.
        horarios: n.horarios, // Opening hours
        productos: n.productos
          ?.map((p) => ({ nombre: p.nombre, precio: p.precio }))
          .slice(0, 5), // Top 5 products/services
        calificacion: n.promedio,
      }))
      .slice(0, 50); // Limit context size

    console.log(context);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value, // Send full history
        context: context,
        currentColonia: store.ubicacion?.colonia || 'Ubicación actual', // Send current location context
      }),
    });
    console.log(response);

    const data = await response.json();

    if (data.content) {
      messages.value.push({ role: 'assistant', content: data.content });
    } else {
      messages.value.push({
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu respuesta.',
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    messages.value.push({
      role: 'assistant',
      content: 'Ocurrió un error de conexión. Por favor intenta de nuevo.',
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 font-sans flex flex-col items-end">
    <!-- Chat Window -->
    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="mb-4 w-[350px] max-w-[90vw] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
      >
        <!-- Header -->
        <div
          class="bg-primary-600 p-4 flex justify-between items-center text-white"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 4.477-10 10-10z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-sm">Asistente IA</h3>
              <p class="text-xs text-white/80">En línea</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="text-white/80 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm"
              :class="
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              "
            >
              <!-- Render HTML content if assistant, plain text if user -->
              <div
                v-if="msg.role === 'assistant'"
                v-html="parseMarkdown(msg.content)"
                class="markdown-content"
              ></div>
              <div v-else>{{ msg.content }}</div>
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-start">
            <div
              class="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1 items-center"
            >
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"
              ></span>
              <span
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"
              ></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-3 bg-white border-t border-gray-100">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="userInput"
              type="text"
              placeholder="Escribe tu pregunta..."
              class="flex-1 min-w-0 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
            <button
              type="submit"
              :disabled="!userInput.trim() || isLoading"
              class="flex-shrink-0 bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- Floating Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 bg-primary-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center text-white group relative"
    >
      <span
        v-if="!isOpen"
        class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
      ></span>

      <svg
        v-if="!isOpen"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="group-hover:rotate-12 transition-transform"
      >
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        ></path>
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="rotate-90"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.delay-100 {
  animation-delay: 100ms;
}
.delay-200 {
  animation-delay: 200ms;
}

/* Markdown Styles */
:deep(.markdown-content p) {
  margin-bottom: 0.5rem;
}
:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-content strong) {
  font-weight: 700;
}
:deep(.markdown-content ul) {
  list-style-type: disc;
  padding-left: 1.2rem;
  margin-bottom: 0.5rem;
}
:deep(.markdown-content li) {
  margin-bottom: 0.25rem;
}
:deep(.markdown-content a) {
  color: #00a572;
  text-decoration: underline;
}
</style>
