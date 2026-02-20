<template>
  <div class="bg-white rounded-2xl shadow-sm p-8 h-full relative">
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <div class="border-b border-gray-200 pb-6 mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-[22px] sm:text-2xl font-bold text-gray-900">Información Personal</h2>
        <p class="text-gray-500 text-sm mt-1">Administra tu información básica y preferencias.</p>
      </div>
      <button 
        v-if="!isEditing"
        @click="startEditing"
        class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Editar
      </button>
      <button 
        v-else
        @click="cancelEditing"
        class="text-gray-500 hover:text-gray-700 font-medium text-sm"
      >
        Cancelar
      </button>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6 max-w-2xl">
      
      <!-- Profile Image Upload -->
      <div class="flex items-center gap-6">
        <div class="relative group">
          <div class="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            <img 
              v-if="previewImage || form.photoURL" 
              :src="previewImage || form.photoURL" 
              class="w-full h-full object-cover" 
              alt="Profile"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
            </div>
          </div>
          
          <label 
            v-if="isEditing"
            class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="file" accept="image/*" class="hidden" @change="handleImageChange">
          </label>
        </div>
        <div v-if="isEditing">
          <h3 class="font-medium text-gray-900">Foto de Perfil</h3>
          <p class="text-sm text-gray-500">Haz clic en la imagen para cambiarla.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input 
            v-model="form.displayName" 
            type="text" 
            :readonly="!isEditing"
            :class="{'bg-white ring-1 ring-primary-500 border-primary-500': isEditing, 'bg-gray-50 border-gray-200 cursor-not-allowed': !isEditing}"
            class="w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none transition-all"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
          <input 
            v-model="form.email" 
            type="email" 
            readonly
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 focus:outline-none cursor-not-allowed"
            title="El correo no se puede cambiar"
          >
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
           <input 
             v-model="form.birthDate" 
             type="date"
             :readonly="!isEditing"
             :class="{'bg-white ring-1 ring-primary-500 border-primary-500': isEditing, 'bg-gray-50 border-gray-200 cursor-not-allowed': !isEditing}"
             class="w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none transition-all"
           >
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">ID de Usuario</label>
        <div class="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <code class="text-sm text-gray-500 font-mono flex-1">{{ user?.uid }}</code>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div v-if="isEditing" class="pt-4 flex justify-end gap-3 fade-in">
        <button 
          type="button" 
          @click="cancelEditing"
          class="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-primary-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <span v-if="loading">Guardando...</span>
          <span v-else>Guardar Cambios</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { useAuthStore } from '~/stores/auth.store';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const loading = computed(() => authStore.loading);

const isEditing = ref(false);
const previewImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const form = reactive({
  displayName: '',
  email: '',
  photoURL: '',
  birthDate: ''
});

// Initialize form data
watch(user, (newUser) => {
  if (newUser) {
    form.displayName = newUser.displayName || '';
    form.email = newUser.email || '';
    form.photoURL = newUser.photoURL || '';
    form.birthDate = newUser.birthDate?.split('T')[0] || ''; // Format generic
  }
}, { immediate: true });

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  selectedFile.value = null;
  previewImage.value = null;
  // Reset form
  if (user.value) {
    form.displayName = user.value.displayName;
    form.birthDate = user.value.birthDate?.split('T')[0] || '';
  }
};

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    selectedFile.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSave = async () => {
  try {
    await authStore.updateProfile({
      displayName: form.displayName,
      birthDate: form.birthDate
    }, selectedFile.value || undefined);
    
    isEditing.value = false;
    selectedFile.value = null;
    previewImage.value = null;
    // Success notification could go here
  } catch (error) {
    console.error(error);
    alert('Error al actualizar el perfil');
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
