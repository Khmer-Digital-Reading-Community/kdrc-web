<template>
  <div class="min-h-screen bg-[#fbfaf7] pb-20">
    <div class="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <ExploreHeader />

      <div
        v-if="isMobileFilterOpen"
        class="fixed inset-0 z-50 lg:hidden"
      >
        <div
          class="absolute inset-0 bg-black/40"
          @click="isMobileFilterOpen = false"
        />

        <div
          class="absolute left-0 top-0 h-full w-[280px] overflow-y-auto bg-[#fbfaf7] p-6"
        >
          <div class="mb-8 flex items-center justify-between">
            <h2 class="text-lg font-bold text-[#093A3F]">
              Filters
            </h2>
            <button
              class="text-xl text-gray-500"
              @click="isMobileFilterOpen = false"
            >
              &times;
            </button>
          </div>

          <SidebarFilters
            :activeCategory="activeCategory"
            :categories="categories"
            :activeLanguage="activeLanguage"
            :activeMinRating="activeMinRating"
            :languages="languages"
            @updateCategory="
              activeCategory = $event;
              isMobileFilterOpen = false;
            "
            @updateLanguage="
              activeLanguage = $event;
              isMobileFilterOpen = false;
            "
            @updateMinRating="
              activeMinRating = $event;
              isMobileFilterOpen = false;
            "
          />
        </div>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <aside class="hidden lg:block lg:w-[200px] lg:shrink-0">
          <div class="sticky top-24">
            <SidebarFilters
              :activeCategory="activeCategory"
              :categories="categories"
              :activeLanguage="activeLanguage"
              :activeMinRating="activeMinRating"
              :languages="languages"
              @updateCategory="activeCategory = $event"
              @updateLanguage="activeLanguage = $event"
              @updateMinRating="activeMinRating = $event"
            />
          </div>
        </aside>

        <main class="min-w-0 flex-1 pb-6">
          <ExploreToolbar
            :sortBy="sortBy"
            :activeCategory="activeCategory"
            :activeLanguage="activeLanguage"
            @toggleFilter="isMobileFilterOpen = true"
            @updateSort="sortBy = $event"
          />

          <div
            v-if="loading"
            class="py-24 text-center"
          >
            Loading books...
          </div>

          <div
            v-else-if="error"
            class="py-24 text-center text-red-500"
          >
            {{ error }}
          </div>

          <EmptyExplore
            v-else-if="paginatedBooks.length === 0"
          />

          <ExploreGrid
            v-else
            :books="paginatedBooks"
          />

          <ExplorePagination
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
import { computed, ref, watch } from "vue";
import ExploreHeader from "@/components/explore/ExploreHeader.vue";
import SidebarFilters from "@/components/explore/SidebarFilters.vue";
import ExploreToolbar from "@/components/explore/ExploreToolbar.vue";
import ExploreGrid from "@/components/explore/ExploreGrid.vue";
import ExplorePagination from "@/components/explore/ExplorePagination.vue";
import EmptyExplore from "@/components/explore/EmptyExplore.vue";
import { useExploreBooks } from "../../composables/useExploreBooks";

const { books, loading, error } = useExploreBooks();

const activeCategory = ref("All Categories");
const activeLanguage = ref("All");
const activeMinRating = ref<number | null>(null);
const sortBy = ref("Newest Arrivals");
const isMobileFilterOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = 6;

const categories = computed(() => {
  if (!books.value) {
    return ["All Categories"];
  }

  return [
    "All Categories",
    ...new Set(books.value.map((book) => book.category)),
  ];
});

const languages = computed(() => {
  if (!books.value) {
    return [];
  }

  const counts: Record<string, number> = {};

  books.value.forEach((book) => {
    counts[book.lang] = (counts[book.lang] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }));
});

const filteredBooks = computed(() => {
  let result = [...books.value];

  if (activeCategory.value !== "All Categories") {
    result = result.filter(
      (book) => book.category === activeCategory.value
    );
  }

  if (activeLanguage.value !== "All") {
    result = result.filter(
      (book) => book.lang === activeLanguage.value
    );
  }

  if (activeMinRating.value !== null) {
    const minRating = activeMinRating.value;

    result = result.filter(
      (book) => book.rating >= minRating
    );
  }

  return result;
});

const sortedBooks = computed(() => {
  const result = [...filteredBooks.value];

  if (sortBy.value === "Popular") {
    return result.sort((a, b) => b.rating - a.rating);
  }

  if (sortBy.value === "Latest") {
    return result.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }

  return result.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
});

watch(
  [
    activeCategory,
    activeLanguage,
    activeMinRating,
    sortBy,
  ],
  () => {
    currentPage.value = 1;
  }
);

const totalPages = computed(() =>
  Math.ceil(sortedBooks.value.length / itemsPerPage)
);

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;

  return sortedBooks.value.slice(start, start + itemsPerPage);
});
</script>
