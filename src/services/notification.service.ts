import api from './api'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  recipientId: string
  createdAt: string
  updatedAt: string
}

class NotificationService {
  /**
   * Fetch all notifications for current user
   */
  async getMyNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications/user/me')
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/user/me/unread-count')
      return response.data
    } catch (error) {
      console.error('Error fetching unread count:', error)
      throw error
    }
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/user/me/read-all')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  /**
   * Get single notification
   */
  async getNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await api.get(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching notification:', error)
      throw error
    }
  }

  /**
   * Get notifications for a specific user
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      throw error
    }
  }
}

export default new NotificationService()
