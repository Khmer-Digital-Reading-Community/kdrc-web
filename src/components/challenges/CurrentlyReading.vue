<template>
  <div class="bg-white border border-[#e0ddd6] rounded-xl p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-[#1a3330]">Currently Reading</h3>
    </div>

    <div v-if="!books.length" class="text-center py-8">
      <div class="w-12 h-12 mx-auto mb-3 bg-[#f5f3ee] rounded-lg flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-[#8a8580] mb-1">No books in progress</p>
      <p class="text-xs text-[#b8b0a8]">Start reading to track your progress</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="book in books" :key="book.id" class="flex items-center gap-3">
        <div class="w-12 h-16 rounded-lg bg-[#f5f3ee] flex items-center justify-center flex-none overflow-hidden">
          <img v-if="book.book?.coverImageUrl" :src="book.book.coverImageUrl" :alt="book.book.title" class="w-full h-full object-cover" />
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-medium text-[#1a3330] truncate">{{ book.book?.title || 'Untitled' }}</p>
          <div class="mt-1.5 flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-[#e8e3dc] rounded-full overflow-hidden">
              <div class="h-full bg-[#c8861a] rounded-full" :style="{ width: Math.min(book.percentageCompleted, 100) + '%' }"></div>
            </div>
            <span class="text-[10px] font-medium text-[#c8861a]">{{ Math.round(book.percentageCompleted) }}%</span>
          </div>
        </div>
        <button class="text-xs font-medium text-[#c8861a] hover:text-[#b87812] whitespace-nowrap">Log reading</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrentlyReading',
  data() {
    return {
      books: [],
    }
  },
  created() {
    this.fetchBooks()
  },
  methods: {
    async fetchBooks() {
      try {
        const { fetchMyReadingProgress } = await import('../../services/community')
        const data = await fetchMyReadingProgress()
        this.books = Array.isArray(data) ? data.slice(0, 3) : []
      } catch (e) {
        console.warn('Failed to fetch reading progress:', e.message)
      }
    },
  },
}
</script>
