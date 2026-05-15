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
          <!-- Gold right indicator -->
          <span
            v-if="activeNav === item.name"
            class="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#c5a050] rounded-l-full"
          ></span>

          <!-- Icon -->
          <span class="flex-none w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>

          <!-- Label -->
          <span class="flex-1">{{ item.name }}</span>

          <!-- Count badge -->
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

    <!-- Divider -->
    <div class="h-px bg-[#e0dbd0] mx-4 my-1"></div>

    <!-- Mini profile -->
    <div class="flex items-center gap-3 px-4 py-2">
      <div class="w-8 h-8 rounded-full bg-[#1c3a2e] text-[#c5a050] text-[11px] font-semibold flex items-center justify-center flex-none">
        SP
      </div>
      <div>
        <p class="text-[12px] font-semibold text-[#1c3a2e] leading-none">Sophal Prak</p>
        <p class="text-[11px] text-gray-500 mt-0.5">Writer · 142 followers</p>
      </div>
    </div>

  </aside>
</template>

<script>
export default {
  name: 'CommunityLeftNav',
  props: { activeNav: { type: String, default: 'Feed' } },
  emits: ['navigate'],
  data() {
    return {
      sidebar: [
        {
          label: 'My Space',
          items: [
            { name: 'Feed',      count: null, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` },
            { name: 'My Posts',  count: '12', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>` },
            { name: 'Saved',     count: '7',  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z"/></svg>` },
            { name: 'Following', count: '38', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>` },
          ],
        },
        {
          label: 'Explore',
          items: [
            { name: 'Genres',  count: null, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>` },
            { name: 'Authors', count: null, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>` },
            { name: 'Events',  count: '2',  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>` },
          ],
        },
      ],
    }
  },
}
</script>