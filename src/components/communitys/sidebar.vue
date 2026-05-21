<template>
  <div class="flex-col gap-3.5">

    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="s in miniStats" :key="s.label"
        class="bg-white border border-black/[0.08] rounded-xl px-3.5 py-3 text-center shadow-sm"
      >
        <p class="font-['Syne',sans-serif] text-[20px] font-bold text-[#1c3a2e] leading-none">{{ s.val }}</p>
        <p class="text-[10px] text-[#c0bbb2] mt-1">{{ s.label }}</p>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">My Challenges</span>
        <span class="text-[11px] font-semibold text-[#c5a050]">2 active</span>
      </div>
      <div class="flex flex-col gap-2.5">
        <div v-for="c in challenges" :key="c.title" class="flex items-center gap-2.5">
          <span v-html="c.icon" class="flex-none text-[#1c3a2e]"></span>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-semibold text-[#1c3a2e] truncate">{{ c.title }}</p>
            <p class="text-[10px] text-[#c0bbb2] mt-0.5">{{ c.progress }}</p>
            <div class="h-1.5 bg-[#f0ece4] rounded-full overflow-hidden mt-1">
              <div
                class="h-full bg-[#c5a050] rounded-full"
                :style="{ width: c.pct + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">Recent Badges</span>
        <button class="text-[11px] font-semibold text-[#c5a050] hover:opacity-70 transition-opacity">See all</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="b in recentBadges" :key="b.name"
          class="flex items-center gap-1.5 bg-[#f5f1ea] rounded-full px-2.5 py-1"
        >
          <span v-html="b.icon" class="flex-none text-[#1c3a2e]"></span>
          <span class="text-[10px] font-medium text-[#1c3a2e]">{{ b.name }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c5a050" stroke-width="1.8">
            <circle cx="12" cy="8" r="5"/><path d="M12 13l-2.5 6 2.5-1 2.5 1-2.5-6z"/>
          </svg>
          <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">Top Readers</span>
        </div>
        <button class="text-[11px] font-semibold text-[#c5a050] hover:opacity-70 transition-opacity">Full board</button>
      </div>
      <div class="flex flex-col gap-2.5">
        <div
          v-for="(r, i) in topReaders" :key="r.name"
          class="flex items-center gap-2"
        >
          <span
            class="text-[11px] font-bold min-w-[16px]"
            :class="i === 0 ? 'text-[#c5a050]' : i === 1 ? 'text-[#a8a8a8]' : i === 2 ? 'text-[#cd7f32]' : 'text-[#e0dbd0]'"
          >{{ '#' + (i+1) }}</span>
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-none"
            :style="{ background: r.color }"
          >{{ r.initials }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-semibold text-[#1c3a2e] truncate">{{ r.name }}</p>
          </div>
          <span class="text-[11px] font-bold text-[#c5a050]">{{ r.books }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CommunityRightSidebar',
  data() {
    return {
      miniStats: [
        { val: '18', label: 'Books' },
        { val: '12', label: 'Day Streak' },
        { val: '4.8k', label: 'Pages' },
        { val: '5', label: 'Badges' },
      ],
      challenges: [
        {
          title: '2025 Reading Challenge', progress: '8/24 books', pct: 33,
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
        },
        {
          title: 'Khmer Lit Explorer', progress: '2/5 books', pct: 40,
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
        },
      ],
      recentBadges: [
        { name: 'First Chapter', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>` },
        { name: '7-Day Streak', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
        { name: 'Bookworm', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path stroke-linecap="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>` },
        { name: 'Reviewer', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>` },
      ],
      topReaders: [
        { name: 'Dara Samnang', initials: 'DS', color: '#1c3a2e', books: 32 },
        { name: 'Leakna Rath', initials: 'LR', color: '#7a3d92', books: 28 },
        { name: 'Vutha Prak', initials: 'VP', color: '#3a5fa5', books: 24 },
        { name: 'Sophal Prak', initials: 'SP', color: '#c5a050', books: 18, isYou: true },
      ],
    }
  },
}
</script>
