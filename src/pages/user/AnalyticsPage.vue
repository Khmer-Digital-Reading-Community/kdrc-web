<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Users, Eye, BookOpen } from 'lucide-vue-next'
import Sidebar from '@/components/common/Sidebar.vue'
import Navbar from '@/components/common/Navbar.vue'
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview.vue'
import ReadingTrendChart from '@/components/analytics/ReadingTrendChart.vue'
import ChapterPerformance from '@/components/analytics/ChapterPerformance.vue'
import AudienceInsights from '@/components/analytics/AudienceInsights.vue'
import EngagementMetrics from '@/components/analytics/EngagementMetrics.vue'

const selectedPeriod = ref('month')
const periods = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
]

// Mock analytics data
const overviewStats = ref([
  {
    title: 'Total Readers',
    value: '12,450',
    change: '+12.5%',
    isPositive: true,
    icon: Users,
    color: 'bg-blue-50',
  },
  {
    title: 'Total Views',
    value: '84,530',
    change: '+8.2%',
    isPositive: true,
    icon: Eye,
    color: 'bg-green-50',
  },
  {
    title: 'Avg. Reading Time',
    value: '12m 45s',
    change: '-3.1%',
    isPositive: false,
    icon: TrendingUp,
    color: 'bg-purple-50',
  },
  {
    title: 'Engagement Rate',
    value: '68.5%',
    change: '+5.3%',
    isPositive: true,
    icon: BookOpen,
    color: 'bg-orange-50',
  },
])

const readingTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  views: [320, 450, 380, 520, 490, 610, 580],
  readers: [65, 95, 78, 110, 105, 130, 125],
}

const chapterPerformanceData = [
  {
    id: 1,
    title: 'Chapter 1: The Beginning',
    views: 2450,
    completionRate: 92,
    avgTime: 8.5,
    rating: 4.8,
    drop: -2.1,
  },
  {
    id: 2,
    title: 'Chapter 2: Rising Tension',
    views: 2180,
    completionRate: 85,
    avgTime: 9.2,
    rating: 4.6,
    drop: -7.3,
  },
  {
    id: 3,
    title: 'Chapter 3: Climax',
    views: 1920,
    completionRate: 78,
    avgTime: 10.1,
    rating: 4.9,
    drop: -12.4,
  },
  {
    id: 4,
    title: 'Chapter 4: Resolution',
    views: 1680,
    completionRate: 72,
    avgTime: 7.8,
    rating: 4.5,
    drop: -14.6,
  },
]

const audienceData = {
  demographics: [
    { label: '13-18 years', percentage: 25, color: 'bg-blue-500' },
    { label: '19-25 years', percentage: 35, color: 'bg-purple-500' },
    { label: '26-35 years', percentage: 25, color: 'bg-pink-500' },
    { label: '36+ years', percentage: 15, color: 'bg-amber-500' },
  ],
  topCountries: [
    { country: 'Cambodia', readers: 3450, percentage: 28 },
    { country: 'Thailand', readers: 2890, percentage: 23 },
    { country: 'Vietnam', readers: 2450, percentage: 20 },
    { country: 'Philippines', readers: 1870, percentage: 15 },
    { country: 'Indonesia', readers: 1690, percentage: 14 },
  ],
}

const engagementMetrics = ref([
  {
    title: 'Comments',
    value: 342,
    change: '+15.2%',
    isPositive: true,
  },
  {
    title: 'Bookmarks',
    value: 1240,
    change: '+22.8%',
    isPositive: true,
  },
  {
    title: 'Shares',
    value: 456,
    change: '+8.5%',
    isPositive: true,
  },
  {
    title: 'Bounce Rate',
    value: '24.3%',
    change: '-2.1%',
    isPositive: true,
  },
])
</script>

<template>
  <div class="relative flex h-screen overflow-hidden bg-[#F6F1E8]">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Sticky Navbar -->
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-3 sm:p-4 lg:p-6">
          <!-- Breadcrumb -->
          <div class="text-[11px] sm:text-sm uppercase tracking-[0.15em] text-gray-500 mb-6">
            Atelier >
            <span class="font-bold text-black"> Analytics </span>
          </div>

          <!-- Header with Period Selector -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-black mb-2">Analytics Dashboard</h1>
              <p class="text-gray-600 text-sm">Track your book performance and audience insights</p>
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

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
            <!-- Reading Trend Chart (spans 2 columns on large screens) -->
            <div class="lg:col-span-2">
              <ReadingTrendChart :data="readingTrendData" />
            </div>

            <!-- Engagement Metrics -->
            <div>
              <EngagementMetrics :metrics="engagementMetrics" />
            </div>
          </div>

          <!-- Chapter Performance -->
          <ChapterPerformance :chapters="chapterPerformanceData" />

          <!-- Audience Insights -->
          <AudienceInsights :audience="audienceData" />
        </div>
      </main>
    </div>
  </div>
</template>
