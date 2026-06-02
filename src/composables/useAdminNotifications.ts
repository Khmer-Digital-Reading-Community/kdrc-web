import { ref, computed } from 'vue';
import notificationService, {
  type Notification,
} from '../services/notification.service';

const notifications = ref<Notification[]>([]);
const loading = ref(false);
let loaded = false;

export function useAdminNotifications() {
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  );

  const load = async (force = false) => {
    if (loaded && !force) return;
    loading.value = true;
    try {
      notifications.value = await notificationService.getMyNotifications();
      loaded = true;
    } catch (e) {
      console.error('Failed to load notifications', e);
      notifications.value = [];
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    const item = notifications.value.find((n) => n.id === id);
    if (!item || item.read) return;
    try {
      const updated = await notificationService.markAsRead(id);
      const idx = notifications.value.findIndex((n) => n.id === id);
      if (idx !== -1) notifications.value[idx] = updated;
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      notifications.value = notifications.value.map((n) => ({
        ...n,
        read: true,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      notifications.value = notifications.value.filter((n) => n.id !== id);
    } catch (e) {
      console.error(e);
    }
  };

  const clearAll = async () => {
    const ids = [...notifications.value.map((n) => n.id)];
    for (const id of ids) {
      await remove(id);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'security';
      case 'success':
        return 'user';
      default:
        return 'system';
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    load,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
    formatTime,
    typeIcon,
  };
}
