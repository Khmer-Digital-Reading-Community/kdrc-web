<template>
  <div class="bg-[#F8F9F8] min-h-screen pb-20 font-sans selection:bg-[#093A3F]/10">
    <div class="max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 pt-8 sm:pt-16">
      
      <header class="mb-8 sm:mb-14">
        <h1 class="text-[32px] sm:text-[44px] md:text-[52px] font-serif font-bold text-[#093A3F] leading-tight mb-2 sm:mb-4 tracking-[-0.02em]">
          Browse Our Collection
        </h1>
        <p class="text-gray-400 text-[14px] sm:text-[17px] max-w-2xl leading-relaxed font-medium">
          Discover rare manuscripts, modern classics, and educational volumes curated for the discerning reader.
        </p>
      </header>

      <div class="flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-16">
        
        <aside class="hidden md:block w-[200px] shrink-0">
          <SidebarFilters 
            :activeCategory="activeCategory" 
            @updateCategory="activeCategory = $event" 
          />
        </aside>

        <main class="flex-grow flex-1">
          
          <div class="flex w-full justify-between md:justify-end items-center mb-8">
            
            <button 
              @click="isMobileFilterOpen = true" 
              class="md:hidden flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-lg border border-gray-200 text-[#093A3F] font-bold text-[11px] uppercase tracking-[0.1em] shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
              Filters
            </button>

            <div class="relative">
              <div 
                @click="isSortMenuOpen = !isSortMenuOpen"
                class="bg-white px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-4 border border-gray-200 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 hidden sm:inline-block">Sort By</span>
                <span class="text-[11px] font-bold text-[#093A3F] flex items-center gap-1.5 sm:gap-2">
                  {{ sortBy }}
                  <svg :class="{'rotate-180': isSortMenuOpen}" class="transition-transform duration-300" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </div>

              <div v-if="isSortMenuOpen" class="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                <button v-for="option in ['Newest Arrivals', 'Highest Rated', 'A-Z']" :key="option"
                  @click="selectSort(option)"
                  class="w-full text-left px-4 sm:px-5 py-2.5 text-[11px] sm:text-[12px] font-bold transition-colors"
                  :class="sortBy === option ? 'bg-[#FDE9D0]/50 text-[#B4690E]' : 'text-gray-500 hover:bg-gray-50 hover:text-[#093A3F]'"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <div v-if="isSortMenuOpen" @click="isSortMenuOpen = false" class="fixed inset-0 z-10"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-8 md:gap-y-12 gap-x-8 items-stretch w-full max-w-[270px] sm:max-w-[320px] md:max-w-none mx-auto">
            
            <router-link 
              v-for="book in paginatedBooks" 
              :key="book.id" 
              :to="`/book-detail/${book.id}`"
              class="group block bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
            >
              <div :class="book.headerColor" class="h-[240px] md:h-[300px] w-full flex items-end justify-center pt-8 md:pt-10 pb-0 relative overflow-hidden shrink-0">
                 <img :src="book.cover" class="h-full aspect-[2/3] object-cover object-center rounded-t-[8px] md:rounded-t-[12px] shadow-[0_-5px_20px_rgba(0,0,0,0.25)] transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              
              <div class="p-5 md:p-8 flex flex-col flex-grow text-left">
                <div class="flex justify-between items-start gap-3 mb-1.5 h-[54px] md:h-[58px]">
                  <h3 class="text-[18px] md:text-[20px] xl:text-[21px] font-sans font-bold text-[#093A3F] leading-snug group-hover:text-[#B4690E] transition-colors line-clamp-2 pr-2">
                    {{ book.title }}
                  </h3>
                  <div class="flex items-center gap-1 text-[12px] md:text-[13px] font-bold text-[#B4690E] shrink-0 mt-1">
                    <span>★</span>
                    <span>{{ book.rating }}</span>
                  </div>
                </div>

                <p class="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4">
                  By {{ book.author }}
                </p>
                
                <p class="text-[12px] md:text-[13px] text-gray-500 line-clamp-3 leading-relaxed mb-4 md:mb-6 font-medium min-h-[60px] md:min-h-[66px]">
                  {{ book.desc }}
                </p>
                
                <div class="flex flex-wrap gap-2 md:gap-2.5 mt-auto pt-4">
                  <span class="px-3 md:px-3.5 py-1.5 bg-[#FDE9D0] text-[#B4690E] text-[9px] md:text-[10px] font-bold rounded-md uppercase tracking-wider">E-book</span>
                  <span class="px-3 md:px-3.5 py-1.5 bg-[#FDE9D0] text-[#B4690E] text-[9px] md:text-[10px] font-bold rounded-md uppercase tracking-wider">{{ book.lang }}</span>
                </div>
              </div>
            </router-link>

            <div class="rounded-[24px] bg-[#F4F5F4] border border-gray-100 flex flex-col items-center justify-center text-center p-6 md:p-12 group h-full min-h-[240px] md:min-h-[460px]">
              <div class="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <svg class="w-6 h-6 md:w-7 md:h-7 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h4 class="font-bold text-[#093A3F] text-[16px] md:text-[18px]">Not finding it?</h4>
              <p class="text-[12px] md:text-[13px] text-gray-500 mt-2 md:mt-3 leading-relaxed max-w-[200px] font-medium">Request a specific title for our digital archives.</p>
              <button class="mt-6 md:mt-8 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#B4690E] border-b-2 border-[#B4690E] pb-0.5 hover:opacity-70 transition-all">Make a Request</button>
            </div>
          </div>

          <div class="mt-16 md:mt-20 flex justify-center items-center gap-3 md:gap-6">
            <button @click="prevPage" class="text-gray-400 hover:text-[#093A3F] transition-colors font-bold text-xl px-2">‹</button>
            
            <button @click="goToPage(1)" :class="currentPage === 1 ? 'bg-[#093A3F] text-white shadow-[0_8px_16px_rgba(9,58,63,0.25)]' : 'text-gray-500 hover:bg-gray-100'" class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-[12px] md:rounded-[14px] text-[13px] md:text-[14px] font-bold transition-all">1</button>
            
            <button @click="goToPage(2)" :class="currentPage === 2 ? 'bg-[#093A3F] text-white shadow-[0_8px_16px_rgba(9,58,63,0.25)]' : 'text-gray-500 hover:bg-gray-100'" class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-[12px] md:rounded-[14px] text-[13px] md:text-[14px] font-bold transition-all">2</button>
            
            <button class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-[12px] md:rounded-[14px] text-gray-500 text-[13px] md:text-[14px] font-bold hover:bg-gray-100 transition-all hidden sm:flex">3</button>
            <span class="text-gray-300 px-1 font-bold tracking-widest text-[13px] md:text-[14px]">...</span>
            <button class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-[12px] md:rounded-[14px] text-gray-500 text-[13px] md:text-[14px] font-bold hover:bg-gray-100 transition-all">12</button>
            
            <button @click="nextPage" class="text-gray-400 hover:text-[#093A3F] transition-colors font-bold text-xl px-2">›</button>
          </div>
        </main>
      </div>
    </div>

    <div v-if="isMobileFilterOpen" class="fixed inset-0 z-50 flex md:hidden">
      <div @click="isMobileFilterOpen = false" class="fixed inset-0 bg-[#093A3F]/40 backdrop-blur-sm transition-opacity"></div>
      
      <div class="relative flex flex-col w-[260px] h-full bg-[#F8F9F8] shadow-2xl p-6 overflow-y-auto z-50 animate-[slideIn_0.3s_ease-out]">
        <div class="flex justify-between items-center mb-8">
          <h2 class="font-serif text-[20px] font-bold text-[#093A3F]">Filters</h2>
          <button @click="isMobileFilterOpen = false" class="text-gray-400 hover:text-[#093A3F] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <SidebarFilters 
          :activeCategory="activeCategory" 
          @updateCategory="handleMobileCategorySelect" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SidebarFilters from '@/components/explore/SidebarFilters.vue'

