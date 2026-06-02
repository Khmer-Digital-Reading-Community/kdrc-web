<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/common/Sidebar.vue'
import Navbar from '@/components/common/Navbar.vue'

import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import RecentManuscripts from '@/components/dashboard/RecentManuscripts.vue'
import { getMyBookStats, getMyBooks, type AuthorStats, type Book } from '@/services/bookApi'

const stats = ref<AuthorStats | null>(null)
const recentBooks = ref<Book[]>([])
const isLoading = ref(true)

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const [statsData, booksData] = await Promise.all([
      getMyBookStats(),
      getMyBooks()
    ])
    stats.value = statsData
    recentBooks.value = booksData.slice(0, 5) // Get only top 5 recent books
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDashboardData)
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

          <!-- Welcome Banner -->
          <WelcomeBanner />

          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C6700]"></div>
          </div>

          <template v-else>
            <!-- Stats Section -->
            <section
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
                    gap-4 lg:gap-6 my-4 lg:my-6"
            >

              <StatCard
                title="Total Books"
                :value="stats?.totalBooks.toString() || '0'"
                :subtitle="`${stats?.totalPublished} Published`"
                description="Your complete portfolio"
              />

              <StatCard
                title="Writing Streak"
                :value="`${stats?.streakDays || 0} Days`"
                subtitle="Excellent"
                description="Keep the momentum going"
              />

              <StatCard
                title="Total Words"
                :value="Intl.NumberFormat('en-US', { notation: 'compact' }).format(stats?.totalWords || 0)"
                :subtitle="`${stats?.engagementRate}% Engagement`"
                description="Community interaction"
              />

            </section>

            <!-- Bottom Section -->
            <section
              class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6"
            >

              <!-- Recent Manuscripts -->
              <div class="xl:col-span-2 min-w-0">
                <RecentManuscripts :books="recentBooks" />
              </div>

            </section>
          </template>

        </div>

      </main>

    </div>

  </div>
</template>
