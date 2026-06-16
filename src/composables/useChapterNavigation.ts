import { ref, computed, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  content?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
  bookId: string;
  description?: string;
  order: number;
  type: string;
  status?: string;
  price?: number;
  isPurchasable?: boolean;
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccessError {
  reason: string;
  chapterId?: string;
  requiresLogin?: boolean;
  requiresPurchase?: boolean;
  requiresSubscription?: boolean;
}

export function useChapterNavigation() {
  const router = useRouter();

  const chapters = ref<Chapter[]>([]);
  const currentChapter = ref<Chapter | null>(null);
  const currentChapterContent = shallowRef<string>('');
  const contentCacheKey = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const accessError = ref<AccessError | null>(null);

  const currentChapterIndex = computed(() => {
    if (!currentChapter.value) return -1;
    return chapters.value.findIndex(ch => ch.id === currentChapter.value!.id);
  });

  const hasNextChapter = computed(() => {
    return currentChapterIndex.value < chapters.value.length - 1;
  });

  const hasPreviousChapter = computed(() => {
    return currentChapterIndex.value > 0;
  });

  const nextChapter = computed(() => {
    if (!hasNextChapter.value) return null;
    return chapters.value[currentChapterIndex.value + 1];
  });

  const previousChapter = computed(() => {
    if (!hasPreviousChapter.value) return null;
    return chapters.value[currentChapterIndex.value - 1];
  });

  const totalChapters = computed(() => chapters.value.length);

  const progressPercentage = computed(() => {
    if (totalChapters.value === 0) return 0;
    return ((currentChapterIndex.value + 1) / totalChapters.value) * 100;
  });

  const scrollToTop = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function parseAccessError(err: any, chapterId?: string): AccessError {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.data?.message ||
      err?.message ||
      'Access denied';

    const lower = message.toLowerCase();
    if (status === 403 || status === 401) {
      if (lower.includes('login') || status === 401) {
        return { reason: message, chapterId, requiresLogin: true };
      }
      // Check both flags independently — backend may mention both options
      const hasSub = lower.includes('subscription') || lower.includes('premium');
      const hasPurchase = lower.includes('purchase') || lower.includes('own');
      if (hasSub || hasPurchase) {
        return {
          reason: message,
          chapterId,
          requiresSubscription: hasSub || undefined,
          requiresPurchase: hasPurchase || undefined,
        };
      }
      return { reason: message, chapterId, requiresLogin: true };
    }
    return { reason: message, chapterId };
  }

  const fetchChapters = async (bookId: string) => {
    if (!bookId) {
      error.value = 'Book ID is required';
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      accessError.value = null;

      const response = await api.get(`/chapters/book/${bookId}`);
      chapters.value = (response.data || []).sort((a: Chapter, b: Chapter) =>
        a.chapterNumber - b.chapterNumber
      );
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch chapters';
      chapters.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch chapter content from the backend.
   * Returns true if the content was loaded successfully, false if access was denied or an error occurred.
   */
  const fetchChapterContent = async (chapterId: string): Promise<boolean> => {
    if (!chapterId) {
      error.value = 'Chapter ID is required';
      return false;
    }

    // Save previous state in case access is denied — we'll restore it
    const prevChapter = currentChapter.value;
    const prevContent = currentChapterContent.value;

    try {
      isLoading.value = true;
      error.value = null;
      accessError.value = null;

      const response = await api.get(`/chapters/${chapterId}/content`);
      const chapterData = response.data;

      currentChapter.value = chapterData;
      currentChapterContent.value = chapterData.content || '';
      contentCacheKey.value++;
      return true;
    } catch (err: any) {
      const ae = parseAccessError(err, chapterId);
      if (ae.requiresLogin || ae.requiresPurchase || ae.requiresSubscription) {
        accessError.value = ae;
        error.value = ae.reason;
        // Restore previous chapter state so the user isn't left with a blank screen
        currentChapter.value = prevChapter;
        currentChapterContent.value = prevContent;
      } else {
        error.value = err.message || 'Failed to fetch chapter content';
        currentChapterContent.value = '';
        contentCacheKey.value++;
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Find the first free published chapter that doesn't require payment or subscription.
   * Used when navigating to a book without a specific chapter in mind.
   */
  const findFirstFreeChapter = (): Chapter | undefined => {
    return chapters.value.find((ch) => {
      if (ch.status !== 'PUBLISHED') return false;
      if (ch.isPremium) return false;
      if (ch.isPurchasable && Number(ch.price ?? 0) > 0) return false;
      return true;
    });
  };

  const initializeReading = async (bookId: string, chapterId?: string) => {
    accessError.value = null;
    error.value = null;
    await fetchChapters(bookId);

    if (chapterId) {
      await fetchChapterContent(chapterId);
      return;
    }

    if (chapters.value.length === 0) {
      error.value = 'This book has no chapters yet.';
      return;
    }

    // Try to load the first free chapter
    const free = findFirstFreeChapter();
    if (free) {
      await fetchChapterContent(free.id);
      return;
    }

    // No free chapters — try loading the first published chapter through the backend.
    // The backend will grant or deny access based on the user's purchases/subscription.
    // Only show the access-error overlay if the backend actually returns 403.
    const firstPublished = chapters.value.find((ch) => ch.status === 'PUBLISHED');
    if (firstPublished) {
      await fetchChapterContent(firstPublished.id);
      // If fetchChapterContent succeeded, currentChapter is now set and accessError is null.
      // If it failed with an access error, accessError is already populated by parseAccessError.
      return;
    }

    error.value = 'No readable chapters found.';
  };

  const navigateWithCleanUrl = async () => {
    if (currentChapter.value?.bookId) {
      await router.push({
        name: 'readingpage',
        params: { id: currentChapter.value.bookId },
        query: { chapterId: currentChapter.value.id },
      });
    }
  };

  const goToNextChapter = async () => {
    if (!hasNextChapter.value || !nextChapter.value) {
      error.value = 'No next chapter available';
      return;
    }

    isLoading.value = true;
    scrollToTop();
    const ok = await fetchChapterContent(nextChapter.value.id);
    if (ok) {
      await navigateWithCleanUrl();
    }
    isLoading.value = false;
  };

  const goToPreviousChapter = async () => {
    if (!hasPreviousChapter.value || !previousChapter.value) {
      error.value = 'No previous chapter available';
      return;
    }

    isLoading.value = true;
    scrollToTop();
    const ok = await fetchChapterContent(previousChapter.value.id);
    if (ok) {
      await navigateWithCleanUrl();
    }
    isLoading.value = false;
  };

  const goToChapter = async (chapterId: string) => {
    const chapter = chapters.value.find(ch => ch.id === chapterId);
    if (!chapter) {
      error.value = 'Chapter not found';
      return;
    }

    isLoading.value = true;
    scrollToTop();
    const ok = await fetchChapterContent(chapterId);
    if (ok) {
      await navigateWithCleanUrl();
    }
    isLoading.value = false;
  };

  return {
    chapters,
    currentChapter,
    currentChapterContent,
    contentCacheKey,
    isLoading,
    error,
    accessError,

    currentChapterIndex,
    hasNextChapter,
    hasPreviousChapter,
    nextChapter,
    previousChapter,
    totalChapters,
    progressPercentage,

    fetchChapters,
    fetchChapterContent,
    initializeReading,
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    scrollToTop,
  };
}
