<template>
  <div class="flex flex-col gap-3">

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="s in computedStats" :key="s.label"
        class="bg-white border border-black/[0.08] rounded-xl px-4 py-3.5 text-center shadow-sm"
      >
        <p class="text-[22px] font-bold font-['Syne',sans-serif] text-[#1c3a2e] leading-none">{{ s.value }}</p>
        <p class="text-[11px] text-[#c0bbb2] mt-1.5">{{ s.label }}</p>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-['Syne',sans-serif] text-[14px] font-bold text-[#1c3a2e]">Reading Activity</h3>
        <span class="flex items-center gap-1.5 text-[11px] font-semibold text-[#c5a050]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          {{ streakDisplay }}
        </span>
      </div>

      <div class="flex items-center gap-1 mb-2">
        <div
          v-for="day in weekDays" :key="day"
          class="flex-1 text-center text-[10px] font-semibold text-[#c0bbb2] uppercase tracking-wide"
        >{{ day }}</div>
      </div>

      <div class="flex flex-col gap-1">
        <div v-for="(week, wi) in calendarWeeks" :key="wi" class="flex items-center gap-1">
          <div
            v-for="(day, di) in week" :key="di"
            :title="day.label"
            class="flex-1 aspect-square rounded-md flex items-center justify-center text-[9px] font-medium transition-colors duration-100"
            :class="dayColor(day.value)"
          >
            <span v-if="day.value > 0" class="text-white/80">{{ day.value }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-black/[0.05]">
        <span class="text-[10px] text-[#c0bbb2]">Less</span>
        <div v-for="l in levels" :key="l" class="w-3 h-3 rounded-sm" :class="l"></div>
        <span class="text-[10px] text-[#c0bbb2]">More</span>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm">
      <h3 class="font-['Syne',sans-serif] text-[14px] font-bold text-[#1c3a2e] mb-3">Genre Breakdown</h3>
      <div class="flex flex-col gap-2.5">
        <div v-for="g in genres" :key="g.name" class="flex items-center gap-3">
          <span class="text-[12px] font-medium text-[#1c3a2e] min-w-[80px]">{{ g.name }}</span>
          <div class="flex-1 h-2 bg-[#f0ece4] rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :style="{ width: g.pct + '%', background: g.color }"
            ></div>
          </div>
          <span class="text-[11px] font-semibold text-[#868080] min-w-[30px] text-right">{{ g.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyStats',
  props: {
    statsData: {
      type: Object,
      default: () => ({ booksRead: 0, currentStreak: 0, totalPages: 0 }),
    },
  },
  data() {
    return {
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      levels: ['bg-[#f0ece4]', 'bg-[#d4e8d8]', 'bg-[#8fc99e]', 'bg-[#3d8c5a]', 'bg-[#1c3a2e]'],
      genres: [
        { name: 'Fiction', pct: 38, count: 7, color: '#1c3a2e' },
        { name: 'Non-Fiction', pct: 22, count: 4, color: '#3a5fa5' },
        { name: 'Poetry', pct: 17, count: 3, color: '#7a3d92' },
        { name: 'History', pct: 12, count: 2, color: '#c5a050' },
        { name: 'Science', pct: 11, count: 2, color: '#0f6e56' },
      ],
    }
  },
  computed: {
    computedStats() {
      return [
        { value: String(this.statsData.booksRead || 0), label: 'Books Read' },
        { value: String(this.statsData.currentStreak || 0), label: 'Day Streak' },
        { value: this.formatNumber(this.statsData.totalPages || 0), label: 'Pages Read' },
        { value: String(this.statsData.totalEntries || 0), label: 'Reading Sessions' },
      ]
    },
    streakDisplay() {
      const s = this.statsData.currentStreak || 0
      return s + '-day streak'
    },
    calendarWeeks() {
      const weeks = []
      const today = new Date()
      const start = new Date(today)
      start.setDate(start.getDate() - 55)
      start.setDate(start.getDate() - start.getDay() + 1)

      for (let w = 0; w < 8; w++) {
        const week = []
        for (let d = 0; d < 7; d++) {
          const date = new Date(start)
          date.setDate(date.getDate() + w * 7 + d)
          const isToday = date.toDateString() === today.toDateString()
          const val = Math.random()
          const pages = val < 0.3 ? 0 : Math.floor(Math.random() * 60) + 10
          week.push({
            label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + (isToday ? ' (Today)' : ''),
            value: isToday ? 45 : pages,
            isToday,
          })
        }
        weeks.push(week)
      }
      return weeks
    },
  },
  methods: {
    formatNumber(n) {
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
      return String(n)
    },
    dayColor(val) {
      if (val === 0) return 'bg-[#f0ece4]'
      if (val < 15) return 'bg-[#d4e8d8]'
      if (val < 30) return 'bg-[#8fc99e]'
      if (val < 50) return 'bg-[#3d8c5a]'
      return 'bg-[#1c3a2e]'
    },
  },
}
</script>
