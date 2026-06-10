<script>
import api from "../../services/api";
import { extractText } from "../../utils/content";

export default {
  name: "BookCollections",

  data() {
    return {
      activeDot: 0,
      dotCount: 3,
      books: [],
      loading: false,
      error: null,
    };
  },

  mounted() {
    this.fetchBooks();
    const el = this.$refs.carousel;
    if (el) {
      el.addEventListener("scroll", this.onScroll, { passive: true });
    }
    this.initReveal();
  },

  beforeUnmount() {
    const el = this.$refs.carousel;
    if (el) el.removeEventListener("scroll", this.onScroll);
    if (this._revealObserver) this._revealObserver.disconnect();
  },

  methods: {
    initReveal() {
      const root = this.$refs.sectionRoot;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root?.classList.add("reveal-visible");
        return;
      }
      this._revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            root.classList.add("reveal-visible");
            this._revealObserver?.disconnect();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      );
      this._revealObserver.observe(root);
    },

    async fetchBooks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/books");
        const payload = response.data;
        const books = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        this.books = books.slice(0, 12);
      } catch (err) {
        this.error = "Failed to load books";
        console.error("Error fetching books:", err);
      } finally {
        this.loading = false;
      }
    },

    getAuthorName(book) {
      if (!book.author) return "Unknown Author";
      if (typeof book.author === "string") return book.author;
      return book.author.name || "Unknown Author";
    },

    getCoverUrl(book) {
      return book.coverImageUrl || book.cover || null;
    },

    getGenreLabel(book) {
      if (book.categories?.length) return book.categories[0].name;
      return book.genre?.name || "General";
    },

    getRating(book) {
      return Number(book.rating ?? 0);
    },

    formatDescription(desc) {
      return extractText(desc, 100);
    },

    scrollLeft() {
      this.$refs.carousel.scrollBy({ left: -340, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.carousel.scrollBy({ left: 340, behavior: "smooth" });
    },
    scrollToPage(index) {
      const el = this.$refs.carousel;
      const pageWidth = el.clientWidth;
      el.scrollTo({ left: pageWidth * index, behavior: "smooth" });
      this.activeDot = index;
    },
    onScroll() {
      const el = this.$refs.carousel;
      if (!el || el.scrollWidth <= el.clientWidth) return;
      const scrollFraction = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      this.activeDot = Math.round(scrollFraction * (this.dotCount - 1));
    },
  },
};
</script>

<template>
  <section
    ref="sectionRoot"
    class="reveal-on-scroll bg-white py-10 px-4 md:py-16 md:px-8 lg:px-16 border-y border-[#e8e4dc]/50"
  >
    <div class="max-w-[1280px] mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div class="flex flex-col items-start">
          <p class="text-[11px] font-bold text-[#c5a050] uppercase tracking-[0.16em] mb-2">
            Curated Selection
          </p>
          <h2
            class="font-['Playfair_Display',Georgia,serif] text-[28px] md:text-[32px] font-bold text-[#012D1D]"
          >
            Book Collections
          </h2>
          <p class="text-sm text-gray-500 mt-2 max-w-md">
            Hand-picked titles from our community — swipe to explore.
          </p>
        </div>
        <router-link
          to="/explore"
          class="group flex items-center gap-2 bg-[#1c3a2e] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#c5a050] transition-all duration-300 hover:shadow-lg shrink-0"
        >
          More Books
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex gap-5 overflow-hidden">
        <div v-for="n in 4" :key="n" class="flex-none w-[260px] animate-pulse">
          <div class="aspect-[3/4] rounded-2xl bg-gray-100 mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-gray-400 text-sm">{{ error }}</p>
        <button @click="fetchBooks" class="mt-3 text-[#c5a050] text-sm font-semibold hover:underline">
          Retry
        </button>
      </div>

      <!-- Carousel -->
      <div v-else class="relative group/carousel">
        <!-- Left arrow -->
        <button
          @click="scrollLeft"
          class="absolute left-0 top-[40%] -translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-[#e8e4dc] shadow-lg flex items-center justify-center text-gray-500 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e] hover:shadow-xl"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Right arrow -->
        <button
          @click="scrollRight"
          class="absolute right-0 top-[40%] translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-[#e8e4dc] shadow-lg flex items-center justify-center text-gray-500 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e] hover:shadow-xl"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          ref="carousel"
          class="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style="scrollbar-width: none"
        >
          <div
            v-for="(book, index) in books"
            :key="book.id"
            class="book-card flex-none w-[260px] cursor-pointer group/card"
            :style="{ animationDelay: `${index * 80}ms` }"
            @click="$router.push(`/book-detail/${book.id}`)"
          >
            <!-- Cover -->
            <div
              class="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md transition-all duration-400 group-hover/card:-translate-y-1.5 group-hover/card:shadow-xl"
            >
              <img
                v-if="getCoverUrl(book)"
                :src="getCoverUrl(book)"
                :alt="book.title"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
              />

              <!-- Fallback cover -->
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
                :style="{
                  background: `linear-gradient(135deg, hsl(${(index * 47) % 360}, 25%, 22%) 0%, hsl(${(index * 47 + 40) % 360}, 30%, 28%) 100%)`,
                }"
              >
                <div class="absolute inset-0 opacity-10">
                  <div class="absolute top-4 left-4 w-16 h-16 border border-white/30 rounded-full" />
                  <div class="absolute bottom-8 right-4 w-24 h-24 border border-white/20 rounded-full" />
                </div>
                <svg
                  class="relative w-10 h-10 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p class="relative text-white/60 text-xs font-semibold text-center line-clamp-3 leading-snug">
                  {{ book.title }}
                </p>
              </div>

              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              />

              <!-- Genre badge -->
              <span
                class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#1c3a2e] shadow-sm"
              >
                {{ getGenreLabel(book) }}
              </span>

              <!-- Rating badge -->
              <div
                v-if="getRating(book) > 0"
                class="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full pl-2 pr-2.5 py-1 shadow-sm"
              >
                <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-[10px] font-bold text-gray-700 leading-none">{{ getRating(book).toFixed(1) }}</span>
              </div>

              <!-- Quick-read button on hover -->
              <div
                class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 ease-out"
              >
                <span
                  class="block w-full text-center bg-[#c5a050] hover:bg-[#b8913f] text-white text-[13px] font-bold py-2.5 rounded-xl shadow-lg transition-colors duration-200"
                >
                  View Details
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="px-0.5">
              <h3
                class="text-[14px] font-bold text-gray-900 truncate leading-snug group-hover/card:text-[#1c3a2e] transition-colors duration-200"
              >
                {{ book.title }}
              </h3>
              <p class="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                {{ formatDescription(book.description) || "No description available" }}
              </p>
              <p class="text-[11px] text-gray-400 mt-1.5 font-medium">
                {{ getAuthorName(book) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pills / dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="i in dotCount"
            :key="i"
            @click="scrollToPage(i - 1)"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-300',
              activeDot === i - 1 ? 'bg-[#c5a050] w-5' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import '../../assets/style/home.css';

[ref="carousel"]::-webkit-scrollbar,
div::-webkit-scrollbar {
  display: none;
}

.book-card {
  animation: fadeInUp 0.5s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
