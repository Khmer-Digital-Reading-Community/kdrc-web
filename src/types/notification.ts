export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'book_published'
  | 'book_reviewed'
  | 'exchange_update'
  | 'community_mention'
  | 'achievement_earned'
  | 'system_alert'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  recipientId: string
  link?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface NotificationFilter {
  type?: NotificationType | 'all'
  read?: boolean
  page?: number
  limit?: number
}
