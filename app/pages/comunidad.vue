<template>
  <div class="min-h-screen bg-gray-50 pt-4 pb-20">
    <div class="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-12 lg:gap-8">
      
      <!-- Main Content Area -->
      <main class="lg:col-span-8">
        <!-- Sticky Header & Top Action -->
        <div class="sticky top-[110px] md:top-[64px] z-30 bg-gray-50 -mx-4 px-4 pb-4 pt-4 sm:pb-6 sm:pt-8 mb-2 transition-all">
          <!-- "What's on your mind" style box -->
          <div 
            @click="openCreateModal"
            class="bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4 cursor-pointer hover:border-primary-200 transition-all group"
          >
            <img 
              :src="authStore.user?.photoURL || `https://ui-avatars.com/api/?name=${authStore.user?.displayName || 'User'}&background=00cc8d&color=fff`" 
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full sm:rounded-2xl object-cover shrink-0"
            />
            <div class="flex-1 bg-gray-50 rounded-2xl px-4 py-2 sm:px-5 sm:py-3 text-gray-400 font-medium text-sm sm:text-base group-hover:bg-gray-100 transition-colors truncate">
              ¿Qué quieres compartir?
            </div>
            <button class="bg-primary-500 text-white p-2 sm:p-3 rounded-2xl shadow-lg shadow-primary-100 group-hover:bg-primary-600 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Filters (Hidden on Desktop) -->
        <div class="lg:hidden flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
           <button 
             v-for="cat in filterOptions"
             :key="cat.id"
             @click="filter = cat.id"
             :class="['px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 whitespace-nowrap border shadow-sm', 
               filter === cat.id 
                 ? cat.activeClass 
                 : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
             ]"
           >
             <span v-if="cat.emoji">{{ cat.emoji }}</span> {{ cat.label }}
           </button>
        </div>

        <!-- Feed Area ... (rest remains same) -->

        <!-- Feed -->
        <div class="space-y-6">
           <!-- Loading State -->
           <div v-if="loading && posts.length === 0" class="space-y-6">
              <PostSkeleton v-for="i in 3" :key="i" />
           </div>

           <!-- Empty State -->
           <div v-else-if="filteredPosts.length === 0" class="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-6 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">No se encontraron publicaciones</h3>
              <p class="text-gray-500 max-w-xs mx-auto">Sé el primero en compartir algo con tus vecinos de esta zona.</p>
              <button @click="openCreateModal" class="mt-8 bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-600 transition shadow-lg shadow-primary-200">
                Crear publicación
              </button>
           </div>

           <!-- Posts List -->
           <div v-else class="space-y-6">
              <PostCard 
                v-for="post in filteredPosts" 
                :key="post.id" 
                :post="post" 
                @require-login="showLoginModal = true"
                @report="openReportModal"
              />
              
              <!-- Pagination / Load More -->
              <div v-if="store.posts.length > 0" class="py-8 text-center bg-gray-50 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent rounded-b-3xl">
                 <div v-if="loadingMore" class="flex justify-center">
                    <div class="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                 </div>
                 
                 <button 
                    v-else-if="store.hasMore"
                    @click="handleLoadMore"
                    class="bg-white text-gray-700 font-bold py-3 px-8 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                 >
                    <span>Ver más publicaciones</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                 </button>
                 
                 <div v-else class="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-xs font-bold uppercase tracking-widest">Estás al día</span>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <!-- Sidebar (Desktop only) -->
      <aside class="hidden lg:block lg:col-span-4">
        <div class="sticky top-[64px] space-y-8 pt-8 -mx-4 px-4 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar">
          
          <!-- Premium Search -->
          <div class="relative group mx-2">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar en la comunidad..." 
              class="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl text-sm shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-50 placeholder-gray-400 font-medium"
            />
          </div>

          <!-- Enhanced Categories Navigation -->
          <div class="mx-2">
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4">Explorar Temas</h3>
            <div class="space-y-1">
              <button 
                v-for="cat in filterOptions"
                :key="cat.id"
                @click="filter = cat.id"
                class="w-full flex items-center justify-between p-4 rounded-[2rem] transition-all duration-300 group relative"
                :class="filter === cat.id 
                  ? 'bg-white text-primary-700 shadow-lg shadow-gray-200/60 scale-[1.02] z-10' 
                  : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'"
              >
                <div class="flex items-center gap-4 relative z-10">
                  <div 
                    class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 shadow-sm"
                    :class="filter === cat.id ? 'bg-primary-500 text-white shadow-primary-200 rotate-3' : 'bg-gray-100 group-hover:bg-white grayscale'"
                  >
                    {{ cat.emoji }}
                  </div>
                  <span class="font-bold text-sm tracking-tight">{{ cat.label }}</span>
                </div>

                <div 
                  v-if="filter === cat.id"
                  class="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Community Guidelines / Info Card -->
          <div class="mx-2 p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[2.5rem] text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 class="font-black text-lg mb-2 relative z-10">¡Hola, Comunidad!</h4>
            <p class="text-xs text-white/80 leading-relaxed font-medium relative z-10">
              Comparte noticias, ofertas o simplemente saluda a tus vecinos. Juntos hacemos mejor nuestra zona.
            </p>
            <div class="mt-4 flex -space-x-2 relative z-10">
              <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-primary-500 bg-primary-100 flex items-center justify-center text-[10px]">👤</div>
              <div class="w-7 h-7 rounded-full border-2 border-primary-500 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[8px] font-bold">+99</div>
            </div>
          </div>

          <!-- Footer Info -->
          <div class="py-4 text-center">
             <p class="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">© 2026 Buscaya Comunidad</p>
          </div>
        </div>
      </aside>

      <!-- FAB (Visible on mobile only when sidebar is hidden) -->
      <button 
        @click="openCreateModal"
        class="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary-500 rounded-full shadow-2xl shadow-primary-200 flex items-center justify-center text-white hover:bg-primary-600 transition transform hover:scale-105 active:scale-95 z-40 border-4 border-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <CreatePostModal 
         v-model="showCreateModal" 
         @success="handlePostCreated"
      />
      
      <LoginModal v-model:isOpen="showLoginModal" />
      
      <ReportModal 
        v-model="showReportModal" 
        :loading="isReporting"
        @submit="handleReportSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCommunityStore } from '@/stores/community.store';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { useAuthStore } from '@/stores/auth.store';
