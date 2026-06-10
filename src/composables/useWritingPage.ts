import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getBookDetail,
  updateBook,
  createBook,
  type Book,
} from "../services/bookApi";
import {
  getChapters,
  getChapterContent,
  createChapter,
  updateChapter,
  deleteChapter,
  type Chapter,
  type ChapterContent,
} from "../services/chapterApi";
import { useToast } from "vue-toastification";

export function useWritingPage() {
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();

  const book = ref<Book | null>(null);
  const chapters = ref<Chapter[]>([]);
  const activeChapterId = ref<string | null>(null);
  const activeChapter = ref<Chapter | null>(null);
  const activeChapterContent = ref<ChapterContent | null>(null);
  const editorContent = ref("");
  const isSaved = ref(true);
  const lastSavedTime = ref("never");
  const isLoading = ref(true);
  const isSaving = ref(false);

  const bookId = computed(() => route.params.id as string);
  const isNewBook = computed(() => bookId.value === "new");

  const wordCount = computed(() => {
    if (!editorContent.value) return 0;
    return editorContent.value
      .replace(/<[^>]*>/g, "")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  });

  const draftChapters = computed(() =>
    chapters.value.filter((c) => c.status === "DRAFT"),
  );
  const publishedChapters = computed(() =>
    chapters.value.filter((c) => c.status === "PUBLISHED"),
  );

  async function fetchBookData() {
    if (isNewBook.value) {
      book.value = {
        id: "new",
        title: "Untitled",
        description: "",
        status: "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Book;
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

      if (chapters.value.length === 0) {
        const newCh = await createChapter({
          bookId: bookId.value,
          title: "Chapter 1",
          chapterNumber: 1,
          order: 1,
          content: "",
          type: "CHAPTER",
          status: "DRAFT",
        } as any);
        chapters.value.push(newCh);
        await selectChapter(newCh.id);
      } else {
        const firstDraft =
          chapters.value.find((c) => c.status === "DRAFT") || chapters.value[0];
        if (firstDraft) await selectChapter(firstDraft.id);
      }
    } catch {
      toast.error("Failed to load book data");
      router.push("/dashboard/manuscripts");
    } finally {
      isLoading.value = false;
    }
  }

  async function selectChapter(chapterId: string) {
    if (!isSaved.value && activeChapterId.value) {
      await saveDraft();
    }

    try {
      const content = await getChapterContent(chapterId);
      activeChapterContent.value = content;
      activeChapterId.value = chapterId;
      activeChapter.value = chapters.value.find((c) => c.id === chapterId) || null;
      editorContent.value = content.content || "";
      isSaved.value = true;
    } catch {
      toast.error("Failed to load chapter");
    }
  }

  async function saveDraft() {
    if (!book.value || isSaving.value) return;

    isSaving.value = true;
    try {
      if (isNewBook.value) {
        const newBook = await createBook({
          title: book.value.title || "Untitled",
          description: "",
        } as any);
        toast.success("Book created!");
        router.push(`/${newBook.id}/write`);
        return;
      }

      const toc = chapters.value
        .sort((a, b) => a.order - b.order || a.chapterNumber - b.chapterNumber)
        .map((c) => `${c.chapterNumber}. ${c.title}`)
        .join("\n");

      const promises: Promise<any>[] = [
        updateBook(bookId.value, {
          title: book.value.title,
          tableOfContents: toc,
        }),
      ];

      if (activeChapterId.value) {
        promises.push(
          updateChapter(activeChapterId.value, {
            content: editorContent.value,
          }),
        );
      }

      await Promise.all(promises);

      if (activeChapterId.value) {
        const chIndex = chapters.value.findIndex(
          (c) => c.id === activeChapterId.value,
        );
        if (chIndex !== -1) {
          chapters.value[chIndex].wordCount = wordCount.value;
        }
      }

      isSaved.value = true;
      lastSavedTime.value = new Date().toLocaleTimeString();
    } catch {
      toast.error("Failed to save draft");
    } finally {
      isSaving.value = false;
    }
  }

  // Autosave: 5s debounce
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  watch(editorContent, () => {
    if (!isSaved.value) {
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(() => {
        saveDraft();
      }, 5000);
    }
  });

  function markDirty() {
    isSaved.value = false;
  }

  // Keyboard shortcut Ctrl+S
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (!isSaved.value) saveDraft();
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
    fetchBookData();
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
    if (autosaveTimer) clearTimeout(autosaveTimer);
  });

  return {
    book,
    chapters,
    activeChapterId,
    activeChapter,
    activeChapterContent,
    editorContent,
    isSaved,
    lastSavedTime,
    isLoading,
    isSaving,
    bookId,
    isNewBook,
    wordCount,
    draftChapters,
    publishedChapters,
    fetchBookData,
    selectChapter,
    saveDraft,
    markDirty,
    createChapter,
    updateChapter,
    deleteChapter,
  };
}
