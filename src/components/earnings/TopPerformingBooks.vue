<template>
  <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      <div>
        <h3 class="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
          Top Performing Books
        </h3>
        <p class="text-[11px] sm:text-[12px] text-gray-500">Based on earnings this month</p>
      </div>
      <router-link to="/manuscripts" class="text-[11px] sm:text-[12px] font-bold text-[#c1712a] hover:text-[#a15c20] transition whitespace-nowrap">
        View all →
      </router-link>
    </div>

    <!-- Books Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <div v-for="book in books" :key="book.id" class="group">
        <!-- Book Cover -->
        <div class="mb-2 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden h-32 sm:h-40 md:h-48 bg-gray-200 shadow-md group-hover:shadow-lg transition">
          <img :src="book.image" :alt="book.title" class="w-full h-full object-cover group-hover:scale-105 transition" />
        </div>

        <!-- Book Info -->
        <div>
          <h4 class="text-[12px] sm:text-[14px] font-bold text-[#093A3F] mb-1 line-clamp-1">{{ book.title }}</h4>
          <p class="text-[10px] sm:text-[11px] text-gray-500 mb-2 sm:mb-3">By {{ book.author }}</p>

          <!-- Stats -->
          <div class="space-y-1 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-[10px] sm:text-[11px] text-gray-600">Reads</span>
              <span class="text-[11px] sm:text-[12px] font-bold text-[#093A3F]">{{ Number(book.reads).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] sm:text-[11px] text-gray-600">Rating</span>
              <span class="text-[11px] sm:text-[12px] font-bold text-[#c1712a]">⭐ {{ book.rating }}</span>
            </div>
          </div>

          <!-- Earnings -->
          <div class="flex justify-between items-center">
            <span class="text-[9px] sm:text-[11px] font-bold text-gray-600 uppercase">Earnings</span>
            <span class="text-[12px] sm:text-[14px] font-bold text-[#52B788]">
              ${{ Number(book.earnings).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: number
  title: string
  author: string
  reads: number
  earnings: number
  rating: number
  image: string
}

defineProps<{
  books: Book[]
}>()
</script>
