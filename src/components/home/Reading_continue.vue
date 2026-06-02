<template>
  <section
    ref="sectionRoot"
    class="reveal-on-scroll bg-[#faf8f3] py-10 px-4 md:py-16 md:px-8 lg:px-16"
  >
    <div class="max-w-[1280px] mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-[11px] font-bold text-[#c5a050] uppercase tracking-[0.16em] mb-2">
            Your shelf
          </p>
          <h2
            class="font-['Playfair_Display',Georgia,serif] text-[24px] md:text-[28px] font-bold text-gray-900"
          >
            Continue Reading
          </h2>
        </div>
        <router-link
          to="/dashboard/bookmarks"
          class="text-[11px] font-bold tracking-[0.14em] text-[#1c3a2e] uppercase
                 hover:text-[#c5a050] transition-colors duration-200 flex items-center gap-1"
        >
          My Bookmarks
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div
          class="inline-block w-10 h-10 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mb-4"
        />
        <p class="text-[13px] text-gray-400">Loading your reading progress...</p>
      </div>

      <div
        v-else-if="!books.length"
        class="text-center py-14 bg-white border border-[#e8e4dc] rounded-3xl shadow-sm
               hover:shadow-md transition-shadow duration-300"
      >
        <div
          class="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-[#f5f3ee] to-[#e8e4dc]
                 rounded-2xl flex items-center justify-center"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c5a050" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        </div>
        <p class="font-['Playfair_Display',serif] text-xl font-bold text-gray-900 mb-2">
          No books in progress
        </p>
        <p class="text-[13px] text-gray-400 mb-6 max-w-xs mx-auto">
          Start reading to track your progress here.
        </p>
        <router-link
          to="/explore"
          class="inline-flex items-center gap-2 bg-[#1c3a2e] text-white text-[13px] font-bold
                 px-6 py-3 rounded-xl hover:bg-[#c5a050] transition-all duration-300 hover:scale-[1.02]"
        >
          Browse Books
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          class="group bg-white border border-[#e8e4dc] rounded-3xl p-5 sm:p-7
                 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7
                 shadow-sm hover:shadow-xl hover:border-[#c5a050]/40
                 transition-all duration-400"
        >
          <div
            class="relative flex-none w-[72px] h-[100px] rounded-xl overflow-hidden shadow-lg
                   ring-2 ring-[#e8e4dc] group-hover:ring-[#c5a050]/50 transition-all duration-300"
          >
            <div class="absolute left-0 top-0 h-full w-2 bg-[#c5a050] z-10" />
            <div
              v-if="!currentBook.cover"
              class="w-full h-full flex items-center justify-center bg-[#f0ece4]"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0bbb2" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <img
              v-else
              :src="currentBook.cover"
              :alt="currentBook.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div class="flex-1 min-w-0 w-full">
            <p
              class="font-['Playfair_Display',serif] font-bold text-lg sm:text-xl text-gray-900 leading-snug mb-1"
            >
              {{ currentBook.title }}
            </p>
            <p class="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-4">
              {{ currentBook.author }} &bull; {{ currentBook.progress }}% complete
            </p>

            <div class="flex items-center justify-between mb-2">
              <p class="text-[11px] text-gray-500 font-medium">Reading Progress</p>
              <p class="text-[11px] font-bold text-[#c5a050]">{{ currentBook.progress }}%</p>
            </div>
            <div class="w-full h-2 bg-[#f0ece4] rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#1c3a2e] to-[#c5a050] rounded-full
                       transition-all duration-1000 ease-out relative overflow-hidden"
                :style="{ width: currentBook.progress + '%' }"
              >
                <div
                  class="absolute inset-0 bg-white/20 animate-[home-shimmer_2s_linear_infinite]
                         bg-[length:200%_100%]"
                />
              </div>
            </div>
          </div>

          <router-link
            :to="'/reading/' + currentBook.id"
            class="flex-none flex items-center gap-2 bg-[#1c3a2e] text-white
                   text-[13px] font-bold px-6 py-3.5 rounded-xl
                   hover:bg-[#c5a050] transition-all duration-300 whitespace-nowrap
                   shadow-md hover:shadow-lg hover:scale-[1.02] w-full sm:w-auto justify-center"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.5 5.5v9l7.25-4.5-7.25-4.5z" />
            </svg>
            Resume Reading
          </router-link>
        </div>

        <div v-if="recentBooks.length">
          <p class="text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-4">
            Recently Read
          </p>
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style="scrollbar-width: none">
            <div
              v-for="(recent, i) in recentBooks"
              :key="recent.id"
              class="recent-card flex-none flex items-center gap-3 bg-white border border-[#e8e4dc]
                     rounded-2xl px-4 py-3.5 cursor-pointer min-w-[240px]
                     hover:border-[#c5a050] hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-300"
              :style="{ animationDelay: `${i * 60}ms` }"
              @click="$router.push('/reading/' + recent.id)"
            >
              <div class="relative w-10 h-14 rounded-lg flex-none overflow-hidden shadow-sm bg-[#f0ece4]">
                <div class="absolute left-0 top-0 h-full w-1 bg-[#1c3a2e]" />
                <img
                  v-if="recent.cover"
                  :src="recent.cover"
                  :alt="recent.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[13px] font-semibold text-gray-800 truncate">{{ recent.title }}</p>
                <p class="text-[11px] text-gray-400 mt-0.5">{{ recent.progress }}% complete</p>
                <div class="w-full h-1 bg-[#f0ece4] rounded-full mt-2 overflow-hidden">
                  <div
                    class="h-full bg-[#1c3a2e]/70 rounded-full transition-all duration-500"
                    :style="{ width: recent.progress + '%' }"
                  />
                </div>
              </div>
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
  name: 'ContinueReading',
  data() {
    return {
      loading: true,
      books: [],
      _revealObserver: null,
    }
  },
  computed: {
    currentBook() {
      return this.books.length ? this.books[0] : null
    },
    recentBooks() {
      return this.books.slice(1)
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.initReveal()
  },
  beforeUnmount() {
    if (this._revealObserver) this._revealObserver.disconnect()
  },
  methods: {
    initReveal() {
      const root = this.$refs.sectionRoot
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root?.classList.add('reveal-visible')
        return
      }
      this._revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            root.classList.add('reveal-visible')
            this._revealObserver?.disconnect()
          }
        },
        { threshold: 0.08 },
      )
      this._revealObserver.observe(root)
    },

    async fetchData() {
      this.loading = true
      try {
        const raw = await fetchMyReadingProgress()
        this.books = (Array.isArray(raw) ? raw : []).map((p) => ({
          id: p.book?.id || p.id,
          title: p.book?.title || 'Untitled',
          author: p.book?.author?.name || 'Unknown Author',
          progress: Math.round(Number(p.percentageCompleted) || 0),
          cover: p.book?.cover || p.book?.coverImageUrl || null,
          lastReadAt: p.lastReadAt,
        }))
      } catch (e) {
        console.warn('Failed to fetch reading progress:', e?.message)
        this.books = []
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>
@import '../../assets/style/home.css';

.recent-card {
  animation: home-fade-up 0.5s ease-out both;
}
</style>
