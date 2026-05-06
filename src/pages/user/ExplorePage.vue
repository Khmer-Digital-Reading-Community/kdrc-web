<template>
  <div class="bg-[#F8F9F8] min-h-screen pb-20 font-sans selection:bg-[#093A3F]/10">
    <div class="max-w-[1320px] mx-auto px-12 pt-16">
      
      <!-- Header Section -->
      <header class="mb-14">
        <h1 class="text-[52px] font-serif font-bold text-[#093A3F] leading-tight mb-4 tracking-[-0.02em]">
          Browse Our Collection
        </h1>
        <p class="text-gray-400 text-[17px] max-w-2xl leading-relaxed font-medium">
          Discover rare manuscripts, modern classics, and educational volumes curated for the discerning reader.
        </p>
      </header>

      <div class="flex gap-16">
        
        <!-- Sidebar -->
        <aside class="w-[200px] shrink-0 space-y-12">
          <!-- Categories -->
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B4690E] mb-6">Categories</h3>
            <div class="space-y-1.5">
              <button 
                v-for="cat in categories" :key="cat"
                @click="activeCat = cat"
                :class="activeCat === cat ? 'bg-[#1c3a2e] text-white shadow-md' : 'text-gray-500 hover:text-[#093A3F]'"
                class="w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Format -->
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B4690E] mb-5">Format</h3>
            <div class="flex gap-2">
              <button class="px-5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-500 hover:border-[#F9AE5B] transition-colors">E-book</button>
              <button class="px-5 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-500 hover:border-[#F9AE5B] transition-colors">Physical</button>
            </div>
          </div>

          <!-- Minimum Rating -->
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B4690E] mb-5">Minimum Rating</h3>
            <div class="space-y-4">
              <label v-for="rate in ['4.5+ Stars', '4.0+ Stars']" :key="rate" class="flex items-center gap-3 cursor-pointer group">
                <div class="w-4 h-4 rounded-full border border-gray-300 group-hover:border-[#093A3F] transition-colors relative">
                   <div class="absolute inset-0.5 rounded-full bg-[#093A3F] scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
                <span class="text-[12px] font-bold text-gray-400 group-hover:text-[#093A3F] transition-colors">{{ rate }}</span>
              </label>
            </div>
          </div>

          <!-- Language -->
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B4690E] mb-6">Language</h3>
            <div class="space-y-5">
              <div v-for="lang in langs" :key="lang.label" class="flex justify-between items-center text-[12px] font-bold">
                <span class="text-gray-500">{{ lang.label }}</span>
                <span class="text-gray-200 font-mono">{{ lang.count }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1">
          <div class="flex justify-end items-center mb-10">
            <div class="bg-gray-100/40 px-4 py-2.5 rounded-xl flex items-center gap-4 border border-gray-100">
              <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Sort By</span>
              <span class="text-[11px] font-bold text-[#093A3F] flex items-center gap-2 cursor-pointer">
                Newest Arrivals
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </div>
          </div>

          <!-- Clickable Card Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
            <router-link 
              v-for="book in books" 
              :key="book.id" 
              :to="`/user/book-exchange-detail/${book.id}`"
              class="group block bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <!-- Colored Card Header - Height increased to 340px and padding reduced to p-6 for a larger book -->
              <div :class="book.headerColor" class="h-[340px] flex items-center justify-center p-6 relative overflow-hidden">
                 <!-- Shadow is high-diffusion; h-[85%] ensures it takes up most of the header -->
                 <img :src="book.cover" class="h-[85%] w-auto object-contain shadow-[0_30px_60px_-12px_rgba(0,0,0,0.45)] rounded-sm transition-transform duration-700 group-hover:scale-105" />
                 
                 <div class="absolute top-6 right-6 text-[11px] font-bold px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20" :class="book.id === 1 || book.id === 3 ? 'text-[#093A3F]' : 'text-white'">
                   ★ {{ book.rating }}
                 </div>
              </div>
              
              <!-- Content Section -->
              <div class="p-8 text-left">
                <h3 class="text-[24px] font-serif font-bold text-[#093A3F] mb-1.5 leading-tight group-hover:text-[#B4690E] transition-colors line-clamp-1">
                  {{ book.title }}
                </h3>
                <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-5">By {{ book.author }}</p>
                <p class="text-[14px] text-gray-400 line-clamp-3 leading-relaxed mb-8 font-medium">
                  {{ book.desc }}
                </p>
                
                <!-- Format Tags -->
                <div class="flex gap-2.5">
                  <span class="px-4 py-2 bg-[#FDE9D0] text-[#B4690E] text-[11px] font-bold rounded uppercase tracking-wider">E-book</span>
                  <span class="px-4 py-2 bg-[#FDE9D0] text-[#B4690E] text-[11px] font-bold rounded uppercase tracking-wider">{{ book.lang }}</span>
                </div>
              </div>
            </router-link>

            <!-- "Not Finding it" Placeholder -->
            <div class="rounded-[32px] bg-[#F4F5F4] border border-gray-100 flex flex-col items-center justify-center text-center p-12 group">
              <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h4 class="font-bold text-[#093A3F] text-[18px]">Not finding it?</h4>
              <p class="text-[13px] text-gray-400 mt-3 leading-relaxed max-w-[200px] font-medium opacity-80">Request a specific title for our digital archives.</p>
              <button class="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-[#B4690E] border-b-2 border-[#B4690E] pb-1 hover:opacity-60 transition-all">Make a Request</button>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-24 flex justify-center items-center gap-5">
            <button class="text-gray-300 hover:text-[#093A3F] transition-colors font-bold text-lg">‹</button>
            <button class="w-10 h-10 flex items-center justify-center rounded-lg bg-[#093A3F] text-white text-[13px] font-bold shadow-xl shadow-[#093A3F]/20">1</button>
            <button class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 text-[13px] font-bold hover:bg-gray-100 transition-all">2</button>
            <button class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 text-[13px] font-bold hover:bg-gray-100 transition-all">3</button>
            <span class="text-gray-300 px-1 font-bold">...</span>
            <button class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 text-[13px] font-bold hover:bg-gray-100 transition-all">12</button>
            <button class="text-gray-300 hover:text-[#093A3F] transition-colors font-bold text-lg">›</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeCat = ref('Khmer Literature')
const categories = ['Khmer Literature', 'Education', 'Novels', 'Manga', 'Sci-Fi']
const langs = [
  { label: 'Khmer', count: '1,240' }, 
  { label: 'English', count: '850' }, 
  { label: 'French', count: '420' }
]

const books = ref([
  { 
    id: 1, 
    title: 'Echoes of Angkor', 
    author: 'SOVANNARA YUTHY', 
    rating: '4.9', 
    lang: 'Khmer', 
    headerColor: 'bg-[#557C7D]', 
    desc: 'In the heart of the jungle, where stone faces smile at eternity, a secret long buried begins to unfold among the roots...', 
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000' 
  },
  { 
    id: 2, 
    title: "The Weaver's Tale", 
    author: 'MALY CHANNARY', 
    rating: '4.7', 
    lang: 'English', 
    headerColor: 'bg-[#121212]',
    desc: 'A generational epic tracing the history of silk weaving through the rise and fall of empires, from royal looms to village weavers...', 
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000' 
  },
  { 
    id: 3, 
    title: 'Modern Pedagogy', 
    author: 'DR. SAMNANG KHEM', 
    rating: '4.2', 
    lang: 'Physical', 
    headerColor: 'bg-[#2E5A6E]',
    desc: 'A critical analysis of digital education systems in the 21st century and the importance of preserving traditional values...', 
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000' 
  },
  { 
    id: 4, 
    title: 'Poetry of Silence', 
    author: 'LINA MORN', 
    rating: '5.0', 
    lang: 'Khmer', 
    headerColor: 'bg-[#181818]',
    desc: 'A collection of haikus and free verse that explores the quiet spaces between spoken words in the busy streets of modern cities...', 
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000' 
  },
  { 
    id: 5, 
    title: 'Digital Monsoon', 
    author: 'PHEARUN SOK', 
    rating: '4.4', 
    lang: 'Sci-Fi', 
    headerColor: 'bg-[#1A2B2D]',
    desc: 'In a future where memory is a commodity, one hack changes the fate of a nation submerged under a perpetual digital rain storm...', 
    cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000' 
  }
])
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>