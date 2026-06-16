<template>
    <div class="min-h-screen bg-gray-50 py-8 md:py-4">
        <div class="container mx-auto px-4 md:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 md:mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-[#093A3F] mb-2">
                    Search Results
                </h1>
                <p class="text-gray-600 text-lg">
                    <template v-if="searchQuery">
                        Found
                        <span class="font-semibold text-[#B4690E]">{{ totalResults }}</span>
                        result{{ totalResults === 1 ? '' : 's' }} for "<span class="font-semibold">{{ searchQuery }}</span>"
                        <span v-if="totalResults > 0" class="text-gray-400">
                            ({{ booksTotal }} Book{{ booksTotal === 1 ? '' : 's' }}
                            <span v-if="exchangesTotal > 0"> + {{ exchangesTotal }} Exchange{{ exchangesTotal === 1 ? '' : 's' }}</span>)
                        </span>
                    </template>
                    <template v-else>
                        Enter a search query to find books and exchange listings
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
                            placeholder="Search books, exchange listings, authors..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#B4690E] focus:border-transparent"
                            @keyup.enter="handleSearch"
                        />
                    </div>

                    <!-- Sort Dropdown -->
                    <SortDropdown
                        v-model="sortOption"
                        @update:modelValue="handleSortChange"
                    />

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

            <!-- Results Area -->
            <div>
                <!-- Loading State -->
                <template v-if="isLoading">
                    <!-- Books Skeleton Section -->
                    <div class="mb-12">
                        <SectionHeader
                            title="Books"
                            :count="-1"
                            icon="book"
                        />
                        <div :class="[
                            'grid gap-6 md:gap-8',
                            isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        ]">
                            <SearchSkeleton
                                v-for="i in 4"
                                :key="'book-sk-' + i"
                                :isListView="isListView"
                            />
                        </div>
                    </div>

                    <!-- Exchange Skeleton Section -->
                    <div class="mb-12">
                        <SectionHeader
                            title="Exchange Books"
                            :count="-1"
                            icon="exchange"
                        />
                        <div :class="[
                            'grid gap-6 md:gap-8',
                            isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        ]">
                            <SearchSkeleton
                                v-for="i in 4"
                                :key="'ex-sk-' + i"
                                :isListView="isListView"
                            />
                        </div>
                    </div>
                </template>

                <!-- Empty State (no results at all) -->
                <template v-else-if="hasSearched && booksTotal === 0 && exchangesTotal === 0">
                    <div class="bg-white rounded-[16px] p-12 md:p-16 text-center">
                        <div class="mb-6">
                            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-[#093A3F] mb-2">No results found</h2>
                        <p class="text-gray-600 mb-6">
                            We couldn't find anything matching "<span class="font-semibold">{{ searchQuery }}</span>"
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
                        <p class="text-gray-600">Enter a search query above to find books, exchange listings, and authors</p>
                    </div>
                </template>

                <!-- Results: Two Sections -->
                <template v-else>
                    <!-- ─── Books Section ─── -->
                    <div class="mb-12" v-if="books.length > 0 || booksTotal > 0">
                        <SectionHeader
                            title="Books"
                            :count="booksTotal"
                            icon="book"
                        />

                        <div :class="[
                            'grid gap-6 md:gap-8',
                            isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        ]">
                            <SearchResultCard
                                v-for="book in books"
                                :key="'book-' + book.id"
                                :book="book"
                                :isListView="isListView"
                            />
                        </div>

                        <!-- Books: "See all" link when there are more pages -->
                        <div
                            v-if="booksPages > 1"
                            class="mt-6 text-center"
                        >
                            <button
                                @click="loadMoreBooks"
                                :disabled="booksLoadingMore"
                                class="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border-2 border-[#B4690E] text-[#B4690E] font-semibold hover:bg-[#B4690E] hover:text-white transition-colors disabled:opacity-50"
                            >
                                <template v-if="booksLoadingMore">
                                    <span class="spinner-small"></span>
                                    Loading...
                                </template>
                                <template v-else>
                                    See all {{ booksTotal }} Books
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </template>
                            </button>
                        </div>
                    </div>

                    <!-- ─── Exchange Books Section ─── -->
                    <div class="mb-12" v-if="exchanges.length > 0 || exchangesTotal > 0">
                        <SectionHeader
                            title="Exchange Books"
                            :count="exchangesTotal"
                            icon="exchange"
                        />

                        <div :class="[
                            'grid gap-6 md:gap-8',
                            isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        ]">
                            <ExchangeResultCard
                                v-for="exchange in exchanges"
                                :key="'ex-' + exchange.id"
                                :exchange="exchange"
                                :isListView="isListView"
                            />
                        </div>

                        <!-- Exchanges: "See all" link when there are more pages -->
                        <div
                            v-if="exchangesPages > 1"
                            class="mt-6 text-center"
                        >
                            <button
                                @click="loadMoreExchanges"
                                :disabled="exchangesLoadingMore"
                                class="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border-2 border-green-700 text-green-700 font-semibold hover:bg-green-700 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <template v-if="exchangesLoadingMore">
                                    <span class="spinner-small"></span>
                                    Loading...
                                </template>
                                <template v-else>
                                    See all {{ exchangesTotal }} Exchange Books
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </template>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchAll, type SearchResult, type ExchangeResult, type SortOption } from '../../services/searchApi';
import SearchResultCard from '../../components/search/SearchResultCard.vue';
import ExchangeResultCard from '../../components/search/ExchangeResultCard.vue';
import SearchSkeleton from '../../components/search/SearchSkeleton.vue';
import SortDropdown from '../../components/search/SortDropdown.vue';
import SectionHeader from '../../components/search/SectionHeader.vue';

