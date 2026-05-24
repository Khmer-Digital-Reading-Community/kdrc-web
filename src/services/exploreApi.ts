import api, { apiBaseUrl } from "./api";
import { extractText } from "../utils/content";
import type { ExploreBook } from "../types/exploreBook";

export interface ExploreFilters {
  category?: string;
  genres?: string[];
  authors?: string[];
  minRating?: number;
  language?: string;
  page?: number;
  limit?: number;
}

/** Resolve a cover URL: absolute URLs are returned as-is; relative paths get the API base URL prepended. */
export function resolveCoverUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${apiBaseUrl}${url}`;
}

/** Compute average rating from a reviews array from the API. */
export function computeRating(reviews: any[]): number {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + Number(review.rating ?? 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/** Map a raw API Book object to the ExploreBook shape expected by the UI. */
export function mapToExploreBook(book: any): ExploreBook {
  return {
    id: book.id,
    title: book.title,
    author: book.author?.name ?? "Unknown Author",
    rating: computeRating(book.reviews),
    lang: book.metadata?.language ?? book.language ?? "English",
    category: book.categories?.[0]?.name ?? "General",
    genre: book.genre?.name ?? book.genre ?? book.tags?.[0]?.name,
    description: extractText(book.description, 160),
    tags: book.tags?.map((tag: any) => tag.name),
    coverImage: resolveCoverUrl(book.coverImageUrl),
    createdAt: book.createdAt ?? "",
  };
}

/** Fetch books for the explore page and map them into the UI model. */
export const getExploreBooks = async (
  filters?: ExploreFilters,
): Promise<ExploreBook[]> => {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.category && filters.category !== "All Categories") {
      params.append("category", filters.category);
    }

    if (filters.language && filters.language !== "All") {
      params.append("language", filters.language);
    }

    if (filters.genres && filters.genres.length > 0) {
      params.append("genres", filters.genres.join(","));
    }

    if (filters.authors && filters.authors.length > 0) {
      params.append("authors", filters.authors.join(","));
    }

    if (filters.minRating && filters.minRating > 0) {
      params.append("minRating", filters.minRating.toString());
    }

    if (filters.page) {
      params.append("page", filters.page.toString());
    }

    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }
  }

  const url = params.toString() ? `/books?${params.toString()}` : "/books";
  const response = await api.get(url);
  const raw: any[] = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.data)
      ? response.data.data
      : [];

  return raw.map(mapToExploreBook);
};
