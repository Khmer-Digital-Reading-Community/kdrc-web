<template>
  <div class="dashboard-layout">
    <Sidebar @update:collapsed="sidebarCollapsed = $event" />
    <div class="dashboard-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <Navbar class="sticky top-0 z-20 shrink-0" />
      <main class="dashboard-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "../components/common/Sidebar.vue";
import Navbar from "../components/common/Navbar.vue";

const sidebarCollapsed = ref(false);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f6f1e8;
}

.dashboard-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.25s ease;
}

.dashboard-main.sidebar-collapsed {
  margin-left: 68px;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-main,
  .dashboard-main.sidebar-collapsed {
    margin-left: 0;
  }

  .dashboard-content {
    padding-top: 3.5rem;
  }
}
</style>
