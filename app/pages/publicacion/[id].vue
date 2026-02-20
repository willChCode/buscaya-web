<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Navbar (Static/Sticky and centered in layout) -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-3">
      <div class="max-w-4xl mx-auto flex items-center gap-4">
        <button 
          @click="goBack" 
          class="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="font-black text-xl text-gray-900 tracking-tight">Publicación</h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 mt-6">
      <div v-if="loading && !post" class="flex flex-col items-center justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
         <p class="mt-4 text-gray-500 font-medium">Cargando detalles...</p>
      </div>

      <div v-else-if="post" class="space-y-6">
        <!-- Main Post Content -->
        <PostCard 
          :post="post" 
          :disable-navigation="true"
          @require-login="showLoginModal = true"
          @report="openReportModal"
        />

        <!-- Comments Section Header -->
        <div class="flex items-center justify-between px-4">
           <h2 class="font-black text-lg text-gray-900">Comentarios ({{ post.comments.length }})</h2>
           <div class="h-[1px] flex-1 bg-gray-100 ml-4"></div>
        </div>

        <!-- Comments Tree -->
        <div class="space-y-8 px-2 pb-10">
           <div v-if="post.comments.length === 0" class="text-center py-12 opacity-60">
              <span class="text-4xl">💬</span>
              <p class="mt-4 text-gray-400 font-medium italic">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
           </div>
           
           <CommentItem 
             v-for="comment in sortedComments" 
             :key="comment.id"
             :comment="comment"
             :current-user-id="authStore.user?.uid"
             @like="handleCommentLike"
             @reply="handleReplyTo"
             @delete="handleCommentDelete"
             @require-login="showLoginModal = true"
           />
        </div>
      </div>
    </div>

    <!-- Bottom Input Bar (Sticky) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
      <div class="max-w-4xl mx-auto">
        <!-- Replying to indicator -->
        <div v-if="replyingTo" class="flex items-center justify-between py-1.5 px-3 mb-2 bg-primary-50 rounded-xl animate-in fade-in slide-in-from-bottom-2">
           <span class="text-xs text-primary-700 font-bold uppercase tracking-tight">
             Respondiendo a {{ replyingTo.author }}
           </span>
           <button @click="replyingTo = null" class="text-primary-400 hover:text-primary-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        <div class="flex items-end gap-3">
          <!-- Current User Avatar -->
          <div class="flex-shrink-0 hidden sm:block">
            <img 
              v-if="authStore.user?.image?.url" 
              :src="authStore.user.image.url" 
              class="w-10 h-10 rounded-full border border-gray-100"
            />
            <div v-else class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              <span class="text-lg">👤</span>
            </div>
          </div>

          <!-- Input Area -->
          <div class="flex-1 relative">
            <textarea 
              v-model="commentText"
              ref="textInput"
              :placeholder="replyingTo ? 'Escribe una respuesta...' : 'Escribe un comentario...'"
              class="w-full bg-gray-50 border-transparent rounded-2xl px-4 py-3 text-[15px] focus:bg-white focus:border-primary-500 transition-all resize-none max-h-32"
              rows="1"
              @input="adjustTextareaHeight"
            ></textarea>
          </div>

          <!-- Send Button -->
          <button 
            @click="submitComment"
            :disabled="!commentText.trim() || submitting"
            class="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all disabled:opacity-30 disabled:shadow-none translate-y-0 active:translate-y-0.5"
          >
            <div v-if="submitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transform rotate-45 -translate-x-0.5 translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <LoginModal v-model:isOpen="showLoginModal" />

    <ReportModal 
      v-model="showReportModal" 
      :loading="isReporting"
      @submit="handleReportSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCommunityStore } from '@/stores/community.store';
import { useAuthStore } from '@/stores/auth.store';
import PostCard from '@/components/Comunidad/PostCard.vue';
import CommentItem from '@/components/Comunidad/CommentItem.vue';
import ReportModal from '@/components/Comunidad/ReportModal.vue';
import LoginModal from '@/components/auth/LoginModal.vue';

const route = useRoute();
const router = useRouter();
const store = useCommunityStore();
const authStore = useAuthStore();

const postId = route.params.id as string;
const post = computed(() => store.currentPost);
const loading = computed(() => store.loading);

const commentText = ref('');
const submitting = ref(false);
const replyingTo = ref<{ id: string; author: string } | null>(null);
const textInput = ref<HTMLTextAreaElement | null>(null);

const showReportModal = ref(false);
const showLoginModal = ref(false);
const isReporting = ref(false);
const postToReport = ref<any>(null);

const sortedComments = computed(() => {
  if (!post.value?.comments) return [];
  return [...post.value.comments].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
});

onMounted(async () => {
  if (postId) {
    await store.fetchPostById(postId, authStore.user?.token);
  }
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/comunidad');
  }
};

const adjustTextareaHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
};

const handleCommentLike = async (comment: any) => {
  if (!authStore.user) {
    showLoginModal.value = true;
    return;
  }
  await store.toggleCommentReaction(postId, comment.id);
};

const handleReplyTo = (comment: any) => {
  replyingTo.value = { id: comment.id, author: comment.author };
  nextTick(() => {
    textInput.value?.focus();
  });
};

const handleCommentDelete = async (comment: any) => {
  if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
    await store.deleteComment(postId, comment.id);
  }
};

const submitComment = async () => {
  if (!commentText.value.trim() || !authStore.user) return;
  
  submitting.value = true;
  try {
    const parentId = replyingTo.value?.id;
    const success = await store.addComment(postId, commentText.value, parentId);
    
    if (success) {
      commentText.value = '';
      replyingTo.value = null;
      if (textInput.value) textInput.value.style.height = 'auto';
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
  } finally {
    submitting.value = false;
  }
};

const openReportModal = (postToReportVal: any) => {
    postToReport.value = postToReportVal;
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
        alert('Reporte enviado con éxito. Gracias por ayudarnos a mantener la comunidad segura.');
    } else {
        alert('Hubo un error al enviar el reporte. Por favor intenta de nuevo.');
    }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
