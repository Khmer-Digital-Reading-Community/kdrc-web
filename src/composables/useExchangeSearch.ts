import { ref } from 'vue';
import { exchangeService } from '../services/exchange.service';

type ExchangeResult = {
    id: string;
    title: string;
    author: string;
    condition: string;
    location: string;
    imageUrl: string;
    tradingFor?: string;
    exchangeType?: string;
    price?: number;
    createdAt?: string;
};

const searchQuery = ref('');
const selectedCondition = ref('');
const selectedLocation = ref('');
const results = ref<ExchangeResult[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

export function useExchangeSearch() {
    const performSearch = async () => {
        loading.value = true;
        try {
            const response = await exchangeService.search({
                search: searchQuery.value,
                condition: selectedCondition.value,
                location: selectedLocation.value,
                page: currentPage.value,
                limit: 10,
            });

            const actualPayload = response.data;
            results.value = Array.isArray(actualPayload?.data) ? actualPayload.data : Array.isArray(actualPayload) ? actualPayload : [];
            totalPages.value = actualPayload?.meta?.lastPage ?? 1;
        } catch (error) {
            console.error('Error occurred while searching exchanges:', error);
            results.value = [];
            totalPages.value = 1;
        } finally {
            loading.value = false;
        }
    };

    let debounceTimer: number | undefined;
    const triggerSearch = () => {
        // reset to first page for new searches
        currentPage.value = 1;
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = window.setTimeout(() => {
            performSearch();
        }, 300);
    };

    const applyFilters = () => {
        currentPage.value = 1;
        performSearch();
    };

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
            performSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        searchQuery.value = '';
        selectedCondition.value = '';
        selectedLocation.value = '';
        currentPage.value = 1;
        performSearch();
    };

    return {
        searchQuery,
        results,
        loading,
        selectedCondition,
        selectedLocation,
        performSearch,
        triggerSearch,
        clearFilters,
        changePage,
        currentPage,
        totalPages,
        applyFilters,
    };
}