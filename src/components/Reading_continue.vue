<template>
  <section class="bg-[#faf8f3] py-14 px-8">
    <div class="max-w-[1280px] mx-auto">

      <!-- Section Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="font-['Playfair_Display'] text-[28px] font-bold text-gray-900">
          Continue Reading
        </div>
        <a
          href="#"
          class="text-[11px] font-bold tracking-[0.14em] text-[#1c3a2e] uppercase
                 hover:text-[#c5a050] transition-colors duration-200"
        >
          Open Library
        </a>
      </div>

      <!-- Reading Card -->
      <div
        class="bg-white border border-[#e8e4dc] rounded-2xl p-6 flex items-center gap-6
               shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <!-- Book Thumbnail -->
        <div class="relative flex-none w-[52px] h-[72px] rounded-md overflow-hidden shadow-md">
          <!-- Spine accent -->
          <div class="absolute left-0 top-0 h-full w-[7px] bg-[#c5a050] z-10"></div>
          <img
            :src="book.cover"
            :alt="book.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-['Playfair_Display'] font-bold text-[17px] text-gray-900 leading-snug mb-0.5">
            {{ book.title }}
          </p>
          <p class="text-[11px] font-semibold tracking-[0.1em] text-gray-400 uppercase mb-3">
            {{ book.author }} &bull; Chapter {{ book.currentChapter }} of {{ book.totalChapters }}
          </p>

          <!-- Progress Label Row -->
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-[11px] text-gray-400 font-medium">Reading Progress</p>
            <p class="text-[11px] font-bold text-[#c5a050]">{{ book.progress }}%</p>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-[6px] bg-[#f0ece4] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#c5a050] rounded-full transition-all duration-700 ease-out"
              :style="{ width: book.progress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Resume Button -->
        <button
          class="flex-none flex items-center gap-2 bg-[#1c3a2e] text-white
                 text-[13px] font-semibold px-5 py-3 rounded-xl
                 hover:bg-[#c5a050] transition-colors duration-250 whitespace-nowrap
                 shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.518-3.76A1 1 0 007 8.237v7.526a1 1 0 001.234.964l6.518-1.763A1 1 0 0016 14v-2.596a1 1 0 00-.248-.236z" />
          </svg>
          Resume Manuscript
        </button>
      </div>

      <!-- Recently Read Row -->
      <div class="mt-6">
        <p class="text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-4">
          Recently Read
        </p>
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style="scrollbar-width:none;">
          <div
            v-for="recent in recentBooks"
            :key="recent.id"
            class="flex-none flex items-center gap-3 bg-white border border-[#e8e4dc]
                   rounded-xl px-4 py-3 cursor-pointer
                   hover:border-[#c5a050] hover:shadow-sm transition-all duration-200 min-w-[220px]"
          >
            <!-- Mini Cover -->
            <div class="relative w-9 h-12 rounded flex-none overflow-hidden shadow-sm">
              <div class="absolute left-0 top-0 h-full w-[5px] bg-[#1c3a2e]"></div>
              <img :src="recent.cover" :alt="recent.title" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0">
              <p class="text-[13px] font-semibold text-gray-800 truncate leading-snug">
                {{ recent.title }}
              </p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ recent.progress }}% complete</p>
              <!-- Mini bar -->
              <div class="w-full h-[4px] bg-[#f0ece4] rounded-full mt-1.5 overflow-hidden">
                <div
                  class="h-full bg-[#1c3a2e]/60 rounded-full"
                  :style="{ width: recent.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
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
  name: 'ContinueReading',

  data() {
    return {
      book: {
        title: 'The Silent Atelier',
        author: 'Julian Vane',
        currentChapter: 14,
        totalChapters: 28,
        progress: 46,
        cover: images['Book1'],
      },
      recentBooks: [
        {
          id: 1,
          title: 'A Record of Cambodia',
          progress: 82,
          cover: images['Book 4'],
        },
        
        {
          id: 3,
          title: 'Midnight Pages',
          progress: 61,
          cover: images['Book 2'],
        },
        {
          id: 4,
          title: 'The Quiet River',
          progress: 15,
          cover: images['Book 5'],
        },
      ],
    }
  },
}
</script>