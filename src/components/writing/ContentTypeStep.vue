<template>
  <div class="space-y-8">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-[#123C3A] font-['Playfair_Display',Georgia,serif]">
        What are you writing?
      </h2>
      <p class="text-sm text-gray-500 mt-2">Tell us about your book</p>
    </div>

    <!-- Content Type Cards -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-3">Content Type</label>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          v-for="option in contentTypes"
          :key="option.value"
          @click="$emit('update:modelValue', option.value)"
          :class="[
            'relative p-4 rounded-xl border-2 text-center transition-all duration-300',
            'hover:shadow-md hover:-translate-y-0.5',
            modelValue === option.value
              ? 'border-[#c5a050] bg-gradient-to-br from-amber-50 to-amber-50/60 shadow-md shadow-amber-100/50'
              : 'border-gray-200/80 bg-white hover:border-amber-200 hover:bg-amber-50/30',
          ]"
        >
          <component
            :is="option.icon"
            :size="20"
            :stroke-width="1.5"
            :class="[
              'mx-auto mb-1.5 transition-colors',
              modelValue === option.value ? 'text-[#c5a050]' : 'text-gray-400',
            ]"
          />
          <span
            :class="[
              'text-xs font-semibold',
              modelValue === option.value ? 'text-[#123C3A]' : 'text-gray-600',
            ]"
          >
            {{ option.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Genre -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">
        Genre <span class="text-gray-400 font-normal">(optional)</span>
      </label>

      <!-- Selected genre chip -->
      <div v-if="selectedGenreName" class="mb-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#093A3F] text-white rounded-full text-xs font-medium"
        >
          {{ selectedGenreName }}
          <button @click="clearGenre" class="text-white/70 hover:text-white transition" type="button">&times;</button>
        </span>
      </div>

      <!-- Genre search input -->
      <div class="relative">
        <input
          v-model="genreSearch"
          type="text"
          :placeholder="selectedGenreName ? 'Change genre...' : 'Search or pick a genre...'"
          :disabled="isLoading"
          @focus="showGenreDropdown = true"
          @keydown.escape="showGenreDropdown = false"
          class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] disabled:opacity-50 placeholder:text-gray-400"
        />

        <!-- Genre dropdown -->
        <div
          v-if="showGenreDropdown && filteredGenres.length > 0 && !selectedGenreName"
          class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
        >
          <button
            v-for="g in filteredGenres"
            :key="g.id"
            @click="selectGenre(g.slug)"
            class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F1E8] transition flex items-center gap-2"
          >
            {{ g.name }}
          </button>
        </div>

        <!-- Create genre option -->
        <div
          v-if="showGenreDropdown && genreSearch.trim() && !exactGenreMatch && !selectedGenreName"
          class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          <button
            @click="createGenreHandler"
            :disabled="creatingGenre"
            class="w-full text-left px-4 py-2.5 text-sm text-[#c5a050] font-medium hover:bg-[#F6F1E8] transition flex items-center gap-2"
          >
            <span v-if="creatingGenre" class="w-3.5 h-3.5 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="text-xs">+</span>
            Create "{{ genreSearch.trim() }}"
          </button>
        </div>
      </div>

      <!-- Popular genre chips -->
      <div v-if="!selectedGenreName && !genreSearch" class="flex flex-wrap gap-2 mt-3">
        <button
          v-for="g in popularGenres"
          :key="g.id"
          @click="selectGenre(g.slug)"
          class="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:border-[#c5a050] hover:text-[#c5a050] transition"
        >
          {{ g.name }}
        </button>
      </div>
    </div>

    <!-- Categories -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">
        Categories <span class="text-gray-400 font-normal">(optional)</span>
      </label>

      <!-- Selected count -->
      <div v-if="categorySlugs.length > 0" class="flex flex-wrap gap-1.5 mb-2">
        <span
          v-for="slug in categorySlugs"
          :key="slug"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#093A3F] text-white rounded-full text-xs font-medium"
        >
          {{ getCategoryName(slug) }}
          <button @click="toggleCategory(slug)" class="text-white/70 hover:text-white transition" type="button">&times;</button>
        </span>
      </div>

      <!-- Category search -->
      <input
        v-model="categorySearch"
        type="text"
        :placeholder="categorySlugs.length ? 'Add more categories...' : 'Search or pick categories...'"
        :disabled="isLoading"
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] disabled:opacity-50 placeholder:text-gray-400"
      />

      <!-- Filtered category chips -->
      <div class="flex flex-wrap gap-2 mt-3">
        <button
          v-for="cat in filteredCategories"
          :key="cat.id"
          @click="toggleCategory(cat.slug)"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
            categorySlugs.includes(cat.slug)
              ? 'bg-[#093A3F] text-white border-[#093A3F]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#093A3F]/30',
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Create category -->
      <div v-if="categorySearch.trim() && !exactCategoryMatch" class="mt-2">
        <button
          @click="createCategoryHandler"
          :disabled="creatingCategory"
          class="inline-flex items-center gap-1.5 text-sm text-[#c5a050] font-medium hover:text-[#b09040] transition"
        >
          <span v-if="creatingCategory" class="w-3.5 h-3.5 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin"></span>
          <span v-else class="text-xs">+</span>
          Create "{{ categorySearch.trim() }}"
        </button>
      </div>

      <p v-if="isLoading && categories.length === 0" class="text-xs text-gray-400 mt-2">Loading categories...</p>
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">
        Tags <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <TagComboBox
        :modelValue="tagSlugs"
        :availableTags="availableTagSlugs"
        :loading="isLoading"
        @update:modelValue="(v: string[]) => $emit('update:tagSlugs', v)"
        @create:tag="(name: string) => $emit('createTag', name)"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">
        Description <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <textarea
        :value="description"
        @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        placeholder="Briefly describe what your book is about..."
        rows="4"
        maxlength="500"
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] resize-none placeholder:text-gray-400"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">{{ description.length }}/500</p>
    </div>

    <p v-if="error" class="text-sm text-red-500 bg-red-50 rounded-lg p-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ContentType } from "../../composables/useBookWizard";
