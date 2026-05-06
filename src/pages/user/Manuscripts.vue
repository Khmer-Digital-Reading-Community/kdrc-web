<script setup lang="ts">
import Sidebar from '@/components/common/Sidebar.vue'
import Navbar from '@/components/common/Navbar.vue'

import ManuscriptHeader from '@/components/manuscript/ManuscriptHeader.vue'
import ManuscriptFilters from '@/components/manuscript/ManuscriptFilters.vue'
import ManuscriptGrid from '@/components/manuscript/ManuscriptGrid.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Navbar -->
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">

        <ManuscriptHeader />

        <ManuscriptFilters />

        <ManuscriptGrid />

      </main>

    </div>

  </div>
</template>