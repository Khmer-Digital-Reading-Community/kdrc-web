<template>
    <div class="relative flex-grow max-w-2xl">
        <form @submit.prevent="handleSearch" class="relative">
            <input
                v-model="localQuery"
                type="text"
                placeholder="Search books by title, author, or topic..."
                class="w-full px-4 md:px-5 py-2.5 md:py-3 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B4690E] focus:border-transparent transition-all placeholder-gray-400 text-sm md:text-base"
                @focus="showSuggestions = true"
                @blur="setTimeout(() => showSuggestions = false, 200)"
            />
            <button
                type="submit"
                class="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#B4690E] transition-colors"
                aria-label="Search"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
        </form>

        <!-- Recent Searches / Suggestions -->
        <div
            v-if="showSuggestions && (recentSearches.length > 0 || suggestions.length > 0)"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-[12px] shadow-lg z-50 overflow-hidden"
        >
            <!-- Recent Searches -->
            <div v-if="recentSearches.length > 0" class="border-b border-gray-100">
                <p class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Recent
                </p>
                <button
                    v-for="search in recentSearches"
                    :key="search"
                    @click="selectSuggestion(search)"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                    <svg class="w-4 h-4 inline-block mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    {{ search }}
                </button>
            </div>

            <!-- Suggestions -->
            <div v-if="suggestions.length > 0">
                <p class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggestions
                </p>
                <button
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    @click="selectSuggestion(suggestion)"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                    {{ suggestion }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const localQuery = ref<string>('');
const showSuggestions = ref<boolean>(false);
const recentSearches = ref<string[]>([]);

// Load recent searches from localStorage
const loadRecentSearches = () => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
        try {
            recentSearches.value = JSON.parse(stored).slice(0, 5);
        } catch (e) {
            console.error('Failed to load recent searches', e);
        }
    }
};

const saveRecentSearch = (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) return;

    const updated = [
        cleaned,
        ...recentSearches.value.filter(s => s !== cleaned),
    ].slice(0, 5);

    recentSearches.value = updated;
    localStorage.setItem('recentSearches', JSON.stringify(updated));
};

// Computed suggestions (could be dynamic based on API in future)
const suggestions = computed(() => {
    const commonSearches = [
        'Fiction',
        'Self-help',
        'Mystery',
        'Science Fiction',
        'Romance',
        'Biography',
        'History',
    ];
    return commonSearches;
});

const handleSearch = () => {
    const query = localQuery.value.trim();
    if (query) {
        saveRecentSearch(query);
        router.push({
            name: 'search',
            query: { q: query, page: '1' },
        });
        showSuggestions.value = false;
    }
};

const selectSuggestion = (suggestion: string) => {
    localQuery.value = suggestion;
    handleSearch();
};

// Initialize
loadRecentSearches();

// Watch for route changes to clear input
watch(
    () => router.currentRoute.value.name,
    (newName) => {
        if (newName !== 'search') {
            localQuery.value = '';
        }
    }
);
</script>
