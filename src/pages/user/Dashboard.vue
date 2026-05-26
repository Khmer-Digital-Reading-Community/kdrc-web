<script setup lang="ts">
import Sidebar from '@/components/common/Sidebar.vue'
import Navbar from '@/components/common/Navbar.vue'

import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import RecentManuscripts from '@/components/dashboard/RecentManuscripts.vue'
</script>

<template>
  <div
    class="relative flex
          min-h-screen overflow-hidden
          bg-[#F6F1E8]"
  >
    <Sidebar />

    <!-- Main Content -->
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">

      <!-- Sticky Navbar -->
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden">

        <div class="p-3 sm:p-4 lg:p-6">

          <!-- Breadcrumb -->
          <div
            class="text-[11px] sm:text-sm uppercase tracking-[0.15em]
                   text-gray-500 mb-4 sm:mb-6"
          >
            Atelier >

            <span class="font-bold text-black">
              Dashboard
            </span>
          </div>

          <!-- Welcome Banner -->
          <WelcomeBanner />

          <!-- Stats Section -->
          <section
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
                   gap-4 lg:gap-6 my-4 lg:my-6"
          >

            <StatCard
              title="Daily Word Goal"
              value="72%"
              subtitle="1,800 / 2,500"
              description="Words written today"
            />

            <StatCard
              title="Writing Streak"
              value="14 Days"
              subtitle="Excellent"
              description="You're on fire"
            />

            <StatCard
              title="Weekly Engagement"
              value="+12.4%"
              subtitle="Compared to last week"
              description="Community interaction"
            />

          </section>

          <!-- Bottom Section -->
          <section
            class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6"
          >

            <!-- Recent Manuscripts -->
            <div class="xl:col-span-2 min-w-0">
              <RecentManuscripts />
            </div>

          </section>

        </div>

      </main>

    </div>

  </div>
</template>
