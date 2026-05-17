<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden
              bg-white border-t border-[#e0ddd6]
              safe-area-pb">
    <div class="flex items-stretch h-16">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="$emit('navigate', item.name)"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-0.5 relative',
          'transition-colors duration-150 group',
          activeNav === item.name ? 'text-[#1a3330]' : 'text-[#aaa]'
        ]"
      >
        <span
          v-if="activeNav === item.name"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#c8861a] rounded-b-full"
        ></span>

        <span
          :class="[
            'w-6 h-6 flex items-center justify-center transition-transform duration-150',
            activeNav === item.name ? 'scale-110' : 'group-active:scale-90'
          ]"
          v-html="item.icon"
        ></span>

        <span
          :class="[
            'text-[10px] font-medium tracking-wide leading-none',
            activeNav === item.name ? 'text-[#1a3330]' : 'text-[#aaa]'
          ]"
        >{{ item.name }}</span>

        <span
          v-if="item.badge"
          class="absolute top-2.5 right-[calc(50%-10px)] min-w-[16px] h-4
                 bg-[#c8861a] text-white text-[9px] font-medium leading-none
                 flex items-center justify-center rounded-full px-1"
        >{{ item.badge }}</span>
      </button>
    </div>

    <div class="h-safe-area-inset-bottom bg-white"></div>
  </nav>
</template>

<script>
export default {
  name: 'CommunityBottomNav',
  props: {
    activeNav: { type: String, default: 'Challenges' },
    isAuthenticated: { type: Boolean, default: false },
  },
  emits: ['navigate'],
  computed: {
    navItems() {
      const items = [
        {
          name: 'Challenges',
          badge: '2',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                 </svg>`,
        },
        {
          name: 'Leaderboard',
          badge: null,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                 </svg>`,
        },
      ]
      if (this.isAuthenticated) {
        items.splice(1, 0, {
          name: 'Achievements',
          badge: '5',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                 </svg>`,
        })
        items.push({
          name: 'My Stats',
          badge: null,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                 </svg>`,
        })
      }
      return items
    },
  },
}
</script>

<style scoped>
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0px); }
.h-safe-area-inset-bottom { height: env(safe-area-inset-bottom, 0px); }
</style>
