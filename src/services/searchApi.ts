import api from './api';

export interface SearchResult {
    id: string;
    title: string;
    author: {
        id: string;
        name: string;
    };
    rating?: number;
    description: string;
    coverImage: string;
    createdAt: string;
    status?: string;
}

export interface SearchResponse {
    data: SearchResult[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export type SortOption = 'recent' | 'popular' | 'trending' | 'rating';

export const searchBooks = async (
    query: string,
    page: number = 1,
    limit: number = 12,
    sort: SortOption = 'recent',
): Promise<SearchResponse> => {
    if (!query.trim()) {
        return {
            data: [],
            total: 0,
            page,
            limit,
            pages: 0,
        };
    }

    try {
        const response = await api.get<SearchResponse>('/books/search', {
            params: {
                q: query,
                page,
                limit,
                sort,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};