import PostCard from '@/components/Comunidad/PostCard.vue';
import PostSkeleton from '@/components/Comunidad/PostSkeleton.vue';
import CreatePostModal from '@/components/Comunidad/CreatePostModal.vue';
import ReportModal from '@/components/Comunidad/ReportModal.vue';
import LoginModal from '@/components/auth/LoginModal.vue';

const store = useCommunityStore();
const ubicacionStore = useUbicacionNegocios();
const authStore = useAuthStore();

const filter = ref('todos');
const searchQuery = ref('');
const showCreateModal = ref(false);
const showReportModal = ref(false);
const showLoginModal = ref(false);
const postToReport = ref<any>(null);
const isReporting = ref(false);

const filterOptions = [
  { id: 'todos', label: 'Todos', emoji: '🏠', activeClass: 'bg-gray-900 border-gray-900 text-white' },
  { id: 'ofertas', label: 'Ofertas', emoji: '🔥', activeClass: 'bg-[#F59E0B] border-[#F59E0B] text-white' },
  { id: 'vecinos', label: 'Vecinos', emoji: '💬', activeClass: 'bg-[#6366F1] border-[#6366F1] text-white' },
  { id: 'otros', label: 'Otros', emoji: '📦', activeClass: 'bg-gray-500 border-gray-500 text-white' },
];

const posts = computed(() => store.posts);
const loading = computed(() => store.loading);

const filteredPosts = computed(() => {
  let result = posts.value;
  
  if (filter.value !== 'todos') {
    result = result.filter(p => p.category === filter.value);
  }
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => 
      p.content.toLowerCase().includes(q) || 
      p.author.toLowerCase().includes(q)
    );
  }
  
  return result;
});

onMounted(() => {
  if (ubicacionStore.ubicacion) {
     store.fetchPosts(ubicacionStore.ubicacion.lat, ubicacionStore.ubicacion.lng);
  }
});

watch(() => ubicacionStore.ubicacion, (newVal) => {
   if (newVal) {
      store.fetchPosts(newVal.lat, newVal.lng);
   }
});

watch(() => ubicacionStore.filtros.radius, () => {
    if (ubicacionStore.ubicacion) {
        store.fetchPosts(ubicacionStore.ubicacion.lat, ubicacionStore.ubicacion.lng, true);
    }
});

watch(() => authStore.user, () => {
    if (ubicacionStore.ubicacion) {
        // Force refresh to update 'isLikedByCurrentUser' status or load public feed
        store.fetchPosts(ubicacionStore.ubicacion.lat, ubicacionStore.ubicacion.lng, true);
    }
});

const openCreateModal = () => {
   if (!authStore.user) {
      showLoginModal.value = true;
      return;
   }
   showCreateModal.value = true;
};

const handlePostCreated = () => {
   if (ubicacionStore.ubicacion) {
      // Refresh feed
      store.fetchPosts(ubicacionStore.ubicacion.lat, ubicacionStore.ubicacion.lng, true);
   }
};

const openReportModal = (post: any) => {
    postToReport.value = post;
    showReportModal.value = true;
};

const handleReportSubmit = async (reason: string) => {
    if (!postToReport.value) return;
    
    isReporting.value = true;
    const success = await store.reportPost(postToReport.value.id, reason);
    isReporting.value = false;
    
    if (success) {
        showReportModal.value = false;
        postToReport.value = null;
        // Optional: show a success toast or alert
        alert('Reporte enviado con éxito. Gracias por ayudarnos a mantener la comunidad segura.');
    } else {
        alert('Hubo un error al enviar el reporte. Por favor intenta de nuevo.');
    }
};

const loadingMore = ref(false);

const handleLoadMore = async () => {
    if (loadingMore.value || !store.hasMore || !ubicacionStore.ubicacion) return;
    
    loadingMore.value = true;
    try {
        const nextPage = store.page + 1;
        await store.fetchPosts(ubicacionStore.ubicacion.lat, ubicacionStore.ubicacion.lng, false, nextPage);
    } finally {
        loadingMore.value = false;
    }
};

definePageMeta({
  paddingClass: 'px-0'
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
