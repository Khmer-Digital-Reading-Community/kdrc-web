<template>
  <div class="search-container">
    <div class="search-wrapper relative flex-grow max-w-2xl">
      <div class="search-input-group relative">
        <svg
          class="search-icon absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>

        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Search books, authors, topics..."
          class="w-full pl-12 pr-10 py-2.5 md:py-3 rounded-[12px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B4690E] focus:border-transparent transition-all placeholder-gray-400 text-sm md:text-base"
          :aria-label="'Search books and authors'"
          :aria-expanded="showSuggestions"
          aria-autocomplete="list"
          :aria-controls="showSuggestions ? 'search-suggestions' : undefined"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
        />

        <button
          v-if="query"
          class="clear-btn absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
          @click="clearSearch"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <div
          v-if="isLoading"
          class="loading-spinner absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
        ></div>
      </div>

      <!-- Autocomplete Dropdown -->
      <div
        v-if="
          showSuggestions &&
          (recentSearches.length > 0 ||
            filteredSuggestions.length > 0 ||
            query.trim())
        "
        class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-[12px] shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto"
        id="search-suggestions"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading && query.trim()"
          class="px-4 py-4 flex items-center justify-center gap-2 text-gray-500 text-sm"
        >
          <div class="spinner-small w-3 h-3"></div>
          <span>Finding suggestions...</span>
        </div>

        <!-- Recent Searches -->
        <div
          v-else-if="!query.trim() && recentSearches.length > 0"
          class="border-b border-gray-100"
        >
          <p
            class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Recent
          </p>
          <button
            v-for="(search, index) in recentSearches"
            :key="`recent-${search}`"
            :class="[
              'block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700',
              { 'bg-blue-50': selectedIndex === index },
            ]"
            @click="selectRecentSearch(search)"
            @mouseenter="selectedIndex = index"
          >
            <svg
              class="w-4 h-4 inline-block mr-2 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ search }}
          </button>
        </div>

        <!-- Suggestions with categories -->
        <template v-else-if="filteredSuggestions.length > 0">
          <!-- Books Section -->
          <div
            v-if="bookSuggestions.length > 0"
            class="border-b border-gray-100"
          >
            <p
              class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Books
            </p>
            <button
              v-for="(item, index) in bookSuggestions"
              :key="`book-${item.id}`"
              :class="[
                'w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3',
                { 'bg-blue-50': selectedIndex === index },
              ]"
              @click="selectSuggestion(item)"
              @mouseenter="selectedIndex = index"
            >
              <img
                v-if="item.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="w-8 h-10 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <div
                  class="text-sm text-gray-900 truncate"
                  v-html="highlightMatch(item.title ?? '')"
                ></div>
                <div class="text-xs text-gray-500">
                  by {{ item.author?.name || "Unknown" }}
                </div>
              </div>
              <svg
                class="w-4 h-4 text-gray-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Authors Section -->
          <div
            v-if="authorSuggestions.length > 0"
            class="border-b border-gray-100"
          >
            <p
              class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Authors
            </p>
            <button
              v-for="(item, index) in authorSuggestions"
              :key="`author-${item.id}`"
              :class="[
                'w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3',
                {
                  'bg-blue-50':
                    selectedIndex === bookSuggestions.length + index,
                },
              ]"
              @click="selectAuthorSuggestion(item)"
              @mouseenter="selectedIndex = bookSuggestions.length + index"
            >
              <div
                class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-700"
              >
                {{ item.author?.name?.charAt(0) || "A" }}
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="text-sm text-gray-900 truncate"
                  v-html="highlightMatch(item.author?.name ?? '')"
                ></div>
                <div class="text-xs text-gray-500">Author</div>
              </div>
            </button>
          </div>

          <!-- View All Button -->
          <div class="border-t border-gray-100 p-2">
            <button
              class="w-full px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors rounded"
              @click="viewAllResults"
            >
              View all results for "{{ query }}"
            </button>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else-if="query.trim()" class="px-4 py-8 text-center">
          <svg
            class="w-10 h-10 mx-auto mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <p class="text-gray-600 text-sm font-medium">No results found</p>
          <p class="text-gray-400 text-xs mt-1">Try a different search term</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAutocomplete } from "../../composables/useAutocomplete";

