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
      return book.genre || "General";
    },

    getRatingStars(book) {
      const rating = book.rating || (4.0 + Math.random()).toFixed(1);
      const full = Math.floor(rating);
      return "★".repeat(full) + (rating % 1 >= 0.5 ? "½" : "") + ` ${rating}`;
    },

    formatDescription(desc) {
      return extractText(desc, 100);
    },

    scrollLeft() {
      this.$refs.carousel.scrollBy({ left: -360, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.carousel.scrollBy({ left: 360, behavior: "smooth" });
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
          class="group flex items-center gap-2 bg-[#1c3a2e] text-white text-[13px] font-semibold
                 px-5 py-2.5 rounded-xl hover:bg-[#c5a050] transition-all duration-300
                 hover:shadow-lg shrink-0"
        >
          More Books
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex gap-5 overflow-hidden">
        <div v-for="n in 4" :key="n" class="flex-none w-[280px] animate-pulse">
          <div class="w-full h-[400px] rounded-2xl bg-gray-100 mb-4"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-gray-400 text-sm">{{ error }}</p>
        <button
          @click="fetchBooks"
          class="mt-3 text-[#c5a050] text-sm font-semibold hover:underline"
        >
          Retry
        </button>
      </div>

      <!-- Carousel -->
      <div v-else class="relative group/carousel">
        <button
          @click="scrollLeft"
          class="absolute left-0 top-[200px] -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#e8e4dc] shadow-lg flex items-center justify-center text-gray-500 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e] hover:shadow-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          @click="scrollRight"
          class="absolute right-0 top-[200px] translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-[#e8e4dc] shadow-lg flex items-center justify-center text-gray-500 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e] hover:shadow-xl"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          ref="carousel"
          class="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style="scrollbar-width: none"
        >
          <div
            v-for="(book, index) in books"
            :key="book.id"
            class="book-card flex-none w-[280px] cursor-pointer group/card"
            :style="{ animationDelay: `${index * 80}ms` }"
            @click="$router.push(`/reading/${book.id}`)"
          >
            <!-- Cover Container -->
            <div
              class="relative w-full h-[400px] rounded-2xl overflow-hidden mb-4 shadow-md transition-all duration-400 group-hover/card:-translate-y-2 group-hover/card:shadow-2xl"
            >
              <!-- Cover Image -->
              <img
                v-if="getCoverUrl(book)"
                :src="getCoverUrl(book)"
                :alt="book.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />

              <!-- Fallback Cover -->
              <div
                v-else
                class="w-full h-full flex items-center justify-center relative"
                :style="{
                  background: `linear-gradient(135deg, 
                       hsl(${(index * 47) % 360}, 25%, 25%) 0%, 
                       hsl(${(index * 47 + 40) % 360}, 35%, 40%) 100%)`,
                }"
              >
                <!-- Decorative pattern -->
                <div class="absolute inset-0 opacity-10">
                  <div
                    class="absolute top-6 left-6 w-20 h-20 border border-white/30 rounded-full"
                  ></div>
                  <div
                    class="absolute bottom-10 right-6 w-32 h-32 border border-white/20 rounded-full"
                  ></div>
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[1px] bg-white/20 rotate-45"
                  ></div>
                </div>
                <!-- Book icon & title -->
                <div class="relative z-10 text-center px-6">
                  <svg
                    class="w-10 h-10 mx-auto mb-4 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p
                    class="text-white/70 text-[14px] font-semibold leading-tight line-clamp-3"
                  >
                    {{ book.title }}
                  </p>
                </div>
              </div>

              <!-- Gradient Overlay (always visible, stronger on hover) -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-400"
              ></div>

              <!-- Genre Badge -->
              <div class="absolute top-3 left-3">
                <span
                  class="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#1c3a2e] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
                >
                  {{ getGenreLabel(book) }}
                </span>
              </div>

              <!-- Hover Action -->
              <div
                class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 ease-out"
              >
                <button
                  @click.stop="$router.push(`/reading/${book.id}`)"
                  class="w-full bg-[#c5a050] hover:bg-[#b8913f] text-white text-[13px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors duration-200"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Read Now
                </button>
              </div>
            </div>

            <!-- Book Info -->
            <div class="px-1">
              <h3
                class="text-[15px] font-bold text-gray-900 truncate leading-snug group-hover/card:text-[#1c3a2e] transition-colors duration-200"
              >
                {{ book.title }}
              </h3>
              <p
                class="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed"
              >
                {{
                  formatDescription(book.description) ||
                  "No description available"
                }}
              </p>
              <div class="flex items-center justify-between gap-2 mt-2">
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] text-gray-500 truncate">
                    {{ getAuthorName(book) }}
                  </p>
                  <p class="text-[11px] text-[#c5a050] mt-0.5 font-medium">
                    {{ getRatingStars(book) }}
                  </p>
                </div>
                <button
                  @click.stop="$router.push(`/reading/${book.id}`)"
                  class="shrink-0 bg-[#1c3a2e] flex items-center gap-1.5 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#c5a050] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Read
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 4.5v11l9-5.5-9-5.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import '../../assets/style/home.css';
/* Hide scrollbar cross-browser */
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
