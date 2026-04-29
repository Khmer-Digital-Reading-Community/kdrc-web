<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">ADMIN</h1>
    </div>

    <nav class="sidebar-nav">
      <!-- Dashboard Section -->
      <div class="nav-section">
        <h2 class="section-title">Main</h2>
        <router-link 
          to="/admin/dashboard" 
          class="nav-link"
          :class="{ active: isActive('/admin/dashboard') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Dashboard</span>
        </router-link>
      </div>

      <!-- Content Management -->
      <div class="nav-section">
        <h2 class="section-title">Content Management</h2>
        <router-link 
          to="/admin/books" 
          class="nav-link"
          :class="{ active: isActive('/admin/books') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Books</span>
        </router-link>
        <router-link 
          to="/admin/categories" 
          class="nav-link"
          :class="{ active: isActive('/admin/categories') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Categories</span>
        </router-link>
      </div>

      <!-- User Management -->
      <div class="nav-section">
        <h2 class="section-title">User Management</h2>
        <router-link 
          to="/admin/users" 
          class="nav-link"
          :class="{ active: isActive('/admin/users') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Users</span>
        </router-link>
        <router-link 
          to="/admin/roles" 
          class="nav-link"
          :class="{ active: isActive('/admin/roles') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Roles & Permissions</span>
        </router-link>
      </div>

      <!-- Community -->
      <div class="nav-section">
        <h2 class="section-title">Community</h2>
        <router-link 
          to="/admin/comments" 
          class="nav-link"
          :class="{ active: isActive('/admin/comments') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Comments</span>
        </router-link>
        <router-link 
          to="/admin/reports" 
          class="nav-link"
          :class="{ active: isActive('/admin/reports') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Reports</span>
        </router-link>
      </div>

      <!-- Settings -->
      <div class="nav-section">
        <h2 class="section-title">Settings</h2>
        <router-link 
          to="/admin/settings" 
          class="nav-link"
          :class="{ active: isActive('/admin/settings') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Settings</span>
        </router-link>
        <router-link 
          to="/admin/analytics" 
          class="nav-link"
          :class="{ active: isActive('/admin/analytics') }"
        >
          <span class="nav-icon"></span>
          <span class="nav-label">Analytics</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="logout">
        <span class="nav-icon">-></span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const logout = () => {
  // Clear auth token and redirect to login
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #f8f9f7 0%, #f0f2ee 100%);
  border-right: 1px solid #e0e4e0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e0e4e0;
  background: #ffffff;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 8px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #8a9f8f;
  padding: 12px 20px 8px;
  margin: 0;
  letter-spacing: 0.5px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: #5a675f;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  font-size: 0.95rem;
}

.nav-link:hover {
  background-color: rgba(31, 45, 32, 0.05);
  color: #1f2d20;
}

.nav-link.active {
  background-color: rgba(31, 45, 32, 0.08);
  color: #1f2d20;
  border-left-color: #1f2d20;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  flex: 1;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e4e0;
  background: #ffffff;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f8f9f7;
  border: 1px solid #e0e4e0;
  border-radius: 6px;
  color: #5a675f;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #eff1ed;
  color: #1f2d20;
  border-color: #d0d4d0;
}

/* Scrollbar styling */
.admin-sidebar::-webkit-scrollbar {
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: #d0d4d0;
  border-radius: 3px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: #c0c4c0;
}
</style>