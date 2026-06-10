import api from './api'
import type { Notification } from '../types/notification'

class PushNotificationService {
  private permission: NotificationPermission = 'default'

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') return true

    const result = await Notification.requestPermission()
    this.permission = result
    return result === 'granted'
  }

  isSupported(): boolean {
    return 'Notification' in window
  }

  hasPermission(): boolean {
    return this.permission === 'granted'
  }

  showLocalNotification(notification: Notification) {
    if (!this.hasPermission()) return

    const body = notification.message.length > 100
      ? notification.message.slice(0, 97) + '...'
      : notification.message

    const notif = new Notification(notification.title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      data: { notificationId: notification.id, link: notification.link },
    })

    notif.onclick = () => {
      window.focus()
      if (notification.link) {
        window.location.href = notification.link
      }
      notif.close()
    }

    setTimeout(() => notif.close(), 8000)
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.hasPermission()) {
      const granted = await this.requestPermission()
      if (!granted) return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        ) as BufferSource,
      })

      await api.post('/notifications/push/subscribe', {
        subscription: subscription.toJSON(),
      })

      return subscription
    } catch (err) {
      console.error('Push subscription failed:', err)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await api.delete('/notifications/push/subscribe')
      }
    } catch (err) {
      console.error('Push unsubscribe failed:', err)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

export default new PushNotificationService()
