<template>
  <div class="bg-[#F8F9F8] min-h-screen pb-20">
    <div class="max-w-[1320px] mx-auto px-4 sm:px-8 md:px-12 pt-4 sm:pt-16">
      <ExploreHeader />

      <div v-if="isMobileFilterOpen" class="fixed inset-0 z-50 md:hidden">
        <div
          class="absolute inset-0 bg-black/40"
          @click="isMobileFilterOpen = false"
        />

        <div
          class="absolute left-0 top-0 h-full w-[280px] bg-white p-6 overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-8">
            <h2 class="font-bold text-lg text-[#093A3F]">Filters</h2>
            <button
              @click="isMobileFilterOpen = false"
              class="text-gray-500 text-xl"
            >
              ×
            </button>
          </div>

          <SidebarFilters
            :activeCategory="activeCategory"
            :categories="categories"
            :activeLanguage="activeLanguage"
            :languages="languages"
            :genres="genres"
            :selectedGenres="selectedGenres"
            :authors="authors"
            :selectedAuthors="selectedAuthors"
            :minRating="minRating"
            @updateCategory="
              updateCategory($event);
              isMobileFilterOpen = false;
            "
            @updateLanguage="
              updateLanguage($event);
              isMobileFilterOpen = false;
            "
            @toggleGenre="toggleGenre"
            @toggleAuthor="toggleAuthor"
            @updateRating="updateRating"
            @clearFilters="clearFilters"
          />
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-16">
        <!-- Desktop Sidebar -->
        <aside
          class="hidden md:block w-[200px] shrink-0 sticky top-20 max-h-[calc(100vh-80px)] overflow-y-auto"
        >
          <SidebarFilters
            :activeCategory="activeCategory"
            :categories="categories"
            :activeLanguage="activeLanguage"
            :languages="languages"
            :genres="genres"
            :selectedGenres="selectedGenres"
            :authors="authors"
            :selectedAuthors="selectedAuthors"
            :minRating="minRating"
            @updateCategory="updateCategory"
            @updateLanguage="updateLanguage"
            @toggleGenre="toggleGenre"
            @toggleAuthor="toggleAuthor"
            @updateRating="updateRating"
            @clearFilters="clearFilters"
          />
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <ExploreToolbar
            :sortBy="sortBy"
            :activeCategory="activeCategory"
            :activeLanguage="activeLanguage"
            @toggleFilter="isMobileFilterOpen = true"
            @toggleSort="
              sortBy =
                sortBy === 'Newest Arrivals' ? 'Top Rated' : 'Newest Arrivals'
            "
          />

          <div v-if="loading" class="text-center py-24">Loading books...</div>

          <div v-else-if="error" class="text-center py-24 text-red-500">
            {{ error }}
          </div>

          <EmptyExplore v-else-if="paginatedBooks.length === 0" />

          <ExploreGrid v-else :books="paginatedBooks" />

          <ExplorePagination
            v-if="totalPages > 1"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @next="currentPage++"
            @prev="currentPage--"
            @go="currentPage = $event"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import ExploreHeader from "@/components/explore/ExploreHeader.vue";
import SidebarFilters from "@/components/explore/SidebarFilters.vue";
import ExploreToolbar from "@/components/explore/ExploreToolbar.vue";
import ExploreGrid from "@/components/explore/ExploreGrid.vue";
import ExplorePagination from "@/components/explore/ExplorePagination.vue";
import EmptyExplore from "@/components/explore/EmptyExplore.vue";
import { useExploreBooks } from "../../composables/useExploreBooks";
import { useExploreFilters } from "../../composables/useExploreFilters";

const { books, loading, error } = useExploreBooks();

const {
  activeCategory,
  activeLanguage,
  selectedGenres,
  selectedAuthors,
  minRating,
  categories,
  genres,
  authors,
  languages,
  filteredBooks,
  initializeFiltersFromURL,
  updateCategory,
  updateLanguage,
  toggleGenre,
  toggleAuthor,
  updateRating,
  clearFilters,
} = useExploreFilters(books);

const sortBy = ref("Newest Arrivals");
const isMobileFilterOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = 9;

onMounted(() => {
  initializeFiltersFromURL();
});

const sortedBooks = computed(() => {
  const result = [...filteredBooks.value];

  if (sortBy.value === "Newest Arrivals") {
    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  if (sortBy.value === "Top Rated") {
    return result.sort((a, b) => b.rating - a.rating);
  }

  return result;
});

watch(
  [
    activeCategory,
    activeLanguage,
    selectedGenres,
    selectedAuthors,
    minRating,
    sortBy,
  ],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);

const totalPages = computed(() =>
  Math.ceil(sortedBooks.value.length / itemsPerPage),
);

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return sortedBooks.value.slice(start, start + itemsPerPage);
});
</script>
