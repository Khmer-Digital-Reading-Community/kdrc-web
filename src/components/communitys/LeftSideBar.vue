<template>
  <aside class="sticky top-[70px] bg-[#f0ece4] border-r border-[#e0dbd0] flex flex-col gap-1">
    <div v-for="group in sidebar" :key="group.label" class="mb-2">
      <p class="text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase px-4 pb-1.5 pt-3">
        {{ group.label }}
      </p>
      <ul class="flex flex-col gap-0.5">
        <li
          v-for="item in group.items"
          :key="item.name"
          @click="$emit('navigate', item.name)"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium cursor-pointer transition-all duration-150 relative',
            activeNav === item.name
              ? 'bg-white/60 text-[#1c3a2e] font-semibold'
              : 'text-gray-500 hover:bg-white/40 hover:text-[#1c3a2e]'
          ]"
        >
          <span
            v-if="activeNav === item.name"
            class="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#c5a050] rounded-l-full"
          ></span>

          <span class="flex-none w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>

          <span class="flex-1">{{ item.name }}</span>

          <span
            v-if="item.count"
            :class="[
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-lg',
              activeNav === item.name
                ? 'bg-[#ede8dd] text-[#1c3a2e]'
                : 'bg-[#e0dbd0] text-gray-500'
            ]"
          >{{ item.count }}</span>
        </li>
      </ul>
    </div>

    <div class="h-px bg-[#e0dbd0] mx-4 my-1"></div>

    <div class="flex items-center gap-3 px-4 py-2">
      <div class="w-8 h-8 rounded-full bg-[#1c3a2e] text-[#c5a050] text-[11px] font-semibold flex items-center justify-center flex-none">
        SP
      </div>
      <div>
        <p class="text-[12px] font-semibold text-[#1c3a2e] leading-none">Sophal Prak</p>
        <p class="text-[11px] text-gray-500 mt-0.5">12-day streak 🔥</p>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CommunityLeftNav',
  props: { activeNav: { type: String, default: 'Challenges' } },
  emits: ['navigate'],
  data() {
    return {
      sidebar: [
        {
          label: 'Reading Journey',
          items: [
            {
              name: 'Challenges',
              count: '2',
              icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            },
            {
              name: 'Achievements',
              count: '5',
              icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
            },
          ],
        },
        {
          label: 'Community',
          items: [
            {
              name: 'Leaderboard',
              count: null,
              icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
            },
            {
              name: 'My Stats',
              count: null,
              icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
            },
          ],
        },
      ],
    }
  },
}
</script>
