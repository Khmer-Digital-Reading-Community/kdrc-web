<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex justify-end"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30"></div>

      <!-- Drawer -->
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 class="text-lg font-bold text-[#123C3A]">Book Settings</h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition',
              activeTab === tab
                ? 'text-[#c5a050] border-b-2 border-[#c5a050]'
                : 'text-gray-400 hover:text-gray-600',
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Book Info Tab -->
        <div v-if="activeTab === 'Book Info'" class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Title</label>
            <input
              v-model="localTitle"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              v-model="localDescription"
              rows="4"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 resize-none"
            ></textarea>
          </div>

          <!-- Cover -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Cover</label>
            <div v-if="localCoverPreview" class="relative w-24 aspect-[2/3] rounded-lg overflow-hidden mb-2">
              <img :src="localCoverPreview" alt="Cover" class="w-full h-full object-cover" />
              <button
                @click="$emit('removeCover')"
                class="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-xs hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <label class="inline-block px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition">
              {{ localCoverPreview ? 'Change' : 'Upload' }}
              <input type="file" accept="image/jpeg,image/png" class="hidden" @change="onCoverChange" />
            </label>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Genre</label>
            <select
              v-model="localGenreSlug"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20"
            >
              <option value="">None</option>
              <option v-for="g in genres" :key="g.id" :value="g.slug">{{ g.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Categories</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="toggleCat(cat.slug)"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
                  localCategorySlugs.includes(cat.slug)
                    ? 'bg-[#093A3F] text-white border-[#093A3F]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#093A3F]/30',
                ]"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Tags</label>
            <TagComboBox
              :modelValue="localTagSlugs"
              :availableTags="availableTagNames"
              @update:modelValue="localTagSlugs = $event"
            />
          </div>

          <button
            @click="$emit('saveMetadata', {
              title: localTitle,
              description: localDescription,
              genreSlug: localGenreSlug,
              categorySlugs: localCategorySlugs,
              tagSlugs: localTagSlugs,
            })"
            :disabled="saving"
            class="w-full py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition disabled:opacity-60"
          >
            {{ saving ? 'Saving...' : 'Save Book Info' }}
          </button>
        </div>

        <!-- Pricing Tab -->
        <div v-if="activeTab === 'Pricing'" class="p-6 space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-[#123C3A]">Free Book</p>
              <p class="text-xs text-gray-500">Make this book free to read</p>
            </div>
            <button
              @click="localIsFree = !localIsFree"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors',
                localIsFree ? 'bg-green-500' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  localIsFree ? 'translate-x-5' : '',
                ]"
              ></span>
            </button>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Price (credits)</label>
            <input
              v-model.number="localPrice"
              type="number"
              min="0"
              step="0.01"
              :disabled="localIsFree"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-[#123C3A]">Purchasable</p>
              <p class="text-xs text-gray-500">Allow individual purchase</p>
            </div>
            <button
              @click="localIsPurchasable = !localIsPurchasable"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors',
                localIsPurchasable ? 'bg-green-500' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  localIsPurchasable ? 'translate-x-5' : '',
                ]"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-[#123C3A]">Premium</p>
              <p class="text-xs text-gray-500">Requires subscription to access</p>
            </div>
            <button
              @click="localIsPremium = !localIsPremium"
              :class="[
                'relative w-11 h-6 rounded-full transition-colors',
                localIsPremium ? 'bg-yellow-500' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  localIsPremium ? 'translate-x-5' : '',
                ]"
              ></span>
            </button>
          </div>

          <button
            @click="$emit('savePricing', {
              isFree: localIsFree,
              price: Number(localPrice) || 0,
              isPurchasable: localIsPurchasable,
              isPremium: localIsPremium,
            })"
            :disabled="saving"
            class="w-full py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition disabled:opacity-60"
          >
            {{ saving ? 'Saving...' : 'Save Pricing' }}
          </button>
        </div>

        <!-- Chapter Tab -->
        <div v-if="activeTab === 'Chapter' && selectedChapter" class="p-6 space-y-5">
          <div class="bg-amber-50 rounded-xl p-4 text-center">
            <p class="text-sm font-semibold text-[#123C3A]">{{ selectedChapter.title }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ selectedChapter.wordCount ?? 0 }} words
              &middot;
              ~{{ Math.max(1, Math.ceil((selectedChapter.wordCount ?? 0) / 200)) }} min read
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Title</label>
            <input
              v-model="chapterTitle"
              type="text"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Type</label>
            <select
              v-model="chapterType"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20"
            >
              <option value="CHAPTER">Chapter</option>
              <option value="PROLOGUE">Prologue</option>
              <option value="EPILOGUE">Epilogue</option>
              <option value="BONUS">Bonus</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              v-model="chapterDescription"
              rows="3"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Price override (credits)</label>
            <input
              v-model.number="chapterPrice"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20"
            />
          </div>

          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-gray-600">Purchasable</p>
            <button
              @click="chapterIsPurchasable = !chapterIsPurchasable"
              :class="['relative w-11 h-6 rounded-full transition-colors', chapterIsPurchasable ? 'bg-green-500' : 'bg-gray-300']"
            >
              <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', chapterIsPurchasable ? 'translate-x-5' : '']"></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-gray-600">Premium</p>
            <button
              @click="chapterIsPremium = !chapterIsPremium"
              :class="['relative w-11 h-6 rounded-full transition-colors', chapterIsPremium ? 'bg-yellow-500' : 'bg-gray-300']"
            >
              <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', chapterIsPremium ? 'translate-x-5' : '']"></span>
            </button>
          </div>

          <button
            @click="$emit('saveChapter', {
              id: selectedChapter.id,
              title: chapterTitle,
              type: chapterType,
              description: chapterDescription,
              price: chapterPrice,
              isPurchasable: chapterIsPurchasable,
              isPremium: chapterIsPremium,
            })"
            :disabled="saving"
            class="w-full py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition disabled:opacity-60"
          >
            {{ saving ? 'Saving...' : 'Save Chapter' }}
          </button>

          <hr class="border-gray-100" />

          <div class="flex gap-2">
            <button
              v-if="selectedChapter.status !== 'PUBLISHED'"
              @click="$emit('setChapterStatus', selectedChapter.id, 'PUBLISHED')"
              class="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition"
            >
              Publish
            </button>
            <button
              v-if="selectedChapter.status !== 'DRAFT'"
              @click="$emit('setChapterStatus', selectedChapter.id, 'DRAFT')"
              class="flex-1 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition"
            >
              Unpublish
            </button>
            <button
              v-if="selectedChapter.status !== 'ARCHIVED'"
              @click="$emit('setChapterStatus', selectedChapter.id, 'ARCHIVED')"
              class="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition"
            >
              Archive
            </button>
          </div>

          <button
            @click="$emit('deleteChapter', selectedChapter.id)"
            class="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
          >
            Delete Chapter
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X } from "lucide-vue-next";
import TagComboBox from "./TagComboBox.vue";
import type { Genre, Category, Tag } from "../../services/bookApi";
import type { Chapter } from "../../services/chapterApi";

