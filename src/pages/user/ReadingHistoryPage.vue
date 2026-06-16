<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-8">
      <p class="text-3xl sm:text-4xl font-bold mt-2">Reading History</p>
      <p class="text-gray-500 text-lg mt-2 text-[17px] pt-2">
        Track every book you've read, your progress, and your reading streaks.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C6700]"
      />
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <section
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8"
      >
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 flex-shrink-0"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Books Read
            </p>
            <h3 class="text-2xl font-extrabold text-gray-900">
              {{ stats?.booksRead ?? 0 }}
            </h3>
          </div>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Current Streak
            </p>
            <h3 class="text-2xl font-extrabold text-gray-900">
              {{ stats?.currentStreak ?? 0 }} days
            </h3>
          </div>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Pages
            </p>
            <h3 class="text-2xl font-extrabold text-gray-900">
              {{ stats?.totalPages?.toLocaleString() ?? 0 }}
            </h3>
          </div>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Genres Explored
            </p>
            <h3 class="text-2xl font-extrabold text-gray-900">
              {{ stats?.genres?.length ?? 0 }}
            </h3>
          </div>
        </div>
      </section>

      <!-- Exchange Dashboard Cross-link Banner -->
      <router-link
        :to="{ name: 'exchange-dashboard-v2' }"
        class="block bg-gradient-to-r from-[#093A3F] to-[#1c5a60] rounded-2xl p-5 sm:p-6 mb-8 hover:shadow-lg transition-shadow group"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-6 h-6 text-[#c5a050]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">
                Manage Your Physical Book Trades
              </h3>
              <p class="text-white/70 text-sm mt-0.5">
                View your exchange listings, incoming requests, and active trades.
              </p>
            </div>
          </div>
          <span
            class="hidden sm:flex items-center gap-1 text-[#c5a050] font-semibold text-sm group-hover:gap-2 transition-all"
          >
            Exchange Dashboard
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </router-link>

      <!-- Genres Breakdown -->
      <section
        v-if="stats?.genres && stats.genres.length > 0"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-8"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-1 h-6 bg-[#c5a050] rounded-full"></div>
          <h2 class="text-lg font-bold text-gray-900">Genres You've Read</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="genre in stats.genres"
            :key="genre.name"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
            :style="{
              backgroundColor: genre.color + '18',
              borderColor: genre.color + '40',
              color: genre.color,
            }"
          >
            {{ genre.name }}
            <span
              class="px-2 py-0.5 rounded-full text-xs"
              :style="{
                backgroundColor: genre.color + '30',
              }"
            >
              {{ genre.count }}
            </span>
          </span>
        </div>
      </section>

      <!-- Error State -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
      >
        <p class="text-red-600 font-semibold">{{ errorMessage }}</p>
        <button
          @click="fetchData()"
          class="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="readingHistory.length === 0"
        class="bg-white rounded-2xl border border-gray-100 p-12 text-center"
      >
        <div class="w-20 h-20 mx-auto mb-5 bg-gray-50 rounded-full flex items-center justify-center">
          <svg
            class="w-10 h-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No reading history yet</h3>
        <p class="text-gray-500 mb-6 max-w-md mx-auto">
          Start reading books and your progress will appear here. Track every chapter you finish and build your reading streak.
        </p>
        <router-link
          to="/explore"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#093A3F] text-white rounded-xl font-semibold hover:bg-[#0c4a50] transition"
        >
          Explore Books
        </router-link>
      </div>

      <!-- Reading History Table -->
      <div
        v-else
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-[#c5a050] rounded-full"></div>
            <h2 class="text-lg font-bold text-gray-900">All Reading Activity</h2>
          </div>
          <span class="text-sm text-gray-400">
            {{ readingHistory.length }} {{ readingHistory.length === 1 ? 'book' : 'books' }}
          </span>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th class="px-6 py-4">Book</th>
                <th class="px-6 py-4">Author</th>
                <th class="px-6 py-4">Progress</th>
                <th class="px-6 py-4">Last Read</th>
                <th class="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="item in readingHistory"
                :key="item.id || item.book?.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-11 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        v-if="item.book?.coverImageUrl"
                        :src="item.book.coverImageUrl"
                        :alt="item.book?.title"
                        class="w-full h-full object-cover"
                        @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-300"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                        >
                          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-sm line-clamp-1">
                        {{ item.book?.title || 'Untitled' }}
                      </p>
                      <p
                        v-if="item.chapter?.title"
                        class="text-xs text-gray-400 mt-0.5"
                      >
                        Ch. {{ item.chapter.chapterNumber }}: {{ item.chapter.title }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ item.book?.author?.name || 'Unknown Author' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="
                          (Number(item.percentageCompleted) || 0) >= 100
                            ? 'bg-green-500'
                            : 'bg-[#c5a050]'
                        "
                        :style="{ width: (Number(item.percentageCompleted) || 0) + '%' }"
                      ></div>
                    </div>
                    <span
                      class="text-xs font-bold"
                      :class="
                        (Number(item.percentageCompleted) || 0) >= 100
                          ? 'text-green-600'
                          : 'text-gray-500'
                      "
                    >
                      {{ Number(item.percentageCompleted) || 0 }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatDate(item.lastReadAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <router-link
                    :to="'/reading/' + (item.book?.id || item.id)"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#093A3F] hover:text-[#c5a050] transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {{ (Number(item.percentageCompleted) || 0) >= 100 ? 'Read Again' : 'Continue' }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden divide-y divide-gray-50">
          <div
            v-for="item in readingHistory"
            :key="item.id || item.book?.id"
            class="p-4 sm:p-5 flex gap-4"
          >
            <div class="w-12 h-[4.5rem] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                v-if="item.book?.coverImageUrl"
                :src="item.book.coverImageUrl"
                :alt="item.book?.title"
                class="w-full h-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-300"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 text-sm truncate">
                {{ item.book?.title || 'Untitled' }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ item.book?.author?.name || 'Unknown Author' }}
                <span v-if="item.chapter?.title">
                  · Ch. {{ item.chapter.chapterNumber }}
                </span>
              </p>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                  <div
                    class="h-full rounded-full"
                    :class="
                      (Number(item.percentageCompleted) || 0) >= 100
                        ? 'bg-green-500'
                        : 'bg-[#c5a050]'
                    "
                    :style="{ width: (Number(item.percentageCompleted) || 0) + '%' }"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-gray-400">
                  {{ Number(item.percentageCompleted) || 0 }}%
                </span>
                <span class="text-[10px] text-gray-400 ml-auto">
                  {{ formatDate(item.lastReadAt) }}
                </span>
              </div>
              <router-link
                :to="'/reading/' + (item.book?.id || item.id)"
                class="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#093A3F] hover:text-[#c5a050] transition-colors"
              >
                {{ (Number(item.percentageCompleted) || 0) >= 100 ? 'Read Again' : 'Continue Reading' }} →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  fetchMyReadingProgress,
  fetchMyStats,
} from "../../services/community";

interface ProgressItem {
  id: string;
  book?: {
    id: string;
    title: string;
    coverImageUrl?: string | null;
    author?: { name: string } | null;
  };
  chapter?: {
    id: string;
    title: string;
    chapterNumber: number;
  } | null;
  percentageCompleted: number;
  lastReadAt: string;
}

interface Stats {
  booksRead: number;
  currentStreak: number;
  totalPages: number;
  totalEntries: number;
  genres: { name: string; count: number; color: string; pct: number }[];
}

const readingHistory = ref<ProgressItem[]>([]);
const stats = ref<Stats | null>(null);
const loading = ref(true);
const errorMessage = ref("");

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fetchData = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [historyData, statsData] = await Promise.all([
      fetchMyReadingProgress(),
      fetchMyStats(),
    ]);

    readingHistory.value = Array.isArray(historyData) ? historyData : [];
    stats.value = statsData;
  } catch (e: any) {
    errorMessage.value =
      e?.response?.data?.message ||
      e?.message ||
      "Failed to load reading history.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
