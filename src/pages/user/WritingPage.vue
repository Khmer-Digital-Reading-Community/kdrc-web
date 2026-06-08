<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import QuillEditor from "../../components/common/QuillEditor.vue";
import ChapterSidebar from "../../components/writing/ChapterSidebar.vue";
import SettingsDrawer from "../../components/writing/SettingsDrawer.vue";
import PublishDialog from "../../components/writing/PublishDialog.vue";
import { ArrowLeft, Save, Settings, Eye } from "lucide-vue-next";
import { useWritingPage } from "../../composables/useWritingPage";
import { useBookSettings } from "../../composables/useBookSettings";
import { useChapterManagement } from "../../composables/useChapterManagement";
import { usePublishFlow } from "../../composables/usePublishFlow";
import { getGenres, getCategories, getTags, type Genre, type Category, type Tag } from "../../services/bookApi";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const writing = useWritingPage();
const publish = usePublishFlow();

// Settings drawer refs (loaded after book is available)
const settingsGenres = ref<Genre[]>([]);
const settingsCategories = ref<Category[]>([]);
const settingsTags = ref<Tag[]>([]);
const showSettings = ref(false);
const settingsSaving = ref(false);
const coverFile = ref<File | null>(null);
let settingsInitialized = false;

// Chapter management (lazy init after book loads)
let chapterMgmt: ReturnType<typeof useChapterManagement> | null = null;

function getChapterMgmt() {
  if (!chapterMgmt && writing.bookId.value && writing.bookId.value !== "new") {
    chapterMgmt = useChapterManagement(writing.bookId.value);
  }
  return chapterMgmt;
}

// Editor ref
const editorRef = ref<any>(null);

// Load dropdown data lazily when settings drawer opens
watch(showSettings, async (open) => {
  if (open && !settingsInitialized) {
    settingsInitialized = true;
    try {
      const [g, c, t] = await Promise.all([
        getGenres(),
        getCategories(),
        getTags(),
      ]);
      settingsGenres.value = Array.isArray(g) ? g : [];
      settingsCategories.value = Array.isArray(c) ? c : [];
      settingsTags.value = Array.isArray(t) ? t : [];
    } catch {
      // dropdown data failed to load — drawer handles the empty state
    }
  }
});

// Editor event handlers
function onEditorChange() {
  if (editorRef.value) {
    const html = editorRef.value.getHTML();
    if (html !== writing.editorContent.value) {
      writing.editorContent.value = html;
      writing.markDirty();
    }
  }
}

// Chapter management wrappers
async function handleNewChapter(type: any) {
  const mgmt = getChapterMgmt();
  if (!mgmt || writing.isNewBook.value) {
    toast.info("Save the book first");
    return;
  }
  const ch = await mgmt.addChapter(type, undefined, writing.chapters.value);
  if (ch) await writing.selectChapter(ch.id);
}

async function handleDeleteChapter(chapterId: string) {
  const mgmt = getChapterMgmt();
  if (!mgmt) return;
  const ok = await mgmt.removeChapter(chapterId, writing.chapters.value);
  if (ok && writing.activeChapterId.value === chapterId) {
    writing.activeChapterId.value = writing.chapters.value[0]?.id || null;
  }
}

async function handleChapterStatus(chapterId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const mgmt = getChapterMgmt();
  if (!mgmt) return;
  await mgmt.setChapterStatus(chapterId, status, writing.chapters.value);
}

async function handleReorder(orderedIds: string[]) {
  const mgmt = getChapterMgmt();
  if (!mgmt) return;
  await mgmt.reorderChapters(orderedIds, writing.chapters.value);
}

// Settings drawer handlers
async function handleSaveMetadata(data: { title: string; description: string; genreSlug: string; categorySlugs: string[]; tagSlugs: string[] }) {
  if (!writing.book.value) return;
  settingsSaving.value = true;
  try {
    if (coverFile.value) {
      const { uploadBookCover } = await import("../../services/bookApi");
      const result = await uploadBookCover(coverFile.value);
      writing.book.value.coverImageUrl = result.url;
      coverFile.value = null;
    }
    const { updateBook } = await import("../../services/bookApi");
    await updateBook(writing.book.value.id, {
      ...data,
      coverImageUrl: writing.book.value.coverImageUrl || undefined,
    });
    if (writing.book.value) {
      writing.book.value.title = data.title;
      writing.book.value.description = data.description;
    }
    toast.success("Book details saved");
  } catch {
    toast.error("Failed to save");
  } finally {
    settingsSaving.value = false;
  }
}

async function handleSavePricing(data: { isFree: boolean; price: number; isPurchasable: boolean; isPremium: boolean }) {
  if (!writing.book.value) return;
  settingsSaving.value = true;
  try {
    const { updateBook } = await import("../../services/bookApi");
    await updateBook(writing.book.value.id, data as any);
    Object.assign(writing.book.value, data);
    toast.success("Pricing saved");
  } catch {
    toast.error("Failed to save pricing");
  } finally {
    settingsSaving.value = false;
  }
}

function handleCoverFileSelected(file: File) {
  coverFile.value = file;
}

async function handleRemoveCover() {
  if (!writing.book.value) return;
  writing.book.value.coverImageUrl = undefined;
  const { updateBook } = await import("../../services/bookApi");
  await updateBook(writing.book.value.id, { coverImageUrl: null as any } as any);
}

