<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>

      <div class="header-right">
        <div class="notification-wrapper">
          <button class="notification-btn" @click="isNotificationOpen = !isNotificationOpen">
            <Bell :size="24" />
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </button>

          <!-- Notification Dropdown Menu -->
          <div v-if="isNotificationOpen" class="notification-dropdown">
            <div class="dropdown-header">
              <h3>Notifications</h3>
              <button v-if="unreadCount > 0" class="mark-all-btn" @click="markAllAsRead">
                Mark all as read
              </button>
            </div>

            <div class="notification-list">
              <div v-if="notifications.length === 0" class="empty-notif">
                <Bell :size="32" />
                <p>No notifications</p>
              </div>

              <div 
                v-for="notification in notifications.slice(0, 5)" 
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.isRead }"
                @click="toggleRead(notification)"
              >
                <div class="notif-icon" :class="notification.type.toLowerCase()">
                  <component :is="getIcon(notification.type)" :size="16" />
                </div>
                <div class="notif-content">
                  <p class="notif-title">{{ notification.title }}</p>
                  <p class="notif-time">{{ formatTime(notification.timestamp) }}</p>
                </div>
              </div>
            </div>

            <div v-if="notifications.length > 0" class="dropdown-footer">
              <router-link to="/admin/notifications" class="view-all-btn">
                View all notifications →
              </router-link>
            </div>
          </div>
        </div>

        <div class="profile-wrapper">
          <button class="profile-section" @click="isProfileOpen = !isProfileOpen">
            <div class="profile-avatar">A</div>
            <div class="profile-info">
              <p class="profile-name">Admin</p>
              <p class="profile-role">Administrator</p>
            </div>
            <span class="dropdown-icon" :class="{ open: isProfileOpen }">▼</span>
          </button>

          <!-- Profile Dropdown Menu -->
          <div v-if="isProfileOpen" class="profile-dropdown">
            <div class="dropdown-header">
              <p class="dropdown-email">admin@kdrc.org</p>
              <p class="dropdown-account">Administrator Account</p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  </header>

  

  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Bell, AlertCircle, Info, Shield, RefreshCw, User } from 'lucide-vue-next';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'System' | 'User' | 'Security' | 'Update';
  timestamp: Date;
  isRead: boolean;
}

const route = useRoute();
const isProfileOpen = ref(false);
const isNotificationOpen = ref(false);

// Sample notification data
const notifications = ref<Notification[]>([
  { 
    id: 1, 
    title: 'New User Registration', 
    message: 'A new user has registered.', 
    type: 'User', 
    timestamp: new Date(Date.now() - 5 * 60000), 
    isRead: false
  },
  { 
    id: 2, 
    title: 'Security Alert', 
    message: 'Unusual login activity detected.', 
    type: 'Security', 
    timestamp: new Date(Date.now() - 15 * 60000), 
    isRead: false
  },
  { 
    id: 3, 
    title: 'System Update Available', 
    message: 'New version v2.1.0 is available.', 
    type: 'Update', 
    timestamp: new Date(Date.now() - 1 * 3600000), 
    isRead: true
  },
  { 
    id: 4, 
    title: 'Database Backup Completed', 
    message: 'Daily backup completed successfully.', 
    type: 'System', 
    timestamp: new Date(Date.now() - 2 * 3600000), 
    isRead: true
  },
  { 
    id: 5, 
    title: 'Book Added to Catalog', 
    message: 'New book added to the system.', 
    type: 'User', 
    timestamp: new Date(Date.now() - 4 * 3600000), 
    isRead: false
  },
]);

const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

const getIcon = (type: string) => {
  switch(type) {
    case 'Security': return Shield;
    case 'Update': return RefreshCw;
    case 'User': return User;
    case 'System': return AlertCircle;
    default: return Info;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return 'Earlier';
};

const toggleRead = (notification: Notification) => {
  notification.isRead = !notification.isRead;
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.isRead = true;
  });
};

