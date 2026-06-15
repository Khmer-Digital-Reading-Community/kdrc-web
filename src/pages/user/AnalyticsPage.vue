<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Users, Eye, BookOpen, Star } from "lucide-vue-next";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview.vue";
import ReadingTrendChart from "@/components/analytics/ReadingTrendChart.vue";
import PublishedBooksPanel from "@/components/analytics/PublishedBooksPanel.vue";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart.vue";
import {
  getMyBooks,
  getMyBookStats,
  getMyReaderTrend,
} from "@/services/bookApi";
import { getFollowerCounts } from "@/services/followApi";
import { user } from "@/services/auth";
import type { Book } from "@/services/bookApi";

const books = ref<Book[]>([]);
const statsData = ref({ totalPublished: 0, totalBooks: 0 });
const followerCount = ref(0);
const booksLoading = ref(false);
const trendData = ref<{ labels: string[]; readers: number[] }>({
  labels: [],
  readers: [],
});

const publishedBooks = computed(() =>
  books.value.filter((b) => b.status === "PUBLISHED"),
);

const totalReads = computed(() =>
  publishedBooks.value.reduce((sum, b) => sum + (b.readCount ?? 0), 0),
);

const avgRating = computed(() => {
  const rated = publishedBooks.value.filter((b) => b.rating && b.rating > 0);
  if (!rated.length) return "—";
  return (
    rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length
  ).toFixed(1);
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
    <!-- Header -->
    <div class="mb-8">
      <p class="text-3xl sm:text-4xl font-bold mt-2">Analytics Dashboard</p>
      <p class="text-gray-500 text-lg mt-2 text-[17px] pt-2">
        Track your book performance and audience insights
      </p>
    </div>

    <!-- Overview Stats -->
    <AnalyticsOverview :stats="overviewStats" />

    <!-- Row 1: Reading Trend + Published Books -->
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

    <!-- Row 2: Book Status Distribution -->
    <div class="my-6">
      <AnalyticsChart :books="books" />
    </div>
  </div>
</template>
