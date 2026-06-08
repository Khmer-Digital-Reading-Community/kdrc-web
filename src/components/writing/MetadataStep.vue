<template>
  <div class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-[#123C3A] font-['Playfair_Display',Georgia,serif]">
        Genre & Categories
      </h2>
      <p class="text-sm text-gray-500 mt-2">Help readers find your book</p>
    </div>

    <!-- Genre -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">Genre</label>
      <select
        :value="genreSlug"
        @change="$emit('update:genreSlug', ($event.target as HTMLSelectElement).value)"
        :disabled="loadingGenres"
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] disabled:opacity-50"
      >
        <option value="">{{ loadingGenres ? "Loading..." : "Select a genre" }}</option>
        <option v-for="g in genres" :key="g.id" :value="g.slug">{{ g.name }}</option>
      </select>
    </div>

    <!-- Categories -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-3">Categories</label>
      <div v-if="loadingCategories" class="text-sm text-gray-400 py-2">Loading categories...</div>
      <div v-else-if="categories.length === 0" class="text-sm text-gray-400 py-2">No categories available</div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="toggle(cat.slug)"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
            categorySlugs.includes(cat.slug)
              ? 'bg-[#093A3F] text-white border-[#093A3F]'
              : 'bg-white text-gray-700 border-gray-200 hover:border-[#093A3F]/30',
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">Tags</label>
      <TagComboBox
        :modelValue="tagSlugs"
        :availableTags="availableTagNames"
        :loading="loadingTags"
        :error="tagsError"
        @update:modelValue="(v: string[]) => $emit('update:tagSlugs', v)"
      />
    </div>

    <p v-if="error" class="text-sm text-red-500 bg-red-50 rounded-lg p-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Genre, Category, Tag } from "../../services/bookApi";
import TagComboBox from "./TagComboBox.vue";
import { computed } from "vue";

const props = defineProps<{
  genreSlug: string;
  categorySlugs: string[];
  tagSlugs: string[];
  genres: Genre[];
  categories: Category[];
  tags: Tag[];
  loadingGenres?: boolean;
  loadingCategories?: boolean;
  loadingTags?: boolean;
  error?: string | null;
  tagsError?: string | null;
}>();

const emit = defineEmits<{
  "update:genreSlug": [value: string];
  "update:categorySlugs": [value: string[]];
  "update:tagSlugs": [value: string[]];
}>();

const availableTagNames = computed(() => props.tags.map((t) => t.slug));

function toggle(slug: string) {
  if (props.categorySlugs.includes(slug)) {
    emit("update:categorySlugs", props.categorySlugs.filter((s) => s !== slug));
  } else {
    emit("update:categorySlugs", [...props.categorySlugs, slug]);
  }
}
</script>
