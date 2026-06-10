import { ref, onMounted } from "vue";
import {
  buyBook,
  buyChapter,
  checkBookOwnership,
  checkChapterOwnership,
  getMyLibrary,
  getCredits,
  addCredits,
  type LibraryBook,
} from "../services/purchaseApi";
import { token } from "../services/auth";

export function usePurchases() {
  const credits = ref(0);
  const library = ref<LibraryBook[]>([]);
  const ownedBookIds = ref<Set<string>>(new Set());
  const ownedChapterIds = ref<Set<string>>(new Set());
  const loading = ref(false);
  const libraryLoading = ref(false);

  const fetchCredits = async () => {
    if (!token.value) return;
    try {
      const res = await getCredits();
      credits.value = res.credits;
    } catch {
      // ignore
    }
  };

  const fetchLibrary = async () => {
    if (!token.value) return;
    libraryLoading.value = true;
    try {
      const books = await getMyLibrary();
      library.value = books;
      ownedBookIds.value = new Set(books.map((b) => b.id));
    } catch {
      // ignore
    } finally {
      libraryLoading.value = false;
    }
  };

  const purchaseBook = async (bookId: string, price: number) => {
    if (!token.value) return { success: false, error: "Login required" };
    if (credits.value < price) {
      return { success: false, error: "Insufficient credits" };
    }
    loading.value = true;
    try {
      await buyBook(bookId);
      credits.value = credits.value - price;
      ownedBookIds.value.add(bookId);
      await fetchLibrary();
      return { success: true };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Purchase failed";
      return { success: false, error: msg };
    } finally {
      loading.value = false;
    }
  };

  const purchaseChapter = async (chapterId: string, price: number) => {
    if (!token.value) return { success: false, error: "Login required" };
    if (credits.value < price) {
      return { success: false, error: "Insufficient credits" };
    }
    loading.value = true;
    try {
      await buyChapter(chapterId);
      credits.value = credits.value - price;
      ownedChapterIds.value.add(chapterId);
      return { success: true };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Purchase failed";
      return { success: false, error: msg };
    } finally {
      loading.value = false;
    }
  };

  const checkOwnership = async (bookId: string) => {
    if (!token.value) return false;
    if (ownedBookIds.value.has(bookId)) return true;
    try {
      const res = await checkBookOwnership(bookId);
      if (res.owned) {
        ownedBookIds.value.add(bookId);
      }
      return res.owned;
    } catch {
      return false;
    }
  };

  const checkChapterAccess = async (chapterId: string) => {
    if (!token.value) return false;
    if (ownedChapterIds.value.has(chapterId)) return true;
    try {
      const res = await checkChapterOwnership(chapterId);
      if (res.owned) {
        ownedChapterIds.value.add(chapterId);
      }
      return res.owned;
    } catch {
      return false;
    }
  };

  const topUpCredits = async (amount: number) => {
    if (!token.value) return;
    try {
      const res = await addCredits(amount);
      credits.value = res.credits;
    } catch (err) {
      console.error("Failed to add credits:", err);
    }
  };

  onMounted(() => {
    fetchCredits();
    fetchLibrary();
  });

  return {
    credits,
    library,
    ownedBookIds,
    ownedChapterIds,
    loading,
    libraryLoading,
    fetchCredits,
    fetchLibrary,
    purchaseBook,
    purchaseChapter,
    checkOwnership,
    checkChapterAccess,
    topUpCredits,
  };
}
