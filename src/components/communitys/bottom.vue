<template>
  <!-- Only visible on lg and below -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 lg:hidden
              bg-white/95 backdrop-blur-md border-t border-black/[0.08]
              safe-area-pb">

    <div class="flex items-stretch h-16">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="$emit('navigate', item.name)"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-0.5 relative',
          'transition-colors duration-150 group',
          activeNav === item.name ? 'text-[#1c3a2e]' : 'text-[#999]'
        ]"
      >
        <!-- Active indicator -->
        <span
          v-if="activeNav === item.name"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#c5a050] rounded-b-full"
        ></span>

        <!-- Icon -->
        <span
          :class="[
            'w-6 h-6 flex items-center justify-center transition-transform duration-150',
            activeNav === item.name ? 'scale-110' : 'group-active:scale-90'
          ]"
          v-html="item.icon"
        ></span>

        <!-- Label -->
        <span
          :class="[
            'text-[10px] font-semibold tracking-wide leading-none',
            activeNav === item.name ? 'text-[#1c3a2e]' : 'text-[#aaa]'
          ]"
        >{{ item.name }}</span>

        <!-- Badge dot -->
        <span
          v-if="item.badge"
          class="absolute top-2.5 right-[calc(50%-10px)] min-w-[16px] h-4
                 bg-[#c5a050] text-white text-[9px] font-bold leading-none
                 flex items-center justify-center rounded-full px-1"
        >{{ item.badge }}</span>
      </button>
    </div>

    <!-- iOS safe area spacer -->
    <div class="h-safe-area-inset-bottom bg-white"></div>
  </nav>
</template>

<script>
export default {
  name: 'CommunityBottomNav',
  props: {
    activeNav: { type: String, default: 'Feed' },
  },
  emits: ['navigate'],
  data() {
    return {
      navItems: [
        {
          name: 'Feed',
          badge: null,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round"
                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                 </svg>`,
        },
        {
          name: 'My Posts',
          badge: '12',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round"
                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                 </svg>`,
        },
        {
          name: 'Saved',
          badge: null,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round"
                     d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z"/>
                 </svg>`,
        },
        {
          name: 'Genres',
          badge: null,
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round"
                     d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                 </svg>`,
        },
        {
          name: 'Following',
          badge: '38',
          icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                   <path stroke-linecap="round" stroke-linejoin="round"
                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                 </svg>`,
        },
      ],
    }
  },
}
</script>

<style scoped>
/* iOS safe area support */
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0px); }
.h-safe-area-inset-bottom { height: env(safe-area-inset-bottom, 0px); }
</style>