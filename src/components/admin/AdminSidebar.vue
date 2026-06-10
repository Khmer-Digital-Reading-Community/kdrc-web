<template>
  <aside
    class="admin-sidebar"
    :class="{
      open: mobileOpen,
      collapsed: collapsed && !isMobile,
    }"
  >
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-mark">K</div>
      <div v-if="!collapsed || isMobile" class="brand-text">
        <p class="brand-title">KDRC</p>
        <p class="brand-sub">Admin Console</p>
      </div>
      <button
        v-if="!isMobile"
        type="button"
        class="collapse-btn"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      >
        <PanelLeftClose v-if="!collapsed" :size="18" />
        <PanelLeftOpen v-else :size="18" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <div
        v-for="section in navSections"
        :key="section.label"
        class="nav-section"
      >
        <p v-if="!collapsed || isMobile" class="section-label">
          {{ section.label }}
        </p>
        <div v-else class="section-divider" />

        <router-link
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
          @click="mobileOpen = false"
        >
          <span class="nav-icon">
            <component :is="item.icon" :size="18" />
            <span
              v-if="item.badge && pendingComments > 0 && collapsed && !isMobile"
              class="nav-badge-dot"
            />
          </span>
          <span v-if="!collapsed || isMobile" class="nav-label">{{
            item.label
          }}</span>
          <span
            v-if="item.badge && pendingComments > 0 && (!collapsed || isMobile)"
            class="nav-badge"
            >{{ pendingComments }}</span
          >

          <!-- Tooltip when collapsed -->
          <span v-if="collapsed && !isMobile" class="nav-tooltip">
            {{ item.label }}
          </span>
        </router-link>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <router-link to="/home" class="nav-item subtle">
        <Home :size="18" />
        <span v-if="!collapsed || isMobile" class="nav-label"
          >Back to site</span
        >
        <span v-if="collapsed && !isMobile" class="nav-tooltip"
          >Back to site</span
        >
      </router-link>
      <button type="button" class="nav-item subtle logout" @click="logout">
        <LogOut :size="18" />
        <span v-if="!collapsed || isMobile" class="nav-label">Sign out</span>
        <span v-if="collapsed && !isMobile" class="nav-tooltip">Sign out</span>
      </button>
    </div>
  </aside>

  <!-- Mobile toggle -->
  <button
    v-if="isMobile"
    type="button"
    class="mobile-toggle"
    aria-label="Menu"
    @click="mobileOpen = !mobileOpen"
  >
    <Menu :size="22" />
  </button>
  <div
    v-if="mobileOpen && isMobile"
    class="sidebar-overlay"
    @click="mobileOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
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
  UserCircle2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { useAuth } from "../../stores/useAuth";
import { fetchAdminStats } from "../../services/adminApi";

const emit = defineEmits<{
  (e: "update:collapsed", value: boolean): void;
}>();

const route = useRoute();
const router = useRouter();
const { logout: authLogout } = useAuth();
const mobileOpen = ref(false);
const collapsed = ref(false);
const isMobile = ref(false);
const pendingComments = ref(0);

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/books", label: "Books", icon: BookOpen },
      { to: "/admin/challenges", label: "Challenges", icon: Trophy },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      {
        to: "/admin/comments",
        label: "Comments",
        icon: MessageSquare,
        badge: true,
      },
      { to: "/admin/reports", label: "Reports", icon: Flag },
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/profile", label: "Profile", icon: UserCircle2 },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const isActive = (path: string) => route.path.startsWith(path);

const logout = async () => {
  await authLogout();
  router.push("/login");
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    collapsed.value = false;
  }
};

watch(collapsed, (val) => {
  emit("update:collapsed", val);
});

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);

  fetchAdminStats()
    .then((stats) => {
      pendingComments.value = stats.pendingComments;
    })
    .catch(() => {
      /* non-admin or offline */
    });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
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
  transition: width 0.25s ease;
}

.admin-sidebar.collapsed {
  width: 68px;
}

/* ---- Brand ---- */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
}

.collapsed .sidebar-brand {
  justify-content: center;
  padding: 1.25rem 0.5rem;
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
  flex-shrink: 0;
}

.brand-text {
  overflow: hidden;
  white-space: nowrap;
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

.collapse-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--admin-sidebar);
  color: #8a9b8f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.15s,
    background 0.15s;
  z-index: 10;
}

.collapse-btn:hover {
  color: #fff;
  background: #2a3a30;
}

.collapsed .collapse-btn {
  right: 0;
  transform: translate(50%, -50%);
}

/* ---- Nav ---- */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0.5rem;
}

.section-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6d7f72;
  padding: 0.75rem 0.75rem 0.35rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.section-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 0.5rem 0.75rem;
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
  transition:
    background 0.15s,
    color 0.15s;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
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

.nav-icon {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-label {
  overflow: hidden;
  white-space: nowrap;
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
  flex-shrink: 0;
}

.nav-badge-dot {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--admin-danger);
  border: 1.5px solid var(--admin-sidebar);
}

/* ---- Tooltip (collapsed mode) ---- */
.nav-tooltip {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  padding: 0.4rem 0.75rem;
  background: #1a2a1e;
  color: #e8eee9;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 150;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.nav-tooltip::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: #1a2a1e;
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  transition-delay: 0.3s;
}

/* ---- Footer ---- */
.sidebar-footer {
  padding: 0.75rem 0.5rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.collapsed .sidebar-footer .nav-item {
  justify-content: center;
  padding: 0.6rem 0;
}

/* ---- Mobile toggle ---- */
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
    transition:
      transform 0.25s ease,
      width 0.25s ease;
    width: 260px !important;
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

  .nav-tooltip {
    display: none;
  }
}
</style>
