<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-[#1a3330]">Available Challenges</h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div
        v-for="c in availableChallenges" :key="c.id"
        class="bg-white border border-[#e0ddd6] rounded-xl p-5 flex flex-col"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-none"
            :style="{ background: c.color }"
          >
            <span v-html="c.icon" class="text-white"></span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-[14px] font-medium text-[#1a3330] truncate">{{ c.title }}</h3>
            <p class="text-[11px] text-[#8a8580]">{{ c.targetBooks }} books · {{ c.daysLeft ? c.daysLeft + ' days' : 'No deadline' }}</p>
          </div>
        </div>

        <p class="text-[12px] text-[#8a8580] leading-relaxed mb-4 flex-1">{{ c.description }}</p>

        <div class="flex items-center gap-2 pt-3 border-t border-[#e0ddd6]">
          <div class="flex-1">
            <div class="flex items-center gap-1 text-[11px] text-[#8a8580]">
              <span>{{ c.completedBooks }}/{{ c.targetBooks }} books</span>
            </div>
          </div>
          <button
            @click="$emit('join', c)"
            class="text-[12px] font-medium px-4 py-1.5 rounded-lg border border-[#1a3330] text-[#1a3330]
                   hover:bg-[#1a3330] hover:text-white transition-colors"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChallengeGrid',
  props: {
    challenges: {
      type: Array,
      default: () => [
        {
          id: 3, title: 'Poetry Month', description: 'Read 3 poetry collections in 30 days.',
          targetBooks: 3, completedBooks: 0, daysLeft: 45,
          joined: false, color: '#7a3d92',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M11 5h2m-1 14V5m0 0L7 9m4-4l4 4"/></svg>`,
        },
        {
          id: 4, title: 'Classics Revisited', description: 'Read 5 classic works from our heritage collection.',
          targetBooks: 5, completedBooks: 0, daysLeft: null,
          joined: false, color: '#3a5fa5',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
        },
        {
          id: 5, title: 'Short Story Sprint', description: 'Read 10 short stories in one month.',
          targetBooks: 10, completedBooks: 0, daysLeft: 60,
          joined: false, color: '#0f6e56',
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
        },
      ],
    },
  },
  emits: ['join'],
  computed: {
    availableChallenges() {
      return this.challenges.filter(c => !c.joined)
    },
  },
}
</script>
