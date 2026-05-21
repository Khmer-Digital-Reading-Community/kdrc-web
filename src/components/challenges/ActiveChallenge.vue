<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-[#1a3330]">Active Challenges</h3>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="c in activeChallenges" :key="c.id"
        class="bg-white border border-[#e0ddd6] rounded-xl p-5"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-none"
            :style="{ background: c.color }"
          >
            <span v-html="c.icon" class="text-white"></span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 class="text-sm font-medium text-[#1a3330]">{{ c.title }}</h3>
                <p class="text-[12px] text-[#8a8580] mt-0.5">{{ c.description }}</p>
              </div>
            </div>

            <div class="mt-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[12px] font-medium text-[#1a3330]">
                  {{ c.completedBooks }} / {{ c.targetBooks }} books
                </span>
                <span class="text-[11px] font-medium" :class="percentComplete(c) >= 100 ? 'text-green-700' : 'text-[#c8861a]'">
                  {{ percentComplete(c) }}%
                </span>
              </div>
              <div class="h-1.5 bg-[#e8e3dc] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500 ease-out"
                  :class="percentComplete(c) >= 100 ? 'bg-green-700' : 'bg-[#c8861a]'"
                  :style="{ width: percentComplete(c) + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex items-center justify-between mt-3 pt-3 border-t border-[#e0ddd6]">
              <span class="flex items-center gap-1.5 text-[11px] text-[#8a8580]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ c.daysLeft ? c.daysLeft + ' days remaining' : 'No deadline' }}
              </span>

              <button
                class="text-[12px] font-medium px-4 py-1.5 rounded-lg bg-[#1a3330] text-white hover:bg-[#142c22] transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActiveChallenge',
  props: {
    challenges: {
      type: Array,
      default: () => [
        {
          id: 1, title: '2025 Reading Challenge', description: 'Read 24 books this year.',
          targetBooks: 24, completedBooks: 8, daysLeft: 229,
          joined: true, color: '#1a3330',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
        },
        {
          id: 2, title: 'Khmer Literature Explorer', description: 'Discover 5 Khmer literary works.',
          targetBooks: 5, completedBooks: 2, daysLeft: null,
          joined: true, color: '#c8861a',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
        },
      ],
    },
  },
  computed: {
    activeChallenges() {
      return this.challenges.filter(c => c.joined)
    },
  },
  methods: {
    percentComplete(c) {
      return Math.round((c.completedBooks / c.targetBooks) * 100)
    },
  },
}
</script>
