<template>
  <aside
    class="dashboard-sidebar"
    :class="{
      open: mobileOpen,
      collapsed: collapsed && !isMobile,
    }"
  >
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-mark">
        <svg
          class="brand-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <div v-if="!collapsed || isMobile" class="brand-text">
        <p class="brand-title">KDRC</p>
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
      <div v-for="section in navSections" :key="section.group" class="nav-section">
        <p v-if="!collapsed || isMobile" class="section-label">{{ section.group }}</p>
        <div v-else class="section-divider" />

        <router-link
          v-for="item in section.items"
          :key="item.label"
          :to="resolvedRoute(item)"
          class="nav-item"
          :class="{ active: isItemActive(item) }"
          @click="mobileOpen = false"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-if="!collapsed || isMobile" class="nav-label">{{ item.label }}</span>
          <span v-if="collapsed && !isMobile" class="nav-tooltip">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <button type="button" class="nav-item cta" @click="createNewDraft">
        <Plus :size="18" />
        <span v-if="!collapsed || isMobile" class="nav-label">New Draft</span>
        <span v-if="collapsed && !isMobile" class="nav-tooltip">New Draft</span>
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
    <Menu v-if="!mobileOpen" :size="22" />
    <X v-else :size="22" />
  </button>
  <div v-if="mobileOpen && isMobile" class="sidebar-overlay" @click="mobileOpen = false" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Plus,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { loginRole } from "../../stores/useAuth";
import { authState } from "../../services/auth";

const emit = defineEmits<{
  (e: "update:collapsed", value: boolean): void;
}>();

const route = useRoute();
const router = useRouter();
const mobileOpen = ref(false);
const collapsed = ref(false);
const isMobile = ref(false);

const navSections = [
  {
    group: "Core",
    items: [
      {
        label: "Dashboard",
        route: "/dashboard",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"/>
        </svg>`,
      },
      {
        label: "Manuscripts",
        route: "/dashboard/manuscripts",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>`,
      },
      {
        label: "Exchange",
        route: "/exchange",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>`,
      },
    ],
  },
  {
    group: "Growth",
    items: [
      {
        label: "Analytics",
        route: "/dashboard/analytics",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>`,
      },
      {
        label: "Earnings",
        route: "/dashboard/earnings",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
      },
    ],
  },
  {
    group: "History",
    items: [
      {
        label: "Archive",
        route: "/archive",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
        </svg>`,
      },
      {
        label: "Bookmarks",
        route: "/dashboard/bookmarks",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"/>
        </svg>`,
      },
      {
        label: "Trade Center",
        route: "/dashboard/exchange-dashboard-v2",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10m0 0l-2-2m2 2l-2 2M17 17H7m0 0l2 2m-2-2l2-2"/>
        </svg>`,
      },
    ],
  },
  {
    group: "Utility",
    items: [
      {
        label: "Plan and Billing",
        route: "/dashboard/earnings",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>`,
      },
      {
        label: "Profile",
        route: "/settings/profile",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
      },
      {
        label: "Settings",
        route: "/settings",
        icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`,
      },
    ],
  },
];

const resolvedRoute = (item: { route: string }) => {
  const currentRole =
    loginRole.value || (authState.user.value?.role === "ADMIN" ? "admin" : "user");
  if (currentRole === "admin") {
    if (item.route === "/settings/profile") return "/admin/profile";
    if (item.route === "/settings") return "/admin/settings";
  }
  return item.route;
};

const isItemActive = (item: { route: string }) => {
  const currentRole =
    loginRole.value || (authState.user.value?.role === "ADMIN" ? "admin" : "user");
  let targetRoute = item.route;
  if (currentRole === "admin") {
    if (item.route === "/settings/profile") targetRoute = "/admin/profile";
    if (item.route === "/settings") targetRoute = "/admin/settings";
  }
  return route.path === targetRoute;
};

const createNewDraft = () => {
  mobileOpen.value = false;
  if (route.path !== "/dashboard/books/new") {
    router.push("/dashboard/books/new");
  }
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
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.dashboard-sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: #f0ece4;
  color: #1c3a2e;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0dbd0;
  transition: width 0.25s ease;
}

.dashboard-sidebar.collapsed {
  width: 68px;
}

/* ---- Brand ---- */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #e0dbd0;
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
  background: #1c3a2e;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon {
  width: 20px;
  height: 20px;
}

.brand-text {
  overflow: hidden;
  white-space: nowrap;
}

.brand-title {
  margin: 0;
  color: #1c3a2e;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
  font-family: "Playfair Display", serif;
}

.collapse-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #e0dbd0;
  background: #f0ece4;
  color: #8a9b8f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  z-index: 10;
}

.collapse-btn:hover {
  color: #1c3a2e;
  background: #e8e4d8;
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
  color: #9b9689;
  padding: 0.75rem 0.75rem 0.35rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.section-divider {
  border-top: 1px solid #e0dbd0;
  margin: 0.5rem 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.75rem;
  margin: 0.1rem 0;
  border-radius: 8px;
  color: #5a6b5f;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  font-family: inherit;
  text-align: left;
}

.nav-item:hover {
  background: rgba(28, 58, 46, 0.06);
  color: #1c3a2e;
}

.nav-item.active {
  background: rgba(28, 58, 46, 0.1);
  color: #1c3a2e;
  font-weight: 600;
}

.nav-item.cta {
  background: #1c3a2e;
  color: #fff;
  font-weight: 600;
  justify-content: center;
  border-radius: 12px;
  padding: 0.7rem 0.75rem;
}

.nav-item.cta:hover {
  background: #c5a050;
  color: #fff;
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

/* ---- Tooltip (collapsed mode) ---- */
.nav-tooltip {
  position: absolute;
  left: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%);
  padding: 0.4rem 0.75rem;
  background: #1c3a2e;
  color: #f0ece4;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 150;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.nav-tooltip::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: #1c3a2e;
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  transition-delay: 0.3s;
}

/* ---- Footer ---- */
.sidebar-footer {
  padding: 0.75rem 0.5rem 1rem;
  border-top: 1px solid #e0dbd0;
}

.collapsed .sidebar-footer .nav-item {
  justify-content: center;
  padding: 0.7rem;
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
  border: 1px solid #e0dbd0;
  background: #f0ece4;
  color: #1c3a2e;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease, width 0.25s ease;
    width: 260px !important;
  }

  .dashboard-sidebar.open {
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
