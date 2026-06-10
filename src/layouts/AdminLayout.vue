<template>
  <div class="admin-layout" :class="{ 'admin-theme-dark': isDark }">
    <AdminSidebar @update:collapsed="sidebarCollapsed = $event" />
    <div class="admin-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import '../assets/admin.css';
import AdminSidebar from '../components/admin/AdminSidebar.vue';
import AdminHeader from '../components/admin/AdminHeader.vue';
import { useAdminTheme } from '../composables/useAdminTheme';

const { isDark, initTheme } = useAdminTheme();
const sidebarCollapsed = ref(false);

onMounted(() => initTheme());
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--admin-bg);
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.25s ease;
}

.admin-main.sidebar-collapsed {
  margin-left: 68px;
}

.admin-content {
  flex: 1;
  padding: 1.5rem 2rem 2.5rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-main,
  .admin-main.sidebar-collapsed {
    margin-left: 0;
  }

  .admin-content {
    padding: 1rem;
    padding-top: 4.5rem;
  }
}
</style>
