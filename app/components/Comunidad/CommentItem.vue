<template>
  <div class="relative">
    <!-- Main Comment Row -->
    <div class="flex gap-1 relative z-10">
      <!-- Short connector from current avatar down towards children -->
      <div
        v-if="hasReplies"
        class="absolute left-[19px] w-[1.5px] bg-gray-200 z-0 opacity-80"
        :class="[isReply ? 'top-7 bottom-[-12px]' : 'top-10 bottom-[-12px]']"
      ></div>

      <!-- Gutter line for current level siblings -->
      <div
        v-if="isReply"
        class="absolute -left-[9px] top-[-16px] w-[1.5px] bg-gray-200 z-0 opacity-80"
        :class="isLast ? 'h-2' : 'bottom-[-16px]'"
      ></div>
      <!-- Avatar Section -->
      <div class="flex-shrink-0 relative z-20">
        <img
          v-if="comment.avatar"
          :src="comment.avatar"
          :class="[
            isReply ? 'w-7 h-7' : 'w-10 h-10',
            'rounded-full bg-gray-100 border border-gray-100 shadow-sm',
          ]"
        />
        <div
          v-else
          :class="[
            isReply ? 'w-7 h-7' : 'w-10 h-10',
            'rounded-full bg-gray-50 flex items-center justify-center border border-gray-100',
          ]"
        >
          <span :class="isReply ? 'text-[10px]' : 'text-sm'">👤</span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="flex-1 min-w-0">
        <!-- Text Bubble -->
        <div
          class="bg-gray-50 rounded-2xl px-4 pb-2.5 pt-[2px] inline-block max-w-full hover:bg-gray-100/80 transition-colors"
        >
          <div class="flex items-center gap-2 mb-0.5">
            <span class="font-bold text-gray-900 text-sm">
              {{ formattedAuthor }}
            </span>
            <span class="text-[11px] text-gray-400 font-normal">
              • {{ relativeTime }}
            </span>
          </div>
          <p
            class="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap"
          >
            {{ comment.content }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 mt-1.5 ml-2">
          <button
            @click="handleLike"
            :class="[
              'text-[12px] font-bold transition-colors',
              comment.isLikedByCurrentUser
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Me gusta
          </button>

          <button
            v-if="!isReply"
            @click="$emit('reply', comment)"
            class="text-[12px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Responder
          </button>

          <button
            v-if="isOwner"
            @click="$emit('delete', comment)"
            class="text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            Eliminar
          </button>

          <!-- Likes Count Mini Badge -->
          <div
            v-if="comment.likes > 0"
            class="flex items-center gap-1 bg-white shadow-sm border border-gray-100 rounded-full px-1.5 py-0.5 ml-auto"
          >
            <span class="text-[10px]">👍</span>
            <span class="text-[10px] font-bold text-gray-500">{{
              comment.likes
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tree Lines & Nested Replies -->
    <div v-if="hasReplies" class="mt-2 relative">
      <!-- Trunk Line removed from here -->

      <!-- Recursive Loop -->
      <div class="pl-7 space-y-3 mt-6">
        <div
          v-for="(reply, index) in displayedReplies"
          :key="reply.id"
          class="relative"
        >
          <!-- Branch Line (L-shape connector) -->
          <div
            class="absolute -left-[9px] top-[-14px] w-[9px] h-[30px] border-l-[1.5px] border-b-[1.5px] border-gray-200 rounded-bl-xl z-0 opacity-80"
          ></div>

          <CommentItem
            :comment="reply"
            :is-reply="true"
            :is-last="
              index === displayedReplies.length - 1 && remainingReplies === 0
            "
            :current-user-id="currentUserId"
            @like="$emit('like', $event)"
            @reply="$emit('reply', $event)"
            @delete="$emit('delete', $event)"
            @require-login="$emit('require-login')"
          />
        </div>

        <!-- View More Replies -->
        <div v-if="remainingReplies > 0" class="relative">
          <!-- Connector for the button -->
          <div
            class="absolute -left-[9px] top-[-24px] w-[9px] h-[40px] border-l-[1.5px] border-b-[1.5px] border-gray-200 rounded-bl-xl z-0 opacity-80"
          ></div>

          <button
            @click="showAllReplies = true"
            class="flex items-center gap-2 pl-2 group h-8"
          >
            <span
              class="text-[12px] font-bold text-gray-400 group-hover:text-primary-600 transition-colors"
            >
              Ver {{ remainingReplies }} respuesta{{
                remainingReplies > 1 ? 's' : ''
              }}
              más...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PostComment } from '@/types/community.types';
import { getRelativeTime } from '@/utils/date';

const props = defineProps<{
  comment: PostComment;
  isReply?: boolean;
  isLast?: boolean;
  currentUserId?: string;
}>();

const emit = defineEmits<{
  (e: 'like', comment: PostComment): void;
  (e: 'reply', comment: PostComment): void;
  (e: 'delete', comment: PostComment): void;
  (e: 'require-login'): void;
}>();

const showAllReplies = ref(false);

const handleLike = () => {
  if (!props.currentUserId) {
    emit('require-login');
    return;
  }
  emit('like', props.comment);
};

const formattedAuthor = computed(() => {
  if (!props.comment.author) return 'Usuario';
  return props.comment.author
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

const relativeTime = computed(() => getRelativeTime(props.comment.timestamp));
const isOwner = computed(() => props.currentUserId === props.comment.authorId);

const hasReplies = computed(
  () => props.comment.replies && props.comment.replies.length > 0
);
const displayedReplies = computed(() => {
  if (!hasReplies.value || !props.comment.replies) return [];
  return showAllReplies.value
    ? props.comment.replies
    : props.comment.replies.slice(0, 1);
});
const remainingReplies = computed(() => {
  if (!hasReplies.value) return 0;
  return props.comment.replies!.length - displayedReplies.value.length;
});
</script>

<style scoped>
/* Ensure smooth transitions for nested content */
.pl-10 {
  transition: all 0.3s ease;
}
</style>
