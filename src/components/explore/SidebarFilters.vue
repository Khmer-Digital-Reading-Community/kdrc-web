<template>
  <div class="flex flex-col gap-8">
    <!-- Clear Filters Button -->
    <button
      v-if="hasActiveFilters"
      @click="emit('clearFilters')"
      class="w-full px-4 py-2 bg-red-500 text-white rounded-lg
             font-semibold text-sm hover:bg-red-600 transition-colors"
    >
      Clear All Filters
    </button>

    <!-- Categories -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-4"
      >
        Categories
      </h3>

      <div class="flex flex-col gap-1">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="
            activeCategory === cat
              ? 'bg-[#1c3a2e] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          "
          class="w-full text-left px-4 py-2.5
                 rounded-xl text-[14px]
                 font-medium transition-all"
          @click="emit('updateCategory', cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Genres (Multiple Selection) -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-4"
      >
        Genres
      </h3>

      <div class="flex flex-col gap-2">
        <label
          v-for="genre in genres"
          :key="genre"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            :checked="selectedGenres.includes(genre)"
            @change="(e) => emit('toggleGenre', genre)"
            class="w-4 h-4 accent-[#B4690E] cursor-pointer
                   rounded transition-all"
          />
          <span
            class="text-sm text-gray-600 group-hover:text-[#B4690E]
                   transition-colors"
          >
            {{ genre }}
          </span>
        </label>
      </div>
    </div>

    <!-- Authors (Multiple Selection) -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-4"
      >
        Authors
      </h3>

      <div class="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
        <label
          v-for="author in authors"
          :key="author"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            :checked="selectedAuthors.includes(author)"
            @change="(e) => emit('toggleAuthor', author)"
            class="w-4 h-4 accent-[#B4690E] cursor-pointer
                   rounded transition-all"
          />
          <span
            class="text-sm text-gray-600 group-hover:text-[#B4690E]
                   transition-colors truncate"
          >
            {{ author }}
          </span>
        </label>
      </div>
    </div>

    <!-- Rating Filter -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-4"
      >
        Minimum Rating
      </h3>

      <div class="flex flex-col gap-3">
        <!-- Rating Slider -->
        <div class="flex items-center gap-4">
          <input
            v-model.number="ratingSliderValue"
            type="range"
            min="0"
            max="5"
            step="0.5"
            @input="emit('updateRating', ratingSliderValue)"
            class="w-full h-2 bg-gray-200 rounded-lg
                   appearance-none cursor-pointer
                   accent-[#B4690E]"
          />
          <span class="text-sm font-bold text-[#B4690E] min-w-[2.5rem]">
            {{ ratingSliderValue }}★
          </span>
        </div>

        <!-- Rating Buttons -->
        <div class="flex flex-col gap-2">
          <button
            v-for="rating in [5, 4, 3, 2, 1]"
            :key="rating"
            @click="emit('updateRating', rating)"
            :class="
              minRating === rating
                ? 'bg-[#1c3a2e] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50
                   border border-gray-200'
            "
            class="w-full text-left px-4 py-2 rounded-lg
                   text-sm font-medium transition-all
                   flex items-center gap-2"
          >
            <span v-for="i in rating" :key="i" class="text-[#B4690E]">★</span>
            <span class="text-xs text-gray-500">{{ rating }}+ stars</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-gray-400 mb-4"
      >
        Language
      </h3>

      <div class="flex flex-col gap-3">
        <button
          v-for="lang in languages"
          :key="lang.name"
          @click="emit('updateLanguage', lang.name)"
          class="flex justify-between text-sm
                 group cursor-pointer"
        >
          <span
            :class="
              activeLanguage === lang.name
                ? 'text-[#093A3F] font-bold'
                : 'text-gray-600'
            "
            class="group-hover:text-[#093A3F]
                   transition-colors"
          >
            {{ lang.name }}
          </span>

          <span
            class="text-gray-400 font-mono
                   text-[11px]
                   group-hover:text-[#B4690E]
                   transition-colors"
          >
            {{ lang.count }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  activeCategory: string;
  categories: string[];
  activeLanguage: string;
  languages: { name: string; count: number }[];
  genres: string[];
  selectedGenres: string[];
  authors: string[];
  selectedAuthors: string[];
  minRating: number;
}>();

const emit = defineEmits([
  "updateCategory",
  "updateLanguage",
  "toggleGenre",
  "toggleAuthor",
  "updateRating",
  "clearFilters",
]);

const ratingSliderValue = computed<number>({
  get: () => props.minRating,
  set: (val) => emit("updateRating", val),
});

const hasActiveFilters = computed(() => {
  return (
    props.activeCategory !== "All Categories" ||
    props.activeLanguage !== "All" ||
    props.selectedGenres.length > 0 ||
    props.selectedAuthors.length > 0 ||
    props.minRating > 0
  );
});
</script>