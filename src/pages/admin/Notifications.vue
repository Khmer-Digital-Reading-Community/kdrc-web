<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>Notifications</h2>
        <p>Manage and review all system notifications</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="markAllAsRead" v-if="unreadCount > 0">
          <Check :size="20" />
          Mark All as Read
        </button>
        <button class="btn btn-danger" @click="clearAll" v-if="notifications.length > 0">
          <Trash2 :size="20" />
          Clear All
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search notifications..."
          class="search-input"
        />
      </div>

      <div class="filter-buttons">
        <button 
          v-for="type in ['All', 'System', 'User', 'Security', 'Update']" 
          :key="type"
          class="filter-btn"
          :class="{ active: selectedType === type }"
          @click="selectedType = type"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-label">Total</span>
        <span class="stat-value">{{ notifications.length }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Unread</span>
        <span class="stat-value unread">{{ unreadCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Read</span>
        <span class="stat-value">{{ notifications.length - unreadCount }}</span>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="notifications-container">
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <Bell :size="48" />
        <p>No notifications found</p>
      </div>

      <div v-else class="notifications-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
          @click="toggleRead(notification)"
        >
          <div class="notification-icon" :class="notification.type.toLowerCase()">
            <component :is="getIcon(notification.type)" :size="20" />
          </div>

          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
            <div v-if="notification.metadata" class="notification-meta">
              <span class="meta-tag">{{ notification.metadata }}</span>
            </div>
          </div>

          <div class="notification-actions">
            <button 
              class="action-btn"
              title="Toggle Read"
              @click.stop="toggleRead(notification)"
            >
              <Eye v-if="!notification.isRead" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
            <button 
              class="action-btn delete"
              title="Delete Notification"
              @click.stop="deleteNotification(notification)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← Previous
      </button>

      <div class="page-numbers">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>

      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next →
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Bell, Search, Trash2, Check, Eye, EyeOff,
  AlertCircle, Info, Shield, RefreshCw, User
} from 'lucide-vue-next';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'System' | 'User' | 'Security' | 'Update';
  timestamp: Date;
  isRead: boolean;
  metadata?: string;
}

// Sample notification data
const notifications = ref<Notification[]>([
  { 
    id: 1, 
    title: 'New User Registration', 
    message: 'A new user "John Doe" has registered on the platform.', 
    type: 'User', 
    timestamp: new Date(Date.now() - 5 * 60000), 
    isRead: false,
    metadata: 'john.doe@example.com'
  },
  { 
    id: 2, 
    title: 'Security Alert', 
    message: 'Unusual login activity detected from IP 192.168.1.100.', 
    type: 'Security', 
    timestamp: new Date(Date.now() - 15 * 60000), 
    isRead: false,
    metadata: '192.168.1.100'
  },
  { 
    id: 3, 
    title: 'System Update Available', 
    message: 'A new version (v2.1.0) of the platform is now available.', 
    type: 'Update', 
    timestamp: new Date(Date.now() - 1 * 3600000), 
    isRead: true,
    metadata: 'v2.1.0'
  },
  { 
    id: 4, 
    title: 'Database Backup Completed', 
    message: 'Daily database backup has completed successfully.', 
    type: 'System', 
    timestamp: new Date(Date.now() - 2 * 3600000), 
    isRead: true,
    metadata: '2.5 GB'
  },
  { 
    id: 5, 
    title: 'Book Added to Catalog', 
    message: 'A new book "The Great Gatsby" has been added to the catalog.', 
    type: 'User', 
    timestamp: new Date(Date.now() - 4 * 3600000), 
    isRead: false,
    metadata: 'F. Scott Fitzgerald'
  },
  { 
    id: 6, 
    title: 'Comment Reported', 
    message: 'A comment on "To Kill a Mockingbird" has been reported as inappropriate.', 
    type: 'System', 
    timestamp: new Date(Date.now() - 6 * 3600000), 
    isRead: true,
    metadata: '1 report'
  },
  { 
    id: 7, 
    title: 'Password Change Request', 
    message: 'User "admin" has requested a password change.', 
    type: 'Security', 
    timestamp: new Date(Date.now() - 8 * 3600000), 
    isRead: true,
    metadata: 'admin'
  },
  { 
    id: 8, 
    title: 'Server Performance Warning', 
    message: 'Server CPU usage has exceeded 80% threshold.', 
    type: 'System', 
    timestamp: new Date(Date.now() - 10 * 3600000), 
    isRead: false,
    metadata: '85%'
  },
]);

const searchQuery = ref('');
const selectedType = ref('All');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

const filteredNotifications = computed(() => {
  let filtered = notifications.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(notification => 
      notification.title.toLowerCase().includes(query) || 
      notification.message.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (selectedType.value !== 'All') {
    filtered = filtered.filter(notification => notification.type === selectedType.value);
  }

  // Sort by timestamp (newest first)
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Paginate
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  let total = notifications.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    total = total.filter(notification => 
      notification.title.toLowerCase().includes(query) || 
      notification.message.toLowerCase().includes(query)
    );
  }
  if (selectedType.value !== 'All') {
    total = total.filter(notification => notification.type === selectedType.value);
  }
  return Math.ceil(total.length / itemsPerPage.value);
});

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
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const toggleRead = (notification: Notification) => {
  notification.isRead = !notification.isRead;
};

const deleteNotification = (notification: Notification) => {
  notifications.value = notifications.value.filter(n => n.id !== notification.id);
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.isRead = true;
  });
};

