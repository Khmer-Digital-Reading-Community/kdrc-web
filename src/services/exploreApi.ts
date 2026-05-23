import api from "./api";
import { apiBaseUrl } from "./api";
import { extractText } from "../utils/content";
import type { ExploreBook } from "../types/exploreBook";

/** Resolve a cover URL: absolute URLs are returned as-is; relative paths get the API base URL prepended. */
export function resolveCoverUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${apiBaseUrl}${url}`;
}

/** Compute average rating from a reviews array from the API. */
export function computeRating(reviews: any[]): number {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
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
    genre: book.genre?.name,
    description: extractText(book.description, 160),
    tags: book.tags?.map((t: any) => t.name),
    coverImage: resolveCoverUrl(book.coverImageUrl),
    createdAt: book.createdAt ?? "",
  };
}

/** Fetch all published books and return them mapped to ExploreBook. */
export const getExploreBooks = async (): Promise<ExploreBook[]> => {
  const response = await api.get("/books");
  const raw: any[] = Array.isArray(response.data) ? response.data : [];
  return raw.map(mapToExploreBook);
};