const pageTitle = computed(() => {
  // Map route names to readable titles
  const titles: Record<string, string> = {
    'admin-dashboard': 'Dashboard',
    'admin-books': 'Books Management',
    'admin-categories': 'Categories',
    'admin-users': 'User Management',
    'admin-notifications': 'Notifications',
    'admin-roles': 'Roles & Permissions',
    'admin-comments': 'Comments Management',
    'admin-reports': 'Reports & Issues',
    'admin-settings': 'Settings',
    'admin-analytics': 'Analytics & Reports',
  };
  return titles[route.name as string] || 'Dashboard';
});





  

</script>

<style scoped>
.admin-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 260px;
  height: 80px;
  background: #ffffff;
  border-bottom: 1px solid #e0e4e0;
  z-index: 40;
  display: flex;
  align-items: center;
  padding: 0 32px;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.header-left {
  flex: 0 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0;
  white-space: nowrap;
}

.header-middle {
  flex: 1;
  min-width: 200px;
}





.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 0 0 auto;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: #1f2d20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.notification-btn:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.notification-wrapper {
  position: relative;
}

/* Notification Dropdown Menu */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(31, 45, 32, 0.12);
  width: 360px;
  z-index: 1000;
  overflow: hidden;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.notification-dropdown .dropdown-header {
  padding: 16px;
  background: #f8f9f7;
  border-bottom: 1px solid #e0e4e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-dropdown .dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2d20;
}

.mark-all-btn {
  background: none;
  border: none;
  color: #1f2d20;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.mark-all-btn:hover {
  color: #8a9f8f;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.empty-notif {
  padding: 40px 20px;
  text-align: center;
  color: #8a9f8f;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-notif svg {
  opacity: 0.3;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2ee;
  cursor: pointer;
  transition: background 0.2s ease;
  align-items: flex-start;
}

.notification-item:hover {
  background: #f8f9f7;
}

.notification-item.unread {
  background: rgba(31, 45, 32, 0.03);
}

.notif-icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 2px;
}

.notif-icon.system {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.notif-icon.user {
  background: rgba(39, 174, 96, 0.15);
  color: #27ae60;
}

.notif-icon.security {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.notif-icon.update {
  background: rgba(241, 196, 15, 0.15);
  color: #f39c12;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title {
  margin: 0 0 2px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2d20;
  white-space: normal;
  word-break: break-word;
}

.notif-time {
  margin: 0;
  font-size: 0.8rem;
  color: #8a9f8f;
}

.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid #e0e4e0;
  background: #f8f9f7;
}

.view-all-btn {
  display: block;
  text-align: center;
  color: #1f2d20;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px;
  transition: color 0.2s ease;
}

.view-all-btn:hover {
  color: #667eea;
}

/* Scrollbar styling */
.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #d0d4d0;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #c0c4c0;
}

.profile-wrapper {
  position: relative;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8f9f7;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.profile-section:hover {
  background: #f0f2ee;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.profile-name {
  font-weight: 600;
  color: #1f2d20;
  margin: 0;
  font-size: 0.95rem;
}

.profile-role {
  font-size: 0.75rem;
  color: #8a9f8f;
  margin: 0;
}

.dropdown-icon {
  font-size: 0.8rem;
  color: #8a9f8f;
  transition: transform 0.2s ease;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

/* Profile Dropdown Menu */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(31, 45, 32, 0.12);
  width: 280px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 16px;
  background: #f8f9f7;
  border-bottom: 1px solid #e0e4e0;
}

.dropdown-email {
  font-weight: 600;
  color: #1f2d20;
  margin: 0 0 4px;
  font-size: 0.95rem;
}

.dropdown-account {
  font-size: 0.8rem;
  color: #8a9f8f;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background: #e0e4e0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #5a675f;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f8f9f7;
  color: #1f2d20;
}

.item-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-item.logout {
  color: #e74c3c;
  font-weight: 500;
}

.dropdown-item.logout:hover {
  background: rgba(231, 76, 60, 0.05);
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Responsive design for smaller screens */
@media (max-width: 1024px) {
  .header-content {
    gap: 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .header-right {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .admin-header {
    left: 0;
    height: 70px;
    padding: 0 16px;
  }

  .header-content {
    gap: 12px;
  }

  .header-middle {
    display: none;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .profile-info {
    display: none;
  }

  .profile-section {
    padding: 4px;
    gap: 0;
  }

  .dropdown-icon {
    display: none;
  }

  .profile-dropdown {
    right: -50px;
    width: 250px;
  }
}
</style>