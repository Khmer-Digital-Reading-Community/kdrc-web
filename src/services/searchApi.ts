import api from "./api";
import { resolveCoverUrl } from "./exploreApi";
import { exchangeService } from "./exchange.service";
import type { ExchangeListing } from "../types/exchange";

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

/** A flattened exchange listing ready for display in search results. */
export interface ExchangeResult {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  condition: string;
  exchangeType: string;
  location: string;
  price?: number | string | null;
  tradingFor: string;
  description: string;
  ownerName: string;
  ownerAvatar?: string | null;
  createdAt: string;
}

export interface SearchResponse {
  data: SearchResult[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** Unified search response combining both books and exchange listings. */
export interface UnifiedSearchResponse {
  books: {
    data: SearchResult[];
    total: number;
    page: number;
    pages: number;
  };
  exchanges: {
    data: ExchangeResult[];
    total: number;
    page: number;
    pages: number;
  };
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
  exchanges?: SuggestionItem[];
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

/** Map a raw exchange listing to the flat ExchangeResult shape. */
const mapExchangeResult = (exchange: ExchangeListing): ExchangeResult => ({
  id: exchange.id,
  title: exchange.title ?? "Untitled",
  author: exchange.author ?? "Unknown",
  coverImage: resolveCoverUrl(exchange.imageUrl),
  condition: exchange.condition ?? "Good",
  exchangeType: exchange.exchangeType ?? "Trade",
  location: exchange.location ?? "Unknown",
  price: exchange.price ?? null,
  tradingFor: exchange.tradingFor ?? "Open to Offers",
  description: exchange.description ?? "",
  ownerName: exchange.owner?.name ?? "Anonymous",
  ownerAvatar: exchange.owner?.avatarUrl ?? null,
  createdAt: exchange.createdAt ?? "",
});

/**
 * Search exchange listings via the existing /exchanges endpoint.
 */
export const searchExchanges = async (
  query: string,
  page: number = 1,
  limit: number = 12,
): Promise<{ data: ExchangeResult[]; total: number; page: number; pages: number }> => {
  if (!query.trim()) {
    return { data: [], total: 0, page, pages: 0 };
  }

  try {
    // The Axios interceptor unwraps the NestJS { status, data } envelope,
    // so response.data is the payload: { data: ExchangeListing[], meta: {...} }
    const response = await exchangeService.search({
      search: query,
      page,
      limit,
    });

    const payload = response.data;

    return {
      data: Array.isArray(payload.data)
        ? payload.data.map(mapExchangeResult)
        : [],
      total: payload.meta?.total ?? 0,
      page: payload.meta?.page ?? page,
      pages: payload.meta?.lastPage ?? 0,
    };
  } catch (error) {
    console.error("Exchange search error:", error);
    throw error;
  }
};

/**
 * Unified search — fetches books and exchange listings in parallel.
 * Each section is independently paginated and returned.
 */
export const searchAll = async (
  query: string,
  bookPage: number = 1,
  exchangePage: number = 1,
  limit: number = 12,
  sort: SortOption = "recent",
): Promise<UnifiedSearchResponse> => {
  if (!query.trim()) {
    return {
      books: { data: [], total: 0, page: 1, pages: 0 },
      exchanges: { data: [], total: 0, page: 1, pages: 0 },
    };
  }

  const [booksResult, exchangesResult] = await Promise.allSettled([
    searchBooks(query, bookPage, limit, sort),
    searchExchanges(query, exchangePage, limit),
  ]);

  const books = booksResult.status === "fulfilled"
    ? booksResult.value
    : { data: [], total: 0, page: bookPage, pages: 0 };

  const exchanges = exchangesResult.status === "fulfilled"
    ? exchangesResult.value
    : { data: [], total: 0, page: exchangePage, pages: 0 };

  if (booksResult.status === "rejected") {
    console.error("Books search failed:", booksResult.reason);
  }
  if (exchangesResult.status === "rejected") {
    console.error("Exchanges search failed:", exchangesResult.reason);
  }

  return { books, exchanges };
};
