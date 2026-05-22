import axios from "axios";

export interface ExploreFilters {
  category?: string;
  genres?: string[];
  authors?: string[];
  minRating?: number;
  language?: string;
  page?: number;
  limit?: number;
}

export const getExploreBooks = async (filters?: ExploreFilters) => {
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
    const response = await axios.get(url);

    return response.data.data;
};