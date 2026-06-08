import api from "./api";
import { resolveCoverUrl } from "./exploreApi";

export interface SearchResult {
  id: string;
  title: string;
  category?: string;
  genre?: string;
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

const mapSearchResult = (book: any): SearchResult => ({
  id: book.id,
  title: book.title ?? "Untitled",
  category: book.categories?.[0]?.name ?? "General",
  genre: book.genre?.name ?? book.genre ?? "General",
  author: book.author
    ? {
        id: book.author.id,
        name: book.author.name ?? "Unknown Author",
      }
    : {
        id: "",
        name: "Unknown Author",
      },
  rating: Number(book.rating ?? 0),
  description: book.description ?? "",
  coverImage: resolveCoverUrl(book.coverImageUrl),
  createdAt: book.createdAt ?? "",
  status: book.status,
});

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

    return {
      ...response.data,
      data: Array.isArray(response.data.data)
        ? response.data.data.map(mapSearchResult)
        : [],
    };
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
