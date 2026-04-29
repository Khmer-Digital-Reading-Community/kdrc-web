<template>
  <div class="bg-white py-6 px-8 md:px-16">
    <div class="max-w-[1280px] mx-auto">
      <div class="flex items-end justify-between mb-8 ">
        <div class="flex flex-col items-start">
          <p class="text-[11px]  font-bold text-[#735C00] uppercase mb-1">
            Curated Selection
          </p>
          <p class=" text-[28px] font-bold  !text-black  ">
            Book Collections
          </p>
        </div>
        <button
          class="flex items-center gap-2 bg-[#1c3a2e] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#14291f] transition-colors duration-200">
          More Books
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>

      <div class="relative group">
        <button @click="scrollLeft" class="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 z-10
                    w-9 h-9 rounded-full bg-white border border-[#e8e4dc] shadow-md
                    flex items-center justify-center text-gray-500
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button @click="scrollRight" class="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 z-10
                    w-9 h-9 rounded-full bg-white border border-[#e8e4dc] shadow-md
                    flex items-center justify-center text-gray-500
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    hover:bg-[#1c3a2e] hover:text-white hover:border-[#1c3a2e]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div ref="carousel" class="flex gap-5 overflow-x-auto scroll-smooth pb-3 scrollbar-hide"
          style="scrollbar-width: none;">

          <div v-for="(book, index) in books" :key="book.id" class="flex-none w-[310px] cursor-pointer"
            :style="{ animationDelay: `${index * 60}ms` }">
            <!-- Cover -->
            <div class="w-[306px] h-[456px] rounded-xl overflow-hidden mb-3 relative shadow-md
                     transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <img :src="book.cover" :alt="book.title" class="w-full h-full object-cover" />
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-[#1c3a2e]/70 opacity-0 hover:opacity-100
                       transition-opacity duration-250 flex items-center justify-center">
                <button class="bg-[#c5a050] text-white text-[12px] font-bold px-4 py-2 rounded-lg
                        transform scale-90 hover:scale-100 transition-transform duration-150">
                  Read Now →
                </button>
              </div>
            </div>
            <!-- Book Details Below Cover -->
            <div class="px-1 text-left">
              <p class="text-[14px] font-semibold text-gray-900 truncate">{{ book.title }}</p>
              <div class="flex justify-between items-end gap-2 mt-2">
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] text-gray-500 mt-0.5">{{ book.author }}</p>
                  <p class="text-[12px] text-[#c5a050] mt-1">{{ book.stars }}</p>
                </div>
                <button class="shrink-0 bg-[#1c3a2e] flex items-center gap-1 text-white text-[11px] 
                  font-bold px-3 py-1.5 rounded-lg">
                  Read Now
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M6 4.5v11l9-5.5-9-5.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const module = import.meta.glob('../assets/images/books/*.{png,jpg,jpeg}', { eager: true })

const images = Object.fromEntries(
  Object.entries(module).map(([path, mod]) => {
    const name = path.split('/').pop()?.replace(/\.(png|jpg|jpeg)$/, '') || ''
    return [name, mod.default]
  })
)
export default {

  name: 'BookCollections',

  data() {
    return {
      activeDot: 0,
      dotCount: 3,
      books: [
        {
          id: 1,
          title: 'Lovers by the Sea',
          author: 'Aria Thorne',
          stars: '★★★★☆',
          cover: images['Book1'],
        },
        {
          id: 2,
          title: 'Spy in the Family',
          author: 'Tatyana Smith',
          stars: '★★★★★',
          cover: images['Book 2'],
        },
        {
          id: 3,
          title: 'Lightfall',
          author: 'Aria Thorne',
          stars: '★★★★☆',
          cover: images['Book1'],
        },
        {
          id: 4,
          title: 'A Record of Cambodia',
          author: 'Peter Harris',
          stars: '★★★★☆',
          cover: images['Book 4'],
        },
        {
          id: 5,
          title: 'The Quiet River',
          author: 'Meng Sovanna',
          stars: '★★★★★',
          cover: images['Book 5'],
        },
        {
          id: 6,
          title: 'Midnight Pages',
          author: 'Lena Voss',
          stars: '★★★☆☆',
          cover: images['Book 2'],
        },

      ],
    }
  },

  mounted() {
    const el = this.$refs.carousel
    if (el) {
      el.addEventListener('scroll', this.onScroll, { passive: true })
    }
  },

  beforeUnmount() {
    const el = this.$refs.carousel
    if (el) el.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    scrollLeft() {
      this.$refs.carousel.scrollBy({ left: -360, behavior: 'smooth' })
    },
    scrollRight() {
      this.$refs.carousel.scrollBy({ left: 360, behavior: 'smooth' })
    },
    scrollToPage(index) {
      const el = this.$refs.carousel
      const pageWidth = el.clientWidth
      el.scrollTo({ left: pageWidth * index, behavior: 'smooth' })
      this.activeDot = index
    },
    onScroll() {
      const el = this.$refs.carousel
      const scrollFraction = el.scrollLeft / (el.scrollWidth - el.clientWidth)
      this.activeDot = Math.round(scrollFraction * (this.dotCount - 1))
    },
  },
}

</script>

<style scoped>
/* Hide scrollbar cross-browser */
[ref="carousel"]::-webkit-scrollbar,
div::-webkit-scrollbar {
  display: none;
}
</style>