async function handleSaveChapter(data: any) {
  settingsSaving.value = true;
  try {
    const { updateChapter } = await import("../../services/chapterApi");
    await updateChapter(data.id, {
      title: data.title,
      type: data.type,
      description: data.description,
      price: data.price,
      isPurchasable: data.isPurchasable,
      isPremium: data.isPremium,
    } as any);
    const ch = writing.chapters.value.find((c) => c.id === data.id);
    if (ch) Object.assign(ch, data);
    toast.success("Chapter saved");
  } catch {
    toast.error("Failed to save chapter");
  } finally {
    settingsSaving.value = false;
  }
}

// Publish
async function handlePublish() {
  if (!writing.book.value) return;
  if (writing.book.value.status === "PUBLISHED") {
    publish.confirmPublish(writing.book.value);
  } else {
    publish.openPublishDialog(writing.chapters.value);
  }
}

async function handleConfirmPublish() {
  if (!writing.book.value) return;
  await publish.confirmPublish(writing.book.value);
}

// Preview
function handlePreview() {
  if (writing.book.value) {
    router.push(`/reading/${writing.book.value.id}`);
  }
}

function goBack() {
  if (!writing.isSaved.value) {
    if (!window.confirm("You have unsaved changes. Leave anyway?")) return;
  }
  router.push("/dashboard/manuscripts");
}

</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">
    <!-- Left: Chapter Sidebar -->
    <ChapterSidebar
      v-if="writing.book && writing.book.id !== 'new'"
      :chapters="writing.chapters.value"
      :activeChapterId="writing.activeChapterId.value"
      @selectChapter="writing.selectChapter($event)"
      @newChapter="handleNewChapter($event)"
      @deleteChapter="handleDeleteChapter($event)"
      @updateStatus="handleChapterStatus"
      @reorder="handleReorder($event)"
    />

    <!-- Center: Editor -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <div class="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 flex-shrink-0">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            title="Back"
          >
            <ArrowLeft :size="18" />
            <span class="hidden sm:inline text-xs font-medium">Back</span>
          </button>

          <span v-if="writing.book" class="text-sm font-semibold text-[#123C3A] truncate max-w-[200px]">
            {{ writing.book.title }}
          </span>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Save status -->
          <span
            :class="[
              'text-xs flex items-center gap-1.5',
              writing.isSaved.value ? 'text-green-600' : 'text-amber-600',
            ]"
          >
            <span
              :class="[
                'w-1.5 h-1.5 rounded-full',
                writing.isSaved.value ? 'bg-green-600' : 'bg-amber-600 animate-pulse',
              ]"
            ></span>
            <span class="hidden sm:inline">{{ writing.isSaved.value ? 'Saved' : 'Unsaved' }}</span>
          </span>

          <span class="hidden sm:inline text-xs text-gray-400">{{ writing.wordCount.value }} words</span>

          <button
            v-if="!writing.isSaved.value"
            @click="writing.saveDraft()"
            :disabled="writing.isSaving.value"
            class="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            <Save :size="14" />
            <span class="hidden sm:inline">Save</span>
          </button>

          <button
            @click="handlePreview"
            v-if="writing.book?.id && writing.book.id !== 'new'"
            class="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
          >
            <Eye :size="14" />
            <span class="hidden sm:inline">Preview</span>
          </button>

          <button
            @click="showSettings = true"
            class="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            title="Settings"
          >
            <Settings :size="18" />
          </button>

          <button
            @click="handlePublish"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition',
              writing.book?.status === 'PUBLISHED'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[#c5a050] text-white hover:bg-[#b09040]',
            ]"
          >
            {{ writing.book?.status === "PUBLISHED" ? "Published" : "Publish" }}
          </button>
        </div>
      </div>

      <!-- Editor area -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="writing.isLoading.value" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-[#c5a050] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-sm text-gray-400">Loading...</p>
          </div>
        </div>

        <div v-else class="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10">
          <!-- Chapter title -->
          <div v-if="writing.activeChapter.value" class="mb-6">
            <p class="text-xs text-[#c5a050] font-bold uppercase tracking-wider mb-1">
              {{ writing.activeChapter.value.type }}
            </p>
            <h2 class="text-2xl font-bold text-[#123C3A] font-['Playfair_Display',Georgia,serif]">
              {{ writing.activeChapter.value.title }}
            </h2>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <QuillEditor
              ref="editorRef"
              :content="writing.editorContent.value"
              @textChange="onEditorChange"
              @update:content="writing.editorContent.value = $event; writing.markDirty()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Drawer -->
    <SettingsDrawer
      :show="showSettings"
      :book="writing.book.value"
      :selectedChapter="writing.activeChapter.value"
      :genres="settingsGenres"
      :categories="settingsCategories"
      :tags="settingsTags"
      :saving="settingsSaving"
      @close="showSettings = false"
      @saveMetadata="handleSaveMetadata($event)"
      @savePricing="handleSavePricing($event)"
      @saveChapter="handleSaveChapter($event)"
      @setChapterStatus="handleChapterStatus"
      @deleteChapter="handleDeleteChapter($event)"
      @removeCover="handleRemoveCover()"
      @coverFileSelected="handleCoverFileSelected($event)"
    />

    <!-- Publish Dialog -->
    <PublishDialog
      :show="publish.showPublishDialog.value"
      :book="writing.book.value"
      :publishSummary="publish.publishSummary.value"
      :isPublishing="publish.isPublishing.value"
      @close="publish.closePublishDialog()"
      @confirm="handleConfirmPublish()"
    />
  </div>
</template>
