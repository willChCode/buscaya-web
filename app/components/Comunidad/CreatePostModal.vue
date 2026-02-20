<template>
  <Dialog v-model="isOpen" class="z-50" widthClass="w-[95%] max-w-lg mx-auto">
    <div class="bg-white rounded-xl overflow-hidden">
       <!-- Header -->
       <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 class="font-bold text-gray-900 text-lg">Crear publicación</h3>
       </div>

       <div class="p-5 flex-1 overflow-y-auto">
          <!-- Category Selector -->
          <div class="mb-5">
             <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Selecciona un tema</label>
             <div class="flex gap-2">
               <button 
                 v-for="cat in categories" 
                 :key="cat.id"
                 @click="selectedCategory = cat.id"
                 :class="[
                     'flex-1 flex flex-col md:flex-row items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 gap-1 md:gap-3',
                    selectedCategory === cat.id 
                      ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                 ]"
               >
                 <span class="text-lg">{{ cat.emoji }}</span>
                 <span class="text-[10px] font-extrabold uppercase tracking-tight">{{ cat.label }}</span>
               </button>
             </div>
          </div>

          <!-- Text Input -->
          <div class="mb-5">
            <textarea 
              v-model="content"
              placeholder="¿Qué está pasando?"
              class="w-full h-32 bg-gray-50 border-transparent rounded-xl p-4 text-gray-700 text-base leading-relaxed focus:bg-white focus:border-primary-500 transition-all resize-none placeholder-gray-400"
            ></textarea>
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreview" class="mb-5 relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img :src="imagePreview" class="w-full h-40 object-cover" />
            <button 
              @click="removeImage"
              class="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3 mt-2">
            <!-- Upload Photo Button (Top) -->
             <button 
              @click="triggerFileInput"
              class="flex items-center justify-center gap-2 text-primary-600 font-bold hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors w-full border border-dashed border-primary-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-bold">{{ imagePreview ? 'Cambiar foto' : 'Agregar foto' }}</span>
            </button>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />

            <!-- Cancel / Publish (Bottom Row) -->
            <div class="grid grid-cols-2 gap-3 w-full">
               <button 
                  @click="isOpen = false" 
                  class="text-gray-500 font-bold px-4 py-3 rounded-xl hover:bg-gray-50 border border-gray-100 text-center text-sm"
                >
                  Cancelar
               </button>
               <button 
                 @click="submitPost" 
                 :disabled="!isValid || submitting" 
                 class="bg-primary-500 text-white px-4 py-3 rounded-xl font-black shadow-lg shadow-primary-100 hover:bg-primary-600 transition-all disabled:opacity-50 disabled:shadow-none translate-y-0 active:translate-y-0.5 text-center text-sm flex items-center justify-center"
               >
                 <span v-if="submitting">...</span>
                 <span v-else>Publicar</span>
               </button>
            </div>
          </div>
       </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Dialog from '@/components/Dialog.vue';
import { useCommunityStore } from '@/stores/community.store';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import type { CategoryType } from '@/types/community.types';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const store = useCommunityStore();
const ubicacionStore = useUbicacionNegocios();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const content = ref('');
const selectedCategory = ref<CategoryType | null>(null);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const submitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const categories: { id: CategoryType; label: string; emoji: string }[] = [
  { id: 'ofertas', label: 'Oferta', emoji: '🔥' },
  { id: 'vecinos', label: 'Social', emoji: '💬' },
  { id: 'otros', label: 'Otros', emoji: '📦' },
];

const isValid = computed(() => {
  return content.value.trim().length > 0 && selectedCategory.value !== null;
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const submitPost = async () => {
  if (!isValid.value) return;
  
  submitting.value = true;
  try {
    const payload: any = {
      contenido: content.value,
      categoria: selectedCategory.value,
      imageFile: imageFile.value || undefined
    };

    if (ubicacionStore.ubicacion) {
      payload.ubicacion = {
        type: 'Point',
        coordinates: [ubicacionStore.ubicacion.lng, ubicacionStore.ubicacion.lat]
      };
    }

    await store.createPost(payload);
    emit('success');
    isOpen.value = false;
    // Reset form
    content.value = '';
    selectedCategory.value = null;
    removeImage();
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Error al crear la publicación. Inténtalo de nuevo.');
  } finally {
    submitting.value = false;
  }
};
</script>
