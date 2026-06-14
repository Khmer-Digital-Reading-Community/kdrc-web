<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Users, Eye, BookOpen, Star } from "lucide-vue-next";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview.vue";
import ReadingTrendChart from "@/components/analytics/ReadingTrendChart.vue";
import PublishedBooksPanel from "@/components/analytics/PublishedBooksPanel.vue";
import { getMyBooks, getMyBookStats, getMyReaderTrend } from "@/services/bookApi";
import { getFollowerCounts } from "@/services/followApi";
import { user } from "@/services/auth";
import type { Book } from "@/services/bookApi";

const books = ref<Book[]>([]);
const statsData = ref({ totalPublished: 0, totalBooks: 0 });
const followerCount = ref(0);
const booksLoading = ref(false);
const trendData = ref<{ labels: string[]; readers: number[] }>({ labels: [], readers: [] });

const publishedBooks = computed(() =>
  books.value.filter((b) => b.status === "PUBLISHED")
);

const totalReads = computed(() =>
  publishedBooks.value.reduce((sum, b) => sum + (b.readCount ?? 0), 0)
);

const avgRating = computed(() => {
  const rated = publishedBooks.value.filter((b) => b.rating && b.rating > 0);
  if (!rated.length) return "—";
  return (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1);
});

const overviewStats = computed(() => [
  {
    title: "Total Reads",
    value: totalReads.value.toLocaleString(),
    icon: Eye,
    color: "bg-blue-50",
  },
  {
    title: "Followers",
    value: followerCount.value.toLocaleString(),
    icon: Users,
    color: "bg-green-50",
  },
  {
    title: "Avg. Rating",
    value: avgRating.value,
    icon: Star,
    color: "bg-purple-50",
  },
  {
    title: "Published",
    value: statsData.value.totalPublished,
    icon: BookOpen,
    color: "bg-orange-50",
  },
]);



onMounted(async () => {
  booksLoading.value = true;
  try {
    const [booksRes, statsRes, trend] = await Promise.all([
      getMyBooks(),
      getMyBookStats(),
      getMyReaderTrend(),
    ]);
    books.value = booksRes;
    statsData.value = statsRes;
    trendData.value = trend;

    if (user.value?.id) {
      const counts = await getFollowerCounts(user.value.id);
      followerCount.value = counts.followersCount;
    }
  } catch (e) {
    console.error(e);
  } finally {
    booksLoading.value = false;
  }
});
</script>

<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Breadcrumb -->
    <div class="text-[11px] sm:text-sm uppercase tracking-[0.15em] text-gray-500 mb-6">
      Atelier >
      <span class="font-bold text-black"> Analytics </span>
    </div>

          <!-- Header with Period Selector -->
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <p class="text-3xl sm:text-4xl font-bold mb-2">
                Analytics Dashboard
              </p>
              <p class="text-gray-600 text-sm pt-2">
                Track your book performance and audience insights
              </p>
            </div>

            <!-- Period Selector -->
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="period in periods"
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedPeriod === period.value
                    ? 'bg-[#9C6700] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>

          <!-- Overview Stats -->
          <AnalyticsOverview :stats="overviewStats" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-black mb-2">
          Analytics Dashboard
        </h1>
        <p class="text-gray-600 text-sm">
          Track your book performance and audience insights
        </p>
      </div>
    </div>

    <!-- Overview Stats (real data) -->
    <AnalyticsOverview :stats="overviewStats" />

    <!-- Charts + Books -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      <div class="lg:col-span-2">
        <ReadingTrendChart
          v-if="trendData.labels.length"
          :data="{ ...trendData, views: trendData.readers }"
        />
        <div
          v-else
          class="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center h-48 text-gray-400 text-sm"
        >
          No published books yet.
        </div>
      </div>
      <div>
        <PublishedBooksPanel :books="publishedBooks" :loading="booksLoading" />
      </div>
    </div>

  </div>
</template>