const props = defineProps<{
  show: boolean;
  book: any;
  selectedChapter?: Chapter | null;
  genres: Genre[];
  categories: Category[];
  tags: Tag[];
  saving?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  saveMetadata: [data: { title: string; description: string; genreSlug: string; categorySlugs: string[]; tagSlugs: string[] }];
  savePricing: [data: { isFree: boolean; price: number; isPurchasable: boolean; isPremium: boolean }];
  saveChapter: [data: { id: string; title: string; type: string; description: string; price: number; isPurchasable: boolean; isPremium: boolean }];
  setChapterStatus: [chapterId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED"];
  deleteChapter: [chapterId: string];
  removeCover: [];
  coverFileSelected: [file: File];
}>();

const activeTab = ref("Book Info");
const tabs = computed(() => props.selectedChapter ? ["Book Info", "Pricing", "Chapter"] : ["Book Info", "Pricing"]);

// Book Info state
const localTitle = ref("");
const localDescription = ref("");
const localGenreSlug = ref("");
const localCategorySlugs = ref<string[]>([]);
const localTagSlugs = ref<string[]>([]);
const localCoverPreview = ref<string | null>(null);

// Pricing state
const localIsFree = ref(false);
const localPrice = ref(0);
const localIsPurchasable = ref(false);
const localIsPremium = ref(false);

// Chapter state
const chapterTitle = ref("");
const chapterDescription = ref("");
const chapterType = ref("CHAPTER");
const chapterPrice = ref(0);
const chapterIsPurchasable = ref(false);
const chapterIsPremium = ref(false);

const availableTagNames = computed(() => props.tags.map((t) => t.slug));

// Sync from props when drawer opens
watch(() => props.show, (visible) => {
  if (!visible || !props.book) return;
  localTitle.value = props.book.title || "";
  localDescription.value = props.book.description || "";
  localGenreSlug.value = props.book.genreSlug || props.book.genre?.slug || "";
  localCategorySlugs.value = props.book.categorySlugs || props.book.categories?.map((c: any) => c.slug) || [];
  localTagSlugs.value = props.book.tagSlugs || props.book.tags?.map((t: any) => t.slug) || [];
  localCoverPreview.value = props.book.coverImageUrl || null;
  localIsFree.value = props.book.isFree ?? false;
  localPrice.value = props.book.price ?? 0;
  localIsPurchasable.value = props.book.isPurchasable ?? false;
  localIsPremium.value = props.book.isPremium ?? false;

  if (props.selectedChapter) {
    chapterTitle.value = props.selectedChapter.title || "";
    chapterDescription.value = props.selectedChapter.description || "";
    chapterType.value = props.selectedChapter.type || "CHAPTER";
    chapterPrice.value = props.selectedChapter.price ?? 0;
    chapterIsPurchasable.value = props.selectedChapter.isPurchasable ?? false;
    chapterIsPremium.value = props.selectedChapter.isPremium ?? false;
  }
});

function toggleCat(slug: string) {
  if (localCategorySlugs.value.includes(slug)) {
    localCategorySlugs.value = localCategorySlugs.value.filter((s) => s !== slug);
  } else {
    localCategorySlugs.value = [...localCategorySlugs.value, slug];
  }
}

function onCoverChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    localCoverPreview.value = URL.createObjectURL(file);
    emit("coverFileSelected", file);
  }
}
</script>
