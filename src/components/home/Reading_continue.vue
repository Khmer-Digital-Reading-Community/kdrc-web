<template>
  <section class="bg-[#faf8f3] py-8 px-4 md:py-14 md:px-8">
    <div class="max-w-[1280px] mx-auto">

      <!-- Section Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="font-['Playfair_Display'] text-[24px] md:text-[28px] font-bold text-gray-900">
          Continue Reading
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-[13px] text-gray-400">Loading your reading progress...</p>
      </div>

      <!-- In-Progress Books (completed books hidden) -->
      <template v-else-if="inProgressBooks.length > 0">
        <div
          class="bg-white border border-[#e8e4dc] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6
                 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <!-- Book Thumbnail -->
          <div class="relative flex-none w-[52px] h-[72px] rounded-md overflow-hidden shadow-md bg-[#f0ece4]">
            <div class="absolute left-0 top-0 h-full w-[7px] bg-[#c5a050] z-10"></div>
            <div v-if="!currentBook.cover" class="w-full h-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
            </div>
            <img
              v-else
              :src="currentBook.cover"
              :alt="currentBook.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 w-full">
            <p class="font-['Playfair_Display'] font-bold text-[17px] text-gray-900 leading-snug mb-0.5">
              {{ currentBook.title }}
            </p>
            <p class="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-1">
              {{ currentBook.author }} &bull; {{ currentBook.progress }}% complete
            </p>
            <p v-if="currentBook.chapterTitle" class="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3">
              Left off at {{ currentBook.chapterTitle }}
            </p>

            <!-- Progress Label Row -->
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-[11px] text-gray-400 font-medium">Reading Progress</p>
              <p class="text-[11px] font-bold text-[#c5a050]">{{ currentBook.progress }}%</p>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-[6px] bg-[#f0ece4] rounded-full overflow-hidden">
              <div
                class="h-full bg-[#c5a050] rounded-full transition-all duration-700 ease-out"
                :style="{ width: currentBook.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- Resume Button -->
          <router-link
            :to="'/reading/' + currentBook.id + (currentBook.lastChapterId ? '?chapterId=' + currentBook.lastChapterId : '')"
            class="flex-none flex items-center gap-2 bg-[#1c3a2e] text-white
                   text-[13px] font-semibold px-5 py-3 rounded-xl
                   hover:bg-[#c5a050] transition-colors duration-250 whitespace-nowrap
                   shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.518-3.76A1 1 0 007 8.237v7.526a1 1 0 001.234.964l6.518-1.763A1 1 0 0016 14v-2.596a1 1 0 00-.248-.236z" />
            </svg>
            Resume Reading
          </router-link>
        </div>

        <!-- Recently Read Row -->
        <div v-if="recentInProgress.length" class="mt-6">
          <p class="text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-4">
            Recently Read
          </p>
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style="scrollbar-width:none;">
            <div
              v-for="recent in recentInProgress"
              :key="recent.id"
              class="flex-none flex items-center gap-3 bg-white border border-[#e8e4dc]
                     rounded-xl px-4 py-3 cursor-pointer
                     hover:border-[#c5a050] hover:shadow-sm transition-all duration-200 min-w-[220px]"
              @click="$router.push('/reading/' + recent.id + (recent.lastChapterId ? '?chapterId=' + recent.lastChapterId : ''))"
            >
              <!-- Mini Cover -->
              <div class="relative w-9 h-12 rounded flex-none overflow-hidden shadow-sm bg-[#f0ece4]">
                <div class="absolute left-0 top-0 h-full w-[5px] bg-[#1c3a2e]"></div>
                <div v-if="!recent.cover" class="w-full h-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                </div>
                <img v-else :src="recent.cover" :alt="recent.title" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0">
                <p class="text-[13px] font-semibold text-gray-800 truncate leading-snug">
                  {{ recent.title }}
                </p>
                <p class="text-[11px] text-gray-400 mt-0.5">{{ recent.progress }}% complete</p>
                <p v-if="recent.chapterTitle" class="text-[10px] text-gray-400 truncate">{{ recent.chapterTitle }}</p>
                <!-- Mini bar -->
                <div class="w-full h-[4px] bg-[#f0ece4] rounded-full mt-1.5 overflow-hidden">
                  <div
                    class="h-full bg-[#1c3a2e]/60 rounded-full"
                    :style="{ width: recent.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty (no in-progress books) -->
      <div v-else-if="!loading" class="text-center py-12 bg-white border border-[#e8e4dc] rounded-2xl">
        <div class="w-14 h-14 mx-auto mb-4 bg-[#f5f3ee] rounded-xl flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <p class="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-1">No books in progress</p>
        <p class="text-[13px] text-gray-400 mb-5">Start reading to see your progress here.</p>
        <router-link to="/explore" class="inline-block bg-[#1c3a2e] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-[#c5a050] transition-colors">Browse Books</router-link>
      </div>

    </div>
  </section>
</template>

<script>
import { fetchMyReadingProgress } from '../../services/community'
import { getChapters } from '../../services/chapterApi'

export default {
  name: 'ContinueReading',
  data() {
    return {
      loading: true,
      books: [],
    }
  },
  computed: {
    inProgressBooks() {
      return this.books.filter(b => b.progress < 100)
    },
    currentBook() {
      return this.inProgressBooks.length ? this.inProgressBooks[0] : null
    },
    recentInProgress() {
      return this.inProgressBooks.slice(1)
    },
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
    async fetchChapterTitles(books) {
      const bookIds = [...new Set(books.map(b => b.id).filter(Boolean))]
      await Promise.all(bookIds.map(async (bookId) => {
        try {
          const chapters = await getChapters(bookId)
          const book = books.find(b => b.id === bookId)
          if (book && book.lastChapterId) {
            const chapter = chapters.find(c => c.id === book.lastChapterId)
            if (chapter) {
              book.chapterTitle = `Ch ${chapter.chapterNumber}: ${chapter.title}`
            }
          }
        } catch (e) {
          // Chapter titles are non-critical; silently skip
        }
      }))
    },
    async fetchData() {
      this.loading = true
      try {
        const raw = await fetchMyReadingProgress()
        this.books = (Array.isArray(raw) ? raw : []).map(p => ({
          id: p.book?.id || p.id,
          title: p.book?.title || 'Untitled',
          author: p.book?.author?.name || 'Unknown Author',
          progress: Math.round(Number(p.percentageCompleted) || 0),
          cover: p.book?.cover || null,
          lastReadAt: p.lastReadAt,
          lastChapterId: p.chapterId || p.lastChapterId || null,
          chapterTitle: null,
        }))
        await this.fetchChapterTitles(this.books)
      } catch (e) {
        console.warn('Failed to fetch reading progress:', e.message)
        this.books = []
      }
      this.loading = false
    },
  },
}
</script>
