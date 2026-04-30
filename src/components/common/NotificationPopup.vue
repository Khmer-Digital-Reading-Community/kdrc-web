<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, X } from 'lucide-vue-next'

interface Notification {
  id: string
  type: 'chapter' | 'follower' | 'approval' | 'swap' | 'mention' | 'recommendation'
  title: string
  description: string
  timestamp: string
  icon?: string
  read: boolean
}

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  markAsRead: [id: string]
}>()

const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'chapter',
    title: 'New Chapter Released',
    description: '"The Amber Shaft" by Elias Thorne just published with Chapter 24: The Reckoning',
    timestamp: '2m ago',
    read: false
  },
  {
    id: '2',
    type: 'follower',
    title: 'New Follower',
    description: 'Julian Vane started following your writing journey',
    timestamp: '3h ago',
    read: false
  },
  {
    id: '3',
    type: 'approval',
    title: 'Chapter Approved',
    description: 'Your latest draft for "Whispers in the Atelier" has been approved by the editorial team',
    timestamp: '1d ago',
    read: true
  },
  {
    id: '4',
    type: 'swap',
    title: 'New Swap Request',
    description: 'Sarah Jenkins requested a review swap for your place "Oceanic Dreams"',
    timestamp: '1d ago',
    read: true
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    description: '@the_curator mentioned you in a comment on "The Future of Digital Noir"',
    timestamp: '5d ago',
    read: true
  },
  {
    id: '6',
    type: 'recommendation',
    title: 'Weekly Recommendation',
    description: 'Based on your library, we think you\'d love "The Silk Architects" by M. Rossi',
    timestamp: '5d ago',
    read: true
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

function getNotificationIcon(type: string) {
  const iconMap: Record<string, string> = {
    chapter: '',
    follower: '',
    approval: '',
    swap: '',
    mention: '',
    recommendation: ''
  }
  return iconMap[type] || ''
}

function markAsRead(id: string) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
  emit('markAsRead', id)
}

function markAllAsRead() {
  notifications.value.forEach(n => {
    n.read = true
  })
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
          @click="markAsRead(notification.id)"
          :class="[
            'px-6 py-4 border-b border-[#FDE9D0]/5 hover:bg-[#0a3f45] cursor-pointer transition-colors',
            notification.read ? 'bg-transparent' : 'bg-[#093A3F]/50'
          ]"
        >
          <div class="flex gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 text-xl">
              {{ getNotificationIcon(notification.type) }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-[#FDE9D0] font-medium text-sm">{{ notification.title }}</p>
                <span v-if="!notification.read" class="flex-shrink-0 w-2 h-2 rounded-full bg-[#F9AE5B]"></span>
              </div>
              <p class="text-[#FDE9D0]/70 text-xs mt-1 line-clamp-2">{{ notification.description }}</p>
              <p class="text-[#FDE9D0]/50 text-xs mt-2">{{ notification.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="notifications.length > 0" class="px-6 py-3 border-t border-[#FDE9D0]/10 flex justify-end">
      <button
        @click="markAllAsRead"
        class="text-[#F9AE5B] text-sm font-medium hover:text-[#FDE9D0] transition-colors"
      >
        Mark all as read
      </button>
    </div>
  </div>
</template>
