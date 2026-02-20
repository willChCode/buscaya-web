<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close();
};

// ==========================================
// LÓGICA DE ARRASTRE (Desktop & Mobile)
// ==========================================
const isDragging = ref(false);
const startY = ref(0);
const dragOffset = ref(0);

const drawerStyle = computed(() => {
  if (!isDragging.value && dragOffset.value === 0) return undefined;
  return { transform: `translateY(${dragOffset.value}px)` };
});

// --- MOUSE (Desktop) ---
const onMouseDown = (e: MouseEvent) => {
  if (!props.modelValue) return;
  e.preventDefault(); // Evita seleccionar texto al arrastrar

  isDragging.value = true;
  startY.value = e.clientY;

  // Agregamos listeners al WINDOW para que no se pierda el arrastre si te sales del div
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const deltaY = e.clientY - startY.value;
  calculateOffset(deltaY);
};

const onMouseUp = () => {
  stopDrag();
  // Limpieza de eventos globales
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

// --- TOUCH (Mobile) ---
const onTouchStart = (e: TouchEvent) => {
  if (!props.modelValue) return;
  isDragging.value = true; //@ts-ignore
  startY.value = e.touches[0].clientY;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return; //@ts-ignore
  const deltaY = e.touches[0].clientY - startY.value;
  calculateOffset(deltaY);
};

const onTouchEnd = () => {
  stopDrag();
};

// --- Lógica Común ---
const calculateOffset = (deltaY: number) => {
  if (deltaY > 0) {
    // Hacia abajo (linear)
    dragOffset.value = deltaY;
  } else {
    // Hacia arriba (resistencia elástica)
    dragOffset.value = -Math.pow(Math.abs(deltaY), 0.7);
  }
};

const stopDrag = () => {
  isDragging.value = false;
  if (dragOffset.value > 150) {
    close();
  }
  dragOffset.value = 0;
};

// ==========================================
// UTILIDADES
// ==========================================
watch(
  () => props.modelValue,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) {
        dragOffset.value = 0;
        isDragging.value = false;
      }
    }
  }
);

onMounted(() => {
  if (import.meta.client) document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
    // Limpieza de seguridad por si se desmonta mientras arrastras
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
        @click="close"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transform transition-transform duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="modelValue"
        :style="drawerStyle"
        class="fixed inset-x-0 bottom-0 z-[9999] flex flex-col w-full bg-white border-t border-gray-200 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] rounded-t-[10px] max-h-[96vh] outline-none"
        :class="{ '!transition-none': isDragging }"
        tabindex="-1"
      >
        <div
          class="w-full pt-4 pb-2 cursor-grab active:cursor-grabbing touch-none select-none bg-white rounded-t-[10px]"
          @mousedown="onMouseDown"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            class="mx-auto h-2 w-[100px] rounded-full bg-slate-100 pointer-events-none"
          ></div>
        </div>

        <div class="p-0 md:p-4 flex-1 overflow-y-auto bg-white">
          <div class="w-full">
            <slot />
          </div>
        </div>

        <div
          class="absolute top-full left-0 right-0 h-[1000px] bg-white w-full -mt-1"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.touch-none {
  touch-action: none;
}
.select-none {
  user-select: none;
}
</style>
