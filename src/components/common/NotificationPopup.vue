<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, X, Info, AlertTriangle, AlertCircle, CheckCircle, Eye, ChevronRight, Filter } from 'lucide-vue-next'
import { useNotifications } from '../../composables/useNotifications'

interface Props {
  isOpen: boolean
  hoverMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverMode: false,
})

const emit = defineEmits<{
  close: []
  popupEnter: []
  popupLeave: []
}>()

const router = useRouter()
const { notifications, unreadCount, markAsRead, markAllAsRead, remove, formatTime } = useNotifications()

const showUnreadOnly = ref(false)

const displayedNotifications = computed(() => {
  if (props.hoverMode) {
    return notifications.value.filter(n => !n.read)
  }
  if (showUnreadOnly.value) {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
})

function getNotificationIcon(type: string) {
  const iconMap: Record<string, any> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }
  return iconMap[type] || Info
}

function getNotificationColor(type: string): string {
  const colorMap: Record<string, string> = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  }
  return colorMap[type] || 'text-gray-400'
}

function getTypeBorderColor(type: string): string {
  const colorMap: Record<string, string> = {
    info: 'border-l-blue-400',
    success: 'border-l-green-400',
    warning: 'border-l-yellow-400',
    error: 'border-l-red-400',
  }
  return colorMap[type] || 'border-l-gray-400'
}

function getRouteForNotification(title: string, message: string): string | null {
  const lowerTitle = title.toLowerCase()
  const lowerMsg = message.toLowerCase()

  if (lowerTitle.includes('book') && lowerTitle.includes('created')) return '/dashboard/manuscripts'
  if (lowerTitle.includes('book') && lowerTitle.includes('available')) return '/explore'
  if (lowerTitle.includes('published')) return '/explore'
  if (lowerTitle.includes('chapter')) return '/dashboard/manuscripts'
  if (lowerTitle.includes('exchange') || lowerTitle.includes('trade')) return '/exchange-dashboard-v2'
  if (lowerTitle.includes('mention')) return '/community'
  if (lowerTitle.includes('follower')) return '/community'
  if (lowerTitle.includes('dashboard')) return '/dashboard'
  if (lowerTitle.includes('bookmark')) return '/dashboard/bookmarks'
  if (lowerTitle.includes('writing') || lowerTitle.includes('manuscript')) return '/dashboard/manuscripts'

  if (lowerMsg.includes('book')) return '/explore'
  if (lowerMsg.includes('exchange') || lowerMsg.includes('trade')) return '/exchange-dashboard-v2'

  return null
}

async function handleNotificationClick(id: string) {
  const notif = notifications.value.find(n => n.id === id)
  if (notif && !notif.read) {
    await markAsRead(id)
  }
  const route = getRouteForNotification(notif?.title || '', notif?.message || '')
  if (route) {
    emit('close')
    router.push(route)
  }
}

async function handleMarkAllAsRead() {
  await markAllAsRead()
}

