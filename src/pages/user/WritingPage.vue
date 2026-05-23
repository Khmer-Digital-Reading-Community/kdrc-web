<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import QuillEditor from "@/components/common/QuillEditor.vue";
import WritingSidebar from "../../components/common/WritingSidebar.vue";
import CoverImageUploader from "@/components/common/CoverImageUploader.vue";
import { Clock, Settings, ArrowLeft, Eye, Save } from "lucide-vue-next";
import {
    getBookDetail,
    createBook,
    updateBook,
    uploadBookCover,
    type Book,
} from "@/services/bookApi";
import {
    getChapters,
    getChapterContent,
    createChapter,
    updateChapter,
    deleteChapter,
    type Chapter,
    type ChapterContent,
} from "@/services/chapterApi";
import { useToast } from "vue-toastification";
import { apiBaseUrl } from "@/services/api";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Book & Chapter State
const book = ref<Book | null>(null);
const chapters = ref<Chapter[]>([]);
const activeChapterId = ref<string | null>(null);
const activeChapterContent = ref<ChapterContent | null>(null);

// Editor State
const editorRef = ref<any>(null);
const editorContent = ref("");
const isSaved = ref(true);
const lastSavedTime = ref("never");
const isEditingTitle = ref(false);
const titleInput = ref("Untitled Masterpiece");
const isLoading = ref(true);
const showPreview = ref(false);

// Project Type & Conversion
const projectTypeChoice = ref<"formal-book" | "short-story">("formal-book");
const showTypeConversionDialog = ref(false);
const isConvertingType = ref(false);

// UI State
const statusFilter = ref<"DRAFT" | "PUBLISHED">("DRAFT");
const coverPreviewUrl = ref<string | null>(null);
const coverUploadError = ref<string | null>(null);
const isUploadingCover = ref(false);

// Preview State
const showPreviewModal = ref(false);
const previewChapterId = ref<string | null>(null);
const previewChapterContent = ref<string>("");
const previewChapterTitle = ref<string>("");
const isLoadingPreview = ref(false);

// Template State
const showTemplateModal = ref(false);
const selectedTemplate = ref<string | null>(null);
const isApplyingTemplate = ref(false);

const chapterTemplates: Record<string, Record<string, string>> = {
    default: {
        blank: "",
        scene: `<h2>Scene Setup</h2>
<p><em>Describe the setting, time, and initial situation...</em></p>

<h2>Action & Dialogue</h2>
<p><em>What happens in this scene? Include character interactions and dialogue...</em></p>

<h2>Scene Resolution</h2>
<p><em>How does the scene end? What changes for the characters?</em></p>`,
        section: `<h2>Introduction</h2>
<p><em>Introduce the main topic or concept of this chapter...</em></p>

<h2>Main Content</h2>
<p><em>Develop your main ideas, arguments, or narrative here...</em></p>

<h2>Conclusion</h2>
<p><em>Summarize key points and transition to the next chapter...</em></p>`,
    },
    fiction: {
        blank: "",
        scene: `<h2>Scene Setup</h2>
<p><em>Describe the setting, time, and initial situation...</em></p>

<h2>Action & Dialogue</h2>
<p><em>What happens in this scene? Include character interactions and dialogue...</em></p>

<h2>Scene Resolution</h2>
<p><em>How does the scene end? What changes for the characters?</em></p>`,
        character: `<h2>Character Introduction</h2>
<p><em>Introduce a character: appearance, background, personality...</em></p>

<h2>Character Arc</h2>
<p><em>How does this character develop or change in this chapter?</em></p>`,
    },
    fantasy: {
        blank: "",
        worldbuilding: `<h2>World Details</h2>
<p><em>Describe the setting, magic system, cultures, or locations relevant to this chapter...</em></p>

<h2>Plot Development</h2>
<p><em>How do the world elements affect the plot and characters?</em></p>

<h2>Mystery & Intrigue</h2>
<p><em>What questions or conflicts does this raise?</em></p>`,
        quest: `<h2>Quest Objective</h2>
<p><em>What is the party's goal in this chapter?</em></p>

<h2>Challenges & Encounters</h2>
<p><em>What obstacles, enemies, or puzzles do they face?</em></p>

<h2>Resolution & Rewards</h2>
<p><em>How do they overcome the challenge? What do they gain?</em></p>`,
    },
    "non-fiction": {
        blank: "",
        section: `<h2>Introduction</h2>
<p><em>Introduce the main topic or concept of this chapter...</em></p>

<h2>Main Content</h2>
<p><em>Develop your main ideas, arguments, or narrative here...</em></p>

<h2>Conclusion</h2>
<p><em>Summarize key points and transition to the next chapter...</em></p>`,
        lesson: `<h2>Learning Objective</h2>
<p><em>What should the reader understand after this chapter?</em></p>

<h2>Content & Examples</h2>
<p><em>Explain the concept with examples, case studies, or evidence...</em></p>

<h2>Key Takeaways</h2>
<p><em>Summarize the essential points...</em></p>`,
    },
};

