import { ref, computed, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ExploreBook } from "../types/exploreBook";

export function useExploreFilters(books: Ref<ExploreBook[]>) {
  const route = useRoute();
  const router = useRouter();

  // Filter states
  const activeCategory = ref<string>("All Categories");
  const activeLanguage = ref<string>("All");
  const selectedGenres = ref<string[]>([]);
  const selectedAuthors = ref<string[]>([]);
  const minRating = ref<number>(0);
  const showFreeOnly = ref<boolean>(false);

  // Initialize filters from URL query params
  const initializeFiltersFromURL = () => {
    const query = route.query;

    if (query.category && typeof query.category === "string") {
      activeCategory.value = query.category;
    }

    if (query.language && typeof query.language === "string") {
      activeLanguage.value = query.language;
    }

    if (query.genres && typeof query.genres === "string") {
      selectedGenres.value = query.genres.split(",").filter(Boolean);
    }

    if (query.authors && typeof query.authors === "string") {
      selectedAuthors.value = query.authors.split(",").filter(Boolean);
    }

    if (query.rating && typeof query.rating === "string") {
      minRating.value = parseFloat(query.rating) || 0;
    }

    if (query.isFree === "true") {
      showFreeOnly.value = true;
    }
  };

  // Computed properties
  const categories = computed<string[]>(() => {
    if (!books.value || books.value.length === 0) {
      return ["All Categories"];
    }

    const uniqueCategories = [
      ...new Set(books.value.map((book: ExploreBook) => book.category)),
    ];

    return ["All Categories", ...uniqueCategories];
  });

  const genres = computed<string[]>(() => {
    if (!books.value || books.value.length === 0) {
      return [];
    }

    const allGenres = new Set<string>();
    books.value.forEach((book: ExploreBook) => {
      if (book.genre) {
        const genreList = Array.isArray(book.genre) ? book.genre : [book.genre];
        genreList.forEach((g: string) => allGenres.add(g));
      }
    });

    return Array.from(allGenres).sort();
  });

  const authors = computed<string[]>(() => {
    if (!books.value || books.value.length === 0) {
      return [];
    }

    const uniqueAuthors = [
      ...new Set(books.value.map((book: ExploreBook) => book.author)),
    ];

    return uniqueAuthors.sort();
  });

  const languages = computed<Array<{ name: string; count: number }>>(() => {
    if (!books.value || books.value.length === 0) {
      return [];
    }

    const counts: Record<string, number> = {};

    books.value.forEach((book: ExploreBook) => {
      counts[book.lang] = (counts[book.lang] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  });

  const hasActiveFilters = computed(() => {
    return (
      activeCategory.value !== "All Categories" ||
      activeLanguage.value !== "All" ||
      selectedGenres.value.length > 0 ||
      selectedAuthors.value.length > 0 ||
      minRating.value > 0 ||
      showFreeOnly.value
    );
  });

  // Filter actions
  const updateCategory = (category: string) => {
    activeCategory.value = category;
    syncURLParams();
  };

  const updateLanguage = (language: string) => {
    activeLanguage.value = language;
    syncURLParams();
  };

  const toggleGenre = (genre: string) => {
    const index = selectedGenres.value.indexOf(genre);
    if (index > -1) {
      selectedGenres.value.splice(index, 1);
    } else {
      selectedGenres.value.push(genre);
    }
    syncURLParams();
  };

  const toggleAuthor = (author: string) => {
    const index = selectedAuthors.value.indexOf(author);
    if (index > -1) {
      selectedAuthors.value.splice(index, 1);
    } else {
      selectedAuthors.value.push(author);
    }
    syncURLParams();
  };

  const updateRating = (rating: number) => {
    minRating.value = rating;
    syncURLParams();
  };

  const toggleFreeOnly = () => {
    showFreeOnly.value = !showFreeOnly.value;
    syncURLParams();
  };

  const clearFilters = () => {
    activeCategory.value = "All Categories";
    activeLanguage.value = "All";
    selectedGenres.value = [];
    selectedAuthors.value = [];
    minRating.value = 0;
    showFreeOnly.value = false;
    syncURLParams();
  };

  // Sync filters to URL
  const syncURLParams = () => {
    const query: Record<string, string> = {};

    if (activeCategory.value !== "All Categories") {
      query.category = activeCategory.value;
    }

    if (activeLanguage.value !== "All") {
      query.language = activeLanguage.value;
    }

    if (selectedGenres.value.length > 0) {
      query.genres = selectedGenres.value.join(",");
    }

    if (selectedAuthors.value.length > 0) {
      query.authors = selectedAuthors.value.join(",");
    }

    if (minRating.value > 0) {
      query.rating = minRating.value.toString();
    }

    if (showFreeOnly.value) {
      query.isFree = "true";
    }

    router.push({
      path: route.path,
      query,
    });
  };

  // Apply filters to books
  const filteredBooks = computed<ExploreBook[]>(() => {
    let result = [...(books.value || [])];

    // Category filter
    if (activeCategory.value !== "All Categories") {
      result = result.filter(
        (book: ExploreBook) => book.category === activeCategory.value,
      );
    }

    // Language filter
    if (activeLanguage.value !== "All") {
      result = result.filter(
        (book: ExploreBook) => book.lang === activeLanguage.value,
      );
    }

    // Genre filter
    if (selectedGenres.value.length > 0) {
      result = result.filter((book: ExploreBook) => {
        const bookGenres = Array.isArray(book.genre)
          ? book.genre
          : [book.genre];
        return selectedGenres.value.some((genre) => bookGenres.includes(genre));
      });
    }

    // Author filter
    if (selectedAuthors.value.length > 0) {
      result = result.filter((book: ExploreBook) =>
        selectedAuthors.value.includes(book.author),
      );
    }

    // Rating filter
    if (minRating.value > 0) {
      result = result.filter(
        (book: ExploreBook) => (book.rating || 0) >= minRating.value,
      );
    }

    // Free only filter
    if (showFreeOnly.value) {
      result = result.filter(
        (book: ExploreBook) => book.isFree === true,
      );
    }

    return result;
  });

  return {
    // States
    activeCategory,
    activeLanguage,
    selectedGenres,
    selectedAuthors,
    minRating,
    showFreeOnly,

    // Computed
    categories,
    genres,
    authors,
    languages,
    hasActiveFilters,
    filteredBooks,

    // Methods
    initializeFiltersFromURL,
    updateCategory,
    updateLanguage,
    toggleGenre,
    toggleAuthor,
    updateRating,
    toggleFreeOnly,
    clearFilters,
  };
}
