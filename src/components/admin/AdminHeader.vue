<template>
  <header class="admin-header">
    <div class="header-left">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <p v-if="pageSubtitle" class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <div class="header-right">
      <button
        type="button"
        class="icon-circle theme-toggle"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Light mode' : 'Dark mode'"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <div class="notification-wrap" v-click-outside="() => (notifOpen = false)">
        <button
          type="button"
          class="icon-circle"
          aria-label="Notifications"
          @click="toggleNotif"
        >
          <Bell :size="20" />
          <span v-if="unreadCount > 0" class="dot-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>

        <div v-if="notifOpen" class="dropdown notif-dropdown">
          <div class="dropdown-top">
            <strong>Notifications</strong>
            <button
              v-if="unreadCount > 0"
              type="button"
              class="link-btn"
              @click="markAllAsRead"
            >
              Mark all read
            </button>
          </div>
          <div class="dropdown-list">
            <div v-if="loading" class="dropdown-empty">Loading…</div>
            <div v-else-if="!notifications.length" class="dropdown-empty">
              <Bell :size="28" />
              <p>No notifications</p>
            </div>
            <button
              v-for="n in notifications.slice(0, 6)"
              :key="n.id"
              type="button"
              class="notif-row"
              :class="{ unread: !n.read }"
              @click="onNotifClick(n)"
            >
              <span class="notif-type" :class="typeIcon(n.type)" />
              <span class="notif-text">
                <span class="notif-title">{{ n.title }}</span>
                <span class="notif-time">{{ formatTime(n.createdAt) }}</span>
              </span>
            </button>
          </div>
          <router-link to="/admin/notifications" class="dropdown-foot" @click="notifOpen = false">
            View all →
          </router-link>
        </div>
      </div>

      <div class="profile-wrap" v-click-outside="() => (profileOpen = false)">
        <button type="button" class="profile-btn" @click="profileOpen = !profileOpen">
          <span class="avatar">{{ initials }}</span>
          <span class="profile-meta">
            <span class="profile-name">{{ displayName }}</span>
            <span class="profile-role">Administrator</span>
          </span>
          <ChevronDown :size="16" class="chevron" :class="{ open: profileOpen }" />
        </button>
        <div v-if="profileOpen" class="dropdown profile-dropdown">
          <p class="profile-email">{{ userEmail }}</p>
          <router-link to="/admin/settings" class="dropdown-link" @click="profileOpen = false">
            <Settings :size="16" /> Settings
          </router-link>
          <button type="button" class="dropdown-link danger" @click="handleLogout">
            <LogOut :size="16" /> Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Bell, ChevronDown, Settings, LogOut, Sun, Moon } from 'lucide-vue-next';
import { useAdminTheme } from '../../composables/useAdminTheme';
import { useAuth } from '../../stores/useAuth';
import { authState } from '../../services/auth';
import { useAdminNotifications } from '../../composables/useAdminNotifications';
import type { Notification } from '../../services/notification.service';

const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    (el as HTMLElement & { _clickOutside?: (e: Event) => void })._clickOutside = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value();
    };
    document.addEventListener('click', (el as HTMLElement & { _clickOutside: (e: Event) => void })._clickOutside!);
  },
  unmounted(el: HTMLElement) {
    const fn = (el as HTMLElement & { _clickOutside?: (e: Event) => void })._clickOutside;
    if (fn) document.removeEventListener('click', fn);
  },
};

const route = useRoute();
const { logout } = useAuth();
const { isDark, toggleTheme, initTheme } = useAdminTheme();
const notifOpen = ref(false);
const profileOpen = ref(false);

const {
  notifications,
  unreadCount,
  loading,
  load,
  markAsRead,
  markAllAsRead,
  formatTime,
  typeIcon,
} = useAdminNotifications();

