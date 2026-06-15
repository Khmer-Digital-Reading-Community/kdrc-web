import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { ExploreBook } from "../types/exploreBook";
import { getExploreBooks } from "../services/exploreApi";
import type { ExploreFilters } from "../services/exploreApi";

export function useExploreBooks() {
  const books = ref<ExploreBook[]>([]);
  const loading = ref(true);
  const error = ref("");

  const fetchBooks = async () => {
    try {
      const route = useRoute();
      const query = route.query;

      const filters: ExploreFilters = {};

      if (query.genres && typeof query.genres === "string") {
        filters.genres = query.genres.split(",").filter(Boolean);
      } else if (query.genre && typeof query.genre === "string") {
        filters.genres = [query.genre];
      }

      if (query.authors && typeof query.authors === "string") {
        filters.authors = query.authors.split(",").filter(Boolean);
      }

      if (query.isFree === "true" || query.filter === "free") {
        filters.isFree = true;
      }

      if (query.category && typeof query.category === "string") {
        filters.category = query.category;
      }

      if (query.language && typeof query.language === "string") {
        filters.language = query.language;
      }

      if (query.rating && typeof query.rating === "string") {
        filters.minRating = parseFloat(query.rating) || undefined;
      }

      books.value = await getExploreBooks(filters);
    } catch (err) {
      console.error("Failed to load explore books:", err);
      error.value = "Failed to fetch books";
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchBooks);

  return { books, loading, error };
}
