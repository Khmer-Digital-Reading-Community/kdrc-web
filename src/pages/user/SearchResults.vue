<template>
    <div class="min-h-screen bg-gray-50 py-8 md:py-12">
        <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 md:mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-[#093A3F] mb-2">
                    Search Results
                </h1>
                <p class="text-gray-600 text-lg">
                    <template v-if="searchQuery">
                        Found <span class="font-semibold text-[#B4690E]">{{ totalResults }}</span> results for "<span class="font-semibold">{{ searchQuery }}</span>"
                    </template>
                    <template v-else>
                        Enter a search query to find books
                    </template>
                </p>
            </div>

            <!-- Search Bar and Controls -->
            <div class="bg-white rounded-[16px] p-4 md:p-6 shadow-sm mb-8 md:mb-12">
                <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    <!-- Search Input -->
                    <div class="flex-grow">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search by title, author, or description..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#B4690E] focus:border-transparent"
                            @keyup.enter="handleSearch"
                        />
                    </div>

                    <!-- View Toggle -->
                    <div class="flex items-center gap-2 bg-gray-100 rounded-[12px] p-1">
                        <button
                            @click="isListView = false"
                            :class="[
                                'px-4 py-2 rounded-[10px] font-semibold transition-all duration-200',
                                !isListView
                                    ? 'bg-white text-[#B4690E] shadow-sm'
                                    : 'text-gray-600 hover:text-[#093A3F]'
                            ]"
                            title="Grid view"
                        >
                            <svg class="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                                <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
                            </svg>
                        </button>
                        <button
                            @click="isListView = true"
                            :class="[
                                'px-4 py-2 rounded-[10px] font-semibold transition-all duration-200',
                                isListView
                                    ? 'bg-white text-[#B4690E] shadow-sm'
                                    : 'text-gray-600 hover:text-[#093A3F]'
                            ]"
                            title="List view"
                        >
                            <svg class="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div>
                <!-- Loading State -->
                <template v-if="isLoading">
                    <div :class="[
                        'grid gap-6 md:gap-8',
                        isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    ]">
                        <SearchSkeleton
                            v-for="i in 12"
                            :key="i"
                            :isListView="isListView"
                        />
                    </div>
                </template>

                <!-- Empty State -->
                <template v-else-if="results.length === 0 && searchQuery">
                    <div class="bg-white rounded-[16px] p-12 md:p-16 text-center">
                        <div class="mb-6">
                            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-[#093A3F] mb-2">No results found</h2>
                        <p class="text-gray-600 mb-6">
                            We couldn't find any books matching "<span class="font-semibold">{{ searchQuery }}</span>"
                        </p>
                        <p class="text-gray-500 text-sm">Try different keywords or browse our explore page</p>
                    </div>
                </template>

                <!-- No Search State -->
                <template v-else-if="!searchQuery">
                    <div class="bg-white rounded-[16px] p-12 md:p-16 text-center">
                        <div class="mb-6">
                            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-[#093A3F] mb-2">Start searching</h2>
                        <p class="text-gray-600">Enter a search query above to find books by title, author, or description</p>
                    </div>
                </template>

                <!-- Results Grid/List -->
                <template v-else>
                    <div :class="[
                        'grid gap-6 md:gap-8',
                        isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    ]">
                        <SearchResultCard
                            v-for="book in results"
                            :key="book.id"
                            :book="book"
                            :isListView="isListView"
                        />
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
                        <button
                            @click="previousPage"
                            :disabled="currentPage === 1"
                            class="px-4 py-2 rounded-[12px] border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>

                        <div class="flex gap-1">
                            <button
                                v-for="pageNum in visiblePages"
                                :key="pageNum"
                                @click="goToPage(pageNum)"
                                :class="[
                                    'px-3 py-2 rounded-[12px] font-semibold transition-colors',
                                    currentPage === pageNum
                                        ? 'bg-[#B4690E] text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                ]"
                            >
                                {{ pageNum }}
                            </button>
                        </div>

                        <button
                            @click="nextPage"
                            :disabled="currentPage === totalPages"
                            class="px-4 py-2 rounded-[12px] border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchBooks, type SearchResult } from '../../services/searchApi';
import SearchResultCard from '../../components/search/SearchResultCard.vue';
import SearchSkeleton from '../../components/search/SearchSkeleton.vue';

const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>('');
const results = ref<SearchResult[]>([]);
const totalResults = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(12);
const totalPages = ref<number>(0);
const isLoading = ref<boolean>(false);
const isListView = ref<boolean>(false);

// Initialize from route query
if (route.query.q) {
    searchQuery.value = String(route.query.q);
    if (route.query.page) {
        currentPage.value = parseInt(String(route.query.page));
    }
}

// Computed for pagination
const visiblePages = computed(() => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return pages;
});

// Handle search
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        results.value = [];
        return;
    }

    currentPage.value = 1;
    await performSearch();
    
    // Update URL
    router.push({
        query: {
            q: searchQuery.value,
            page: currentPage.value,
        },
    });
};

// Perform actual search
const performSearch = async () => {
    if (!searchQuery.value.trim()) {
        return;
    }

    isLoading.value = true;
    try {
        const response = await searchBooks(searchQuery.value, currentPage.value, pageSize.value);
        results.value = response.data;
        totalResults.value = response.total;
        totalPages.value = response.pages;
    } catch (error) {
        console.error('Search failed:', error);
        results.value = [];
    } finally {
        isLoading.value = false;
    }
};

// Pagination handlers
const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        await performSearch();
        router.push({
            query: {
                q: searchQuery.value,
                page: currentPage.value,
            },
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const previousPage = async () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        await performSearch();
        router.push({
            query: {
                q: searchQuery.value,
                page: currentPage.value,
            },
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const goToPage = async (pageNum: number) => {
    currentPage.value = pageNum;
    await performSearch();
    router.push({
        query: {
            q: searchQuery.value,
            page: currentPage.value,
        },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch for route query changes
watch(
    () => route.query,
    async (newQuery) => {
        if (newQuery.q && newQuery.q !== searchQuery.value) {
            searchQuery.value = String(newQuery.q);
            if (newQuery.page) {
                currentPage.value = parseInt(String(newQuery.page));
            } else {
                currentPage.value = 1;
            }
            await performSearch();
        }
    },
    { deep: true }
);

// Initial search if query exists
if (searchQuery.value.trim()) {
    performSearch();
}
</script>
