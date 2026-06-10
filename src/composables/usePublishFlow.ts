import { ref, computed } from "vue";
import { updateBook } from "../services/bookApi";
import type { Book } from "../services/bookApi";
import type { Chapter } from "../services/chapterApi";
import { useToast } from "vue-toastification";

export function usePublishFlow() {
  const toast = useToast();

  const showPublishDialog = ref(false);
  const isPublishing = ref(false);

  const publishSummary = computed(() => {
    return {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
    };
  });

  function updateSummary(chapters: Chapter[]) {
    publishSummary.value.total = chapters.length;
    publishSummary.value.published = chapters.filter((c) => c.status === "PUBLISHED").length;
    publishSummary.value.draft = chapters.filter((c) => c.status === "DRAFT").length;
    publishSummary.value.archived = chapters.filter((c) => c.status === "ARCHIVED").length;
  }

  function openPublishDialog(chapters: Chapter[]) {
    updateSummary(chapters);
    showPublishDialog.value = true;
  }

  function closePublishDialog() {
    showPublishDialog.value = false;
  }

  async function confirmPublish(book: Book): Promise<boolean> {
    isPublishing.value = true;
    try {
      await updateBook(book.id, { status: "PUBLISHED" });
      book.status = "PUBLISHED";
      toast.success("Book published successfully!");
      showPublishDialog.value = false;
      return true;
    } catch {
      toast.error("Failed to publish book");
      return false;
    } finally {
      isPublishing.value = false;
    }
  }

  return {
    showPublishDialog,
    isPublishing,
    publishSummary,
    openPublishDialog,
    closePublishDialog,
    confirmPublish,
  };
}