import type { Genre, Category, Tag } from "../../services/bookApi";
import TagComboBox from "./TagComboBox.vue";
import { ref, computed } from "vue";
import {
  BookOpen,
  BookMarked,
  ScrollText,
  Feather,
  GraduationCap,
  Sparkles,
} from "lucide-vue-next";

const props = defineProps<{
  modelValue: ContentType | null;
  description: string;
  genreSlug: string;
  categorySlugs: string[];
  tagSlugs: string[];
  genres: Genre[];
  categories: Category[];
  tags: Tag[];
  isLoading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ContentType];
  "update:description": [value: string];
  "update:genreSlug": [value: string];
  "update:categorySlugs": [value: string[]];
  "update:tagSlugs": [value: string[]];
  "createGenre": [name: string];
  "createCategory": [name: string];
  "createTag": [name: string];
}>();

const genreSearch = ref("");
const showGenreDropdown = ref(false);
const creatingGenre = ref(false);

const categorySearch = ref("");
const creatingCategory = ref(false);

const contentTypes: {
  value: ContentType;
  label: string;
  icon: typeof BookOpen;
  guide: string;
}[] = [
  { value: "Novel", label: "Novel", icon: BookOpen, guide: "50,000+ words, full narrative arc" },
  { value: "Novella", label: "Novella", icon: BookMarked, guide: "17,500–40,000 words" },
  { value: "Short Story", label: "Short Story", icon: ScrollText, guide: "Under 7,500 words" },
  { value: "Poem Collection", label: "Poem Collection", icon: Feather, guide: "Collection of poems" },
  { value: "Educational", label: "Educational", icon: GraduationCap, guide: "Lessons, guides, tutorials" },
  { value: "Other", label: "Other", icon: Sparkles, guide: "Something different" },
];

const selectedGenreName = computed(() => {
  const g = props.genres.find((g) => g.slug === props.genreSlug);
  return g ? g.name : "";
});

const popularGenres = computed(() => props.genres.slice(0, 8));

const filteredGenres = computed(() => {
  const q = genreSearch.value.toLowerCase().trim();
  if (!q) return [];
  return props.genres.filter((g) => g.name.toLowerCase().includes(q));
});

const exactGenreMatch = computed(() => {
  const q = genreSearch.value.trim().toLowerCase();
  return props.genres.some((g) => g.name.toLowerCase() === q);
});

const filteredCategories = computed(() => {
  const q = categorySearch.value.toLowerCase().trim();
  if (!q) return props.categories;
  return props.categories.filter((c) => c.name.toLowerCase().includes(q));
});

const exactCategoryMatch = computed(() => {
  const q = categorySearch.value.trim().toLowerCase();
  return props.categories.some((c) => c.name.toLowerCase() === q);
});

const availableTagSlugs = computed(() => props.tags.map((t) => t.slug));

function getCategoryName(slug: string): string {
  const cat = props.categories.find((c) => c.slug === slug);
  return cat ? cat.name : slug;
}

function selectGenre(slug: string) {
  emit("update:genreSlug", slug);
  genreSearch.value = "";
  showGenreDropdown.value = false;
}

function clearGenre() {
  emit("update:genreSlug", "");
  genreSearch.value = "";
}

function toggleCategory(slug: string) {
  if (props.categorySlugs.includes(slug)) {
    emit("update:categorySlugs", props.categorySlugs.filter((s) => s !== slug));
  } else {
    emit("update:categorySlugs", [...props.categorySlugs, slug]);
  }
}

async function createGenreHandler() {
  const name = genreSearch.value.trim();
  if (!name) return;
  creatingGenre.value = true;
  emit("createGenre", name);
  genreSearch.value = "";
  showGenreDropdown.value = false;
  // Parent handles the actual API call; we just reset local state
  setTimeout(() => { creatingGenre.value = false; }, 1000);
}

async function createCategoryHandler() {
  const name = categorySearch.value.trim();
  if (!name) return;
  creatingCategory.value = true;
  emit("createCategory", name);
  categorySearch.value = "";
  // Parent handles the actual API call
  setTimeout(() => { creatingCategory.value = false; }, 1000);
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".relative")) {
    showGenreDropdown.value = false;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("click", handleClickOutside);
}
</script>
