<template>
  <div
    class="bg-white rounded-3xl shadow-sm border border-gray-200 mb-6 overflow-hidden transition-all duration-300 group"
    :class="[
      disableNavigation
        ? ''
        : 'hover:shadow-lg hover:shadow-gray-200/60 hover:scale-[1.02] cursor-pointer',
    ]"
    @click="handleNavigate"
  >
    <!-- Header -->
    <div class="p-5 flex items-start justify-between">
      <div class="flex items-center flex-1">
        <div class="relative">
          <img
            :src="post.authorAvatar"
            alt="Avatar"
            class="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
            @error="handleImageError"
          />
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
          ></div>
        </div>
        <div class="ml-4">
          <h3
            class="font-bold text-gray-900 text-[14px] md:text-base leading-tight hover:text-primary-600 transition-colors cursor-pointer"
          >
            {{ post.author }}
          </h3>
          <div
            class="flex items-center text-[12px] md:text-xs text-gray-400 mt-1 font-medium"
          >
            <span class="hover:text-gray-600 cursor-default">{{
              relativeTime
            }}</span>
            <span class="mx-2">•</span>
            <div
              class="flex items-center gap-1 hover:text-gray-600 cursor-default"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Mi zona</span>
            </div>
          </div>
        </div>
      </div>

      <span
        class="px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.1em]"
        :style="{
          backgroundColor: categoryColor + '15',
          color: categoryColor,
          border: `1px solid ${categoryColor}30`,
        }"
      >
        {{ categoryLabel }}
      </span>
    </div>

    <!-- Content -->
    <div class="px-5 pb-4">
      <p
        class="text-gray-700 text-[14px] md:text-[15px] leading-[1.6] whitespace-pre-wrap font-medium"
      >
        {{ post.content }}
      </p>
    </div>

    <!-- Image -->
    <div
      v-if="post.image"
      class="mx-5 mb-5 rounded-2xl overflow-hidden bg-gray-50 relative group"
    >
      <img
        :src="post.image"
        class="w-full h-auto max-h-[280px] sm:max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
        alt="Post Image"
      />
    </div>

    <!-- Stats -->
    <div
      class="mx-5 py-3 flex items-center justify-between border-t border-gray-50"
    >
      <div class="flex items-center gap-2" v-if="post.likes > 0">
        <div class="flex -space-x-1">
          <div
            class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-sm"
          >
            <span class="text-[10px]">👍</span>
          </div>
        </div>
        <span class="text-xs font-bold text-gray-500 translate-y-[0.5px]">
          {{
            post.likes === 1
              ? '1 persona le gusta'
              : `${post.likes} personas les gusta`
          }}
        </span>
      </div>
      <div v-else></div>

      <button
        class="text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors"
      >
        {{ post.comments.length }} comentarios
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between px-3 py-2 bg-gray-50/50">
      <button
        @click.stop="handleLike"
        class="flex-1 flex items-center justify-center py-3 rounded-2xl transition-all gap-2 group/btn"
        :class="
          post.isLikedByCurrentUser
            ? 'text-blue-600 font-bold'
            : 'text-gray-500 hover:bg-white hover:shadow-sm'
        "
      >
        <div class="transform transition-transform group-active/btn:scale-125">
          <span class="text-xl" v-if="post.isLikedByCurrentUser">👍</span>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 md:h-6 md:w-6 transition-colors group-hover/btn:text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
        </div>
        <span class="text-[14px] md:text-sm">Me gusta</span>
      </button>

      <button
        @click.stop="handleComment"
        class="flex-1 flex items-center justify-center py-3 rounded-2xl text-gray-500 hover:bg-white hover:shadow-sm transition-all gap-2 group/btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 md:h-6 md:w-6 transition-colors group-hover/btn:text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <span class="text-[14px] md:text-sm">Comentar</span>
      </button>

      <button
        @click.stop="handleReport"
        class="flex-1 flex items-center justify-center py-3 rounded-2xl text-gray-500 hover:bg-white hover:shadow-sm transition-all gap-2 group/btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 md:h-6 md:w-6 transition-colors group-hover/btn:text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span class="text-[14px] md:text-sm">Reportar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/types/community.types';
import { getRelativeTime } from '@/utils/date';
import { useCommunityStore } from '@/stores/community.store';

const props = withDefaults(
  defineProps<{
    post: Post;
    disableNavigation?: boolean;
  }>(),
  {
    disableNavigation: false,
  }
);

const store = useCommunityStore();
const authStore = useAuthStore();
const router = useRouter();

const emit = defineEmits(['require-login', 'report']);

const handleNavigate = () => {
  if (props.disableNavigation) return;
  router.push(`/publicacion/${props.post.id}`);
};

const relativeTime = computed(() => getRelativeTime(props.post.timestamp));

const categoryColor = computed(() => {
  switch (props.post.category) {
    case 'ofertas':
      return '#F59E0B';
    case 'vecinos':
      return '#6366F1';
    default:
      return '#6B7280';
  }
});

const categoryLabel = computed(() => {
  switch (props.post.category) {
    case 'ofertas':
      return 'Oferta';
    case 'vecinos':
      return 'Vecinos';
    default:
      return 'Otros';
  }
});

const handleLike = () => {
  if (!authStore.user) {
    emit('require-login');
    return;
  }
  store.toggleReaction(props.post.id, 'like');
};

const handleComment = () => {
  if (!authStore.user) {
    emit('require-login');
    return;
  }
  handleNavigate();
};

const handleReport = () => {
  if (!authStore.user) {
    emit('require-login');
    return;
  }
  emit('report', props.post);
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.post.author)}&background=random`;
  }
};
</script>