const titles: Record<string, { title: string; subtitle?: string }> = {
  'admin-dashboard': { title: 'Dashboard', subtitle: 'Platform overview' },
  'admin-books': { title: 'Books', subtitle: 'Manage catalog' },
  'admin-challenges': { title: 'Challenges', subtitle: 'Reading programs' },
  'admin-users': { title: 'Users', subtitle: 'Accounts & roles' },
  'admin-notifications': { title: 'Notifications', subtitle: 'Your alerts' },
  'admin-comments': { title: 'Comments', subtitle: 'Moderation queue' },
  'admin-reports': { title: 'Reports', subtitle: 'User reports' },
  'admin-settings': { title: 'Settings', subtitle: 'Account & preferences' },
  'admin-analytics': { title: 'Analytics', subtitle: 'Growth & engagement' },
};

const pageTitle = computed(() => titles[route.name as string]?.title ?? 'Admin');
const pageSubtitle = computed(() => titles[route.name as string]?.subtitle);

const displayName = computed(() => authState.user.value?.name || 'Admin');
const userEmail = computed(() => authState.user.value?.email || '');
const initials = computed(() => {
  const n = displayName.value.trim();
  return n ? n.charAt(0).toUpperCase() : 'A';
});

const toggleNotif = async () => {
  notifOpen.value = !notifOpen.value;
  if (notifOpen.value) await load(true);
};

const onNotifClick = async (n: Notification) => {
  if (!n.read) await markAsRead(n.id);
  notifOpen.value = false;
};

const handleLogout = async () => {
  profileOpen.value = false;
  await logout();
};

onMounted(() => {
  initTheme();
  load();
});
</script>

<style scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 2rem;
  background: var(--admin-header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--admin-border);
}

.theme-toggle {
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: var(--admin-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-circle {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.icon-circle:hover {
  background: var(--admin-accent-soft);
}

.dot-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--admin-danger);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-wrap,
.profile-wrap {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.5rem 0.35rem 0.35rem;
  border: 1px solid var(--admin-border);
  border-radius: 999px;
  background: var(--admin-surface);
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a8f65, #2d5a40);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.profile-name {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
}

.profile-role {
  font-size: 0.7rem;
  color: var(--admin-muted);
}

.chevron {
  color: var(--admin-muted);
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  box-shadow: 0 16px 40px rgba(15, 22, 17, 0.12);
  min-width: 280px;
  overflow: hidden;
  z-index: 200;
}

.notif-dropdown {
  width: 360px;
}

.dropdown-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--admin-border);
  background: var(--admin-dropdown-muted-bg);
}

.link-btn {
  border: none;
  background: none;
  color: var(--admin-accent);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.dropdown-list {
  max-height: 320px;
  overflow-y: auto;
}

.dropdown-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.dropdown-empty svg {
  opacity: 0.35;
  margin-bottom: 0.5rem;
}

.notif-row {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-bottom: 1px solid var(--admin-table-row-border);
  background: none;
  text-align: left;
  cursor: pointer;
}

.notif-row:hover {
  background: var(--admin-table-row-hover);
}

.notif-row.unread {
  background: var(--admin-accent-soft);
}

.notif-type {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.notif-type.system { background: var(--admin-info); }
.notif-type.user { background: var(--admin-accent); }
.notif-type.security { background: var(--admin-danger); }
.notif-type.warning { background: var(--admin-warning); }

.notif-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.notif-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-text);
}

.notif-time {
  font-size: 0.75rem;
  color: var(--admin-muted);
}

.dropdown-foot {
  display: block;
  text-align: center;
  padding: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-accent);
  text-decoration: none;
  border-top: 1px solid var(--admin-border);
  background: var(--admin-dropdown-muted-bg);
}

.profile-dropdown {
  padding: 0.5rem;
}

.profile-email {
  padding: 0.5rem 0.75rem;
  margin: 0;
  font-size: 0.8rem;
  color: var(--admin-muted);
  border-bottom: 1px solid var(--admin-border);
  margin-bottom: 0.25rem;
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--admin-text);
  text-decoration: none;
  cursor: pointer;
}

.dropdown-link:hover {
  background: var(--admin-bg);
}

.dropdown-link.danger {
  color: var(--admin-danger);
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0.75rem 1rem 0.75rem 3.5rem;
  }

  .profile-meta {
    display: none;
  }

  .chevron {
    display: none;
  }
}
</style>
