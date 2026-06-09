import { ref } from "vue";
import {
  createChapter,
  updateChapter,
  deleteChapter,
  type Chapter,
} from "../services/chapterApi";
import { useToast } from "vue-toastification";

export type ChapterCreateType = "CHAPTER" | "PROLOGUE" | "EPILOGUE" | "BONUS";

export function useChapterManagement(bookId: string) {
  const toast = useToast();
  const isProcessing = ref(false);

  async function addChapter(
    chapters: Chapter[],
    type: ChapterCreateType = "CHAPTER",
    templateContent?: string,
  ): Promise<Chapter | null> {
    isProcessing.value = true;
    try {
      const nextNum = chapters.length + 1;
      const newCh = await createChapter({
        bookId,
        title: type === "PROLOGUE" ? "Prologue"
          : type === "EPILOGUE" ? "Epilogue"
          : type === "BONUS" ? "Bonus Content"
          : `Chapter ${nextNum}`,
        chapterNumber: nextNum,
        order: nextNum,
        content: templateContent || "",
        type,
        status: "DRAFT",
      } as any);
      chapters.push(newCh);
      toast.success(`${type === "CHAPTER" ? "Chapter" : type.charAt(0) + type.slice(1).toLowerCase()} created`);
      return newCh;
    } catch {
      toast.error("Failed to create chapter");
      return null;
    } finally {
      isProcessing.value = false;
    }
  }

  async function removeChapter(
    chapterId: string,
    chapters: Chapter[],
  ): Promise<boolean> {
    if (!window.confirm("Delete this chapter? This cannot be undone.")) return false;

    isProcessing.value = true;
    try {
      await deleteChapter(chapterId);
      const idx = chapters.findIndex((c) => c.id === chapterId);
      if (idx !== -1) chapters.splice(idx, 1);
      toast.success("Chapter deleted");
      return true;
    } catch {
      toast.error("Failed to delete chapter");
      return false;
    } finally {
      isProcessing.value = false;
    }
  }

  async function setChapterStatus(
    chapterId: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
    chapters: Chapter[],
  ): Promise<boolean> {
    try {
      await updateChapter(chapterId, { status } as any);
      const ch = chapters.find((c) => c.id === chapterId);
      if (ch) ch.status = status;
      const labels = { DRAFT: "unpublished", PUBLISHED: "published", ARCHIVED: "archived" };
      toast.success(`Chapter ${labels[status]}`);
      return true;
    } catch {
      toast.error("Failed to update chapter status");
      return false;
    }
  }

  async function setChapterType(
    chapterId: string,
    type: ChapterCreateType,
    chapters: Chapter[],
  ): Promise<boolean> {
    try {
      await updateChapter(chapterId, { type } as any);
      const ch = chapters.find((c) => c.id === chapterId);
      if (ch) ch.type = type as any;
      return true;
    } catch {
      toast.error("Failed to update chapter type");
      return false;
    }
  }

  async function reorderChapters(
    orderedIds: string[],
    chapters: Chapter[],
  ): Promise<boolean> {
    isProcessing.value = true;
    try {
      await Promise.all(
        orderedIds.map((id, index) =>
          updateChapter(id, { order: index + 1 } as any),
        ),
      );
      chapters.sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
      return true;
    } catch {
      toast.error("Failed to reorder chapters");
      return false;
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    addChapter,
    removeChapter,
    setChapterStatus,
    setChapterType,
    reorderChapters,
  };
}
