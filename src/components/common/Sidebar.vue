<template>
  <div>
    <!-- Mobile hamburger toggle -->
    <button
      @click="mobileOpen = !mobileOpen"
      class="lg:hidden fixed top-10 left-4 z-50 p-2 rounded-lg bg-[#1c3a2e] text-white shadow-lg transition-colors hover:bg-[#c5a050]"
    >
      <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile backdrop -->
    <div
      v-if="mobileOpen"
      @click="mobileOpen = false"
      class="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'flex flex-col h-screen bg-[#f0ece4] border-r border-[#e0dbd0] transition-all duration-300 ease-in-out relative z-50',
        isMobile ? 'fixed top-0 left-0 w-[260px]' : (collapsed ? 'w-[64px]' : 'w-[200px]')
      ]"
      :style="isMobile ? { transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' } : {}"
    >
      <!-- Top: Logo + Hamburger -->
      <div class="flex items-center justify-between px-4 py-5 border-b border-[#e0dbd0]">
        <div class="flex items-center gap-2 overflow-hidden">
          <div class="flex-none w-7 h-7 bg-[#1c3a2e] rounded-md flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span
            v-if="!collapsed"
            class="font-['Playfair_Display'] font-bold text-[16px] text-[#1c3a2e] whitespace-nowrap"
          >
            KDRC
          </span>
        </div>
        <button
          v-if="!isMobile"
          @click="collapsed = !collapsed"
          class="flex-none text-gray-400 hover:text-[#1c3a2e] transition-colors duration-200 ml-1"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          v-else
          @click="mobileOpen = false"
          class="flex-none text-gray-400 hover:text-[#1c3a2e] transition-colors duration-200 ml-1"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Nav Sections -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col gap-5">

        <div v-for="section in navSections" :key="section.group">
          <!-- Group Label -->
          <p
            v-if="!collapsed"
            class="text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase px-4 mb-2"
          >
            {{ section.group }}
          </p>
          <div v-else class="border-t border-[#e0dbd0] mx-3 mb-2"></div>

          <!-- Nav Items -->
          <ul class="flex flex-col gap-0.5">
            <li v-for="item in section.items" :key="item.label">
              <button
                @click="setActive(item)"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-left relative transition-all duration-150 group',
                  activeItem === item.label
                    ? 'text-[#1c3a2e] font-semibold bg-white/60'
                    : 'text-gray-500 hover:text-[#1c3a2e] hover:bg-white/40'
                ]"
              >
                <!-- Active indicator bar -->
                <span
                  v-if="activeItem === item.label"
                  class="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#c5a050] rounded-l-full"
                ></span>

                <!-- Icon -->
                <span class="flex-none w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>

                <!-- Label -->
                <span
                  v-if="!collapsed"
                  class="text-[13px] whitespace-nowrap overflow-hidden"
                >
                  {{ item.label }}
                </span>

                <!-- Tooltip on collapsed -->
                <div
                  v-if="collapsed && !isMobile"
                  class="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1c3a2e] text-white text-[12px]
                         font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none
                         group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg"
                >
                  {{ item.label }}
                  <span class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1c3a2e]"></span>
                </div>
              </button>
            </li>
          </ul>
        </div>

      </nav>

      <!-- New Draft CTA -->
      <div class="p-3 border-t border-[#e0dbd0]">
        <button
          :class="[
            'w-full bg-[#1c3a2e] text-white font-semibold rounded-xl transition-all duration-200',
            'hover:bg-[#c5a050] flex items-center justify-center gap-2',
            collapsed && !isMobile ? 'p-3' : 'px-4 py-3 text-[13px]'
          ]"
        >
          <svg class="w-4 h-4 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span v-if="!collapsed">New Draft</span>
        </button>
      </div>

    </aside>
  </div>
</template>

<script>
export default {
  name: 'DashboardSidebar',

  data() {
    return {
      collapsed: false,
      activeItem: 'Earning',
      mobileOpen: false,
      isMobile: false,

      navSections: [
        {
          group: 'Core',
          items: [
            {
              label: 'Dashboard',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor"/>
                       <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor"/>
                       <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor"/>
                       <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor"/>
                     </svg>`,
            },
            {
              label: 'Manuscripts',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                     </svg>`,
            },
            {
              label: 'Exchange',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                     </svg>`,
            },
          ],
        },
        {
          group: 'Growth',
          items: [
            {
              label: 'Analytics',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                     </svg>`,
            },
            {
              label: 'Earning',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                     </svg>`,
            },
          ],
        },
        {
          group: 'History',
          items: [
            {
              label: 'Archive',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                     </svg>`,
            },
            {
              label: 'Reports',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                     </svg>`,
            },
          ],
        },
        {
          group: 'Utility',
          items: [
            {
              label: 'Plan and Billing',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                     </svg>`,
            },
            {
              label: 'Settings',
              icon: `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                       <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                     </svg>`,
            },
          ],
        },
      ],
    }
  },

  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },

  watch: {
    isMobile(val) {
      if (val) {
        this.mobileOpen = false
      }
    },
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 1024
    },

    setActive(item) {
      this.activeItem = item.label
      this.mobileOpen = false
      this.$emit('navigate', item.label)
    },
  },
}
</script>