const clearAll = () => {
  if (confirm('Are you sure you want to delete all notifications?')) {
    notifications.value = [];
    currentPage.value = 1;
  }
};
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 4px;
}

.page-header p {
  color: #8a9f8f;
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #e0e4e0;
}

.btn-secondary:hover {
  background: #e0e4e0;
}

.btn-danger {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.btn-danger:hover {
  background: rgba(231, 76, 60, 0.2);
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  padding: 10px 16px;
  gap: 8px;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  font-size: 1rem;
  color: #8a9f8f;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: #1f2d20;
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: #a8b3aa;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  color: #5a675f;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #1f2d20;
  color: #1f2d20;
}

.filter-btn.active {
  background: #1f2d20;
  color: white;
  border-color: #1f2d20;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 24px;
  background: #ffffff;
  padding: 16px 20px;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #8a9f8f;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2d20;
}

.stat-value.unread {
  color: #e74c3c;
}

/* Notifications Container */
.notifications-container {
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  overflow: hidden;
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2ee;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: flex-start;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f8f9f7;
}

.notification-item.unread {
  background: rgba(31, 45, 32, 0.03);
  border-left: 4px solid #1f2d20;
  padding-left: 16px;
}

.notification-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 2px;
}

.notification-icon.system {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.notification-icon.user {
  background: rgba(39, 174, 96, 0.15);
  color: #27ae60;
}

.notification-icon.security {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.notification-icon.update {
  background: rgba(241, 196, 15, 0.15);
  color: #f39c12;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
}

.notification-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2d20;
}

.notification-time {
  font-size: 0.85rem;
  color: #8a9f8f;
  white-space: nowrap;
}

.notification-message {
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: #5a675f;
  line-height: 1.4;
}

.notification-meta {
  display: flex;
  gap: 8px;
}

.meta-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f2ee;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #5a675f;
  font-weight: 500;
}

.notification-actions {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f0f2ee;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a675f;
  padding: 0;
}

.action-btn:hover {
  background: #e0e4e0;
  color: #1f2d20;
}

.action-btn.delete:hover {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #8a9f8f;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state svg {
  opacity: 0.5;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  color: #1f2d20;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f2ee;
  border-color: #1f2d20;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e4e0;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #1f2d20;
}

.page-btn:hover {
  border-color: #1f2d20;
}

.page-btn.active {
  background: #1f2d20;
  color: white;
  border-color: #1f2d20;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-item {
    flex-wrap: wrap;
  }

  .notification-header {
    width: 100%;
  }

  .notification-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .stats-bar {
    flex-wrap: wrap;
  }
}
</style>
