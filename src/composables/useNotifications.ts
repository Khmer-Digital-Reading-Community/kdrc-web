import { ref, computed, watch } from 'vue'
import notificationService from '../services/notification.service'
import socketService from '../services/socket.service'
import pushService from '../services/push.service'
import { token } from '../stores/useAuth'
import type { Notification, NotificationType } from '../types/notification'

const notifications = ref<Notification[]>([])
const loading = ref(false)
const filter = ref<NotificationType | 'all'>('all')

let pollInterval: ReturnType<typeof setInterval> | null = null
let socketUnsubscribe: (() => void) | null = null
let initialized = false

function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.setValueAtTime(1100, now + 0.08)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1320, now + 0.08)
    osc2.frequency.setValueAtTime(1540, now + 0.16)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.12)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.35)

    setTimeout(() => ctx.close(), 500)
  } catch {
    // Audio not available
  }
}

function startPolling(intervalMs = 15000) {
  stopPolling()
  pollInterval = setInterval(() => loadNotifications(true), intervalMs)
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

function startRealtime() {
  if (socketUnsubscribe) return

  socketService.connect()

  socketUnsubscribe = socketService.onNotification((notification) => {
    notifications.value.unshift(notification)
    playNotificationSound()
    if (pushService.hasPermission()) {
      pushService.showLocalNotification(notification)
    }
  })
}

function stopRealtime() {
  if (socketUnsubscribe) {
    socketUnsubscribe()
    socketUnsubscribe = null
  }
  socketService.disconnect()
}

async function loadNotifications(force = false) {
  if (loading.value && !force) return
  loading.value = true
  try {
    notifications.value = await notificationService.getMyNotifications()
  } catch (e) {
    console.error('[Notifications] Failed to load:', e)
    if (!notifications.value.length) {
      notifications.value = []
    }
  } finally {
    loading.value = false
  }
}

function start() {
  loadNotifications(true)
  startRealtime()
  startPolling()
}

function stop() {
  stopRealtime()
  stopPolling()
  notifications.value = []
}

function init() {
  if (initialized) return
  initialized = true

  if (token.value) {
    start()
  }

  watch(token, (newToken) => {
    if (newToken) {
      start()
    } else {
      stop()
    }
  })
}

export function useNotifications() {
  init()

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length,
  )

  const filteredNotifications = computed(() => {
    if (filter.value === 'all') return notifications.value
    return notifications.value.filter((n) => n.type === filter.value)
  })

  const load = (force = false) => loadNotifications(force)

  const markAsRead = async (id: string) => {
    const item = notifications.value.find((n) => n.id === id)
    if (!item || item.read) return
    try {
      const updated = await notificationService.markAsRead(id)
      const idx = notifications.value.findIndex((n) => n.id === id)
      if (idx !== -1) notifications.value[idx] = updated
    } catch (e) {
      console.error('[Notifications] markAsRead failed:', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      notifications.value = notifications.value.map((n) => ({
        ...n,
        read: true,
      }))
    } catch (e) {
      console.error('[Notifications] markAllAsRead failed:', e)
    }
  }

  const remove = async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      notifications.value = notifications.value.filter((n) => n.id !== id)
    } catch (e) {
      console.error('[Notifications] remove failed:', e)
    }
  }

  const clearAll = async () => {
    const ids = [...notifications.value.map((n) => n.id)]
    for (const id of ids) {
      await remove(id)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const setFilter = (f: NotificationType | 'all') => {
    filter.value = f
  }

  return {
    notifications,
    filteredNotifications,
    unreadCount,
    loading,
    filter,
    load,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
    formatTime,
    setFilter,
    requestPushPermission: () => pushService.requestPermission(),
    hasPushPermission: () => pushService.hasPermission(),
  }
}
