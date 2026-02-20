import { defineStore } from 'pinia';
import { useAuthStore } from './auth.store';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
  read: boolean;
  metadata?: any;
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    loading: false,
    error: null as string | null,
    lastUpdate: 0,
    page: 1,
    hasMore: true,
  }),

  actions: {
    async fetchNotifications(force = false, page = 1) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();
      
      if (!authStore.user?.token) return;

      const now = Date.now();
      const expiration = 5 * 60 * 1000; // 5 minutes

      // Cache check
      if (
        !force &&
        page === 1 &&
        this.notifications.length > 0 &&
        now - this.lastUpdate < expiration
      ) {
        return;
      }

      if (page > 1 && !this.hasMore && !force) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await $fetch(`${API_BASE}/notifications/mis-notificaciones?page=${page}`, {
          headers: {
            Authorization: `Bearer ${authStore.user.token}`
          }
        });

        let newNotifications: Notification[] = [];
        let meta = { page: 1, lastPage: 1, total: 0 };

        if (response && response.data) {
             newNotifications = response.data;
             meta = response.meta;
        } else if (Array.isArray(response)) {
            newNotifications = response;
        }

        if (page === 1) {
          this.notifications = newNotifications;
        } else {
           const existingIds = new Set(this.notifications.map((n) => n._id));
           const uniqueIncoming = newNotifications.filter(
             (n) => !existingIds.has(n._id),
           );
           this.notifications = [...this.notifications, ...uniqueIncoming];
        }

        this.lastUpdate = now;
        this.page = meta.page;
        this.hasMore = meta.page < meta.lastPage;

      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notificationId: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();
      
      if (!authStore.user?.token) return;

      // Optimistic update
      const index = this.notifications.findIndex(n => n._id === notificationId);
      if (index !== -1) {
        this.notifications[index].read = true;
      }

      try {
        await $fetch(`${API_BASE}/notifications/${notificationId}/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.user.token}`
          }
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
        // Could revert here if strict
      }
    },
    
    async markAllAsRead() {
        const config = useRuntimeConfig();
        const API_BASE = config.public.apiBase;
        const authStore = useAuthStore();

        if (!authStore.user?.token) return;

        // Optimistic
        this.notifications.forEach(n => n.read = true);

        try {
             await $fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authStore.user.token}` }
             });
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    },

    clearNotifications() {
      this.notifications = [];
      this.page = 1;
      this.hasMore = true;
      this.lastUpdate = 0;
    }
  }
});
