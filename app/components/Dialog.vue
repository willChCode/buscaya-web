<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    /**
     * Ancho del modal.
     * Default: 'w-11/12 max-w-lg' (Un ancho estándar cómodo para formularios/texto).
     * Para imágenes puedes usar: 'w-auto max-w-5xl'
     */
    widthClass?: string;
    /**
     * Ocultar el botón de cerrar flotante (útil si el contenido ya tiene uno).
     */
    hideCloseButton?: boolean;
  }>(),
  {
    widthClass: 'w-11/12 max-w-lg mx-auto',
    hideCloseButton: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-4 sm:p-6 overflow-y-auto"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out delay-75"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative bg-white shadow-2xl rounded-xl"
            :class="widthClass"
          >
            <button
              v-if="!hideCloseButton"
              @click="close"
              class="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors backdrop-blur-md cursor-pointer shadow-lg border border-white/20"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div class="overflow-hidden">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
