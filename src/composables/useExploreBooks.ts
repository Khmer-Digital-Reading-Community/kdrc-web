import { onMounted, ref } from "vue";
import type { ExploreBook } from "../types/exploreBook";
import { getExploreBooks } from "../services/exploreApi";

export function useExploreBooks() {
  const books = ref<ExploreBook[]>([]);
  const loading = ref(true);
  const error = ref("");

  const fetchBooks = async () => {
    try {
      books.value = await getExploreBooks();
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
