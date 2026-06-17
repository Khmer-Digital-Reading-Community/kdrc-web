<template>
  <section v-if="books.length > 0" class="bg-[#faf8f3] py-8 px-4 md:py-14 md:px-8 border-t border-[#e8e4dc]">
    <div class="max-w-[1280px] mx-auto">

      <div class="flex items-center gap-2 mb-6">
        <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="font-['Playfair_Display'] text-[24px] md:text-[28px] font-bold text-gray-900">
          Reading History
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-[13px] text-gray-400">Loading history...</p>
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style="scrollbar-width:none;">
        <div
          v-for="book in books" :key="book.id"
          class="flex-none w-[180px] bg-white border border-green-200 rounded-xl overflow-hidden
                 hover:border-green-400 hover:shadow-sm transition-all duration-200"
        >
          <div class="h-28 bg-[#f0ece4] relative overflow-hidden" @click="$router.push('/book-detail/' + book.id)">
            <div v-if="!book.cover" class="w-full h-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <img v-else :src="book.cover" :alt="book.title" class="w-full h-full object-cover" />
            <div class="absolute top-2 right-2 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Done
            </div>
          </div>
          <div class="p-3">
            <p class="text-[13px] font-semibold text-gray-800 truncate leading-snug">{{ book.title }}</p>
            <p class="text-[10px] text-gray-400 mt-0.5 truncate">{{ book.author }}</p>
            <div class="flex items-center gap-2 mt-2">
              <router-link
                :to="'/reading/' + book.id"
                class="text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
              >
                Read Again
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import { fetchMyReadingProgress } from '../../services/community'

export default {
  name: 'ReadingHistory',
  data() {
    return {
      loading: true,
      books: [],
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  },
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  },
  methods: {
    onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.fetchData()
      }
    },
    async fetchData() {
      this.loading = true
      try {
        const raw = await fetchMyReadingProgress()
        this.books = (Array.isArray(raw) ? raw : [])
          .filter(p => (Number(p.percentageCompleted) || 0) >= 100)
          .map(p => ({
            id: p.book?.id || p.id,
            title: p.book?.title || 'Untitled',
            author: p.book?.author?.name || 'Unknown Author',
            cover: p.book?.coverImageUrl || null,
          }))
      } catch (e) {
        console.warn('Failed to fetch reading history:', e.message)
        this.books = []
      }
      this.loading = false
    },
  },
}
</script>
