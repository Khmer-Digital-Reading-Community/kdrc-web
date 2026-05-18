import { ref, computed } from 'vue';
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
  createdAt?: string;
  updatedAt?: string;
}

export function useChapterNavigation() {
  const router = useRouter();

  // State
  const chapters = ref<Chapter[]>([]);
  const currentChapter = ref<Chapter | null>(null);
  const currentChapterContent = ref<string>('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
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

  /**
   * Scroll to top of the main content area
   */
  const scrollToTop = () => {
    // Try to scroll main content area
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    } else {
      // Fallback to window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Fetch all chapters for a specific book
   */
  const fetchChapters = async (bookId: string) => {
    if (!bookId) {
      error.value = 'Book ID is required';
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await api.get(`/chapters/book/${bookId}`);
      // Sort chapters by chapter number to ensure correct order
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
   * Fetch content for a specific chapter
   */
  const fetchChapterContent = async (chapterId: string) => {
    if (!chapterId) {
      error.value = 'Chapter ID is required';
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await api.get(`/chapters/${chapterId}/content`);
      const chapterData = response.data;
      
      currentChapter.value = chapterData;
      currentChapterContent.value = chapterData.content || '';
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch chapter content';
      currentChapterContent.value = '';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Initialize chapter reading - fetch both chapters list and current chapter
   */
  const initializeReading = async (bookId: string, chapterId?: string) => {
    // Fetch all chapters for the book
    await fetchChapters(bookId);

    // Set current chapter
    if (chapterId) {
      await fetchChapterContent(chapterId);
    } else if (chapters.value.length > 0) {
      // If no chapter specified, load the first one
      await fetchChapterContent(chapters.value[0].id);
    }
  };

  /**
   * Navigate to the next chapter
   */
  const goToNextChapter = async () => {
    if (!hasNextChapter.value || !nextChapter.value) {
      error.value = 'No next chapter available';
      return;
    }

    try {
      isLoading.value = true;
      scrollToTop();
      
      await fetchChapterContent(nextChapter.value.id);
      
      // Update URL if using route params
      if (currentChapter.value && currentChapter.value.bookId) {
        await router.push({
          name: 'readingpage',
          params: {
            id: currentChapter.value.bookId,
            chapterId: currentChapter.value.id
          }
        });
      }
    } catch (err: any) {
      error.value = 'Failed to navigate to next chapter';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Navigate to the previous chapter
   */
  const goToPreviousChapter = async () => {
    if (!hasPreviousChapter.value || !previousChapter.value) {
      error.value = 'No previous chapter available';
      return;
    }

    try {
      isLoading.value = true;
      scrollToTop();
      
      await fetchChapterContent(previousChapter.value.id);
      
      // Update URL if using route params
      if (currentChapter.value && currentChapter.value.bookId) {
        await router.push({
          name: 'readingpage',
          params: {
            id: currentChapter.value.bookId,
            chapterId: currentChapter.value.id
          }
        });
      }
    } catch (err: any) {
      error.value = 'Failed to navigate to previous chapter';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Jump to a specific chapter
   */
  const goToChapter = async (chapterId: string) => {
    const chapter = chapters.value.find(ch => ch.id === chapterId);
    
    if (!chapter) {
      error.value = 'Chapter not found';
      return;
    }

    try {
      isLoading.value = true;
      scrollToTop();
      
      await fetchChapterContent(chapterId);
      
      // Update URL
      if (currentChapter.value && currentChapter.value.bookId) {
        await router.push({
          name: 'readingpage',
          params: {
            id: currentChapter.value.bookId,
            chapterId: currentChapter.value.id
          }
        });
      }
    } catch (err: any) {
      error.value = 'Failed to navigate to chapter';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    chapters,
    currentChapter,
    currentChapterContent,
    isLoading,
    error,

    // Computed
    currentChapterIndex,
    hasNextChapter,
    hasPreviousChapter,
    nextChapter,
    previousChapter,
    totalChapters,
    progressPercentage,

    // Methods
    fetchChapters,
    fetchChapterContent,
    initializeReading,
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    scrollToTop,
  };
}
