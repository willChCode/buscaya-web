<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-5 sm:p-10 h-full relative min-h-[500px]"
  >
    <!-- Loading Overlay -->
    <div
      v-if="loading && notifications.length === 0"
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
          Notificaciones
        </h2>
        <p class="text-gray-400 text-sm mt-1">
          Mantente al día con las novedades y alertas.
        </p>
      </div>
      <!-- <button
        v-if="notifications.some((n) => !n.read)"
        @click="markAllAsRead"
        class="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
      >
        Marcar todas como leídas
      </button> -->
    </div>

    <div v-if="notifications.length > 0" class="space-y-0">
      <div
        v-for="notification in notifications"
        :key="notification._id"
        @click="handleNotificationClick(notification)"
        class="flex items-start gap-4 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group relative -mx-4 px-4 sm:mx-0 sm:px-4 cursor-pointer rounded-xl"
        :class="{ 'bg-blue-50/30': !notification.read }"
      >
        <!-- Icon Indicator -->
        <div class="flex-shrink-0 mt-1">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="{
              'bg-blue-100 text-blue-600':
                notification.type === 'comment' ||
                notification.type === 'reply',
              'bg-red-100 text-red-600':
                notification.type === 'like' ||
                notification.type === 'reaction',
              'bg-green-100 text-green-600': notification.type === 'system',
              'bg-gray-100 text-gray-500': ![
                'comment',
                'reply',
                'like',
                'reaction',
                'system',
              ].includes(notification.type),
            }"
          >
            <!-- Icons based on type -->
            <svg
              v-if="
                notification.type === 'comment' || notification.type === 'reply'
              "
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <svg
              v-else-if="
                notification.type === 'like' || notification.type === 'reaction'
              "
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <h4
              class="text-[13px] md:text-sm font-bold text-gray-900 mb-0.5 truncate pr-2"
              :class="{ 'font-semibold': !notification.read }"
            >
              {{ notification.title }}
            </h4>
            <span
              class="text-xs text-gray-400 whitespace-nowrap flex-shrink-0"
              >{{ getRelativeTime(notification.createdAt) }}</span
            >
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ notification.body }}
          </p>
        </div>

        <!-- Read Indicator -->
        <div
          v-if="!notification.read"
          class="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"
        ></div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="pt-8 flex justify-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-2 rounded-full bg-gray-50 text-gray-600 font-medium text-sm hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {{ loadingMore ? 'Cargando...' : 'Ver más notificaciones' }}
        </button>
      </div>
    </div>

    <div
      v-else-if="!loading"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Sin notificaciones</h3>
      <p class="text-gray-500 max-w-sm">No tienes notificaciones recientes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useNotificationsStore } from '~/stores/notifications.store';
import { getRelativeTime } from '~/utils/date';
import { useRouter } from '#app';

const store = useNotificationsStore();
const router = useRouter();

const notifications = computed(() => store.notifications);
const loading = ref(true);
const loadingMore = ref(false);
const hasMore = computed(() => store.hasMore);

const loadMore = async () => {
  loadingMore.value = true;
  await store.fetchNotifications(false, store.page + 1);
  loadingMore.value = false;
};

const markAllAsRead = async () => {
  await store.markAllAsRead();
};

const handleNotificationClick = async (notification: any) => {
  // Mark as read
  if (!notification.read) {
    store.markAsRead(notification._id);
  }

  // Navigate based on metadata
  // Example metadata: { postId: '123', commentId: '456', type: 'comment' }
  // Or sometimes strict structure depending on backend.
  // Based on mobile app usage, metadata often contains keys like 'postId' directly or inside 'data'.

  // Check metadata structure from API response in store or mock
  const meta = notification.metadata || {};

  if (meta.postId || meta.publicacionId) {
    router.push(`/publicacion/${meta.postId || meta.publicacionId}`);
  } else if (notification.type === 'system') {
    // Maybe alert or specific route
  }
};

onMounted(async () => {
  try {
    await store.fetchNotifications();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
