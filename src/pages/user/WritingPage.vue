<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import QuillEditor from "@/components/common/QuillEditor.vue";
import WritingNavbar from "../../components/common/WritingNavbar.vue";
import WritingSidebar from "../../components/common/WritingSidebar.vue";
import CoverImageUploader from "@/components/common/CoverImageUploader.vue";
import { Clock, Eye, EyeOff } from "lucide-vue-next";
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
    type Chapter,
    type ChapterContent,
} from "@/services/chapterApi";
import { useToast } from "vue-toastification";
import { apiBaseUrl } from "@/services/api";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const bookId = computed(() => route.params.id as string);
const isNewBook = computed(() => bookId.value === "new");

const book = ref<Book | null>(null);
const chapters = ref<Chapter[]>([]);
const activeChapterId = ref<string | null>(null);
const activeChapterContent = ref<ChapterContent | null>(null);

const editorRef = ref<any>(null);
const editorContent = ref("");
const isSaved = ref(true);
const lastSavedTime = ref("never");
const isEditingTitle = ref(false);
const titleInput = ref("Untitled Masterpiece");
const isLoading = ref(true);
const statusFilter = ref<"DRAFT" | "PUBLISHED">("DRAFT");
const showPreview = ref(false);
const coverPreviewUrl = ref<string | null>(null);
const coverUploadError = ref<string | null>(null);
const isUploadingCover = ref(false);

const resolveCoverUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${apiBaseUrl}${url}`;
};

const fetchBookData = async () => {
    if (isNewBook.value) {
        book.value = {
            id: "new",
            title: "Untitled Masterpiece",
            content: "",
            status: "DRAFT",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
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
        coverPreviewUrl.value = book.value.coverImageUrl || null;

        if (chapters.value.length > 0) {
            await handleSelectChapter(chapters.value[0].id);
        }
    } catch (error) {
        toast.error("Failed to load book data");
        router.push("/dashboard/manuscripts");
    } finally {
        isLoading.value = false;
    }
};

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

        // Sync content into editor
        if (editorRef.value) {
            editorRef.value.setContent(editorContent.value);
        }
    } catch (error) {
        toast.error("Failed to load chapter content");
    }
};

const handleEditorChange = () => {
    if (editorRef.value) {
        const newContent = editorRef.value.getContent();
        if (newContent !== editorContent.value) {
            editorContent.value = newContent;
            isSaved.value = false;
        }
    }
};

// Autosave logic
let autosaveTimeout: any = null;
watch(editorContent, () => {
    if (!isSaved.value) {
        if (autosaveTimeout) clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            handleSaveDraft();
        }, 5000); // 5 seconds debounce
    }
});

const handleSaveDraft = async () => {
    if (!book.value) return;

    try {
        if (isNewBook.value) {
            const newBook = await createBook({
                title: titleInput.value,
                content: "", // Book summary/content
            });
            toast.success("Book created!");
            router.push(`/${newBook.id}/write`);
            return;
        }

        if (activeChapterId.value) {
            await updateChapter(activeChapterId.value, {
                content: editorContent.value,
                title: activeChapterContent.value?.title,
            });

            // Update word count in sidebar
            const chIndex = chapters.value.findIndex(
                (c) => c.id === activeChapterId.value,
            );
            if (chIndex !== -1) {
                chapters.value[chIndex].wordCount = wordCount.value;
            }
        } else {
            // Update book metadata
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
        toast.info("Please save the book title first");
        return;
    }

    try {
        const nextNum = chapters.value.length + 1;
        const newCh = await createChapter({
            bookId: bookId.value,
            title: `Chapter ${nextNum}`,
            chapterNumber: nextNum,
            order: nextNum,
            content: " ",
            type: "CHAPTER",
            status: "DRAFT",
        });
        chapters.value.push(newCh);
        await handleSelectChapter(newCh.id);
        toast.success("New chapter created");
    } catch (error) {
        toast.error("Failed to create chapter");
    }
};

const handleTitleChange = async () => {
    if (book.value) {
        book.value.title = titleInput.value;
        if (!isNewBook.value) {
            await updateBook(bookId.value, { title: titleInput.value });
            toast.success("Title updated");
        }
        isSaved.value = false;
        isEditingTitle.value = false;
    }
};

const startEditingTitle = () => {
    isEditingTitle.value = true;
};

const cancelEditingTitle = () => {
    titleInput.value = book.value?.title || "Untitled Masterpiece";
    isEditingTitle.value = false;
};

const handleCoverSelected = async (file: File) => {
    if (isNewBook.value) {
        toast.info("Save the book first to upload a cover.");
        return;
    }

    isUploadingCover.value = true;
    coverUploadError.value = null;

    try {
        const previewUrl = URL.createObjectURL(file);
        coverPreviewUrl.value = previewUrl;

        const response = await uploadBookCover(file);
        await updateBook(bookId.value, { coverImageUrl: response.url });

        if (book.value) {
            book.value.coverImageUrl = response.url;
        }

        toast.success("Cover updated");
    } catch (error) {
        coverUploadError.value = "Failed to upload cover. Please try again.";
        toast.error(coverUploadError.value);
    } finally {
        isUploadingCover.value = false;
    }
};

const clearCover = async () => {
    coverPreviewUrl.value = null;
    coverUploadError.value = null;

    if (!isNewBook.value && book.value) {
        await updateBook(bookId.value, { coverImageUrl: null });
        book.value.coverImageUrl = undefined;
    }
};

const handleToggleChapterStatus = async () => {
    if (!activeChapterId.value || !activeChapterContent.value) return;

    const nextStatus =
        activeChapterContent.value.status === "PUBLISHED"
            ? "DRAFT"
            : "PUBLISHED";

    try {
        await updateChapter(activeChapterId.value, { status: nextStatus });
        activeChapterContent.value.status = nextStatus;

        const index = chapters.value.findIndex(
            (ch) => ch.id === activeChapterId.value,
        );
        if (index !== -1) {
            chapters.value[index].status = nextStatus;
        }

        toast.success(`Chapter marked as ${nextStatus.toLowerCase()}`);
    } catch (error) {
        toast.error("Failed to update chapter status");
    }
};

const wordCount = computed(() => {
    const div = document.createElement("div");
    div.innerHTML = editorContent.value;
    const text = div.textContent || "";
    return text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
});

const handlePublish = async () => {
    if (!book.value || isNewBook.value) return;

    try {
        await updateBook(bookId.value, { status: "PUBLISHED" });
        book.value.status = "PUBLISHED";

        if (chapters.value.length > 0) {
            await Promise.all(
                chapters.value.map((chapter) =>
                    updateChapter(chapter.id, { status: "PUBLISHED" }),
                ),
            );
            chapters.value = chapters.value.map((chapter) => ({
                ...chapter,
                status: "PUBLISHED",
            }));
        }

        statusFilter.value = "PUBLISHED";
        toast.success("Book published!");
    } catch (error) {
        toast.error("Failed to publish book");
    }
};

onMounted(fetchBookData);
</script>

<template>
    <div class="flex flex-col h-screen bg-[#F5E6D3]">
        <div
            v-if="isLoading"
            class="flex-1 flex flex-col items-center justify-center bg-[#F5E6D3]"
        >
            <div
                class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-800 mb-4"
            ></div>
            <p class="text-amber-900 font-medium">Loading your manuscript...</p>
        </div>

        <template v-else>
            <!-- Writing Navbar -->
            <WritingNavbar
                :isSaved="isSaved"
                :status="book?.status"
                @saveDraft="handleSaveDraft"
                @publish="handlePublish"
            />

            <div class="flex flex-1 overflow-hidden">
                <!-- Sidebar -->
                <WritingSidebar
                    :chapters="chapters"
                    :activeChapterId="activeChapterId || undefined"
                    :statusFilter="statusFilter"
                    @selectChapter="handleSelectChapter"
                    @newChapter="handleNewChapter"
                    @updateStatusFilter="(value) => (statusFilter = value)"
                />

                <!-- Main Content Area -->
                <main class="flex-1 overflow-y-auto">
                    <div class="max-w-4xl mx-auto px-12 py-8">
                        <!-- Header Section with Cover and Metadata -->
                        <div class="mb-8 flex gap-8">
                            <!-- Cover Upload Section -->
                            <div class="flex-shrink-0 w-48">
                                <CoverImageUploader
                                    :model-value="coverPreviewUrl"
                                    :error="coverUploadError"
                                    helper-text="JPG or PNG up to 2MB"
                                    @fileSelected="handleCoverSelected"
                                    @clear="clearCover"
                                />
                                <p
                                    v-if="isUploadingCover"
                                    class="text-xs text-amber-700 mt-2"
                                >
                                    Uploading cover...
                                </p>
                            </div>

                            <!-- Title and Metadata Section -->
                            <div class="flex-1">
                                <!-- Title - Editable -->
                                <div class="mb-8">
                                    <div
                                        v-if="!isEditingTitle"
                                        @click="startEditingTitle"
                                        class="group cursor-pointer"
                                    >
                                        <h1
                                            class="text-5xl font-light text-[#123C3A] leading-tight group-hover:text-amber-800 transition-colors"
                                        >
                                            {{ book?.title }}
                                        </h1>
                                        <p class="text-xs text-gray-500 mt-2">
                                            Click to edit title
                                        </p>
                                    </div>

                                    <div v-else class="mb-4">
                                        <input
                                            v-model="titleInput"
                                            type="text"
                                            @keyup.enter="handleTitleChange"
                                            @keyup.escape="cancelEditingTitle"
                                            class="w-full text-5xl font-light bg-transparent border-b-2 border-amber-600 focus:outline-none text-[#123C3A] pb-2"
                                            placeholder="Enter book title"
                                            autofocus
                                        />
                                        <div class="flex gap-2 mt-4">
                                            <button
                                                @click="handleTitleChange"
                                                class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors"
                                            >
                                                Save Title
                                            </button>
                                            <button
                                                @click="cancelEditingTitle"
                                                class="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Status Line -->
                                <div
                                    class="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-300"
                                >
                                    <div class="flex items-center gap-1">
                                        <Clock
                                            :size="16"
                                            class="text-gray-500"
                                        />
                                        <span
                                            >Last saved
                                            {{ lastSavedTime }}</span
                                        >
                                    </div>
                                    <span>•</span>
                                    <span
                                        >{{ wordCount }} words in active
                                        chapter</span
                                    >
                                    <span>•</span>
                                    <span
                                        :class="
                                            book?.status === 'PUBLISHED'
                                                ? 'text-green-600 font-bold'
                                                : 'text-amber-700 font-semibold'
                                        "
                                    >
                                        {{ book?.status }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Chapter Title for Editor -->
                        <div
                            v-if="activeChapterContent"
                            class="mb-4 flex flex-wrap items-center justify-between gap-3"
                        >
                            <div>
                                <h2
                                    class="text-2xl font-semibold text-[#123C3A]"
                                >
                                    {{ activeChapterContent.title }}
                                </h2>
                                <span
                                    class="inline-flex mt-2 text-[11px] px-2.5 py-1 rounded-full font-semibold uppercase"
                                    :class="
                                        activeChapterContent.status ===
                                        'PUBLISHED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    "
                                >
                                    {{ activeChapterContent.status }}
                                </span>
                            </div>

                            <div class="flex items-center gap-2">
                                <button
                                    type="button"
                                    class="px-3 py-2 rounded-lg text-xs font-semibold border border-amber-200 text-amber-900 hover:bg-amber-50"
                                    @click="handleToggleChapterStatus"
                                >
                                    {{
                                        activeChapterContent.status ===
                                        "PUBLISHED"
                                            ? "Move to Draft"
                                            : "Publish Chapter"
                                    }}
                                </button>
                                <button
                                    type="button"
                                    class="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    @click="showPreview = !showPreview"
                                >
                                    <Eye v-if="!showPreview" :size="14" />
                                    <EyeOff v-else :size="14" />
                                    {{
                                        showPreview ? "Hide Preview" : "Preview"
                                    }}
                                </button>
                            </div>
                        </div>

                        <!-- Editor / Preview -->
                        <div
                            class="mb-4 shadow-sm rounded-lg overflow-hidden border border-amber-200"
                        >
                            <div
                                v-if="showPreview"
                                class="bg-[#FDFCFB] px-12 py-10 text-[#2A241D] prose max-w-none"
                                v-html="editorContent"
                            ></div>
                            <QuillEditor
                                v-else
                                ref="editorRef"
                                :content="editorContent"
                                @update:content="editorContent = $event"
                                @text-change="handleEditorChange"
                            />
                        </div>

                        <div
                            v-if="!activeChapterId && !isNewBook"
                            class="text-center py-20 bg-white/30 rounded-lg border-2 border-dashed border-amber-300"
                        >
                            <p class="text-amber-900 font-medium">
                                Select a chapter to start writing
                            </p>
                            <button
                                @click="handleNewChapter"
                                class="mt-4 text-amber-700 font-bold hover:underline"
                            >
                                + Or create a new one
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Footer -->
            <footer
                class="bg-[#093A3F] text-[#FDE9D0]/70 text-xs px-8 py-4 border-t border-gray-700 flex justify-between"
            >
                <span>© 2025 THE DIGITAL ATELIER. ALL RIGHTS RESERVED.</span>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-[#FDE9D0]"
                        >WRITING GUIDELINES</a
                    >
                    <a href="#" class="hover:text-[#FDE9D0]">SUPPORT</a>
                </div>
            </footer>
        </template>
    </div>
</template>

<style scoped>
/* TipTap overrides for the full-height writing canvas */
:deep(.ProseMirror) {
    min-height: 600px;
    max-height: 800px;
    padding: 3rem;
    background-color: #fdfcfb;
    color: #2a241d;
    font-family: "Crimson Pro", Georgia, serif;
    font-size: 18px;
    line-height: 1.8;
}
:deep(.ProseMirror blockquote) {
    border-left: 4px solid #d97706;
    margin: 1rem 0;
    padding-left: 1rem;
    color: #666;
}
</style>
