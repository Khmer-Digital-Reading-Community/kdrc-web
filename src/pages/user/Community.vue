<template>
  <div class="min-h-screen bg-[#faf8f3] flex">

    <!-- ── LEFT SIDEBAR ─────────────────────────────────────────────── -->
    <CommunitySidebar
      :liveActivities="liveActivities"
      :topContributors="topContributors"
    />

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="flex-1 px-10 py-8">

      <!-- Header -->
      <div class="flex items-start justify-between mb-8">
        <div class="border-l-4 border-[#c5a050] pl-5">
          <div class="font-['Playfair_Display'] text-[42px] font-bold text-[#1c3a2e] leading-none">
            Community
          </div>
          <div class="font-['Playfair_Display'] text-[42px] font-bold italic text-gray-400 leading-none">
            Bookshelf.
          </div>
          <p class="text-[14px] text-gray-500 mt-3 leading-relaxed max-w-[480px]">
            Connecting Cambodia's literary community. Browse
            <span class="font-bold text-gray-800">1,240 verified copies</span>
            shared near you.
          </p>
        </div>
        <button
          class="flex items-center gap-2 bg-[#1c3a2e] text-white text-[13px] font-semibold
                 px-5 py-3 rounded-xl hover:bg-[#c5a050] transition-colors duration-200 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Post a Book
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 mb-8 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          @click="activeTab = tab.label"
          :class="[
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 border',
            activeTab === tab.label
              ? 'bg-[#c5a050] text-white border-[#c5a050] shadow-sm'
              : 'bg-white text-gray-600 border-[#e8e4dc] hover:border-[#c5a050] hover:text-[#c5a050]'
          ]"
        >
          <span v-if="tab.icon" v-html="tab.icon" class="w-3.5 h-3.5"></span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Book Grid -->
      <div class="grid grid-cols-3 gap-6">
        <BookCard
          v-for="(book, index) in filteredBooks"
          :key="book.id"
          :book="book"
          :index="index"
        />
      </div>

      <!-- Explore All -->
      <div class="flex justify-end mt-10">
        <a
          href="#"
          class="flex items-center gap-1.5 text-[#c5a050] text-[14px] font-bold
                 hover:gap-3 transition-all duration-200"
        >
          Explore All
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

    </main>
  </div>
</template>

<script>
import CommunitySidebar from '@/components/communitys/CommunitySidebar.vue'
import BookCard from '@/components/communitys/BookCard.vue'

export default {
  name: 'CommunityBookshelf',

  components: {
    CommunitySidebar,
    BookCard
  },

  data() {
    return {
      activeTab: 'All Books',

      tabs: [
        { label: 'All Books', icon: null },
        { label: 'Exchange', icon: null },
        { label: 'Lend Temporarily', icon: null },
        { label: 'Buy Second-Hand', icon: null },
        {
          label: 'Phnom Penh',
          icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
        },
      ],

      liveActivities: [
        { id: 1, user: 'Socheata P.', type: 'SWAP', ago: '2M AGO' },
        { id: 2, user: 'Dara Samnang', type: 'LEND', ago: '14M AGO' },
        { id: 3, user: 'Leakna R.', type: 'SELL', ago: '1H AGO' },
      ],

      topContributors: [
        {
          name: 'Sokha M.',
          swaps: 62,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
        },
        {
          name: 'Vutha P.',
          swaps: 38,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
        },
        {
          name: 'Leakna R.',
          swaps: 35,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
        },
      ],

      books: [
        {
          id: 1,
          title: 'Classic Khmer Poems',
          author: 'Kram Ngoy',
          condition: 'MINT',
          type: 'SWAP',
          tab: 'Exchange',
          cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
          owner: { name: 'Dara S.', location: 'Toul Kork', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
        },
        {
          id: 2,
          title: 'Corporate Startup',
          author: 'Napoleon Hill',
          condition: 'USED',
          type: 'SELL',
          tab: 'Buy Second-Hand',
          cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
          owner: { name: 'Sokha M.', location: 'BKK1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
        },
        {
          id: 3,
          title: 'The Art of War',
          author: 'Sun Tzu',
          condition: 'GOOD',
          type: 'LEND',
          tab: 'Lend Temporarily',
          cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
          owner: { name: 'Vutha P.', location: 'Sen Sok', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
        },
        {
          id: 4,
          title: 'Cambodian Journal',
          author: 'Bilingual Series',
          condition: 'MINT',
          type: 'SWAP',
          tab: 'Exchange',
          cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400&q=80',
          owner: { name: 'Leakna R.', location: 'Daun Penh', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80' },
        },
        {
          id: 5,
          title: 'The Art of War',
          author: 'Sun Tzu',
          condition: 'GOOD',
          type: 'LEND',
          tab: 'Lend Temporarily',
          cover: 'https://images.unsplash.com/photo-1474366521628-c35acbdd2cfa?w=400&q=80',
          owner: { name: 'Vutha P.', location: 'Sen Sok', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
        },
        {
          id: 6,
          title: 'The Art of War',
          author: 'Sun Tzu',
          condition: 'GOOD',
          type: 'SELL',
          tab: 'Buy Second-Hand',
          cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
          owner: { name: 'Vutha P.', location: 'Sen Sok', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
        },
      ],
    }
  },

  computed: {
    filteredBooks() {
      if (this.activeTab === 'All Books' || this.activeTab === 'Phnom Penh') {
        return this.books
      }
      return this.books.filter(b => b.tab === this.activeTab)
    },
  },
}
</script>