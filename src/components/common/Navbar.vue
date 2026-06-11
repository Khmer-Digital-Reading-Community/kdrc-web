<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Bell } from "lucide-vue-next";
import icon from "../../assets/images/Icon.png";
import Profile from "../../assets/images/Profile.png";
import NotificationIcon from "../../assets/images/NotificationIcon.png";
import ChatIcon from "../../assets/images/ChatIcon.png";
import { useAuth, token } from "../../stores/useAuth";
import { authState } from "../../services/auth";
import NotificationPopup from "./NotificationPopup.vue";
import SearchBar from "../search/SearchBar.vue";
import { useNotifications } from "../../composables/useNotifications";

import { useLanguage } from "../../composables/useLanguage";

const router = useRouter();
const route = useRoute();
const { logout, user, loginRole } = useAuth();

const showNavbarSearch = computed(() => {
  return !route.meta.hideNavbarSearch
})

const mobileOpen = ref(false);
const langOpen = ref(false);
const profileOpen = ref(false);
const currentLang = ref("EN");
const showNotifications = ref(false)
const notifHoverMode = ref(false)
let notifHoverTimeout: ReturnType<typeof setTimeout> | null = null

function onNotifEnter() {
  if (notifHoverTimeout) clearTimeout(notifHoverTimeout)
  notifHoverMode.value = true
  showNotifications.value = true
}

function onNotifLeave() {
  notifHoverTimeout = setTimeout(() => {
    showNotifications.value = false
    notifHoverMode.value = false
  }, 200)
}

function onNotifPopupEnter() {
  if (notifHoverTimeout) clearTimeout(notifHoverTimeout)
}

function onNotifPopupLeave() {
  notifHoverTimeout = setTimeout(() => {
    showNotifications.value = false
    notifHoverMode.value = false
  }, 200)
};

// Derive auth state only from the session token.
const isAuthed = computed(() => Boolean(token.value));
const isAdmin = computed(() => authState.user.value?.role === "ADMIN");
// const showSearch = computed(() => {
//   return route.name !== 'exchange-v2';
// });

const { unreadCount } = useNotifications();

watch(
  () => token.value,
  (newVal) => {
    console.log("Token ref changed:", !!newVal, "isAuthed:", isAuthed.value);
  },
);

console.log("Initial token value:", !!token.value, "isAuthed:", isAuthed.value);

const publicNavLinks = [
  { label: "Browse", path: "/explore" },
  { label: "Community", path: "/community" },
];

const authenticatedNavLinks = [
  { label: "Home", path: "/home" },
  { label: "Explore", path: "/explore" },
  { label: "Exchange", path: "/exchange-v2" },
  // { label: "Trade Center", path: "/dashboard/exchange-dashboard-v2" },
  { label: "Community", path: "/community" },
];

const profileMenuItems = computed(() => {
  const roleChosen = loginRole.value || (user.value?.role === 'ADMIN' ? 'admin' : 'user');
  const items = [
    { label: "Profile", path: roleChosen === 'admin' ? "/admin/profile" : "/settings/profile" },
    { label: "Dashboard", path: roleChosen === 'admin' ? "/admin/dashboard" : "/dashboard" },
  ];
  if (roleChosen !== 'admin' && isAdmin.value) {
    items.splice(1, 0, { label: "Admin Panel", path: "/admin/dashboard" });
  }
  return items;
});

const languages = [
  { code: "EN", label: "English" },
  { code: "KH", label: "ខ្មែរ" },
];

function selectLang(code: string) {
  const { setLanguage } = useLanguage();
  setLanguage(code);
  langOpen.value = false;
}

function goTo(path: string) {
  profileOpen.value = false;
  router.push(path);
}

async function handleLogout() {
  try {
    await logout();
    profileOpen.value = false;
    mobileOpen.value = false;
  } catch (error) {
    console.error("Logout error:", error);
    profileOpen.value = false;
    mobileOpen.value = false;
    await router.push("/user");
  }
}
</script>