const router = useRouter();
const searchInput = ref<HTMLInputElement | null>(null);
const query = ref<string>("");
const selectedIndex = ref<number>(-1);
const showSuggestions = ref<boolean>(false);
const recentSearches = ref<string[]>([]);

const { suggestions, isLoading, fetchSuggestions, clearSuggestions } =
  useAutocomplete();

// Load recent searches from localStorage
const loadRecentSearches = () => {
  const stored = localStorage.getItem("recentSearches");
  if (stored) {
    try {
      recentSearches.value = JSON.parse(stored).slice(0, 5);
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }
};

const saveRecentSearch = (query: string) => {
  const cleaned = query.trim();
  if (!cleaned) return;

  const updated = [
    cleaned,
    ...recentSearches.value.filter((s) => s !== cleaned),
  ].slice(0, 5);

  recentSearches.value = updated;
  localStorage.setItem("recentSearches", JSON.stringify(updated));
};

const bookSuggestions = computed(() =>
  suggestions.value.filter((item) => item.type === "book"),
);

const authorSuggestions = computed(() =>
  suggestions.value.filter((item) => item.type === "author"),
);

const filteredSuggestions = computed(() => suggestions.value);

const handleInput = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  query.value = target.value;
  selectedIndex.value = -1;

  if (query.value.trim().length > 0) {
    showSuggestions.value = true;
    await fetchSuggestions(query.value);
  } else {
    clearSuggestions();
  }
};

const handleFocus = () => {
  showSuggestions.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const handleKeydown = (event: KeyboardEvent) => {
  const totalItems = Math.max(
    recentSearches.value.length,
    filteredSuggestions.value.length,
  );

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, totalItems - 1);
      break;

    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;

    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        if (query.value.trim() === "") {
          selectRecentSearch(recentSearches.value[selectedIndex.value]);
        } else {
          selectSuggestion(filteredSuggestions.value[selectedIndex.value]);
        }
      } else if (query.value.trim()) {
        viewAllResults();
      }
      break;

    case "Escape":
      event.preventDefault();
      closeSuggestions();
      break;

    default:
      break;
  }
};

const selectSuggestion = (item: any) => {
  if (item.type === "book") {
    saveRecentSearch(item.title);
    router.push({
      name: "book-detail",
      params: { id: item.id },
    });
  } else {
    viewAllResults();
  }
  closeSuggestions();
};

const selectAuthorSuggestion = (item: any) => {
  const authorName = item.author?.name || "";
  saveRecentSearch(authorName);
  router.push({
    name: "search",
    query: { q: `author:"${authorName}"` },
  });
  closeSuggestions();
};

const selectRecentSearch = (search: string) => {
  query.value = search;
  viewAllResults();
};

const viewAllResults = () => {
  if (query.value.trim()) {
    saveRecentSearch(query.value);
    router.push({
      name: "search",
      query: { q: query.value, page: "1" },
    });
  }
  closeSuggestions();
};

const clearSearch = () => {
  query.value = "";
  selectedIndex.value = -1;
  clearSuggestions();
  showSuggestions.value = false;
  searchInput.value?.focus();
};

const closeSuggestions = () => {
  showSuggestions.value = false;
  selectedIndex.value = -1;
};

const highlightMatch = (text: string): string => {
  if (!query.value || !text) return text;

  const regex = new RegExp(`(${query.value})`, "gi");
  return text.replace(
    regex,
    '<mark class="font-semibold text-orange-600">$1</mark>',
  );
};

// Initialize
loadRecentSearches();

// Watch for route changes to clear input
watch(
  () => router.currentRoute.value.name,
  (newName) => {
    if (newName !== "search") {
      query.value = "";
    }
  },
);
</script>

<style scoped>
.loading-spinner {
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.spinner-small {
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
