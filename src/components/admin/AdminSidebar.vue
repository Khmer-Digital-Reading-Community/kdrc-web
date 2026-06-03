<template>
  <aside class="admin-sidebar" :class="{ open: mobileOpen }">
    <div class="sidebar-brand">
      <div class="brand-mark">K</div>
      <div>
        <p class="brand-title">KDRC</p>
        <p class="brand-sub">Admin Console</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div v-for="section in navSections" :key="section.label" class="nav-section">
        <p class="section-label">{{ section.label }}</p>
        <router-link
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
          @click="mobileOpen = false"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge && pendingComments > 0" class="nav-badge">{{ pendingComments }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/home" class="nav-item subtle">
        <Home :size="18" />
        <span>Back to site</span>
      </router-link>
      <button type="button" class="nav-item subtle logout" @click="logout">
        <LogOut :size="18" />
        <span>Sign out</span>
      </button>
    </div>
  </aside>

  <button type="button" class="mobile-toggle" aria-label="Menu" @click="mobileOpen = !mobileOpen">
    <Menu :size="22" />
  </button>
  <div v-if="mobileOpen" class="sidebar-overlay" @click="mobileOpen = false" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Users,
  MessageSquare,
  Flag,
  Bell,
  BarChart3,
  Settings,
  Home,
  LogOut,
  Menu,
} from 'lucide-vue-next';
import { useAuth } from '../../stores/useAuth';
import { fetchAdminStats } from '../../services/adminApi';

const route = useRoute();
const router = useRouter();
const { logout: authLogout } = useAuth();
const mobileOpen = ref(false);
const pendingComments = ref(0);

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/books', label: 'Books', icon: BookOpen },
      { to: '/admin/challenges', label: 'Challenges', icon: Trophy },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/comments', label: 'Comments', icon: MessageSquare, badge: true },
      { to: '/admin/reports', label: 'Reports', icon: Flag },
      { to: '/admin/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

const isActive = (path: string) => route.path.startsWith(path);

const logout = async () => {
  await authLogout();
  router.push('/login');
};

onMounted(async () => {
  try {
    const stats = await fetchAdminStats();
    pendingComments.value = stats.pendingComments;
  } catch {
    /* non-admin or offline */
  }
});
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: var(--admin-sidebar);
  color: #c8d4cb;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4a8f65, #2d5a40);
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.brand-title {
  margin: 0;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
}

.brand-sub {
  margin: 0;
  font-size: 0.7rem;
  color: #8a9b8f;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0.5rem;
}

.section-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6d7f72;
  padding: 0.75rem 0.75rem 0.35rem;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.75rem;
  margin: 0.1rem 0;
  border-radius: 8px;
  color: #b8c9be;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: var(--admin-sidebar-hover);
  color: #fff;
}

.nav-item.active {
  background: var(--admin-sidebar-active);
  color: #a8e0b0;
}

.nav-item.subtle {
  color: #8a9b8f;
}

.nav-item.logout:hover {
  background: rgba(220, 76, 76, 0.12);
  color: #f5a8a8;
}

.nav-badge {
  margin-left: auto;
  background: var(--admin-danger);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  min-width: 18px;
  text-align: center;
}

.sidebar-footer {
  padding: 0.75rem 0.5rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.mobile-toggle {
  display: none;
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 110;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-text);
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }

  .mobile-toggle {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
}
</style>
