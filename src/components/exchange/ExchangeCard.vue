<template>
    <router-link :to="{ name: 'book-exchange-detail-v2', params: { id: book.id } }" class="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border-gray-100 flex flex-col no-underline text-inherit">
        <span
            class="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full uppercase tracking-wide shadow-sm z-10"
            :class="getConditionColor(book.condition)"
        >
            {{ formatCondition(book.condition) }}
        </span>
        <div class="relative h-64 w-full">
            <img :src="book.imageUrl" :alt="book.title" class="w-full h-full object-cover">
            <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded-md flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    ​​​​​​​​​​​<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{  book.location }}
            </div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{  book.title  }}</h3>
            <p class="text-sm text-gray-500 mb-5">by {{  book.author  }}</p>

            <div class="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-5 border border-gray-100">
                <div class="bg-[#F3E8FF] p-2 rounded-full text-[#8B5CF6]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trading for</p>
                    <p class="text-sm font-semibold text-gray-800">{{ book.tradingFor || 'Open to offers' }}</p>
                </div>
            </div>

            <button @click.stop class="mt-auto w-full bg-[#042421] hover:bg-[#063330] text-white py-3.5 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2">
                Propose Exchange
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    </router-link>
</template>

<script setup lang="ts">
const props = defineProps({
    book: {
        type: Object as () => any,
        required: true
    }
})

// Helper to format the enum (e.g., 'LIKE_NEW' -> 'Like New')
const formatCondition = (condition: string) => {
    if (!condition) return '';
    return condition
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Map backend condition to badge colors
const getConditionColor = (condition: string) => {
    const map: Record<string, string> = {
        'NEW': 'bg-[#8B5CF6]', // Purple
        'LIKE_NEW': 'bg-[#10B981]', // Green
        'GOOD': 'bg-[#F59E0B]', // Orange
        'ACCEPTABLE': 'bg-red-500',
    }
    return map[condition] || 'bg-gray-400'; // Default gray
}
</script>