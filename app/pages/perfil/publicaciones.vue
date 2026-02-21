<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-5 sm:p-10 h-full relative min-h-[500px]"
  >
    <!-- Loading Overlay -->
    <div
      v-if="loading && posts.length === 0"
      class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-2xl"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
      ></div>
    </div>

    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
    >
      <div>
        <h2
          class="text-[22px] sm:text-2xl font-bold text-gray-900 tracking-tight"
        >
          Mis Publicaciones
        </h2>
        <p class="text-gray-400 text-sm mt-1">
          Gestiona tu actividad en la comunidad.
        </p>
      </div>
    </div>

    <div v-if="posts.length > 0" class="space-y-0">
      <div
        v-for="post in posts"
        :key="post.id"
        class="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group relative -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <!-- Image -->
        <div
          v-if="post.image"
          class="w-full sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100"
        >
          <img
            :src="post.image"
            class="w-full h-full object-cover"
            alt="Post Image"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 py-1">
          <div class="flex justify-between items-start">
            <p
              class="text-gray-900 font-medium text-[14px] md:text-[15px] leading-relaxed line-clamp-2 mb-2 pr-8"
            >
              {{ post.content }}
            </p>

            <!-- Desktop Actions (Hover) -->
            <div
              class="hidden sm:flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="router.push(`/publicacion/${post.id}`)"
                class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ver publicación"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(post.id)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar publicación"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="flex items-center gap-4 text-[11px] md:text-xs font-medium text-gray-400 mt-1"
          >
            <span class="text-gray-500">{{
              getRelativeTime(post.timestamp)
            }}</span>
            <div class="w-1 h-1 rounded-full bg-gray-300"></div>
            <span class="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
                />
              </svg>
              {{ post.likes }}
            </span>
            <div class="w-1 h-1 rounded-full bg-gray-300"></div>
            <span class="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ post.comments.length }}
            </span>
          </div>
        </div>

        <!-- Mobile Actions (Always Visible) -->
        <div
          class="flex sm:hidden justify-end gap-4 border-t border-gray-50 pt-3 mt-1"
        >
          <button
            @click="router.push(`/publicacion/${post.id}`)"
            class="text-xs font-semibold text-gray-500 hover:text-gray-900"
          >
            Ver
          </button>
          <button
            @click="confirmDelete(post.id)"
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
          {{ loadingMore ? 'Cargando...' : 'Ver más publicaciones' }}
        </button>
      </div>
    </div>

    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">
        No tienes publicaciones aún
      </h3>
      <p class="text-gray-500 max-w-sm mb-6">
        Empieza a publicar en la comunidad para interactuar con tus vecinos.
      </p>
      <button
        @click="openCreateModal"
        class="text-primary-600 font-bold hover:underline"
      >
        Crear mi primera publicación
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useCommunityStore } from '~/stores/community.store';
import { getRelativeTime } from '~/utils/date';
import { useRouter } from '#app';
import CreatePostModal from '~/components/Comunidad/CreatePostModal.vue'; // Standardize this modal usage? We might need to emit event to parent layout or use a global modal store.
// For now, assuming we might replicate or reuse the modal logic.
// However, the requested task is just porting the list. "New Post" button can just redirect to community page or open modal if available.
// Let's redirect to community page with a query param or just community page for now if modal is local to community page.
// The mobile app has a "New Post" button that likely opens a modal.
// In web, CreatePostModal is used in comunidad.vue.
// I will just redirect to /comunidad for creation for now to keep it simple, or I can try to import the modal.
// To allow "local" creation, I'd need to add the modal here.

const communityStore = useCommunityStore();
const router = useRouter();

const posts = computed(() => communityStore.myPosts);
const loading = ref(true);
const loadingMore = ref(false);
const hasMore = computed(() => communityStore.hasMoreMyPosts);

const openCreateModal = () => {
  // Navigate to community page to create post
  router.push('/comunidad');
};

const loadMore = async () => {
  loadingMore.value = true;
  await communityStore.fetchMyPosts(false, communityStore.pageMyPosts + 1);
  loadingMore.value = false;
};

const confirmDelete = async (postId: string) => {
  const confirmed = confirm(
    '¿Estás seguro de que quieres eliminar esta publicación?'
  );
  if (confirmed) {
    const success = await communityStore.deletePost(postId);
    if (success) {
      alert('Publicación eliminada correctamente');
    } else {
      alert('Error al eliminar la publicación');
    }
  }
};

onMounted(async () => {
  try {
    await communityStore.fetchMyPosts();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
