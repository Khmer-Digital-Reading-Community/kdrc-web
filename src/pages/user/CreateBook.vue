<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import CoverImageUploader from "@/components/common/CoverImageUploader.vue";
import {
  createBook,
  uploadBookCover,
  getGenres,
  getCategories,
  getTags,
  type BookMetadata,
  type Genre,
  type Category,
  type Tag,
} from "../../services/bookApi";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

// Form state
const projectType = ref<"formal-book" | "short-story">("formal-book");
const title = ref("");
const subtitle = ref("");
const description = ref("");
const authorBio = ref("");
const language = ref("English");
const ageRating = ref<BookMetadata["ageRating"] | "">("");

// Relationships
const selectedGenre = ref<string>("");
const selectedCategories = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const newTag = ref("");

// Series info
const seriesName = ref("");
const seriesPosition = ref<number>();

// Additional metadata
const publisher = ref("");
const pageCount = ref<number>();
const contentWarnings = ref<string[]>([]);
const newWarning = ref("");

// UI state
const coverPreviewUrl = ref<string | null>(null);
const uploadedCoverUrl = ref<string | null>(null);
const coverUploadError = ref<string | null>(null);
const isUploadingCover = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const activeTab = ref<"main" | "metadata" | "advanced">("main");

// Loading states
const isLoadingGenres = ref(false);
const isLoadingCategories = ref(false);
const isLoadingTags = ref(false);
const genresError = ref<string | null>(null);
const categoriesError = ref<string | null>(null);
const tagsError = ref<string | null>(null);

// Dropdowns data
const genres = ref<Genre[]>([]);
const categories = ref<Category[]>([]);
const tags = ref<Tag[]>([]);
const languages = [
  "English",
  "Khmer",
  "French",
  "Spanish",
  "Chinese",
  "Japanese",
];
const ageRatings = ["G", "PG", "PG-13", "R", "NC-17"];

// Load options from API
onMounted(async () => {
  await Promise.all([loadGenres(), loadCategories(), loadTags()]);
});

const loadGenres = async () => {
  isLoadingGenres.value = true;
  genresError.value = null;
  try {
    genres.value = await getGenres();
  } catch (error) {
    genresError.value = "Failed to load genres. Please refresh.";
    console.error("Failed to load genres:", error);
  } finally {
    isLoadingGenres.value = false;
  }
};