// --- State ---
const activeCategory = ref('All Categories')
const sortBy = ref('Newest Arrivals')
const isSortMenuOpen = ref(false)
const isMobileFilterOpen = ref(false)

const currentPage = ref(1)
const itemsPerPage = 6

const selectSort = (option: string) => {
  sortBy.value = option
  isSortMenuOpen.value = false
}

const handleMobileCategorySelect = (category: string) => {
  activeCategory.value = category
  isMobileFilterOpen.value = false
}

watch([activeCategory, sortBy], () => {
  currentPage.value = 1
})

const books = ref([
  { id: 1, title: 'Echoes of Angkor', author: 'SOVANNARA YUTHY', rating: '4.9', lang: 'Khmer', category: 'Khmer Literature', headerColor: 'bg-[#4A7274]', desc: 'In the heart of the jungle, where stone faces smile at eternity, a secret long buried begins to unfold among the roots...', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000' },
  { id: 2, title: "The Weaver's Tale", author: 'MALY CHANNARY', rating: '4.7', lang: 'English', category: 'Novels', headerColor: 'bg-[#1A1A1A]', desc: 'A generational epic tracing the history of silk weaving through the rise and fall of empires, from royal looms to village weavers...', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000' },
  { id: 3, title: 'Modern Pedagogy', author: 'DR. SAMNANG KHEM', rating: '4.2', lang: 'Physical', category: 'Education', headerColor: 'bg-[#1C4E5C]', desc: 'A critical analysis of digital education systems in the 21st century and the importance of preserving traditional values...', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000' },
  { id: 4, title: 'Poetry of Silence', author: 'LINA MORN', rating: '5.0', lang: 'Khmer', category: 'Khmer Literature', headerColor: 'bg-[#121415]', desc: 'A collection of haikus and free verse that explores the quiet spaces between spoken words in the busy streets of modern cities...', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000' },
  { id: 5, title: 'Digital Monsoon', author: 'PHEARUN SOK', rating: '4.4', lang: 'Sci-Fi', category: 'Sci-Fi', headerColor: 'bg-[#0D181A]', desc: 'In a future where memory is a commodity, one hack changes the fate of a nation submerged under a perpetual digital rain storm...', cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000' },
  { id: 6, title: 'The Bamboo Bridge', author: 'SOPHEA NOU', rating: '4.8', lang: 'Khmer', category: 'Novels', headerColor: 'bg-[#8C5E45]', desc: 'A sweeping romance set against the backdrop of the Mekong River during the French colonial era...', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000' },
  { id: 7, title: 'Advanced Calculus', author: 'PROF. VISOTH', rating: '4.1', lang: 'English', category: 'Education', headerColor: 'bg-[#3A4E59]', desc: 'A comprehensive guide to multivariable calculus tailored for engineering and computer science students...', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000' },
  { id: 8, title: 'Shadows of Tokyo', author: 'KENJI SATO', rating: '4.6', lang: 'Physical', category: 'Manga', headerColor: 'bg-[#8B0000]', desc: 'A gripping cyberpunk detective story following a rogue android through the neon-lit underbelly of Neo-Tokyo...', cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000' },
  { id: 9, title: 'Beyond the Stars', author: 'RITHY CHEA', rating: '4.5', lang: 'English', category: 'Sci-Fi', headerColor: 'bg-[#191970]', desc: 'Humanity’s first faster-than-light journey goes terribly wrong when the crew emerges in a parallel universe...', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000' }
])

const filteredBooks = computed(() => {
  let result = activeCategory.value === 'All Categories' 
    ? [...books.value] 
    : books.value.filter(book => book.category === activeCategory.value)
  
  if (sortBy.value === 'Highest Rated') {
    result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
  } else if (sortBy.value === 'A-Z') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    result.sort((a, b) => b.id - a.id)
  }
  return result
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBooks.value.slice(start, end)
})

const nextPage = () => { if (currentPage.value < 2) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const goToPage = (page: number) => { 
  if(page <= 2) currentPage.value = page 
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}
.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
</style>