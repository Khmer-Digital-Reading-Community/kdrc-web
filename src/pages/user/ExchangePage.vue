<template>
  <div class="bg-[#fbfbfc] min-h-screen py-12 px-6 md:px-10">
    <div class="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <aside class="col-span-1 lg:col-span-3 order-2 lg:order-1">
        <BookshelfLiveActivity />
        <BookshelfTopContributors />
      </aside>

      <main class="col-span-1 lg:col-span-9 order-1 lg:order-2">
        <header class="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
          <div class="border-l-[3.5px] border-[#c1712a] pl-6">
            <h1 class="text-[32px] md:text-[42px] font-serif font-bold text-[#093A3F] leading-[1.1]">Community</h1>
            <h1 class="text-[32px] md:text-[42px] font-serif italic text-gray-300 leading-[1.1]">Bookshelf.</h1>
            <p class="text-[15px] text-gray-500 mt-4 max-w-md">
              Connecting Cambodia's literary community. Browse <span class="font-bold text-gray-900">{{ filteredBooks.length }} verified copies</span> shared near you.
            </p>
          </div>
          <button class="w-full sm:w-auto bg-[#093A3F] text-white px-6 py-3 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span class="text-lg leading-none">+</span> Post a Book
          </button>
        </header>

        <div class="flex flex-wrap items-center gap-3 mb-10">
            <button 
              v-for="f in ['All Books', 'Exchange', 'Lend Temporarily', 'Buy Second-Hand']" 
              :key="f"
              @click="selectedFilter = f"
              :class="selectedFilter === f 
                ? 'bg-[#c1712a] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-300'"
              class="px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap"
            >
              {{ f }}
            </button>
            
            <div class="sm:ml-auto bg-white border border-gray-100 px-6 py-2.5 rounded-full text-[13px] font-bold text-gray-600 flex items-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-[#c1712a]">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Phnom Penh
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 max-w-[280px] mx-auto sm:max-w-none w-full">
          <div v-for="book in filteredBooks" :key="book.id" @click="goToDetail(book.id)" class="group cursor-pointer">
            <div class="aspect-[3/4.2] bg-gray-200 rounded-[32px] relative overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
               <img v-if="book.cover" :src="book.cover" class="w-full h-full object-cover" />
               <div class="absolute top-4 left-4 bg-[#c1712a] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg uppercase tracking-wider">
                 {{ book.status }}
               </div>
            </div>
            
            <div class="mt-5 px-1">
              <h3 class="font-serif font-bold text-[18px] text-gray-950 leading-tight group-hover:text-[#c1712a] transition-colors">{{ book.title }}</h3>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-1">By {{ book.author }}</p>
            </div>
            
            <div class="mt-4 bg-white border border-gray-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm group-hover:border-gray-200 transition-colors">
              <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-gray-100">
                 <img v-if="book.userAvatar" :src="book.userAvatar" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 text-[12px] leading-tight">
                <p class="font-bold text-gray-950 uppercase">{{ book.userName }}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{{ book.location }}</p>
              </div>
              <button class="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#c1712a] transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-16">
          <button 
            @click="exploreAll"
            class="text-[#c1712a] font-bold text-[13px] flex items-center gap-2 hover:gap-3 transition-all"
          >
            Explore All <span class="text-lg">→</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BookshelfLiveActivity from '../../components/common/BookshelfLiveActivity.vue';
import BookshelfTopContributors from '../../components/common/BookshelfTopContributors.vue';

const router = useRouter();

// Assets
import book1 from '../../assets/images/books/Book1.png'
import book2 from '../../assets/images/books/Book 2.png'
import book3 from '../../assets/images/books/Book3.png'
import book4 from '../../assets/images/books/Book 4.png'
import book5 from '../../assets/images/books/Book 5.png'
import user1 from '../../assets/images/books/users/user1.png'
import user2 from '../../assets/images/books/users/user2.jpg'
import user3 from '../../assets/images/books/users/user3.jpg'

// 1. Reactive state for the filter
const selectedFilter = ref('All Books');

// 2. Updated data with 'type' property to match filters
const books = ref([
  { id: 1, title: 'Classic Khmer Poems', author: 'Kram Ngoy', status: 'Mint', type: 'Exchange', userName: 'Dara S.', location: 'Toul Kork', cover: book1, userAvatar: user1 },
  { id: 2, title: 'Corporate Startup', author: 'Napoleon Hill', status: 'Used', type: 'Lend Temporarily', userName: 'Sokha M.', location: 'Sen Sok', cover: book2, userAvatar: user2 },
  { id: 3, title: 'The Art of War', author: 'Sun Tzu', status: 'Good', type: 'Buy Second-Hand', userName: 'Vutha P.', location: 'Daun Penh', cover: book3, userAvatar: user3 },
  { id: 4, title: 'Cambodian Journal', author: 'Bilingual Series', status: 'Mint', type: 'Exchange', userName: 'Leakna R.', location: 'Daun Penh', cover: book4, userAvatar: user1 },
  { id: 5, title: 'The Art of War', author: 'Sun Tzu', status: 'Good', type: 'Lend Temporarily', userName: 'Vutha P.', location: 'Sen Sok', cover: book5, userAvatar: user2 },
  { id: 6, title: 'The Art of War', author: 'Sun Tzu', status: 'Good', type: 'Buy Second-Hand', userName: 'Vutha P.', location: 'Sen Sok', cover: book3, userAvatar: user3 },
  // Adding more books as requested
  { id: 7, title: 'Khmer Legends', author: 'Buddhist Institute', status: 'Used', type: 'Exchange', userName: 'Sophea K.', location: 'BKK1', cover: book1, userAvatar: user2 },
  { id: 8, title: 'Business Strategy', author: 'Michael Porter', status: 'Mint', type: 'Buy Second-Hand', userName: 'Rithy S.', location: 'Chroy Changvar', cover: book2, userAvatar: user3 },
  { id: 9, title: 'Modern Khmer Art', author: 'Reyum', status: 'Good', type: 'Lend Temporarily', userName: 'Chavy P.', location: 'Toul Tom Poung', cover: book4, userAvatar: user1 }
]);

// 3. Computed property to handle the filtering logic
const filteredBooks = computed(() => {
  if (selectedFilter.value === 'All Books') {
    return books.value;
  }
  return books.value.filter(book => book.type === selectedFilter.value);
});

const goToDetail = (id: number) => {
  router.push({ name: 'book-exchange-detail', params: { id } });
};

// 4. Explore All logic (Resets filter to show everything)
const exploreAll = () => {
  selectedFilter.value = 'All Books';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>