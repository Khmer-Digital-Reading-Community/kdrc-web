import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { searchBooks, type SearchResult } from '../services/searchApi';

export function useSearch() {
    const router = useRouter();
    const searchQuery = ref<string>('');
    const results = ref<SearchResult[]>([]);
    const totalResults = ref<number>(0);
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(12);
    const totalPages = ref<number>(0);
    const isLoading = ref<boolean>(false);

    const performSearch = async (query: string = searchQuery.value, page: number = 1) => {
        if (!query.trim()) {
            results.value = [];
            totalResults.value = 0;
            totalPages.value = 0;
            return;
        }

        isLoading.value = true;
        try {
            const response = await searchBooks(query, page, pageSize.value);
            results.value = response.data;
            totalResults.value = response.total;
            totalPages.value = response.pages;
            currentPage.value = page;
        } catch (error) {
            console.error('Search failed:', error);
            results.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const navigateToSearch = (query: string) => {
        router.push({
            name: 'search',
            query: { q: query, page: '1' },
        });
    };

    const goToNextPage = async () => {
        if (currentPage.value < totalPages.value) {
            await performSearch(searchQuery.value, currentPage.value + 1);
        }
    };

    const goToPreviousPage = async () => {
        if (currentPage.value > 1) {
            await performSearch(searchQuery.value, currentPage.value - 1);
        }
    };

    const goToPage = async (pageNum: number) => {
        if (pageNum >= 1 && pageNum <= totalPages.value) {
            await performSearch(searchQuery.value, pageNum);
        }
    };

    const clearSearch = () => {
        searchQuery.value = '';
        results.value = [];
        totalResults.value = 0;
        totalPages.value = 0;
        currentPage.value = 1;
    };

    const hasResults = computed(() => results.value.length > 0);
    const hasNoResults = computed(() => searchQuery.value.trim() && results.value.length === 0 && !isLoading.value);
    const isEmpty = computed(() => !searchQuery.value.trim() && results.value.length === 0);

    return {
        searchQuery,
        results,
        totalResults,
        currentPage,
        pageSize,
        totalPages,
        isLoading,
        performSearch,
        navigateToSearch,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        clearSearch,
        hasResults,
        hasNoResults,
        isEmpty,
    };
}
