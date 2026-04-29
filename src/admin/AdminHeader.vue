<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>

      <div class="header-right">
        <button class="notification-btn">
          🔔
          <span class="notification-badge">1</span>
        </button>

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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const isProfileOpen = ref(false);




const pageTitle = computed(() => {
  // Map route names to readable titles
  const titles: Record<string, string> = {
    'admin-dashboard': 'Dashboard',
    'admin-books': 'Books Management',
    'admin-categories': 'Categories',
    'admin-users': 'User Management',
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
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notification-btn:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
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