<template>
  <nav class="w-full bg-[#093A3F] border-b border-gray-700 relative">
    <div
      v-if="isAuthed"
      class="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-6"
    >
      <div class="flex items-center gap-8">
        <router-link to="/home" class="flex items-center gap-2 no-underline">
          <span class="inline-flex items-center justify-start">
            <img :src="icon" alt="KDRC logo" class="w-7 h-5" />
          </span>
          <span class="text-white text-2xl font-bold font-['Manrope'] leading-8"
            >KDRC</span
          >
        </router-link>

        <div class="hidden lg:flex items-center gap-6">
          <router-link
            v-for="link in authenticatedNavLinks"
            :key="link.label"
            :to="link.path"
            class="text-sm font-normal font-['Manrope'] leading-5 transition-colors"
            :class="
              route.path === link.path
                ? 'text-white font-bold border-b border-white/70 pb-1'
                : 'text-white/70 hover:text-white'
            "
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>

      <div v-if="showNavbarSearch" class="w-full max-w-md relative order-3 lg:order-none lg:flex-1 lg:max-w-lg flex items-center">
        <SearchBar />
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <button
            type="button"
            class="px-3 py-1.5 bg-cyan-950 rounded-xl flex items-center gap-2"
            @click="langOpen = !langOpen"
          >
            <span class="w-2 h-2 bg-orange-300 rounded-xl"></span>
            <span class="inline-flex flex-col justify-start items-start">
              <span
                class="w-5 h-4 justify-center text-white text-xs font-bold font-['Inter'] uppercase leading-4 tracking-wider"
                >{{ currentLang }}</span
              >
            </span>
            <span class="inline-flex flex-col justify-start items-start">
              <span class="w-1.5 h-1 bg-white"></span>
            </span>
          </button>

          <div
            v-if="langOpen"
            class="absolute right-0 top-full mt-2 z-50 min-w-28 rounded-md bg-[#093A3F] border border-white/10 shadow-lg overflow-hidden"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              type="button"
              class="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10"
              @click="selectLang(lang.code)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="relative"
            @mouseenter="onNotifEnter"
            @mouseleave="onNotifLeave"
          >
            <button
              type="button"
              @click="showNotifications = !showNotifications"
              class="notif-bell-btn relative inline-flex flex-col justify-start items-start"
            >
              <img
                :src="NotificationIcon"
                alt="Notifications"
                class="w-4 h-5 object-contain"
              />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#F9AE5B] text-[#093A3F] text-[10px] font-bold rounded-full px-1"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>

            <!-- Notification Popup — inside bell wrapper -->
            <NotificationPopup
              :isOpen="showNotifications"
              :hoverMode="notifHoverMode"
              @close="showNotifications = false"
              @popupEnter="onNotifPopupEnter"
              @popupLeave="onNotifPopupLeave"
            />
          </div>
          <router-link
            to="/chatbox"
            class="inline-flex flex-col justify-start items-start"
          >
            <img :src="ChatIcon" alt="Chat" class="w-5 h-5 object-contain" />
          </router-link>
        </div>

        <div class="relative">
          <button
            @click="profileOpen = !profileOpen"
            class="w-10 h-10 relative bg-stone-200 rounded-3xl outline outline-neutral-300/20 -outline-offset-1 overflow-hidden hover:opacity-80 transition-opacity"
          >
            <img
              class="w-10 h-10 left-0 top-0 absolute object-cover"
              :src="user?.avatarUrl || Profile"
              alt="User avatar"
            />
          </button>

          <div
            v-if="profileOpen"
            class="absolute right-0 top-full mt-2 bg-[#093A3F] rounded-md shadow-lg py-1 min-w-40 border border-white/10 z-50"
          >
            <button
              v-for="item in profileMenuItems"
              :key="item.label"
              type="button"
              @click="goTo(item.path)"
              class="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {{ item.label }}
            </button>
            <button
              type="button"
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-6 h-16 flex items-center">
      <router-link to="/" class="flex items-center gap-2 no-underline mr-8">
        <span class="text-2xl">
          <img :src="icon" alt="Icon" />
        </span>
        <span class="text-[#FDE9D0] text-xl tracking-wide">KDRC</span>
      </router-link>

      <div class="hidden md:flex gap-8">
        <router-link
          v-for="link in publicNavLinks"
          :key="link.label"
          :to="link.path"
          class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors flex items-center"
          :class="
            route.path === link.path
              ? 'text-[#F9AE5B] border-[#F9AE5B]'
              : 'text-gray-300 border-transparent hover:text-white'
          "
        >
          {{ link.label }}
        </router-link>
      </div>

      <div class="hidden md:flex items-center gap-4 ml-auto">
        <div class="relative">
          <button
            @click="langOpen = !langOpen"
            class="flex items-center gap-2 bg-[#0d4d54] px-3 py-1.5 rounded-full hover:bg-[#0a3f45] transition-colors"
          >
            <span class="w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
            <span class="text-[#FDE9D0] text-sm">{{ currentLang }}</span>
            <svg
              class="w-3.5 h-3.5 text-[#FDE9D0]/70"
              :class="{ 'rotate-180': langOpen }"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          <div
            v-if="langOpen"
            class="absolute top-full right-0 mt-2 bg-[#0d4d54] rounded-md shadow-lg py-1 min-w-25 border border-[#FDE9D0]/10 z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLang(lang.code)"
              class="w-full text-left px-4 py-2 text-sm text-[#FDE9D0]/70 hover:bg-[#093A3F] hover:text-[#FDE9D0]"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <template v-if="!isAuthed">
          <router-link
            to="/login"
            class="text-[#FDE9D0] text-sm font-medium border border-[#FDE9D0]/30 px-5 py-1.5 rounded hover:bg-[#FDE9D0]/10 transition-colors"
          >
            Login
          </router-link>

          <router-link
            to="/signup"
            class="bg-[#F9AE5B] text-[#093A3F] text-sm font-medium px-5 py-1.5 rounded hover:opacity-90 transition-opacity"
          >
            Sign Up
          </router-link>
        </template>

        <template v-else>
          <button
            @click="handleLogout"
            class="bg-red-600 text-white text-sm font-medium px-5 py-1.5 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </template>
      </div>

      <button
        class="md:hidden text-[#FDE9D0]"
        @click="mobileOpen = !mobileOpen"
      >
        Menu
      </button>
    </div>

    <div
      v-if="mobileOpen && !isAuthed"
      class="md:hidden bg-[#0d4d54] px-6 py-4 flex flex-col gap-4 absolute w-full border-b border-[#FDE9D0]/10 z-40"
    >
      <router-link
        v-for="link in publicNavLinks"
        :key="link.label"
        :to="link.path"
        class="text-[#FDE9D0]/70 hover:text-[#FDE9D0]"
      >
        {{ link.label }}
      </router-link>

      <div class="relative pt-2">
        <button
          type="button"
          @click="langOpen = !langOpen"
          class="flex items-center gap-2 bg-[#0d4d54] px-3 py-1.5 rounded-full hover:bg-[#0a3f45] transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
          <span class="text-[#FDE9D0] text-sm">{{ currentLang }}</span>
        </button>

        <div
          v-if="langOpen"
          class="absolute left-0 top-full mt-2 bg-[#0d4d54] rounded-md shadow-lg py-1 min-w-25 border border-[#FDE9D0]/10 z-50"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLang(lang.code)"
            class="w-full text-left px-4 py-2 text-sm text-[#FDE9D0]/70 hover:bg-[#093A3F] hover:text-[#FDE9D0]"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <hr class="border-[#FDE9D0]/10 my-2" />

      <div class="flex flex-col gap-3">
        <template v-if="isAuthed">
          <button
            @click="handleLogout"
            class="text-center text-[#FDE9D0] border border-[#FDE9D0]/30 py-2 rounded hover:bg-[#FDE9D0]/10"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="text-center text-[#FDE9D0] border border-[#FDE9D0]/30 py-2 rounded hover:bg-[#FDE9D0]/10"
            >Login</router-link
          >
          <router-link
            to="/signup"
            class="text-center bg-[#F9AE5B] text-[#093A3F] font-medium py-2 rounded hover:opacity-90"
            >Sign Up</router-link
          >
        </template>
      </div>
    </div>

    <div
      v-if="mobileOpen && isAuthed"
      class="md:hidden bg-[#0d4d54] px-6 py-4 flex flex-col gap-4 absolute w-full border-b border-[#FDE9D0]/10 z-40"
    >
      <router-link
        v-for="link in authenticatedNavLinks"
        :key="link.label"
        :to="link.path"
        class="text-[#FDE9D0]/70 hover:text-[#FDE9D0]"
      >
        {{ link.label }}
      </router-link>

      <div class="flex flex-col gap-3 pt-2 border-t border-[#FDE9D0]/10">
        <div class="relative">
          <button
            type="button"
            @click="langOpen = !langOpen"
            class="flex items-center gap-2 bg-[#0d4d54] px-3 py-1.5 rounded-full hover:bg-[#0a3f45] transition-colors"
          >
            <span class="w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
            <span class="text-[#FDE9D0] text-sm">{{ currentLang }}</span>
          </button>

          <div
            v-if="langOpen"
            class="absolute left-0 top-full mt-2 bg-[#0d4d54] rounded-md shadow-lg py-1 min-w-25 border border-[#FDE9D0]/10 z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLang(lang.code)"
              class="w-full text-left px-4 py-2 text-sm text-[#FDE9D0]/70 hover:bg-[#093A3F] hover:text-[#FDE9D0]"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div
            class="relative"
            @mouseenter="onNotifEnter"
            @mouseleave="onNotifLeave"
          >
            <button
              type="button"
              @click="showNotifications = !showNotifications"
              class="notif-bell-btn relative text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors"
            >
              <Bell :size="20" />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-[#F9AE5B] text-[#093A3F] text-[9px] font-bold rounded-full px-0.5"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>
          </div>

          <button
            type="button"
            class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors"
          >
            <img :src="ChatIcon" alt="Chat" class="w-5 h-5 object-contain" />
          </button>
        </div>

        <div class="relative flex items-center gap-3">
          <button
            @click="profileOpen = !profileOpen"
            class="w-10 h-10 relative bg-stone-200 rounded-3xl outline outline-neutral-300/20 -outline-offset-1 overflow-hidden hover:opacity-80 transition-opacity"
          >
            <img
              class="w-10 h-10 left-0 top-0 absolute object-cover"
              :src="user?.avatarUrl || Profile"
              alt="User avatar"
            />
          </button>

          <div
            v-if="profileOpen"
            class="absolute left-0 top-full mt-2 bg-[#093A3F] rounded-md shadow-lg py-1 min-w-40 border border-white/10 z-50"
          >
            <button
              v-for="item in profileMenuItems"
              :key="item.label"
              type="button"
              @click="goTo(item.path)"
              class="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {{ item.label }}
            </button>
            <button
              type="button"
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

  </nav>
</template>

<style scoped>
.notif-bell-btn {
  position: relative;
}

.notif-bell-btn::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: scale(0.8);
}

.notif-bell-btn:hover::before {
  border-color: rgba(249, 174, 91, 0.5);
  opacity: 1;
  transform: scale(1);
  animation: bellRing 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes bellRing {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.25);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
