import api from "./api";

export interface SearchResult {
  id: string;
  title: string;
  category?: string;
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

export interface SuggestionItem {
  id: string;
  title?: string;
  name?: string;
  coverImage?: string;
  author?: {
    id: string;
    name: string;
  };
}

export interface SuggestionsResponse {
  books: SuggestionItem[];
  authors: SuggestionItem[];
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

export type SortOption = "recent" | "popular" | "trending" | "rating";

export const searchBooks = async (
  query: string,
  page: number = 1,
  limit: number = 12,
  sort: SortOption = "recent",
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
    const response = await api.get<SearchResponse>("/books/search", {
      params: {
        q: query,
        page,
        limit,
        sort,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

/**
 * Fetch search suggestions for autocomplete
 * @param query - Search query string
 * @returns Promise with suggestions for books, authors, and categories
 */
export const getSearchSuggestions = async (
  query: string,
): Promise<SuggestionsResponse> => {
  if (!query.trim()) {
    return {
      books: [],
      authors: [],
      categories: [],
    };
  }

  try {
    const response = await api.get<SuggestionsResponse>("/search/suggestions", {
      params: {
        q: query,
        limit: 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Suggestions error:", error);
    throw error;
  }
};
