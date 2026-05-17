<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h2 class="font-['Syne',sans-serif] text-[15px] font-bold text-[#1c3a2e]">Top Readers</h2>
      <div class="flex gap-1">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="$emit('tab-change', tab.key)"
          :class="[
            'text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150',
            activeTab === tab.key
              ? 'bg-[#1c3a2e] text-white'
              : 'text-[#868080] bg-white border border-black/[0.08] hover:border-[#c5a050]'
          ]"
        >{{ tab.label }}</button>
      </div>
    </div>

    <div class="bg-white border border-black/[0.08] rounded-2xl shadow-sm overflow-hidden">
      <div
        v-for="(reader, i) in sortedReaders" :key="reader.rank"
        :class="[
          'flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-black/[0.05] last:border-b-0 transition-colors',
          reader.isYou ? 'bg-[#fdf9f0]' : 'hover:bg-[#faf8f3]'
        ]"
      >
        <div class="w-7 text-center flex-none">
          <span v-if="i === 0" v-html="medalIcons.gold" class="block"></span>
          <span v-else-if="i === 1" v-html="medalIcons.silver" class="block"></span>
          <span v-else-if="i === 2" v-html="medalIcons.bronze" class="block"></span>
          <span v-else class="text-[13px] font-bold text-[#c0bbb2]">{{ reader.rank }}</span>
        </div>

        <div
          class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-none"
          :style="{ background: reader.color }"
        >{{ reader.initials }}</div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-[13px] font-semibold text-[#1c3a2e] truncate">{{ reader.name }}</p>
            <span v-if="reader.isYou" class="text-[9px] font-bold text-[#c5a050] bg-[#fdf4dc] px-1.5 py-0.5 rounded-md">YOU</span>
          </div>
        </div>

        <div class="text-right flex-none">
          <p class="text-[14px] font-bold font-['Syne',sans-serif] text-[#1c3a2e]">
            {{ statValue(reader) }}
          </p>
          <p class="text-[10px] text-[#c0bbb2]">{{ statLabel }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeaderboardTable',
  props: {
    readers: {
      type: Array,
      default: () => [
        { rank: 1, name: 'Dara Samnang', initials: 'DS', color: '#1c3a2e', books: 32, streak: 45, pages: 8400, isYou: false },
        { rank: 2, name: 'Leakna Rath', initials: 'LR', color: '#7a3d92', books: 28, streak: 38, pages: 7200, isYou: false },
        { rank: 3, name: 'Vutha Prak', initials: 'VP', color: '#3a5fa5', books: 24, streak: 12, pages: 6100, isYou: false },
        { rank: 4, name: 'Sophal Prak', initials: 'SP', color: '#c5a050', books: 18, streak: 12, pages: 4800, isYou: true },
        { rank: 5, name: 'Sokha Meas', initials: 'SM', color: '#0f6e56', books: 15, streak: 7, pages: 3900, isYou: false },
        { rank: 6, name: 'Chan Dara', initials: 'CD', color: '#1c3a2e', books: 12, streak: 5, pages: 3100, isYou: false },
        { rank: 7, name: 'Bopha Devi', initials: 'BD', color: '#7a3d92', books: 10, streak: 3, pages: 2600, isYou: false },
      ],
    },
    activeTab: { type: String, default: 'books' },
  },
  emits: ['tab-change'],
  data() {
    return {
      tabs: [
        { key: 'books', label: 'Books Read' },
        { key: 'streak', label: 'Longest Streak' },
        { key: 'pages', label: 'Pages Read' },
      ],
      medalIcons: {
        gold: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a050" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M12 13l-2.5 6 2.5-1 2.5 1-2.5-6z"/></svg>`,
        silver: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a8a8" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M12 13l-2.5 6 2.5-1 2.5 1-2.5-6z"/></svg>`,
        bronze: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cd7f32" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M12 13l-2.5 6 2.5-1 2.5 1-2.5-6z"/></svg>`,
      },
    }
  },
  computed: {
    sortedReaders() {
      const sorted = [...this.readers].sort((a, b) => this.statValue(b) - this.statValue(a))
      return sorted.map((r, i) => ({ ...r, rank: i + 1 }))
    },
    statLabel() {
      const map = { books: 'books', streak: 'days', pages: 'pages' }
      return map[this.activeTab] || 'books'
    },
  },
  methods: {
    statValue(r) {
      return r[this.activeTab] || 0
    },
  },
}
</script>
