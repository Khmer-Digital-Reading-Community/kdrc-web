<template>
  <div class="admin-layout">
    <AdminSidebar />
    <AdminHeader />
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '../admin/AdminSidebar.vue';
import AdminHeader from '../admin/AdminHeader.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f8f9f7;
}

.admin-content {
  flex: 1;
  margin-left: 260px;
  margin-top: 80px;
  overflow-y: auto;
  padding: 32px;
  height: calc(100vh - 80px);
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-content {
    margin-left: 0;
    margin-top: 70px;
    height: auto;
    min-height: calc(100vh - 70px);
    padding: 16px;
  }
}
</style>