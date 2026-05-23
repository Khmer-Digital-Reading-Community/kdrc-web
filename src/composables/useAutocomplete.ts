import { ref, readonly } from 'vue';
import { getSearchSuggestions } from '../services/searchApi';

export interface AutocompleteSuggestion {
    id: string;
    type: 'book' | 'author' | 'category';
    title?: string;
    name?: string;
    coverImage?: string;
    author?: {
        id: string;
        name: string;
    };
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const suggestions = ref<AutocompleteSuggestion[]>([]);
const isLoading = ref<boolean>(false);

/**
 * Debounce function that delays API calls
 * @param callback - Function to execute
 * @param delay - Delay in milliseconds (default: 300ms)
 */
const debounce = (callback: () => void, delay: number = 300) => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(callback, delay);
};

/**
 * Fetch suggestions from API with debouncing
 * @param query - Search query string
 */
const fetchSuggestions = async (query: string): Promise<void> => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        clearSuggestions();
        return;
    }

    // Use debounce to delay API request
    debounce(async () => {
        try {
            isLoading.value = true;

            const data = await getSearchSuggestions(trimmedQuery);

            // Transform API response to our suggestion format
            const transformedSuggestions: AutocompleteSuggestion[] = [];

            // Add books (limit to 5)
            if (data.books && Array.isArray(data.books)) {
                transformedSuggestions.push(
                    ...data.books.slice(0, 5).map((book) => ({
                        id: book.id,
                        type: 'book' as const,
                        title: book.title,
                        coverImage: book.coverImage,
                        author: book.author,
                    }))
                );
            }

            // Add authors (limit to 3)
            if (data.authors && Array.isArray(data.authors)) {
                transformedSuggestions.push(
                    ...data.authors.slice(0, 3).map((item) => ({
                        id: item.id,
                        type: 'author' as const,
                        author: item.author,
                    }))
                );
            }

            // Add categories if available (limit to 3)
            if (data.categories && Array.isArray(data.categories)) {
                transformedSuggestions.push(
                    ...data.categories.slice(0, 3).map((category) => ({
                        id: category.id,
                        type: 'category' as const,
                        name: category.name,
                    }))
                );
            }

            suggestions.value = transformedSuggestions;
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestions.value = [];
        } finally {
            isLoading.value = false;
        }
    }, 300);
};

/**
 * Clear all suggestions
 */
const clearSuggestions = (): void => {
    suggestions.value = [];
    isLoading.value = false;

    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
};

export function useAutocomplete() {
    return {
        suggestions: readonly(suggestions),
        isLoading: readonly(isLoading),
        fetchSuggestions,
        clearSuggestions,
    };
}
