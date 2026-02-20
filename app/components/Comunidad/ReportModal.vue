<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <Transition name="pop">
        <div v-if="modelValue" class="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <!-- Header -->
          <div class="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 class="text-xl font-black text-gray-900">Reportar publicación</h3>
            <button 
              @click="close"
              class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-8 py-8">
            <p class="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
              Ayúdanos a mantener la comunidad segura. ¿Cuál es el problema con esta publicación?
            </p>

            <textarea
              v-model="reason"
              placeholder="Describe brevemente el motivo de tu reporte..."
              class="w-full h-40 bg-gray-50 border border-gray-100 rounded-3xl p-5 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 focus:bg-white transition-all outline-none resize-none font-medium text-[15px]"
            ></textarea>

            <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-[13px] text-red-600 font-bold leading-tight">{{ error }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-8 pb-8">
            <button 
              @click="handleSubmit"
              :disabled="!reason.trim() || loading"
              class="w-full py-4 bg-red-500 text-white rounded-[1.25rem] font-bold text-base hover:bg-red-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg shadow-red-100 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ loading ? 'Enviando reporte...' : 'Enviar Reporte' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const reason = ref('');
const error = ref('');

const close = () => {
    if (props.loading) return;
    emit('update:modelValue', false);
};

const handleSubmit = () => {
    if (!reason.value.trim()) {
        error.value = 'Por favor ingresa un motivo para el reporte.';
        return;
    }
    error.value = '';
    emit('submit', reason.value.trim());
};

watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        reason.value = '';
        error.value = '';
    }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
