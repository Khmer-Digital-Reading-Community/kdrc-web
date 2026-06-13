<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <WelcomeBanner />

          <div v-if="isLoading" class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C6700]"
            />
          </div>

          <template v-else>
            <section
              class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 my-4 lg:my-6"
            >
              <StatCard
                title="Total Books"
                :value="stats?.totalBooks.toString() || '0'"
                :subtitle="`${stats?.totalPublished} Published`"
                description="Your books across all genres"
              />

              <StatCard
                title="Followers"
                :value="
                  Intl.NumberFormat('en-US', {
                    notation: 'compact',
                  }).format(followersCount)
                "
                subtitle="Growing Audience"
                description="Readers following your work"
              />

              <StatCard
                title="Following"
                :value="
                  Intl.NumberFormat('en-US', {
                    notation: 'compact',
                  }).format(followingCount)
                "
                subtitle="Building Connections"
                description="Authors you follow"
              />

              <StatCard
                title="Total Words"
                :value="
                  Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                    stats?.totalWords || 0,
                  )
                "
                :subtitle="`${stats?.engagementRate}% Engagement`"
                description="Community interaction"
              />
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">

              <div class="xl:col-span-2 min-w-0">
                <RecentManuscripts :books="recentBooks" />
              </div>

              <div>
                <AnalyticsChart
                  :books="allBooks"
                />
              </div>

            </section>
          </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner.vue";
import StatCard from "@/components/dashboard/StatCard.vue";
import RecentManuscripts from "@/components/dashboard/RecentManuscripts.vue";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart.vue";

import {
  getMyBookStats,
  getMyBooks,
  type AuthorStats,
  type Book,
} from "@/services/bookApi";

import { getFollowerCounts } from "@/services/followApi";
import { authState } from "@/services/auth";

const stats = ref<AuthorStats | null>(null);
const allBooks = ref<Book[]>([]);
const recentBooks = ref<Book[]>([]);
const followersCount = ref(0);
const followingCount = ref(0);
const isLoading = ref(true);

const fetchDashboardData = async () => {
  isLoading.value = true;

  try {
    const [statsData, booksData] = await Promise.all([
      getMyBookStats(),
      getMyBooks(),
    ]);

    stats.value = statsData;
    allBooks.value = booksData;
    recentBooks.value = booksData.slice(0, 5);

    const currentUser = authState.user.value;

    if (currentUser?.id) {
      const followerData = await getFollowerCounts(currentUser.id);
      followersCount.value = followerData.followersCount ?? 0;
      followingCount.value = followerData.followingCount ?? 0;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>