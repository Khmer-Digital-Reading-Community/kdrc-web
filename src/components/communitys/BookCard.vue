<template>
  <div
    class="group cursor-pointer"
    :style="{ animationDelay: `${animationDelay}ms` }"
  >
    <!-- Cover Image -->
    <div class="relative rounded-2xl overflow-hidden mb-4 shadow-md
                transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl
                aspect-[3/4]">
      <img
        :src="book.cover"
        :alt="book.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <!-- Condition Badge -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            'text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full',
            book.condition === 'MINT'
              ? 'bg-[#1c3a2e] text-white'
              : book.condition === 'USED'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-700 text-white'
          ]"
        >{{ book.condition }}</span>
      </div>

      <!-- Hover Action Buttons -->
      <div class="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div class="flex gap-2">
          <button class="flex-1 bg-white text-[#1c3a2e] text-[12px] font-bold py-2 rounded-xl hover:bg-[#c5a050] hover:text-white transition-colors duration-150">
            {{ book.type === 'SWAP' ? '↔ Swap' : book.type === 'LEND' ? '📤 Borrow' : '🛒 Buy' }}
          </button>
          <button class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Book Info -->
    <div class="px-1">
      <h3 class="font-['Playfair_Display'] text-[17px] font-bold text-gray-900 leading-snug mb-0.5 group-hover:text-[#1c3a2e] transition-colors">
        {{ book.title }}
      </h3>
      <p class="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3">
        BY {{ book.author }}
      </p>

      <!-- Owner Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="relative">
            <img
              :src="book.owner.avatar"
              :alt="book.owner.name"
              class="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <p class="text-[11px] font-bold text-gray-700 uppercase tracking-wide">{{ book.owner.name }}</p>
            <div class="flex items-center gap-1">
              <svg class="w-2.5 h-2.5 text-[#c5a050]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <p class="text-[10px] text-gray-400">{{ book.owner.location }}</p>
            </div>
          </div>
        </div>

        <!-- Chat bubble -->
        <button
          class="w-8 h-8 rounded-full border border-[#e8e4dc] flex items-center justify-center
                 text-gray-400 hover:border-[#c5a050] hover:text-[#c5a050] transition-all duration-200
                 hover:bg-[#c5a050]/5"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    animationDelay() {
      return this.index * 60
    }
  }
}
</script>
