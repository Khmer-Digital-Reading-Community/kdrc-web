<template>
  <div class="flex flex-col gap-3">

    <!-- Loading -->
    <div v-if="loading" class="bg-white border border-black/[0.08] rounded-2xl p-6 text-center">
      <div class="inline-block w-6 h-6 border-2 border-[#1c3a2e] border-t-transparent rounded-full animate-spin mb-2" />
      <p class="text-[12px] text-[#868080]">Loading stats...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-white border border-red-200 rounded-2xl p-4 text-center">
      <p class="text-[12px] text-red-600">{{ error }}</p>
      <button @click="load" class="mt-2 text-[11px] font-medium text-[#1c3a2e] underline">Retry</button>
    </div>

    <template v-else>
      <!-- Stat cards row — compact -->
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="s in statCards" :key="s.label"
          class="bg-white border border-black/[0.06] rounded-xl px-3 py-2.5 text-center shadow-sm"
        >
          <p class="text-[18px] font-bold text-[#1c3a2e] leading-none">{{ s.value }}</p>
          <p class="text-[10px] text-[#868080] mt-1">{{ s.label }}</p>
        </div>
      </div>

      <!-- GitHub-style activity heatmap -->
      <div class="bg-white border border-black/[0.06] rounded-xl px-4 py-3 shadow-sm">
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="text-[12px] font-bold text-[#1c3a2e] tracking-tight">Reading Activity</h3>
          <span class="text-[10px] font-semibold text-[#c5a050]">
            {{ streakDisplay }}
          </span>
        </div>

        <!-- Day-of-week labels + graph -->
        <div class="flex gap-0.5">
          <!-- Side day labels -->
          <div class="flex flex-col gap-0.5 pr-1 pt-[1px]">
            <div
              v-for="(day, i) in ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']"
              :key="i"
              class="h-[11px] text-[8px] text-[#a09890] leading-[11px]"
            >{{ day }}</div>
          </div>
          <!-- Graph columns (one per week) -->
          <div class="flex gap-0.5 overflow-x-auto pb-0.5">
            <div v-for="(week, wi) in weeks" :key="wi" class="flex flex-col gap-0.5">
              <div
                v-for="(day, di) in week" :key="di"
                :title="`${day.date}: ${day.count} entries`"
                class="w-[11px] h-[11px] rounded-[2px]"
                :class="cellColor(day.count)"
              />
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-black/[0.04]">
          <span class="text-[8px] text-[#a09890]">Less</span>
          <div v-for="l in 5" :key="l" class="w-[10px] h-[10px] rounded-[2px]" :class="levelClass(l - 1)" />
          <span class="text-[8px] text-[#a09890]">More</span>
        </div>
      </div>

      <!-- Genre Breakdown — compact -->
      <div class="bg-white border border-black/[0.06] rounded-xl px-4 py-3 shadow-sm">
        <h3 class="text-[12px] font-bold text-[#1c3a2e] mb-2.5">Genres</h3>
        <div v-if="!genres.length" class="text-[11px] text-[#a09890] text-center py-2">
          No reading data yet.
        </div>
        <div v-else class="flex flex-col gap-1.5">
          <div v-for="g in genres" :key="g.name" class="flex items-center gap-2">
            <span class="text-[11px] text-[#1c3a2e] min-w-[64px] truncate">{{ g.name }}</span>
            <div class="flex-1 h-1.5 bg-[#f0ece4] rounded-full overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: g.pct + '%', background: g.color }" />
            </div>
            <span class="text-[10px] font-semibold text-[#868080] min-w-[20px] text-right">{{ g.count }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { fetchMyStats, fetchMyActivity } from '../../services/community'

export default {
  name: 'MyStats',
  props: {
    statsData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      error: null,
      stats: { booksRead: 0, currentStreak: 0, totalPages: 0, totalEntries: 0, genres: [] },
      weeks: [],
    }
  },
  computed: {
    statCards() {
      const s = this.stats
      return [
        { value: String(s.booksRead || 0), label: 'Books' },
        { value: String(s.currentStreak || 0), label: 'Streak' },
        { value: this.fmt(s.totalPages || 0), label: 'Pages' },
        { value: String(s.totalEntries || 0), label: 'Sessions' },
      ]
    },
    streakDisplay() {
      const s = this.stats.currentStreak || 0
      return s > 0 ? s + '-day streak' : 'No streak'
    },
    genres() {
      return this.stats.genres || []
    },
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = null
      try {
        const [stats, activity] = await Promise.all([
          fetchMyStats(),
          fetchMyActivity(),
        ])
        this.stats = { ...this.stats, ...stats }
        this.weeks = activity?.weeks || []
      } catch (e) {
        this.error = e.message || 'Failed to load stats'
      }
      this.loading = false
    },
    cellColor(count) {
      if (count === 0) return 'bg-[#f0ece4]'
      if (count <= 1) return 'bg-[#d4e8d8]'
      if (count <= 3) return 'bg-[#8fc99e]'
      if (count <= 6) return 'bg-[#3d8c5a]'
      return 'bg-[#1c3a2e]'
    },
    levelClass(i) {
      const levels = ['bg-[#f0ece4]', 'bg-[#d4e8d8]', 'bg-[#8fc99e]', 'bg-[#3d8c5a]', 'bg-[#1c3a2e]']
      return levels[i]
    },
    fmt(n) {
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
      return String(n)
    },
  },
}
</script>
