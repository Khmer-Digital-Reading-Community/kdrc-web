<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Bell,
  BookOpen,
  ArrowLeftRight,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Trash2,
  CheckCheck,
} from 'lucide-vue-next'
import { useNotifications } from '../../composables/useNotifications'
import type { NotificationType } from '../../types/notification'

const router = useRouter()
const {
  notifications,
  filteredNotifications,
  unreadCount,
  loading,
  filter,
  markAsRead,
  markAllAsRead,
  remove,
  clearAll,
  formatTime,
  setFilter,
} = useNotifications()

const filterTabs: { label: string; value: NotificationType | 'all'; icon: any }[] = [
  { label: 'All', value: 'all', icon: Bell },
  { label: 'Unread', value: 'info', icon: Info },
  { label: 'Books', value: 'book_published', icon: BookOpen },
  { label: 'Exchange', value: 'exchange_update', icon: ArrowLeftRight },
  { label: 'Community', value: 'community_mention', icon: Users },
  { label: 'Achievements', value: 'achievement_earned', icon: Trophy },
  { label: 'System', value: 'system_alert', icon: AlertCircle },
]

function getNotificationIcon(type: string) {
  const iconMap: Record<string, any> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    book_published: BookOpen,
    book_reviewed: BookOpen,
    exchange_update: ArrowLeftRight,
    community_mention: Users,
    achievement_earned: Trophy,
    system_alert: AlertCircle,
  }
  return iconMap[type] || Info
}

function getNotificationColor(type: string): string {
  const colorMap: Record<string, string> = {
    info: 'text-blue-500 bg-blue-50',
    success: 'text-green-500 bg-green-50',
    warning: 'text-yellow-500 bg-yellow-50',
    error: 'text-red-500 bg-red-50',
    book_published: 'text-indigo-500 bg-indigo-50',
    book_reviewed: 'text-purple-500 bg-purple-50',
    exchange_update: 'text-orange-500 bg-orange-50',
    community_mention: 'text-cyan-500 bg-cyan-50',
    achievement_earned: 'text-amber-500 bg-amber-50',
    system_alert: 'text-red-500 bg-red-50',
  }
  return colorMap[type] || 'text-gray-500 bg-gray-50'
}

function getRouteForNotification(notification: any): string | null {
  if (notification.link) return notification.link

  const lowerTitle = notification.title.toLowerCase()
  const lowerMsg = notification.message.toLowerCase()

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
  if (lowerTitle.includes('achievement') || lowerTitle.includes('badge')) return '/community'

  if (lowerMsg.includes('book')) return '/explore'
  if (lowerMsg.includes('exchange') || lowerMsg.includes('trade')) return '/exchange-dashboard-v2'

  return null
}

async function handleClick(notification: any) {
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  const route = getRouteForNotification(notification)
  if (route) {
    router.push(route)
  }
}

async function handleDelete(e: Event, id: string) {
  e.stopPropagation()
  await remove(id)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F6F1E8] via-[#FEF7ED] to-[#F2F6FF]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Bell :size="32" class="text-[#0f6d5f]" />
            Notifications
          </h1>
          <p class="text-gray-500 mt-2">
            Stay updated with your latest activity
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f6d5f] bg-[#0f6d5f]/10 rounded-lg hover:bg-[#0f6d5f]/20 transition-colors"
          >
            <CheckCheck :size="16" />
            Mark all read
          </button>
          <button
            v-if="notifications.length > 0"
            @click="clearAll"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 :size="16" />
            Clear all
          </button>
        </div>
      </div>

      <!-- Unread Badge -->
      <div
        v-if="unreadCount > 0"
        class="mb-6 p-4 bg-[#0f6d5f]/5 border border-[#0f6d5f]/20 rounded-xl flex items-center gap-3"
      >
        <div class="w-10 h-10 rounded-full bg-[#0f6d5f] flex items-center justify-center">
          <Bell :size="20" class="text-white" />
        </div>
        <div>
          <p class="font-semibold text-gray-900">
            You have {{ unreadCount }} unread notification{{ unreadCount > 1 ? 's' : '' }}
          </p>
          <p class="text-sm text-gray-500">Click on a notification to mark it as read</p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          @click="setFilter(tab.value)"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
            filter === tab.value
              ? 'bg-[#0f6d5f] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
          ]"
        >
          <component :is="tab.icon" :size="14" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading && notifications.length === 0" class="flex justify-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f6d5f]"></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredNotifications.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Bell :size="40" class="text-gray-300" />
        </div>
        <h3 class="text-lg font-semibold text-gray-700 mb-1">No notifications</h3>
        <p class="text-gray-500 text-sm">
          {{ filter === 'all' ? "You're all caught up!" : 'No notifications in this category' }}
        </p>
      </div>

      <!-- Notification List -->
      <div v-else class="space-y-2">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          @click="handleClick(notification)"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
            notification.read
              ? 'bg-white hover:bg-gray-50'
              : 'bg-[#0f6d5f]/5 border border-[#0f6d5f]/10 hover:bg-[#0f6d5f]/10',
          ]"
        >
          <!-- Unread indicator -->
          <div
            v-if="!notification.read"
            class="absolute top-4 left-2 w-2 h-2 rounded-full bg-[#0f6d5f]"
          ></div>

          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              getNotificationColor(notification.type),
            ]"
          >
            <component :is="getNotificationIcon(notification.type)" :size="18" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm">{{ notification.title }}</p>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ notification.message }}</p>
            <p class="text-gray-400 text-xs mt-2">{{ formatTime(notification.createdAt) }}</p>
          </div>

          <!-- Delete button -->
          <button
            @click="(e: Event) => handleDelete(e, notification.id)"
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
