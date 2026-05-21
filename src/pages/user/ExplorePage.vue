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
                        <h2 class="font-bold text-lg text-[#093A3F]">
                            Filters
                        </h2>
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
                        @updateCategory="
                            activeCategory = $event;
                            isMobileFilterOpen = false;
                        "
                        @updateLanguage="
                            activeLanguage = $event;
                            isMobileFilterOpen = false;
                        "
                    />
                </div>
            </div>

            <!-- Main Layout -->
            <div class="flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-16">
                <!-- Desktop Sidebar -->
                <aside class="hidden md:block w-[200px] shrink-0">
                    <SidebarFilters
                        :activeCategory="activeCategory"
                        :categories="categories"
                        :activeLanguage="activeLanguage"
                        :languages="languages"
                        @updateCategory="activeCategory = $event"
                        @updateLanguage="activeLanguage = $event"
                    />
                </aside>

                <!-- Main Content -->
                <main class="flex-1">
                    <ExploreToolbar
                        :sortBy="sortBy"
                        @toggleFilter="isMobileFilterOpen = true"
                        @update:sortBy="sortBy = $event"
                    />

                    <div v-if="loading" class="text-center py-24">
                        Loading books...
                    </div>

                    <div
                        v-else-if="error"
                        class="text-center py-24 text-red-500"
                    >
                        {{ error }}
                    </div>

                    <EmptyExplore v-else-if="paginatedBooks.length === 0" />

                    <ExploreGrid v-else :books="paginatedBooks" />

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
import { ref, computed, watch } from "vue";
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
const sortBy = ref("Newest Arrivals");
const isMobileFilterOpen = ref(false);
const currentPage = ref(1);
const itemsPerPage = 6;

const categories = computed(() => {
    if (!books.value) {
        return ["All Categories"];
    }

    const uniqueCategories = [
        ...new Set(books.value.map((book) => book.category)),
    ];

    return ["All Categories", ...uniqueCategories];
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
        result = result.filter((b) => b.category === activeCategory.value);
    }

    if (activeLanguage.value !== "All") {
        result = result.filter((b) => b.lang === activeLanguage.value);
    }

    // Sort
    if (sortBy.value === "Newest Arrivals") {
        result.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    } else if (sortBy.value === "Top Rated") {
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
});

watch([activeCategory, activeLanguage, sortBy], () => {
    currentPage.value = 1;
});

const totalPages = computed(() =>
    Math.ceil(filteredBooks.value.length / itemsPerPage),
);

const paginatedBooks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;

    return filteredBooks.value.slice(start, start + itemsPerPage);
});
</script>
