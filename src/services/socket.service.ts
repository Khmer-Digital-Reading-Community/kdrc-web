import { io, type Socket } from 'socket.io-client'
import type { Notification } from '../types/notification'
import { apiBaseUrl } from './api'
import { token } from '../stores/useAuth'

type NotificationCallback = (notification: Notification) => void

class SocketService {
  private socket: Socket | null = null
  private listeners: NotificationCallback[] = []

  connect() {
    if (this.socket) return

    if (!token.value) {
      console.warn('[Socket] No auth token available for websocket connection')
      return
    }

    this.socket = io(apiBaseUrl, {
      auth: {
        token: token.value,
      },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    })

    this.socket.on('connect', () => {
      console.info('[Socket] connected', this.socket?.id)
    })

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] connect_error', error)
    })

    this.socket.on('notification', (notification: Notification) => {
      this.listeners.forEach((callback) => callback(notification))
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.listeners = []
  }

  onNotification(callback: NotificationCallback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback)
    }
  }

  isConnected() {
    return Boolean(this.socket?.connected)
  }
}

export default new SocketService()