async function handleDelete(e: Event, id: string) {
  e.stopPropagation()
  await remove(id)
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
      @click="emit('close')"
    ></div>
  </Transition>

  <!-- Notification Panel -->
  <Transition name="panel">
    <div
      v-if="isOpen"
      @mouseenter="emit('popupEnter')"
      @mouseleave="emit('popupLeave')"
      class="fixed top-12 right-6 w-96 bg-[#0d4d54] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-50 border border-[#FDE9D0]/10 max-h-[600px] flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0a3f45] to-[#0d4d54] border-b border-[#FDE9D0]/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#F9AE5B]/15 flex items-center justify-center">
            <Bell :size="16" class="text-[#F9AE5B]" />
          </div>
          <h2 class="text-base font-semibold text-[#FDE9D0]">Notifications</h2>
          <span v-if="unreadCount > 0" class="bg-[#F9AE5B] text-[#093A3F] text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-if="unreadCount > 0"
            @click="showUnreadOnly = !showUnreadOnly"
            :class="[
              'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200',
              showUnreadOnly
                ? 'bg-[#F9AE5B] text-[#093A3F]'
                : 'text-[#FDE9D0]/50 hover:text-[#FDE9D0]/80 hover:bg-[#FDE9D0]/5'
            ]"
          >
            <Filter :size="10" />
            Unread
          </button>
          <button
            @click="emit('close')"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-[#FDE9D0]/50 hover:text-[#FDE9D0] hover:bg-[#FDE9D0]/10 transition-all duration-200"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="overflow-y-auto flex-1 overscroll-contain">
        <!-- Empty State -->
        <div v-if="notifications.length === 0" class="px-6 py-12 text-center">
          <div class="w-16 h-16 rounded-full bg-[#FDE9D0]/5 flex items-center justify-center mx-auto mb-3 notif-empty-pulse">
            <Bell :size="28" class="text-[#FDE9D0]/25" />
          </div>
          <p class="text-[#FDE9D0]/50 text-sm font-medium">No notifications yet</p>
          <p class="text-[#FDE9D0]/30 text-xs mt-1">You're all caught up!</p>
        </div>

        <!-- Unread filter empty -->
        <div v-else-if="displayedNotifications.length === 0" class="px-6 py-12 text-center">
          <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle :size="28" class="text-green-400/50" />
          </div>
          <p class="text-[#FDE9D0]/50 text-sm font-medium">All caught up!</p>
          <p class="text-[#FDE9D0]/30 text-xs mt-1">No unread notifications</p>
        </div>

        <!-- Notification Items -->
        <div v-else>
          <div
            v-for="(notification, index) in displayedNotifications"
            :key="notification.id"
            @click="handleNotificationClick(notification.id)"
            class="notif-item group relative px-5 py-3.5 cursor-pointer border-b border-[#FDE9D0]/5 border-l-2 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="[
              notification.read
                ? 'bg-transparent hover:bg-[#FDE9D0]/5 hover:translate-x-1'
                : 'bg-[#F9AE5B]/8 hover:bg-[#F9AE5B]/15 hover:translate-x-1 notif-unread-glow',
              getTypeBorderColor(notification.type),
            ]"
            :style="{ animationDelay: `${index * 30}ms` }"
          >
            <div class="flex gap-3">
              <!-- Icon -->
              <div :class="['flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-all duration-200 group-hover:scale-110', getNotificationColor(notification.type), notification.read ? 'bg-white/5' : 'bg-white/10']">
                <component :is="getNotificationIcon(notification.type)" :size="15" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p :class="['font-medium text-sm leading-snug transition-colors duration-200', notification.read ? 'text-[#FDE9D0]/80' : 'text-[#FDE9D0]']">
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      v-if="!notification.read"
                      class="w-2 h-2 rounded-full bg-[#F9AE5B] mt-1.5 notif-dot-glow"
                    ></span>
                    <button
                      @click="(e: Event) => handleDelete(e, notification.id)"
                      class="flex-shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#FDE9D0]/20 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all duration-200 scale-75 group-hover:scale-100"
                    >
                      <X :size="12" />
                    </button>
                  </div>
                </div>
                <p class="text-[#FDE9D0]/55 text-xs mt-1 line-clamp-2 leading-relaxed">{{ notification.message }}</p>
                <p class="text-[#FDE9D0]/35 text-[11px] mt-1.5 tabular-nums">{{ formatTime(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 0" class="px-5 py-3 border-t border-[#FDE9D0]/10 bg-[#0a3f45]/50 flex justify-between items-center">
        <button
          @click="router.push('/notifications'); emit('close')"
          class="flex items-center gap-1 text-[#FDE9D0]/60 text-xs font-medium hover:text-[#FDE9D0] transition-all duration-200 group/view"
        >
          <Eye :size="13" class="transition-transform duration-200 group-hover/view:scale-110" />
          <span class="relative">
            View all
            <span class="absolute bottom-0 left-0 w-0 h-px bg-[#FDE9D0]/60 transition-all duration-300 group-hover/view:w-full"></span>
          </span>
          <ChevronRight :size="12" class="transition-transform duration-200 group-hover/view:translate-x-0.5" />
        </button>
        <button
          @click="handleMarkAllAsRead"
          class="text-[#F9AE5B] text-xs font-medium hover:text-[#FDE9D0] transition-all duration-200 relative group/mark"
        >
          Mark all as read
          <span class="absolute bottom-0 left-0 w-0 h-px bg-[#F9AE5B]/60 transition-all duration-300 group-hover/mark:w-full"></span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Panel enter/exit transition */
.panel-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-leave-active {
  transition: all 0.18s cubic-bezier(0.4, 0, 1, 1);
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Overlay transition */
.overlay-enter-active {
  transition: opacity 0.25s ease;
}
.overlay-leave-active {
  transition: opacity 0.18s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Empty state pulsing bell */
.notif-empty-pulse {
  animation: emptyPulse 3s ease-in-out infinite;
}
@keyframes emptyPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
}

/* Unread dot glow — idle pulse */
.notif-dot-glow {
  box-shadow: 0 0 0 0 rgba(249, 174, 91, 0.5);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* On hover of the notification item, intensify the glow */
.notif-item:hover .notif-dot-glow {
  box-shadow: 0 0 8px 3px rgba(249, 174, 91, 0.6);
  transform: scale(1.3);
  animation: dotGlowHover 1s ease-in-out infinite;
}
@keyframes dotGlowHover {
  0%, 100% { box-shadow: 0 0 8px 3px rgba(249, 174, 91, 0.6); }
  50% { box-shadow: 0 0 14px 6px rgba(249, 174, 91, 0.3); }
}

/* Unread item subtle left glow */
.notif-unread-glow {
  box-shadow: inset 3px 0 8px -4px rgba(249, 174, 91, 0.15);
}
.notif-item.notif-unread-glow:hover {
  box-shadow: inset 3px 0 12px -4px rgba(249, 174, 91, 0.3);
}

/* Notification item stagger animation on load */
.notif-item {
  animation: notifSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes notifSlideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
