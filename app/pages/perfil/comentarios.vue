<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-10 h-full relative min-h-[500px]">
     <!-- Loading Overlay -->
    <div v-if="loading && comments.length === 0" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-2xl">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <div>
        <h2 class="text-[22px] sm:text-3xl font-bold text-gray-900 tracking-tight">Mis Comentarios</h2>
        <p class="text-gray-400 text-sm mt-1">Historial de tu participación en la comunidad.</p>
      </div>
    </div>

    <div v-if="comments.length > 0" class="space-y-0">
       <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="flex flex-col gap-3 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group relative -mx-4 px-4 sm:mx-0 sm:px-0"
       >
          <!-- Comment Header -->
          <div class="flex justify-between items-start">
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span class="font-semibold text-gray-900" v-if="comment.isReply">Respuesta</span>
                  <span class="font-semibold text-gray-900" v-else>Comentario</span>
                  <span>en</span>
                  <span class="font-medium text-gray-700 truncate max-w-[150px] sm:max-w-xs cursor-pointer hover:underline" @click="router.push(`/publicacion/${comment.postId}`)">
                      {{ comment.postTitle || 'Publicación' }}
                  </span>
                  <span>•</span>
                  <span>{{ getRelativeTime(comment.timestamp) }}</span>
              </div>
              
               <!-- Desktop Actions (Hover) -->
               <div class="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                      @click="router.push(`/publicacion/${comment.postId}`)"
                      class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Ver publicación"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                  </button>
                  <button 
                      @click="confirmDelete(comment)"
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar comentario"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                  </button>
               </div>
          </div>

          <!-- Content -->
          <p class="text-gray-900 font-medium text-[15px] leading-relaxed whitespace-pre-wrap">{{ comment.content }}</p>

           <!-- Stats -->
           <div class="flex items-center gap-4 text-xs font-medium text-gray-400">
               <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {{ comment.likes }}
              </span>
           </div>

          <!-- Mobile Actions -->
          <div class="flex sm:hidden justify-end gap-4 border-t border-gray-50 pt-3 mt-1">
             <button 
                @click="router.push(`/publicacion/${comment.postId}`)"
                class="text-xs font-semibold text-gray-500 hover:text-gray-900"
             >
                Ver publicación
             </button>
             <button 
                @click="confirmDelete(comment)"
                class="text-xs font-semibold text-red-500 hover:text-red-700"
             >
                Eliminar
             </button>
          </div>
       </div>

       <!-- Load More -->
       <div v-if="hasMore" class="pt-8 flex justify-center">
          <button 
            @click="loadMore" 
            :disabled="loadingMore"
            class="px-6 py-2 rounded-full bg-gray-50 text-gray-600 font-medium text-sm hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            {{ loadingMore ? 'Cargando...' : 'Ver más comentarios' }}
          </button>
       </div>
    </div>

    <div v-else-if="!loading" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Aún no has comentado</h3>
      <p class="text-gray-500 max-w-sm">Tus comentarios en las publicaciones de la comunidad aparecerán aquí.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useCommunityStore } from '~/stores/community.store';
import { getRelativeTime } from '~/utils/date';
import { useRouter } from '#app';

const communityStore = useCommunityStore();
const router = useRouter();

const comments = computed(() => communityStore.myComments);
const loading = ref(true);
const loadingMore = ref(false);
const hasMore = computed(() => communityStore.hasMoreMyComments);

const loadMore = async () => {
    loadingMore.value = true;
    await communityStore.fetchMyComments(false, communityStore.pageMyComments + 1);
    loadingMore.value = false;
};

const confirmDelete = async (comment: any) => {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar este comentario?');
    if (confirmed) {
        // We pass postId and commentId. If it's linked to a post, we have postId.
        if (comment.postId) {
             const success = await communityStore.deleteComment(comment.postId, comment.id, comment.isReply);
            if (success) {
                // Alert or Toast? Minimalist usually no alert, just disappears.
            } else {
                alert('Error al eliminar el comentario');
            }
        } else {
            alert('No se puede eliminar: Información de publicación no encontrada.');
        }
    }
};

onMounted(async () => {
  try {
    await communityStore.fetchMyComments();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
