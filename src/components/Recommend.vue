<template>
  <section class="bg-[#faf8f3] py-14 px-8">
    <div class="max-w-[1280px] mx-auto">

      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-['Playfair_Display'] text-[28px] font-bold text-gray-900">
          Recommended for You
        </h2>

        <!-- Tabs -->
        <div class="flex items-center gap-1 bg-white border border-[#e8e4dc] rounded-xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase transition',
              activeTab === tab
                ? 'bg-[#1c3a2e] text-white'
                : 'text-gray-400 hover:text-gray-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- ✅ GRID FIXED (now inside container) -->
      <div class="grid grid-cols-12 gap-8">

        <!-- LEFT -->
        <div class="col-span-8 flex flex-col">
          <div
            v-for="book in filteredBooks"
            :key="book.id"
            class="flex gap-6 py-6 border-b border-[#e8e4dc] group cursor-pointer hover:bg-[#faf8f3] px-4 rounded-xl transition"
          >

            <!-- Cover -->
            <div class="w-[150px] h-[210px] rounded-xl overflow-hidden shadow-md group-hover:-translate-y-1 transition">
              <img :src="book.cover" class="w-full h-full object-cover" />
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <p class="text-[10px] font-bold text-[#c5a050] uppercase mb-2">
                  {{ book.genre }}
                </p>

                <h3 class="text-[20px] font-bold group-hover:text-[#1c3a2e]">
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
                <button class="bg-[#1c3a2e] text-white px-4 py-2 rounded-lg text-[12px] font-bold">
                  Read Now
                </button>

                <span class="text-[11px] text-gray-400">{{ book.readTime }}</span>

                <span class="text-[12px] font-semibold text-gray-600">
                  ⭐ {{ book.rating }}
                </span>

                <button @click.stop="toggleSave(book)" class="ml-auto">
                  <svg class="w-5 h-5" :fill="book.saved ? '#c5a050' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M5 5h14v16l-7-4-7 4V5z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT -->
        <div class="col-span-4 flex flex-col gap-5">

          <!-- Top Books -->
          <div class="bg-white border rounded-2xl p-5">
            <h3 class="font-bold mb-4">Top Books This Week</h3>

            <div v-for="(book, i) in topBooks" :key="i" class="flex gap-3 p-2 hover:bg-[#faf8f3] rounded-lg">
              <span class="w-6 font-bold" :class="i === 0 ? 'text-[#c5a050]' : 'text-gray-300'">
                {{ i + 1 }}
              </span>

              <img :src="book.cover" class="w-10 h-14 object-cover rounded" />

              <div>
                <p class="text-sm font-semibold">{{ book.title }}</p>
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
const module = import.meta.glob('../assets/images/books/*.{png,jpg,jpeg}', { eager: true })

const images = Object.fromEntries(
  Object.entries(module).map(([path, mod]) => {
    const name = path.split('/').pop()?.replace(/\.(png|jpg|jpeg)$/, '') || ''
    return [name, mod.default]
  })
)
export default {
  name: 'RecommendedSection',

  data() {
    return {
      activeTab: 'Popular',
      email: '',
      subscribed: false,
      tabs: ['Popular', 'Newest', 'Critics'],

      books: [
        {
          id: 1,
          title: 'Harry Potter and the Philosopher\'s Stone',
          author: 'J.K. Rowling',
          genre: 'Fantasy Story',
          desc: 'Harry Potter and the Philosopher\'s Stone is about Harry Potter, a boy who discovers he is a wizard and goes to Hogwarts School of Witchcraft and Wizardry.',
          cover: images['Book1'],
          rating: '4.9',
          reviews: '842',
          readTime: '12 min read',
          saved: false,
          tab: 'Popular',
        },
        {
          id: 2,
          title: 'Why Take A Chance When You Have Choice',
          author: 'Brendt Davenport',
          genre: 'Essay Collection',
          desc: 'Why Take a Chance When You Have a Choice by Brendt Davenport is about how people make decisions in life and the balance between choice and chance.',
          cover: images['Book 2'],
          rating: '4.6',
          reviews: '315',
          readTime: '18 min read',
          saved: false,
          tab: 'Popular',
        },
        {
          id: 3,
          title: 'The Midnight Library',
          author: 'Matt Haig',
          genre: 'Contemporary Fiction',
          desc: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life.',
          cover: images['Book 4'],
          rating: '4.7',
          reviews: '1.2k',
          readTime: '22 min read',
          saved: false,
          tab: 'Newest',
        },
        {
          id: 4,
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'Science Fiction',
          desc: 'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides and the desert planet Arrakis.',
          cover: images['Book 5'],
          rating: '4.8',
          reviews: '2.4k',
          readTime: '30 min read',
          saved: false,
          tab: 'Critics',
        },
        {
          id: 5,
          title: 'Educated',
          author: 'Tara Westover',
          genre: 'Memoir',
          desc: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.',
          cover: images['Book1'],
          rating: '4.8',
          reviews: '980',
          readTime: '20 min read',
          saved: false,
          tab: 'Newest',
        },
        {
          id: 6,
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          genre: 'Non-Fiction',
          desc: 'A brief history of humankind that explores how Homo sapiens came to dominate the earth from the Stone Age through the twenty-first century.',
          cover: images['Book 4'],
          rating: '4.7',
          reviews: '3.1k',
          readTime: '25 min read',
          saved: false,
          tab: 'Critics',
        },
      ],

      topBooks: [
        {
          title: 'The Glass Library',
          meta: 'Mystery • 2.4K reads',
          cover: images['Book1'],
        },
        {
          title: 'Ancient Winds',
          meta: 'History • 1.9K reads',
          cover: images['Book 2'],
        },
        {
          title: 'Morning Call',
          meta: 'Poetry • 1.2K reads',
          cover: images['Book 5'],
        },
      ],

      stats: [
        { label: 'Books Read', value: '24' },
        { label: 'Hours Read', value: '138' },
        { label: 'On Shelf', value: '12' },
        { label: 'Reviews', value: '7' },
      ],
    }
  },

  computed: {
    filteredBooks() {
      return this.books.filter(b => b.tab === this.activeTab)
    },
  },

  methods: {
    toggleSave(book) {
      book.saved = !book.saved
    },
    subscribe() {
      if (this.email) {
        this.subscribed = true
        setTimeout(() => { this.subscribed = false; this.email = '' }, 3000)
      }
    },
  },
}
</script>