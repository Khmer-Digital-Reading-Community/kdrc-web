<template>
  <div class="flex-col gap-3.5">

    <!-- My stats -->
    <!-- <div class="grid grid-cols-2 gap-2">
      <div
        v-for="s in myStats" :key="s.label"
        class="bg-white border border-black/[0.08] rounded-xl px-3.5 py-3 text-center shadow-sm"
      >
        <p class="font-['Syne',sans-serif] text-[20px] font-bold text-[#1c3a2e] leading-none">{{ s.val }}</p>
        <p class="text-[10px] text-[#c0bbb2] mt-1">{{ s.label }}</p>
      </div>
    </div> -->

    <!-- Trending -->
    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3.5">
        <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">Trending</span>
        <button class="text-[11px] font-semibold text-[#c5a050] hover:opacity-70 transition-opacity">See all</button>
      </div>
      <div class="flex flex-col gap-2.5">
        <div
          v-for="(t, i) in trending" :key="t.tag"
          class="flex items-center gap-2.5 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <span :class="['text-[11px] font-bold min-w-[18px]', i === 0 ? 'text-[#c5a050]' : 'text-[#e0dbd0]']">
            {{ String(i+1).padStart(2,'0') }}
          </span>
          <div class="flex-1">
            <p class="text-[13px] font-semibold text-[#1c3a2e]">#{{ t.tag }}</p>
            <p class="text-[11px] text-[#c0bbb2]">{{ t.count }} posts</p>
          </div>
          <svg class="text-[#c0bbb2]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Writers to follow -->
    <div class="bg-white border border-black/[0.08] rounded-2xl p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3.5">
        <span class="font-['Syne',sans-serif] text-[14px] font-semibold text-[#1c3a2e]">Writers to follow</span>
        <button class="text-[11px] font-semibold text-[#c5a050] hover:opacity-70 transition-opacity">Discover</button>
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="w in writers" :key="w.name" class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold flex-none"
            :style="{ background: w.color }"
          >{{ w.initials }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-semibold text-[#1c3a2e] leading-none">{{ w.name }}</p>
            <p class="text-[11px] text-[#c0bbb2] mt-0.5">{{ w.genre }} · {{ w.followers }}</p>
          </div>
          <button
            @click="w.following = !w.following"
            :class="[
              'text-[12px] font-semibold min-w-[48px] px-2.5 py-1 rounded-lg border transition-all duration-150',
              w.following
                ? 'bg-[#1c3a2e] text-white border-[#1c3a2e]'
                : 'bg-transparent text-[#1c3a2e] border-black/[0.12] hover:bg-[#f5f1ea]'
            ]"
          >{{ w.following ? '✓' : '+' }}</button>
        </div>
      </div>
    </div>

    <!-- Reading challenge -->
    <!-- <div class="bg-[#1c3a2e] rounded-2xl p-4">
      <div class="flex gap-2.5 items-start mb-3.5">
        <svg width="16" height="16" class="text-white/60 mt-0.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 3l3.057-3 3.943 3.928 3.057-3L18 4.444l-3.057 3L18 11.39l-3.057 3-3.943-3.928-3.057 3L5 10.556l3.057-3L5 3z"/>
        </svg>
        <div>
          <p class="text-[13px] font-semibold text-white leading-none">2024 Reading Challenge</p>
          <p class="text-[11px] text-white/50 mt-0.5">14 of 24 books</p>
        </div>
      </div>
      <div class="h-1.5 bg-white/[0.12] rounded-full overflow-hidden mb-2.5">
        <div class="h-full bg-[#c5a050] rounded-full" style="width: 58%"></div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[12px] font-semibold text-[#c5a050]">58% complete</span>
        <button class="text-[11px] font-semibold text-white/80 bg-white/10 border border-white/[0.18]
                       px-3 py-1 rounded-lg hover:bg-white/20 transition-colors duration-150">
          Update
        </button>
      </div>
    </div> -->

  </div>
</template>

<script>
export default {
  name: 'CommunityRightSidebar',
  data() {
    return {
      myStats: [
        { val: '142', label: 'Followers' },
        { val: '38',  label: 'Following' },
        { val: '24',  label: 'Posts'     },
        { val: '1.2k',label: 'Likes'     },
      ],
      trending: [
        { tag: 'KhmerLit',         count: '1.2k' },
        { tag: 'BookReview',       count: '894'  },
        { tag: 'ReadingChallenge', count: '762'  },
        { tag: 'ClassicPoetry',    count: '541'  },
        { tag: 'NewChapter',       count: '489'  },
      ],
      writers: [
        { name: 'Dara Samnang', initials: 'DS', genre: 'Fiction',  followers: '2.1k', color: '#1c3a2e', following: false },
        { name: 'Leakna Rath',  initials: 'LR', genre: 'Poetry',   followers: '980',  color: '#7a3d92', following: false },
        { name: 'Vutha Prak',   initials: 'VP', genre: 'History',  followers: '1.4k', color: '#3a5fa5', following: true  },
        { name: 'Chan Dara',    initials: 'CD', genre: 'Essays',   followers: '630',  color: '#c5a050', following: false },
      ],
    }
  },
}
</script>