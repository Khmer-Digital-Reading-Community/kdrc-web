<template>
  <section ref="sectionRoot" class="reveal-on-scroll bg-[#faf8f3] py-10 px-4 md:py-16 md:px-8 lg:px-16">
    <div class="max-w-[1280px] mx-auto">
      <!-- Section Header -->
      <div
        class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-10"
      >
        <div>
          <p class="text-[11px] font-bold text-[#c5a050] uppercase tracking-[0.16em] mb-2">
            Picked for you
          </p>
          <h2
            class="font-['Playfair_Display',Georgia,serif] text-[28px] md:text-[32px] font-bold text-[#012D1D]"
          >
            Recommended for You
          </h2>
        </div>

        <!-- Tabs -->
        <div
          class="flex items-center gap-1 bg-white border border-[#e8e4dc] rounded-xl p-1 shadow-sm"
        >
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 rounded-lg text-[12px] font-bold uppercase transition-all duration-300',
              activeTab === tab
                ? 'bg-[#1c3a2e] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-700 hover:bg-[#faf8f3]',
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div
          class="inline-block w-8 h-8 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mb-3"
        ></div>
        <p class="text-[13px] text-gray-400">Loading recommendations...</p>
      </div>

      <!-- GRID RESPONSIVE -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- LEFT -->
        <div class="lg:col-span-8 flex flex-col">
          <TransitionGroup name="rec-list" tag="div">
          <div
            v-for="(book, idx) in filteredBooks"
            :key="book.id + '-' + activeTab"
            class="rec-item flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-[#e8e4dc] last:border-0
                   group cursor-pointer hover:bg-white px-3 sm:px-5 rounded-2xl
                   transition-all duration-300 hover:shadow-md hover:border-transparent"
            :style="{ animationDelay: `${idx * 50}ms` }"
            @click="$router.push(`/book-detail/${book.id}`)"
          >
            <!-- Cover -->
            <div
              class="w-full sm:w-[150px] h-[180px] sm:h-[210px] rounded-xl overflow-hidden shadow-md group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300"
            >
              <img
                v-if="book.cover"
                :src="book.cover"
                :alt="book.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-[#1c3a2e] to-[#c5a050] flex items-center justify-center"
              >
                <svg
                  class="w-12 h-12 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <p class="text-[10px] font-bold text-[#c5a050] uppercase mb-2">
                  {{ book.genre }}
                </p>

                <h3
                  class="text-[20px] font-bold group-hover:text-[#1c3a2e] transition-colors duration-200"
                >
                  {{ book.title }}
                </h3>

                <p class="text-[12px] text-gray-400 uppercase mb-2">
                  {{ book.author }}
                </p>

                <p class="text-[13px] text-gray-500 line-clamp-2">
                  {{ book.desc }}
                </p>
              </div>

              <!-- Footer -->
              <div class="flex items-center gap-4 mt-4">
                <router-link
                  :to="`/book-detail/${book.id}`"
                  @click.stop
                  class="bg-[#1c3a2e] text-white px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#c5a050] transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <svg
                    class="w-3.5 h-3.5"
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
                </router-link>

                <span v-if="book.readTime" class="text-[11px] text-gray-400">{{
                  book.readTime
                }}</span>

                <span
                  v-if="book.rating"
                  class="text-[12px] font-semibold text-gray-600"
                >
                  ⭐ {{ book.rating }}
                </span>

                <button
                  @click.stop="toggleSave(book)"
                  class="ml-auto group/save"
                >
                  <svg
                    class="w-5 h-5 transition-colors duration-200"
                    :fill="book.saved ? '#c5a050' : 'none'"
                    :stroke="book.saved ? '#c5a050' : 'currentColor'"
                    stroke-width="2"
                  >
                    <path d="M5 5h14v16l-7-4-7 4V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          </TransitionGroup>

          <!-- Empty state -->
          <div v-if="!filteredBooks.length" class="text-center py-12">
            <p class="text-gray-400 text-[14px]">
              No books found for this category.
            </p>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="lg:col-span-4 flex flex-col gap-5">
          <!-- Top Books -->
          <div
            class="bg-white border border-[#e8e4dc] rounded-3xl p-6 shadow-sm
                   hover:shadow-lg transition-shadow duration-400 sticky top-24"
          >
            <h3 class="font-['Playfair_Display',serif] font-bold text-lg text-[#012D1D] mb-5">
              Top Books This Week
            </h3>

            <div
              v-for="(book, i) in topBooks"
              :key="book.id || i"
              class="flex gap-3 p-2.5 hover:bg-[#faf8f3] rounded-xl cursor-pointer
                     transition-all duration-200 hover:translate-x-1"
              @click="$router.push(`/book-detail/${book.id}`)"
            >
              <span
                class="w-6 font-bold"
                :class="i === 0 ? 'text-[#c5a050]' : 'text-gray-300'"
              >
                {{ i + 1 }}
              </span>

              <div
                class="w-10 h-14 rounded overflow-hidden flex-none bg-[#f0ece4]"
              >
                <img
                  v-if="book.cover"
                  :src="book.cover"
                  :alt="book.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-[#1c3a2e] to-[#c5a050] flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-semibold truncate">{{ book.title }}</p>
                <p class="text-xs text-gray-400">{{ book.meta }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from "../../services/api";

export default {
  name: "RecommendedSection",

  data() {
    return {
      activeTab: "Popular",
      tabs: ["Popular", "Newest", "Critics"],
      books: [],
      topBooks: [],
      loading: false,
    };
  },

  computed: {
    filteredBooks() {
      return this.books.filter((b) => b.tab === this.activeTab);
    },
  },

  created() {
    this.fetchBooks();
  },

  mounted() {
    this.initReveal();
  },

  beforeUnmount() {
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
        { threshold: 0.06 },
      );
      this._revealObserver.observe(root);
    },

    async fetchBooks() {
      this.loading = true;
      try {
        const response = await api.get("/books");
        const payload = response.data;
        const allBooks = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        // Map API books into the display format and assign tabs cyclically
        const tabMap = ["Popular", "Newest", "Critics"];
        this.books = allBooks.map((book, index) => ({
          id: book.id,
          title: book.title || "Untitled",
          author: book.author?.name || "Unknown Author",
          genre: book.categories?.[0]?.name || book.genre?.name || book.genre || "General",
          desc: book.description
            ? book.description.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
            : "No description available.",
          cover: book.cover || book.coverImageUrl || null,
          rating: book.rating || (4.5 + Math.random() * 0.5).toFixed(1),
          readTime: book.pageCount
            ? `${Math.ceil(book.pageCount * 1.5)} min read`
            : `${10 + Math.floor(Math.random() * 20)} min read`,
          saved: false,
          tab: tabMap[index % tabMap.length],
        }));

        // Use first 3 books as top books
        this.topBooks = allBooks.slice(0, 3).map((book) => ({
          id: book.id,
          title: book.title || "Untitled",
          meta: `${book.categories?.[0]?.name || "General"} • ${book.pageCount || "—"} pages`,
          cover: book.cover || book.coverImageUrl || null,
        }));
      } catch (err) {
        console.error("Error fetching recommended books:", err);
        this.books = [];
        this.topBooks = [];
      } finally {
        this.loading = false;
      }
    },

    toggleSave(book) {
      book.saved = !book.saved;
    },
  },
};
</script>

<style scoped>
@import '../../assets/style/home.css';

.rec-item {
  animation: home-fade-up 0.45s ease-out both;
}

.rec-list-enter-active,
.rec-list-leave-active {
  transition: all 0.35s ease;
}
.rec-list-enter-from,
.rec-list-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