const loadCategories = async () => {
  isLoadingCategories.value = true;
  categoriesError.value = null;
  try {
    categories.value = await getCategories();
  } catch (error) {
    categoriesError.value = "Failed to load categories. Please refresh.";
    console.error("Failed to load categories:", error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const loadTags = async () => {
  isLoadingTags.value = true;
  tagsError.value = null;
  try {
    tags.value = await getTags();
  } catch (error) {
    tagsError.value = "Failed to load tags. Please refresh.";
    console.error("Failed to load tags:", error);
  } finally {
    isLoadingTags.value = false;
  }
};

const handleCoverSelected = async (file: File) => {
  coverUploadError.value = null;
  isUploadingCover.value = true;

  try {
    const previewUrl = URL.createObjectURL(file);
    coverPreviewUrl.value = previewUrl;

    const result = await uploadBookCover(file);
    uploadedCoverUrl.value = result.url;
    console.log("Cover uploaded successfully:", result.url);
    
    toast.success("Cover uploaded");
  } catch (error) {
    coverUploadError.value = "Failed to upload cover. Please try again.";
    toast.error(coverUploadError.value);
  } finally {
    isUploadingCover.value = false;
  }
};

const clearCover = () => {
  coverPreviewUrl.value = null;
  uploadedCoverUrl.value = null;
  coverUploadError.value = null;
};

const addTag = () => {
  if (
    newTag.value.trim() &&
    !selectedTags.value.includes(newTag.value.trim())
  ) {
    selectedTags.value.push(newTag.value.trim());
    newTag.value = "";
  }
};

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const addWarning = () => {
  if (
    newWarning.value.trim() &&
    !contentWarnings.value.includes(newWarning.value.trim())
  ) {
    contentWarnings.value.push(newWarning.value.trim());
    newWarning.value = "";
  }
};

const removeWarning = (warning: string) => {
  contentWarnings.value = contentWarnings.value.filter((w) => w !== warning);
};

const toggleCategory = (categoryId: string) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

const validateForm = () => {
  if (!title.value.trim()) {
    formError.value = "Title is required.";
    return false;
  }

  if (!description.value.trim()) {
    formError.value = "Description is required.";
    return false;
  }

  formError.value = null;
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const book = await createBook({
      title: title.value.trim(),
      description: description.value.trim(),
      coverImageUrl: uploadedCoverUrl.value || undefined,
      genreSlug: selectedGenre.value || undefined,
      categorySlugs: selectedCategories.value,
      tagSlugs: selectedTags.value,
      metadata: {
        subtitle: subtitle.value || undefined,
        authorBio: authorBio.value || undefined,
        language: language.value,
        ageRating: (ageRating.value || undefined) as
          | BookMetadata["ageRating"]
          | undefined,
        publisher: publisher.value || undefined,
        pageCount: pageCount.value || undefined,
        contentWarnings:
          contentWarnings.value.length > 0 ? contentWarnings.value : undefined,
        seriesName: seriesName.value || undefined,
        seriesPosition: seriesPosition.value || undefined,
      },
    });

    toast.success("Book created successfully!");
    router.push(`/${book.id}/write`);
  } catch (error) {
    formError.value = "Failed to create book. Please try again.";
    toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div class="max-w-5xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <p class="text-xs uppercase tracking-[0.2em] text-gray-400">
              Atelier
            </p>
            <h1 class="text-3xl font-semibold text-[#123C3A] mt-2">
              Create Book
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              Add all the details about your book or short story
            </p>
          </div>

          <!-- Project Type Selection -->
          <div class="mb-8 bg-amber-50 rounded-3xl p-6">
            <p class="text-sm font-semibold text-[#123C3A] mb-4">
              What are you writing?
            </p>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="projectType = 'formal-book'"
                :class="[
                  'p-4 rounded-xl border-2 transition text-center',
                  projectType === 'formal-book'
                    ? 'border-amber-700 bg-white'
                    : 'border-amber-200 bg-white/50 hover:bg-white',
                ]"
              >
                <p class="text-lg font-bold text-amber-700">📚 Formal Book</p>
                <p class="text-xs text-gray-600 mt-2">
                  Multiple chapters, full-featured
                </p>
              </button>
              <button
                @click="projectType = 'short-story'"
                :class="[
                  'p-4 rounded-xl border-2 transition text-center',
                  projectType === 'short-story'
                    ? 'border-amber-700 bg-white'
                    : 'border-amber-200 bg-white/50 hover:bg-white',
                ]"
              >
                <p class="text-lg font-bold text-amber-700">✍️ Short Story</p>
                <p class="text-xs text-gray-600 mt-2">
                  Single story, simple editor
                </p>
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <div class="flex gap-4 mb-6 border-b border-amber-200">
              <button
                @click="activeTab = 'main'"
                :class="[
                  'px-4 py-3 font-semibold text-sm transition',
                  activeTab === 'main'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Main Info
              </button>
              <button
                @click="activeTab = 'metadata'"
                :class="[
                  'px-4 py-3 font-semibold text-sm transition',
                  activeTab === 'metadata'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Categories & Tags
              </button>
              <button
                @click="activeTab = 'advanced'"
                :class="[
                  'px-4 py-3 font-semibold text-sm transition',
                  activeTab === 'advanced'
                    ? 'text-amber-700 border-b-2 border-amber-700'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Advanced
              </button>
            </div>
          </div>

          <!-- Main Tab -->
          <div
            v-if="activeTab === 'main'"
            class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6"
          >
            <div class="bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="title"
                  type="text"
                  placeholder="Enter a compelling book title"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <p v-if="title" class="text-xs text-gray-400 mt-1">
                  {{ title.length }} characters
                </p>
              </div>

              <!-- Subtitle -->
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2"
                  >Subtitle</label
                >
                <input
                  v-model="subtitle"
                  type="text"
                  placeholder="Optional: Add a subtitle or tagline"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="description"
                  placeholder="Write a compelling book description to attract readers..."
                  maxlength="500"
                  rows="6"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
                <div class="flex justify-between items-center mt-1">
                  <p class="text-xs text-gray-400">Max 500 characters</p>
                  <p
                    :class="[
                      'text-xs font-semibold',
                      description.length > 450
                        ? 'text-amber-700'
                        : 'text-gray-400',
                    ]"
                  >
                    {{ description.length }}/500
                  </p>
                </div>
              </div>

              <!-- Author Bio -->
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2"
                  >Author Bio</label
                >
                <textarea
                  v-model="authorBio"
                  placeholder="Tell readers about yourself and your writing..."
                  rows="4"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <!-- Error Alert -->
              <div
                v-if="formError"
                class="p-4 rounded-xl bg-red-50 border border-red-200"
              >
                <p class="text-sm text-red-700 font-semibold">
                  ⚠️ {{ formError }}
                </p>
              </div>

              <!-- Buttons -->
              <div class="flex flex-wrap gap-3 pt-4 border-t border-amber-100">
                <button
                  type="button"
                  @click="handleSubmit"
                  :disabled="isSubmitting || isUploadingCover"
                  class="px-6 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-semibold hover:bg-amber-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span
                    v-if="isSubmitting"
                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></span>
                  {{ isSubmitting ? "Creating..." : "Create Book" }}
                </button>
                <button
                  type="button"
                  @click="router.push('/dashboard/manuscripts')"
                  class="px-6 py-2.5 rounded-xl border border-amber-200 text-amber-800 text-sm font-semibold hover:bg-amber-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>

            <!-- Cover Section -->
            <div class="bg-white rounded-3xl p-6 shadow-sm h-fit">
              <CoverImageUploader
                :model-value="coverPreviewUrl"
                :error="coverUploadError"
                helper-text="JPG or PNG up to 2MB"
                @fileSelected="handleCoverSelected"
                @clear="clearCover"
              />
              <p
                v-if="isUploadingCover"
                class="text-xs text-amber-700 mt-3 font-semibold"
              >
                📤 Uploading cover...
              </p>
              <div
                class="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100"
              >
                <p class="text-xs text-gray-600">
                  <span class="font-semibold">💡 Tip:</span> A professional
                  cover image helps your book stand out and attract more
                  readers.
                </p>
              </div>
            </div>
          </div>

          <!-- Categories & Tags Tab -->
          <div
            v-if="activeTab === 'metadata'"
            class="bg-white rounded-3xl p-6 shadow-sm max-w-3xl space-y-6"
          >
            <!-- Genre -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-[#123C3A] mb-2"
                >Genre</label
              >
              <select
                v-model="selectedGenre"
                :disabled="isLoadingGenres"
                class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {{
                    isLoadingGenres ? "Loading genres..." : "Select a genre..."
                  }}
                </option>
                <option
                  v-for="genre in genres"
                  :key="genre.id"
                  :value="genre.slug"
                >
                  {{ genre.name }}
                </option>
              </select>
              <p v-if="genresError" class="text-xs text-red-600 mt-2">
                {{ genresError }}
              </p>
            </div>

            <!-- Language & Age Rating -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2"
                  >Language</label
                >
                <select
                  v-model="language"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option v-for="lang in languages" :key="lang" :value="lang">
                    {{ lang }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-[#123C3A] mb-2"
                  >Age Rating</label
                >
                <select
                  v-model="ageRating"
                  class="w-full rounded-xl border border-amber-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="">None</option>
                  <option
                    v-for="rating in ageRatings"
                    :key="rating"
                    :value="rating"
                  >
                    {{ rating }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-semibold text-[#123C3A]"
                  >Categories</label
                >
                <span v-if="isLoadingCategories" class="text-xs text-gray-400"
                  >Loading...</span
                >
              </div>
              <p v-if="categoriesError" class="text-xs text-red-600 mb-3">
                {{ categoriesError }}
              </p>
              <div
                v-if="
                  categories.length === 0 &&
                  !isLoadingCategories &&
                  !categoriesError
                "
                class="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg"
              >
                No categories available
              </div>
              <div
                v-else-if="isLoadingCategories"
                class="text-sm text-gray-500 p-3"
              >
                Loading categories...
              </div>
              <div v-else class="space-y-2">
                <label
                  v-for="cat in categories"
                  :key="cat.id"
                  class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-amber-50 transition"
                >
                  <input
                    type="checkbox"
                    :checked="selectedCategories.includes(cat.slug)"
                    @change="toggleCategory(cat.slug)"
                    class="w-4 h-4 rounded border-amber-300 text-amber-700 focus:ring-amber-500"
                  />
                  <span class="text-sm text-gray-700 font-medium">{{
                    cat.name
                  }}</span>
                </label>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-semibold text-[#123C3A]"
                  >Tags</label
                >
                <span v-if="isLoadingTags" class="text-xs text-gray-400"
                  >Loading...</span
                >
              </div>
              <p class="text-xs text-gray-500 mb-3">
                Search and add existing tags or create new ones
              </p>
              <p v-if="tagsError" class="text-xs text-red-600 mb-3">
                {{ tagsError }}
              </p>
              <div class="flex gap-2 mb-3">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="Add a tag..."
                  @keyup.enter="addTag"
                  :disabled="isLoadingTags"
                  class="flex-1 rounded-xl border border-amber-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="addTag"
                  :disabled="isLoadingTags || !newTag.trim()"
                  class="px-4 py-2 rounded-xl bg-amber-100 text-amber-700 text-sm font-semibold hover:bg-amber-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(tag)"
                    class="text-amber-700 hover:text-amber-900"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Advanced Tab -->
          <div
            v-if="activeTab === 'advanced'"
            class="bg-white rounded-3xl p-6 shadow-sm max-w-3xl space-y-6"
          >
            <!-- Series Info -->
            <div
              class="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-5 border border-teal-100"
            >
              <h3
                class="text-sm font-semibold text-[#123C3A] mb-4 flex items-center gap-2"
              >
                <span>📚</span> Series Information
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <input
                  v-model="seriesName"
                  type="text"
                  placeholder="e.g., The Chronicles of..."
                  class="rounded-xl border border-teal-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <input
                  v-model="seriesPosition"
                  type="number"
                  placeholder="Position in series"
                  min="1"
                  class="rounded-xl border border-teal-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <!-- Publication Info -->
            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100"
            >
              <h3
                class="text-sm font-semibold text-[#123C3A] mb-4 flex items-center gap-2"
              >
                <span>📖</span> Publication Information
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <input
                  v-model="publisher"
                  type="text"
                  placeholder="Publisher name"
                  class="rounded-xl border border-blue-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  v-model="pageCount"
                  type="number"
                  placeholder="Page count"
                  min="1"
                  class="rounded-xl border border-blue-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <!-- Content Warnings -->
            <div
              class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100"
            >
              <h3
                class="text-sm font-semibold text-[#123C3A] mb-2 flex items-center gap-2"
              >
                <span>⚠️</span> Content Warnings
              </h3>
              <p class="text-xs text-gray-600 mb-3">
                Add warnings for sensitive content in your book
              </p>
              <div class="flex gap-2 mb-3">
                <input
                  v-model="newWarning"
                  type="text"
                  placeholder="e.g., Violence, Gore, Abuse..."
                  @keyup.enter="addWarning"
                  class="flex-1 rounded-xl border border-red-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  type="button"
                  @click="addWarning"
                  :disabled="!newWarning.trim()"
                  class="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <div
                v-if="contentWarnings.length === 0"
                class="text-xs text-gray-400 italic"
              >
                No content warnings added
              </div>
              <div v-else class="flex flex-wrap gap-2">
                <span
                  v-for="warning in contentWarnings"
                  :key="warning"
                  class="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ warning }}
                  <button
                    type="button"
                    @click="removeWarning(warning)"
                    class="text-red-700 hover:text-red-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
