<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, X, BookOpen, UserPlus, CheckCircle, ArrowLeftRight, AtSign, Sparkles, Info, AlertTriangle, AlertCircle } from 'lucide-vue-next'
import { useAdminNotifications } from '../../composables/useAdminNotifications'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const { notifications, unreadCount, load, markAsRead, markAllAsRead, formatTime } = useAdminNotifications()

let pollInterval: ReturnType<typeof setInterval> | null = null

watch(() => true, () => {
  load()
})

onMounted(() => {
  load()
  pollInterval = setInterval(() => {
    load(true)
  }, 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
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
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 z-40"
    @click="emit('close')"
  ></div>

  <!-- Notification Panel -->
  <div
    v-if="isOpen"
    class="fixed top-12 right-6 w-96 bg-[#0d4d54] rounded-lg shadow-2xl z-50 border border-[#FDE9D0]/10 max-h-[600px] flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#FDE9D0]/10">
      <div class="flex items-center gap-2">
        <Bell :size="20" class="text-[#F9AE5B]" />
        <h2 class="text-lg font-semibold text-[#FDE9D0]">Notifications</h2>
        <span v-if="unreadCount > 0" class="bg-[#F9AE5B] text-[#093A3F] text-xs font-bold px-2 py-0.5 rounded-full">
          {{ unreadCount }}
        </span>
      </div>
      <button
        @click="emit('close')"
        class="text-[#FDE9D0]/70 hover:text-[#FDE9D0] transition-colors"
      >
        <X :size="20" />
      </button>
    </div>

    <!-- Notifications List -->
    <div class="overflow-y-auto flex-1">
      <div v-if="notifications.length === 0" class="px-6 py-8 text-center">
        <Bell :size="40" class="mx-auto text-[#FDE9D0]/30 mb-2" />
        <p class="text-[#FDE9D0]/50">No notifications yet</p>
      </div>

      <div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification.id)"
          :class="[
            'px-6 py-4 border-b border-[#FDE9D0]/5 hover:bg-[#0a3f45] cursor-pointer transition-colors',
            notification.read ? 'bg-transparent' : 'bg-[#093A3F]/50'
          ]"
        >
          <div class="flex gap-3">
            <!-- Icon -->
            <div :class="['flex-shrink-0 mt-0.5', getNotificationColor(notification.type)]">
              <component :is="getNotificationIcon(notification.type)" :size="18" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-[#FDE9D0] font-medium text-sm">{{ notification.title }}</p>
                <span v-if="!notification.read" class="flex-shrink-0 w-2 h-2 rounded-full bg-[#F9AE5B] mt-1.5"></span>
              </div>
              <p class="text-[#FDE9D0]/70 text-xs mt-1 line-clamp-2">{{ notification.message }}</p>
              <p class="text-[#FDE9D0]/50 text-xs mt-2">{{ formatTime(notification.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="notifications.length > 0" class="px-6 py-3 border-t border-[#FDE9D0]/10 flex justify-end">
      <button
        @click="handleMarkAllAsRead"
        class="text-[#F9AE5B] text-sm font-medium hover:text-[#FDE9D0] transition-colors"
      >
        Mark all as read
      </button>
    </div>
  </div>
</template>
