<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h2 class="font-['Syne',sans-serif] text-[15px] font-bold text-[#1c3a2e]">All Badges</h2>
      <div class="flex gap-1 overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in categories" :key="tab"
          @click="activeCategory = tab"
          :class="[
            'text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150',
            activeCategory === tab
              ? 'bg-[#1c3a2e] text-white'
              : 'text-[#868080] bg-white border border-black/[0.08] hover:border-[#c5a050]'
          ]"
        >{{ tab }}</button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div
        v-for="badge in filteredBadges" :key="badge.id"
        :class="[
          'bg-white border rounded-2xl p-4 text-center transition-all duration-200',
          badge.earned
            ? 'border-black/[0.08] shadow-sm hover:shadow-md'
            : 'border-black/[0.04] opacity-55'
        ]"
      >
        <div class="mb-3 flex justify-center" :class="badge.earned ? '' : 'grayscale'">
          <span v-html="badge.icon" class="block" :style="{ color: badge.earned ? badge.color : '#c0bbb2' }"></span>
        </div>
        <p class="font-['Syne',sans-serif] text-[13px] font-bold text-[#1c3a2e]">{{ badge.name }}</p>
        <p class="text-[11px] text-[#868080] mt-0.5 leading-tight">{{ badge.description }}</p>
        <p v-if="badge.earned && badge.date" class="text-[10px] text-[#c5a050] font-semibold mt-2">
          Earned {{ badge.date }}
        </p>
        <p v-else class="text-[10px] text-[#c0bbb2] font-medium mt-2">Not yet earned</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AchievementsGrid',
  props: {
    achievements: {
      type: Array,
      default: () => [
        { id: 1, name: 'First Chapter', description: 'Read your first book', earned: true, date: 'Jan 15, 2025', category: 'Milestone', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>` },
        { id: 2, name: 'Bookworm', description: 'Read 10 books', earned: true, date: 'Mar 3, 2025', category: 'Milestone', color: '#1c3a2e',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path stroke-linecap="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>` },
        { id: 3, name: 'Bibliophile', description: 'Read 25 books', earned: false, date: null, category: 'Milestone', color: '#1c3a2e',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v12c0 .552.224 1.052.586 1.414C4.964 20.776 5.464 21 6 21h14M4 7c0-.552.224-1.052.586-1.414C4.964 5.224 5.464 5 6 5h14v14H6c-.536 0-1.036-.224-1.414-.586C4.224 18.052 4 17.552 4 17z"/></svg>` },
        { id: 4, name: '7-Day Streak', description: 'Read 7 days in a row', earned: true, date: 'Feb 20, 2025', category: 'Streak', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
        { id: 5, name: '30-Day Streak', description: 'Read 30 days in a row', earned: false, date: null, category: 'Streak', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
        { id: 6, name: 'Khmer Lit Enthusiast', description: 'Read 5 Khmer books', earned: true, date: 'Apr 2, 2025', category: 'Genre', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>` },
        { id: 7, name: 'Poetry Lover', description: 'Read 3 poetry collections', earned: false, date: null, category: 'Genre', color: '#7a3d92',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" d="M11 5h2m-1 14V5m0 0L7 9m4-4l4 4"/></svg>` },
        { id: 8, name: 'History Buff', description: 'Read 3 historical works', earned: false, date: null, category: 'Genre', color: '#3a5fa5',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>` },
        { id: 9, name: 'Reviewer', description: 'Write 10 reviews', earned: true, date: 'Mar 28, 2025', category: 'Contribution', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>` },
        { id: 10, name: 'Community Voice', description: 'Write 50 reviews', earned: false, date: null, category: 'Contribution', color: '#c5a050',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>` },
        { id: 11, name: 'Night Owl', description: 'Read after midnight 10 times', earned: false, date: null, category: 'Special', color: '#3a5fa5',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>` },
        { id: 12, name: 'Weekend Reader', description: 'Read on 10 weekends', earned: true, date: 'Apr 10, 2025', category: 'Special', color: '#0f6e56',
          icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>` },
      ],
    },
  },
  data() {
    return {
      activeCategory: 'All',
    }
  },
  computed: {
    categories() {
      const cats = ['All', ...new Set(this.achievements.map(a => a.category))]
      return cats
    },
    filteredBadges() {
      if (this.activeCategory === 'All') return this.achievements
      return this.achievements.filter(a => a.category === this.activeCategory)
    },
  },
}
</script>