const getAvailableTemplates = (): Record<string, string> => {
    const genreName = book.value?.genre?.name?.toLowerCase() || "default";
    return chapterTemplates[genreName] || chapterTemplates.default;
};

// Computed Properties
const bookId = computed(() => route.params.id as string);
const isNewBook = computed(() => bookId.value === "new");

const projectType = computed(() => {
    // Detect project type based on chapter count
    return chapters.value.length <= 1 ? "short-story" : "formal-book";
});

const wordCount = computed(() => {
    if (!editorContent.value) return 0;
    return editorContent.value
        .replace(/<[^>]*>/g, "")
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
});

const resolveCoverUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${apiBaseUrl}${url}`;
};

const draftChapters = computed(() =>
    chapters.value.filter((c) => c.status === "DRAFT"),
);

const publishedChapters = computed(() =>
    chapters.value.filter((c) => c.status === "PUBLISHED"),
);

// Lifecycle
onMounted(async () => {
    await fetchBookData();
});

const fetchBookData = async () => {
    if (isNewBook.value) {
        book.value = {
            id: "new",
            title: "Untitled Masterpiece",
            description: "",
            status: "DRAFT",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as Book;
        titleInput.value = book.value.title;
        isLoading.value = false;
        return;
    }

    try {
        isLoading.value = true;
        const [bookData, chaptersData] = await Promise.all([
            getBookDetail(bookId.value),
            getChapters(bookId.value),
        ]);
        book.value = bookData;
        chapters.value = chaptersData;
        titleInput.value = book.value.title;
        coverPreviewUrl.value = resolveCoverUrl(book.value.coverImageUrl);

        // Auto-create Chapter 1 for formal books with no chapters
        if (projectType.value === "formal-book" && chapters.value.length === 0) {
            const newCh = await createChapter({
                bookId: bookId.value,
                title: "Chapter 1",
                chapterNumber: 1,
                order: 1,
                content: "",
                type: "CHAPTER",
                status: "DRAFT",
            });
            chapters.value.push(newCh);
            await handleSelectChapter(newCh.id);
        } else if (projectType.value === "short-story" && chapters.value.length > 0) {
            // For short stories, load the single chapter
            await handleSelectChapter(chapters.value[0].id);
        } else if (projectType.value === "formal-book" && chapters.value.length > 0) {
            // For formal books, select first draft chapter
            const firstDraft = chapters.value.find((c) => c.status === "DRAFT") || chapters.value[0];
            if (firstDraft) await handleSelectChapter(firstDraft.id);
        }
    } catch (error) {
        toast.error("Failed to load book data");
        router.push("/dashboard/manuscripts");
    } finally {
        isLoading.value = false;
    }
};

// Chapter Management
const handleSelectChapter = async (chapterId: string) => {
    if (!isSaved.value) {
        await handleSaveDraft();
    }

    try {
        const content = await getChapterContent(chapterId);
        activeChapterContent.value = content;
        activeChapterId.value = chapterId;
        editorContent.value = content.content || "";
        isSaved.value = true;

        if (editorRef.value) {
            editorRef.value.setContent(editorContent.value);
        }
    } catch (error) {
        toast.error("Failed to load chapter");
    }
};

const handleEditorChange = () => {
    if (editorRef.value) {
        const newContent = editorRef.value.getHTML();
        if (newContent !== editorContent.value) {
            editorContent.value = newContent;
            isSaved.value = false;
        }
    }
};

// Autosave
let autosaveTimeout: any = null;
watch(editorContent, () => {
    if (!isSaved.value) {
        if (autosaveTimeout) clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            handleSaveDraft();
        }, 5000);
    }
});

// Keyboard shortcut for manual save (Ctrl+S / Cmd+S)
const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaved.value) {
            handleSaveDraft();
        }
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});

const handleSaveDraft = async () => {
    if (!book.value) return;

    try {
        if (isNewBook.value) {
            const newBook = await createBook({
                title: titleInput.value,
                description: "",
            });
            toast.success("Book created!");
            router.push(`/${newBook.id}/write`);
            return;
        }

        if (activeChapterId.value && activeChapterContent.value) {
            await updateChapter(activeChapterId.value, {
                content: editorContent.value,
                title: activeChapterContent.value.title,
            });

            const chIndex = chapters.value.findIndex(
                (c) => c.id === activeChapterId.value,
            );
            if (chIndex !== -1) {
                chapters.value[chIndex].wordCount = wordCount.value;
            }
        } else {
            await updateBook(bookId.value, {
                title: titleInput.value,
            });
        }

        isSaved.value = true;
        lastSavedTime.value = new Date().toLocaleTimeString();
    } catch (error) {
        toast.error("Failed to save draft");
    }
};

const handleNewChapter = async () => {
    if (isNewBook.value) {
        toast.info("Please save the book first");
        return;
    }

    selectedTemplate.value = null;
    showTemplateModal.value = true;
};

const handleCreateChapterWithTemplate = async (templateName?: string) => {
    if (isNewBook.value) return;

    try {
        isApplyingTemplate.value = true;
        const nextNum = chapters.value.length + 1;
        const templates = getAvailableTemplates();
        const templateContent = templateName && templates[templateName] ? templates[templateName] : "";

        const newCh = await createChapter({
            bookId: bookId.value,
            title: `Chapter ${nextNum}`,
            chapterNumber: nextNum,
            order: nextNum,
            content: templateContent,
            type: "CHAPTER",
            status: "DRAFT",
        });
        chapters.value.push(newCh);
        await handleSelectChapter(newCh.id);
        toast.success("Chapter created!");
        showTemplateModal.value = false;
    } catch (error) {
        toast.error("Failed to create chapter");
    } finally {
        isApplyingTemplate.value = false;
    }
};

// Cover Management
const handleCoverSelected = async (file: File) => {
    coverUploadError.value = null;
    isUploadingCover.value = true;

    try {
        const previewUrl = URL.createObjectURL(file);
        coverPreviewUrl.value = previewUrl;
        const response = await uploadBookCover(file);

        if (book.value) {
            book.value.coverImageUrl = response.url;
            await updateBook(bookId.value, {
                coverImageUrl: response.url,
            });
        }
        toast.success("Cover uploaded!");
    } catch (error) {
        coverUploadError.value = "Failed to upload cover";
        toast.error(coverUploadError.value);
    } finally {
        isUploadingCover.value = false;
    }
};

const clearCover = () => {
    coverPreviewUrl.value = null;
    coverUploadError.value = null;
};

// Title Editing
const saveTitle = async () => {
    if (book.value && titleInput.value.trim()) {
        try {
            book.value.title = titleInput.value;
            await updateBook(bookId.value, { title: titleInput.value });
            isEditingTitle.value = false;
            toast.success("Title updated");
        } catch {
            toast.error("Failed to update title");
        }
    }
};

// Project Type Conversion
const requestTypeChange = (newType: "formal-book" | "short-story") => {
    if (newType === projectType.value) return;

    // If no chapters or only 1 chapter, allow direct switch
    if (chapters.value.length <= 1) {
        handleTypeChange(newType);
        return;
    }

    // Otherwise, show confirmation
    projectTypeChoice.value = newType;
    showTypeConversionDialog.value = true;
};

const handleTypeChange = async (newType: "formal-book" | "short-story") => {
    isConvertingType.value = true;
    try {
        if (newType === "short-story" && chapters.value.length > 1) {
            // Delete all chapters except the first
            const chaptersToDelete = chapters.value.slice(1);
            for (const ch of chaptersToDelete) {
                await deleteChapter(ch.id);
            }
            chapters.value = chapters.value.slice(0, 1);
            activeChapterId.value = chapters.value[0]?.id || null;
        } else if (newType === "formal-book" && chapters.value.length === 0) {
            // Create first chapter
            const newCh = await createChapter({
                bookId: bookId.value,
                title: "Chapter 1",
                chapterNumber: 1,
                order: 1,
                content: "",
                type: "CHAPTER",
                status: "DRAFT",
            });
            chapters.value.push(newCh);
            activeChapterId.value = newCh.id;
        }

        showTypeConversionDialog.value = false;
        toast.success(`Converted to ${newType === "short-story" ? "Short Story" : "Formal Book"}`);
    } catch (error) {
        toast.error("Failed to convert project type");
    } finally {
        isConvertingType.value = false;
    }
};

const handlePublish = async () => {
    if (!book.value) return;

    try {
        const newStatus = book.value.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
        await updateBook(bookId.value, { status: newStatus });
        book.value.status = newStatus;
        toast.success(`Book ${newStatus === "PUBLISHED" ? "published" : "unpublished"}`);
    } catch (error) {
        toast.error("Failed to update book status");
    }
};

const goBack = () => {
    if (!isSaved.value) {
        const confirmed = window.confirm(
            "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!confirmed) return;
    }
    router.push("/dashboard/manuscripts");
};

const togglePreview = () => {
    showPreviewModal.value = !showPreviewModal.value;
    if (!showPreviewModal.value) {
        showPreviewModal.value = false;
    }
};

const handlePreviewChapter = async (chapterId: string) => {
    try {
        isLoadingPreview.value = true;
        const content = await getChapterContent(chapterId);
        previewChapterId.value = chapterId;
        previewChapterTitle.value = content.title;
        previewChapterContent.value = content.content || "";
        showPreviewModal.value = true;
    } catch (error) {
        toast.error("Failed to load chapter preview");
    } finally {
        isLoadingPreview.value = false;
    }
};

const handleBulkPublish = async () => {
    if (chapters.value.length === 0) {
        toast.info("No chapters to publish");
        return;
    }

    try {
        const draftChapters = chapters.value.filter((c) => c.status === "DRAFT");
        if (draftChapters.length === 0) {
            toast.info("All chapters are already published");
            return;
        }

        let published = 0;
        for (const chapter of draftChapters) {
            try {
                await updateChapter(chapter.id, { status: "PUBLISHED" });
                const idx = chapters.value.findIndex((c) => c.id === chapter.id);
                if (idx !== -1) {
                    chapters.value[idx].status = "PUBLISHED";
                }
                published++;
            } catch (err) {
                // Continue with other chapters if one fails
            }
        }

        toast.success(
            `Published ${published} chapter${published !== 1 ? "s" : ""}`
        );
    } catch (error) {
        toast.error("Failed to publish chapters");
    }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">
    <!-- Conditional Sidebar - Only for Formal Books -->
    <div v-if="projectType === 'formal-book'" class="w-80 bg-white border-r border-amber-200 overflow-y-auto">
      <WritingSidebar
        :chapters="chapters"
        :activeChapterId="activeChapterId"
        :statusFilter="statusFilter"
        @selectChapter="handleSelectChapter"
        @newChapter="handleNewChapter"
        @updateStatusFilter="statusFilter = $event"
        @bulkPublish="handleBulkPublish"
        @previewChapter="handlePreviewChapter"
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <div class="bg-white border-b border-amber-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <!-- Left: Back Button -->
        <button
          @click="goBack"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          title="Back to manuscripts"
        >
          <ArrowLeft :size="18" />
          <span class="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        <!-- Center: Project Type & Status -->
        <div class="flex items-center gap-4">
          <div class="flex gap-1 bg-amber-50 p-1 rounded-lg">
            <button
              @click="requestTypeChange('formal-book')"
              :class="[
                'px-3 py-1 rounded text-xs sm:text-sm font-semibold transition',
                projectType === 'formal-book'
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-700 hover:bg-white',
              ]"
            >
              Formal Book
            </button>
            <button
              @click="requestTypeChange('short-story')"
              :class="[
                'px-3 py-1 rounded text-xs sm:text-sm font-semibold transition',
                projectType === 'short-story'
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-700 hover:bg-white',
              ]"
            >
              Short Story
            </button>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Save Status -->
          <div class="text-xs sm:text-sm flex items-center gap-1">
            <span v-if="isSaved" class="text-green-600 font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-green-600"></span>
              <span class="hidden sm:inline">Saved</span>
            </span>
            <span v-else class="text-amber-600 font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span class="hidden sm:inline">Saving...</span>
            </span>
          </div>

          <!-- Word Count -->
          <span class="hidden sm:inline text-xs text-gray-500">{{ wordCount }} words</span>

          <!-- Manual Save Button -->
          <button
            v-if="!isSaved"
            @click="handleSaveDraft"
            class="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
            title="Save now (Ctrl+S)"
          >
            <Save :size="14" />
            <span class="hidden sm:inline">Save</span>
          </button>

          <!-- Preview Button -->
          <button
            v-if="activeChapterId"
            @click="handlePreviewChapter(activeChapterId)"
            class="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold"
            title="Preview chapter"
          >
            <Eye :size="14" />
            <span class="hidden sm:inline">Preview</span>
          </button>

          <!-- Publish Button -->
          <button
            @click="handlePublish"
            :class="[
              'px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm transition',
              book?.status === 'PUBLISHED'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-amber-700 text-white hover:bg-amber-800',
            ]"
          >
            {{ book?.status === 'PUBLISHED' ? 'Published' : 'Publish' }}
          </button>

          <!-- Settings Button -->
          <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Settings :size="18" />
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-8">
        <div v-if="isLoading" class="text-center py-12">
          <p class="text-gray-500">Loading...</p>
        </div>

        <div v-else class="max-w-4xl mx-auto">
          <!-- Cover & Title Section -->
          <div class="mb-8 flex gap-8">
            <!-- Cover Image -->
            <div class="flex-shrink-0 w-48">
              <CoverImageUploader
                :model-value="coverPreviewUrl"
                :error="coverUploadError"
                label="Cover"
                @fileSelected="handleCoverSelected"
                @clear="clearCover"
              />
            </div>

            <!-- Title & Metadata -->
            <div class="flex-1">
              <!-- Title -->
              <div class="mb-6">
                <div v-if="isEditingTitle" class="flex gap-2">
                  <input
                    v-model="titleInput"
                    type="text"
                    class="flex-1 text-4xl font-bold border-b-2 border-amber-700 focus:outline-none"
                    @blur="saveTitle"
                    @keyup.enter="saveTitle"
                    @keyup.escape="isEditingTitle = false"
                    autofocus
                  />
                  <button
                    @click="saveTitle"
                    class="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800"
                  >
                    Save
                  </button>
                </div>
                <div v-else @click="isEditingTitle = true" class="cursor-pointer group">
                  <h1 class="text-4xl font-bold text-[#123C3A] group-hover:text-amber-700 transition">
                    {{ titleInput }}
                  </h1>
                  <p class="text-xs text-gray-400 mt-1 group-hover:text-gray-600">Click to edit</p>
                </div>
              </div>

              <!-- Status -->
              <div class="text-sm text-gray-600">
                <span class="font-semibold">Status:</span>
                <span class="ml-2 px-3 py-1 rounded-full" :class="book?.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                  {{ book?.status || 'DRAFT' }}
                </span>
              </div>

              <!-- Project Type Info -->
              <div class="mt-4 text-xs text-gray-500">
                <p>{{ projectType === 'short-story' ? '📖 Short Story' : '📚 Formal Book' }}</p>
                <p v-if="projectType === 'formal-book'" class="mt-1">
                  {{ draftChapters.length }} draft{{ draftChapters.length !== 1 ? 's' : '' }}
                  {{ publishedChapters.length > 0 ? `• ${publishedChapters.length} published` : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Editor -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
            <QuillEditor
              ref="editorRef"
              :content="editorContent"
              @textChange="handleEditorChange"
              @update:content="editorContent = $event"
            />
          </div>

          <!-- Short Story Helper Text -->
          <div v-if="projectType === 'short-story' && chapters.length === 0" class="text-center py-12 text-gray-400">
            <p class="text-lg">Start writing your story...</p>
          </div>

          <!-- Formal Book Helper Text -->
          <div v-if="projectType === 'formal-book' && chapters.length === 0" class="text-center py-12 text-gray-400">
            <p class="text-lg">No chapters yet</p>
            <button
              @click="handleNewChapter"
              class="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
            >
              Create First Chapter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Type Conversion Dialog -->
    <Teleport to="body">
      <div
        v-if="showTypeConversionDialog"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg">
          <h3 class="text-lg font-bold text-[#123C3A] mb-4">
            Convert to {{ projectTypeChoice === 'short-story' ? 'Short Story' : 'Formal Book' }}?
          </h3>

          <p v-if="projectTypeChoice === 'short-story'" class="text-gray-600 mb-6">
            Converting to a Short Story will delete all chapters except the first one. This action cannot be undone.
          </p>
          <p v-else class="text-gray-600 mb-6">
            Convert this short story to a multi-chapter book?
          </p>

          <div class="flex gap-3">
            <button
              @click="showTypeConversionDialog = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleTypeChange(projectTypeChoice)"
              :disabled="isConvertingType"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {{ isConvertingType ? 'Converting...' : 'Convert' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Chapter Preview Modal -->
    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Preview Header -->
          <div class="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-[#123C3A]">{{ previewChapterTitle }}</h3>
              <p class="text-xs text-gray-500 mt-1">Reading time: ~{{ Math.ceil(previewChapterContent.replace(/<[^>]*>/g, '').split(/\s+/).length / 200) }} min</p>
            </div>
            <button
              @click="showPreviewModal = false"
              class="text-gray-500 hover:text-gray-700 text-2xl leading-none hover:bg-white/30 p-2 rounded-lg transition"
            >
              ×
            </button>
          </div>

          <!-- Preview Content -->
          <div class="overflow-y-auto flex-1">
            <div v-if="isLoadingPreview" class="text-center py-12">
              <p class="text-gray-500">Loading preview...</p>
            </div>
            <div
              v-else
              class="prose prose-sm max-w-none text-gray-700 leading-relaxed p-6 sm:p-8"
              v-html="previewChapterContent"
            />
          </div>

          <!-- Preview Footer -->
          <div class="sticky bottom-0 border-t border-amber-200 bg-white px-6 py-4 flex gap-3 justify-end">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold transition"
            >
              Close
            </button>
            <button
              @click="() => {
                if (previewChapterId) {
                  handleSelectChapter(previewChapterId);
                  showPreviewModal = false;
                }
              }"
              class="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-sm font-semibold transition"
            >
              Edit Chapter
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Chapter Template Selection Modal -->
    <Teleport to="body">
      <div
        v-if="showTemplateModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full mx-4 shadow-lg">
          <!-- Modal Header -->
          <div class="border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-bold text-[#123C3A]">Chapter Template</h3>
            <p class="text-sm text-gray-600 mt-1">Choose a structure for your new chapter or start blank</p>
          </div>

          <!-- Templates List -->
          <div class="px-6 py-6 max-h-96 overflow-y-auto space-y-3">
            <button
              v-for="(template, name) in getAvailableTemplates()"
              :key="name"
              @click="selectedTemplate = name"
              :class="[
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                selectedTemplate === name
                  ? 'border-amber-700 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50',
              ]"
            >
              <div class="font-semibold text-gray-900 capitalize">
                {{ name === 'blank' ? 'Blank Chapter' : name.replace(/([A-Z])/g, ' $1').trim() }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                {{
                  name === 'blank' ? 'Start with an empty chapter' :
                  name === 'scene' ? 'Three-act structure for scenes' :
                  name === 'section' ? 'Introduction, content, conclusion' :
                  name === 'character' ? 'Character-focused narrative' :
                  name === 'worldbuilding' ? 'World details and plot' :
                  name === 'quest' ? 'Adventure with objective and challenges' :
                  name === 'lesson' ? 'Educational content structure' :
                  'Pre-formatted chapter structure'
                }}
              </div>
            </button>
          </div>

          <!-- Modal Footer -->
          <div class="border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              @click="showTemplateModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleCreateChapterWithTemplate(selectedTemplate || 'blank')"
              :disabled="isApplyingTemplate"
              class="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
            >
              {{ isApplyingTemplate ? 'Creating...' : 'Create Chapter' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Responsive Design */
@media (max-width: 768px) {
  .w-80 {
    display: none;
  }
}
</style>
