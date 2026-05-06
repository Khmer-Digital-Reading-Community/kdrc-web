<template>
    <section class="bg-white py-14 px-8">
        <div class="max-w-[1280px] mx-auto">

            <!-- Section Header -->
            <div class="flex items-end justify-between mb-8">
                <div class="flex flex-col items-start">
                   
                    <p class=" text-[28px] font-bold  !text-black  ">
                        Explorations
                    </p>
                </div>
                <button class="text-[11px] font-bold tracking-[0.12em] text-[#1c3a2e] uppercase
                 hover:text-[#c5a050] transition-colors duration-200 flex items-center gap-1.5">
                    View All Genres
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Genre Grid -->
            <div class="grid grid-cols-12 grid-rows-2 gap-4 h-[480px]">

                <!-- Khmer Literature — large left hero card -->
                <div class="col-span-5 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
                    @click="selectGenre(genres[0])">
                    <img :src="genres[0].image" alt="Khmer Literature"
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0a1e14]/90 via-[#0a1e14]/30 to-transparent">
                    </div>

                    <!-- Badge -->
                    <div class="absolute top-4 left-4">
                        <span
                            class="bg-[#c5a050] text-white text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded-full uppercase">
                            Featured
                        </span>
                    </div>

                    <!-- Content -->
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-2xl">{{ genres[0].icon }}</span>
                            <span class="text-[11px] font-semibold tracking-[0.12em] text-[#c5a050] uppercase">
                                {{ genres[0].tag }}
                            </span>
                        </div>
                        <h3 class="font-['Playfair_Display'] text-white text-[26px] font-bold leading-tight mb-1">
                            {{ genres[0].name }}
                        </h3>
                        <p class="text-white/60 text-[12px] mb-4">{{ genres[0].count }} titles available</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="tag in genres[0].tags" :key="tag"
                                class="bg-white/10 backdrop-blur-sm text-white/80 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                                {{ tag }}
                            </span>
                        </div>
                        <button class="mt-4 flex items-center gap-1.5 text-[#c5a050] text-[12px] font-bold
                     hover:gap-3 transition-all duration-200">
                            Explore Collection
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Education — top middle -->
                <div v-for="(genre, i) in genres.slice(1, 5)" :key="genre.id" :class="[
                    'relative rounded-2xl overflow-hidden cursor-pointer group',
                    i === 0 ? 'col-span-4 row-span-1' : '',
                    i === 1 ? 'col-span-3 row-span-1' : '',
                    i === 2 ? 'col-span-3 row-span-1' : '',
                    i === 3 ? 'col-span-4 row-span-1' : '',
                ]" :style="{ background: genre.bg }" @click="selectGenre(genre)">
                    <!-- Background image if available -->
                    <img v-if="genre.image" :src="genre.image" :alt="genre.name"
                        class="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-300 group-hover:opacity-30" />

                    <!-- Hover overlay -->
                    <div :class="[
                        'absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100',
                        genre.hoverOverlay
                    ]"></div>

                    <div class="relative z-10 p-5 h-full flex flex-col justify-between">
                        <div class="flex items-start justify-between">
                            <span class="text-3xl">{{ genre.icon }}</span>
                            <span class="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                                :class="genre.badgeClass">
                                {{ genre.count }}
                            </span>
                        </div>
                        <div>
                            <h3 class="font-['Playfair_Display'] text-[18px] font-bold leading-tight mb-0.5"
                                :class="genre.textClass">
                                {{ genre.name }}
                            </h3>
                            <p class="text-[11px] font-semibold tracking-[0.1em] uppercase opacity-60"
                                :class="genre.textClass">
                                {{ genre.tag }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Free Books — bottom right spanning -->
                <div class="col-span-7 row-span-1 relative rounded-2xl overflow-hidden cursor-pointer group"
                    :style="{ background: genres[5].bg }" @click="selectGenre(genres[5])">
                    <img :src="genres[5].image" alt="Free Books"
                        class="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-300" />
                    <div
                        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#1c3a2e]/10">
                    </div>
                    <div class="relative z-10 p-5 h-full flex items-center gap-5">
                        <div
                            class="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl flex-none">
                            {{ genres[5].icon }}
                        </div>
                        <div class="flex-1">
                            <p class="text-[10px] font-bold tracking-[0.14em] uppercase mb-1"
                                :class="genres[5].textClass" style="opacity:0.6">
                                {{ genres[5].tag }}
                            </p>
                            <h3 class="font-['Playfair_Display'] text-[22px] font-bold" :class="genres[5].textClass">
                                {{ genres[5].name }}
                            </h3>
                            <p class="text-[12px] mt-0.5" :class="genres[5].textClass" style="opacity:0.6">
                                {{ genres[5].count }} books available at no cost
                            </p>
                        </div>
                        <button class="flex-none flex items-center gap-2 bg-[#1c3a2e] text-white
                     text-[12px] font-bold px-5 py-2.5 rounded-xl
                     group-hover:bg-[#c5a050] transition-colors duration-250">
                            Browse Free
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            <!-- All Genres Pill Row -->
            <div class="mt-8 flex flex-wrap gap-2">
                <button v-for="pill in allGenres" :key="pill" :class="[
                    'px-4 py-2 rounded-full text-[12px] font-semibold border transition-all duration-200',
                    activePill === pill
                        ? 'bg-[#1c3a2e] text-white border-[#1c3a2e]'
                        : 'bg-white text-gray-600 border-[#e8e4dc] hover:border-[#c5a050] hover:text-[#c5a050]'
                ]" @click="activePill = pill">
                    {{ pill }}
                </button>
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
    name: 'ExploreGenres',

    data() {
        return {
            activePill: 'All',
            allGenres: [
                'All', 'Fiction', 'Non-Fiction', 'History', 'Science', 'Philosophy',
                'Poetry', 'Children', 'Art', 'Religion', 'Law', 'Economics', 'Biography',
            ],
            genres: [
                {
                    id: 1,
                    name: 'Khmer Literature',
                    tag: 'Heritage & Culture',
                    icon: '',
                    count: '1,240',
                    image: images['Book 4'],
                    tags: ['Classic', 'Folk Tales', 'Poetry', 'Modern'],
                    bg: '#1c3a2e',
                    textClass: 'text-white',
                    badgeClass: 'bg-[#c5a050] text-white',
                    hoverOverlay: 'bg-[#c5a050]/10',
                },
                {
                    id: 2,
                    name: 'Education',
                    tag: 'Educational Learning',
                    icon: '',
                    count: '843',
                    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
                    bg: '#f5d97a',
                    textClass: 'text-gray-900',
                    badgeClass: 'bg-[#1c3a2e] text-white',
                    hoverOverlay: 'bg-black/5',
                },
                {
                    id: 3,
                    name: 'Novels',
                    tag: 'Fictional Worlds',
                    icon: '',
                    count: '2,110',
                    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
                    bg: '#f0ece4',
                    textClass: 'text-gray-900',
                    badgeClass: 'bg-[#1c3a2e] text-white',
                    hoverOverlay: 'bg-[#1c3a2e]/5',
                },
                {
                    id: 4,
                    name: 'Science',
                    tag: 'Knowledge & Discovery',
                    icon: '',
                    count: '560',
                    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80',
                    bg: '#e8f0ee',
                    textClass: 'text-gray-900',
                    badgeClass: 'bg-[#1c3a2e] text-white',
                    hoverOverlay: 'bg-[#1c3a2e]/5',
                },
                {
                    id: 5,
                    name: 'History',
                    tag: 'Past & Present',
                    icon: '',
                    count: '720',
                    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
                    bg: '#ede8e0',
                    textClass: 'text-gray-900',
                    badgeClass: 'bg-[#c5a050] text-white',
                    hoverOverlay: 'bg-[#c5a050]/10',
                },
                {
                    id: 6,
                    name: 'Free Books',
                    tag: 'Open Access Gallery',
                    icon: '',
                    count: '3,400+',
                    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
                    bg: '#e8ede8',
                    textClass: 'text-gray-900',
                    badgeClass: 'bg-[#1c3a2e] text-white',
                    hoverOverlay: '',
                },
            ],
        }
    },

    methods: {
        selectGenre(genre) {
            console.log('Selected genre:', genre.name)
            // Emit to parent or navigate
            this.$emit('genre-selected', genre)
        },
    },
}
</script>