const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>('');
const books = ref<SearchResult[]>([]);
const exchanges = ref<ExchangeResult[]>([]);
const booksTotal = ref<number>(0);
const exchangesTotal = ref<number>(0);
const booksPages = ref<number>(0);
const exchangesPages = ref<number>(0);
const booksPage = ref<number>(1);
const exchangesPage = ref<number>(1);
const isLoading = ref<boolean>(false);
const booksLoadingMore = ref<boolean>(false);
const exchangesLoadingMore = ref<boolean>(false);
const isListView = ref<boolean>(false);
const sortOption = ref<SortOption>('recent');
const hasSearched = ref<boolean>(false);
const pageSize = 12;

// Total results across both categories
const totalResults = computed(() => booksTotal.value + exchangesTotal.value);

// Initialize from route query
if (route.query.q) {
    searchQuery.value = String(route.query.q);
    if (route.query.sort && ['recent', 'popular', 'trending', 'rating'].includes(String(route.query.sort))) {
        sortOption.value = String(route.query.sort) as SortOption;
    }
}

// Handle search
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        books.value = [];
        exchanges.value = [];
        booksTotal.value = 0;
        exchangesTotal.value = 0;
        hasSearched.value = false;
        return;
    }

    booksPage.value = 1;
    exchangesPage.value = 1;
    await performSearch();

    router.push({
        query: {
            q: searchQuery.value,
            sort: sortOption.value,
        },
    });
};

// Handle sort change
const handleSortChange = async (newSort: SortOption) => {
    sortOption.value = newSort;
    booksPage.value = 1;
    exchangesPage.value = 1;
    await performSearch();

    router.push({
        query: {
            q: searchQuery.value,
            sort: sortOption.value,
        },
    });
};

// Perform unified search
const performSearch = async (loadMoreBooks = false, loadMoreExchanges = false) => {
    if (!searchQuery.value.trim()) return;

    if (loadMoreBooks) {
        booksLoadingMore.value = true;
    } else if (loadMoreExchanges) {
        exchangesLoadingMore.value = true;
    } else {
        isLoading.value = true;
    }

    try {
        const response = await searchAll(
            searchQuery.value,
            booksPage.value,
            exchangesPage.value,
            pageSize,
            sortOption.value,
        );

        if (loadMoreBooks) {
            books.value = [...books.value, ...response.books.data];
            booksTotal.value = response.books.total;
            booksPages.value = response.books.pages;
        } else if (loadMoreExchanges) {
            exchanges.value = [...exchanges.value, ...response.exchanges.data];
            exchangesTotal.value = response.exchanges.total;
            exchangesPages.value = response.exchanges.pages;
        } else {
            books.value = response.books.data;
            booksTotal.value = response.books.total;
            booksPages.value = response.books.pages;
            exchanges.value = response.exchanges.data;
            exchangesTotal.value = response.exchanges.total;
            exchangesPages.value = response.exchanges.pages;
            hasSearched.value = true;
        }
    } catch (error) {
        console.error('Search failed:', error);
        if (!loadMoreBooks && !loadMoreExchanges) {
            books.value = [];
            exchanges.value = [];
        }
    } finally {
        isLoading.value = false;
        booksLoadingMore.value = false;
        exchangesLoadingMore.value = false;
    }
};

// Load more books (next page)
const loadMoreBooks = async () => {
    if (booksPage.value >= booksPages.value) return;
    booksPage.value++;
    await performSearch(true, false);
};

// Load more exchanges (next page)
const loadMoreExchanges = async () => {
    if (exchangesPage.value >= exchangesPages.value) return;
    exchangesPage.value++;
    await performSearch(false, true);
};

// Watch for route query changes
watch(
    () => route.query,
    async (newQuery) => {
        if (newQuery.q && newQuery.q !== searchQuery.value) {
            searchQuery.value = String(newQuery.q);
            booksPage.value = 1;
            exchangesPage.value = 1;

            if (newQuery.sort && ['recent', 'popular', 'trending', 'rating'].includes(String(newQuery.sort))) {
                sortOption.value = String(newQuery.sort) as SortOption;
            } else {
                sortOption.value = 'recent';
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

<style scoped>
.spinner-small {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
