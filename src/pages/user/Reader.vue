<template>
  <div class="reader-shell bg-gray-100 h-screen w-full flex items-center justify-center p-4 md:p-8">
    <!-- Loading State -->
    <div v-if="isLoading && !currentChapter" class="flex flex-col items-center justify-center gap-4">
      <div class="w-12 h-12 border-4 border-[#093A3F]/20 border-t-[#093A3F] rounded-full animate-spin"></div>
      <p class="text-gray-600 font-medium">Loading chapter...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !currentChapter" class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
      <p class="text-red-700 font-medium mb-4">{{ error }}</p>
      <router-link to="/user/home" class="text-red-600 hover:text-red-700 font-semibold underline">
        ← Back to Home
      </router-link>
    </div>

    <!-- Main Reader -->
    <div v-else-if="currentChapter" class="bg-white w-full max-w-6xl h-full rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 ring-4 ring-blue-500/10">
      <!-- Reading Progress Tracker -->
      <ReadingProgress
        :chapter-id="currentChapter.id"
        :chapter-title="currentChapter.title"
        :current-chapter-number="currentChapterIndex + 1"
        :total-chapters="totalChapters"
        :content-element="mainContentRef"
        :total-words="currentChapter.wordCount || 2500"
        :reading-time-minutes="currentChapter.readingTimeMinutes || 10"
        @progress-update="handleProgressUpdate"
        @progress-saved="handleProgressSaved"
        @chapter-changed="handleChapterChanged"
      />
      <!-- Header -->
      <header class="bg-[#fcfcfc] border-b border-gray-100 flex items-center justify-between px-4 py-3 shrink-0">
        <div class="flex items-center gap-4">
          <router-link to="/user/home" class="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors group" title="Back to Home">
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </router-link>
          <div class="flex flex-col gap-0.5">
            <h1 class="text-xs font-bold text-gray-500 uppercase tracking-wide">Reading</h1>
            <p class="text-sm font-bold text-gray-800 truncate max-w-xs">{{ currentChapter.title }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Progress bar tooltip -->
          <div class="text-right mr-2">
            <p class="text-xs text-gray-400 font-medium">{{ currentChapterIndex + 1 }} of {{ totalChapters }}</p>
            <div class="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div class="h-full bg-[#B4690E] rounded-full transition-all duration-300" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>
          <button class="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors" title="Bookmark">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto relative" ref="mainContentRef">
        <div class="max-w-3xl mx-auto px-8 py-12 md:py-16 relative">
          <!-- Chapter Header -->
          <div class="text-center mb-16 relative">
            <span class="text-[10px] font-bold text-[#B4690E] tracking-[0.2em] uppercase">
              Chapter {{ currentChapter.chapterNumber }}
            </span>
            <h2 class="text-3xl text-gray-800 mt-2 font-serif font-semibold leading-tight">
              {{ currentChapter.title }}
            </h2>
            
            <!-- Chapter metadata -->
            <div v-if="currentChapter.wordCount" class="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span>{{ currentChapter.wordCount }} words</span>
              <span>•</span>
              <span>~{{ currentChapter.readingTimeMinutes || 10 }} min read</span>
            </div>

            <!-- Settings button -->
            <button class="absolute top-0 right-0 md:-right-16 lg:-right-24 w-8 h-8 bg-white border border-gray-200 rounded shadow-sm hidden sm:inline-flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors group" title="Reader settings">
              <svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>

          <!-- Chapter Content -->
          <article class="text-[#6b7280] text-base md:text-[17px] leading-[1.8] space-y-8 font-serif prose prose-sm max-w-none">
            <div v-html="formatContent(currentChapterContent)" class="whitespace-pre-wrap"></div>
          </article>

          <!-- Error notification in content area -->
          <div v-if="error && currentChapter" class="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            {{ error }}
          </div>
        </div>
      </main>

      <!-- Footer Navigation -->
      <footer class="bg-[#fcfcfc] border-t border-gray-100 px-6 py-4 shrink-0">
        <div class="flex items-center justify-between gap-4">
          <!-- Previous Button -->
          <button
            @click="goToPreviousChapter"
            :disabled="!hasPreviousChapter || isLoading"
            :class="[
              'px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2',
              hasPreviousChapter && !isLoading
                ? 'bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            ]"
            :title="hasPreviousChapter ? `Previous: ${previousChapter?.title}` : 'No previous chapter'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>

          <!-- Chapter Progress Info -->
          <div class="text-center flex-1">
            <div class="text-xs text-gray-500 font-medium">
              Chapter {{ currentChapterIndex + 1 }} of {{ totalChapters }}
            </div>
            <div class="mt-1.5 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full from-[#093A3F] to-[#B4690E] rounded-full transition-all duration-300"
                :style="{ width: progressPercentage + '%', background: 'linear-gradient(to right, #093A3F, #B4690E)' }"
              ></div>
            </div>
          </div>

          <!-- Next Button -->
          <button
            @click="goToNextChapter"
            :disabled="!hasNextChapter || isLoading"
            :class="[
              'px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2',
              hasNextChapter && !isLoading
                ? 'bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            ]"
            :title="hasNextChapter ? `Next: ${nextChapter?.title}` : 'No next chapter'"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- Chapter List Dropdown (Optional) -->
        <div v-if="chapters.length > 1" class="mt-3 pt-3 border-t border-gray-100">
          <details class="group cursor-pointer">
            <summary class="text-xs font-semibold text-gray-600 hover:text-gray-800 flex items-center gap-2">
              <svg class="w-3.5 h-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
              Jump to chapter
            </summary>
            <div class="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
              <button
                v-for="chapter in chapters"
                :key="chapter.id"
                @click="goToChapter(chapter.id)"
                :class="[
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  currentChapter.id === chapter.id
                    ? 'bg-[#B4690E] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
                :title="chapter.title"
              >
                {{ chapter.chapterNumber }}
              </button>
            </div>
          </details>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChapterNavigation } from '../../composables/useChapterNavigation';
import { useReadingProgress } from '../../composables/useReadingProgress';
import ReadingProgress from '../../components/reader/ReadingProgress.vue';

const route = useRoute();
const router = useRouter();

const {
  chapters,
  currentChapter,
  currentChapterContent,
  isLoading,
  error,
  currentChapterIndex,
  hasNextChapter,
  hasPreviousChapter,
  nextChapter,
  previousChapter,
  totalChapters,
  progressPercentage,
  initializeReading,
  goToNextChapter,
  goToPreviousChapter,
  goToChapter,
} = useChapterNavigation();

const { saveChapterProgress, getChapterProgress } = useReadingProgress();
const mainContentRef = ref<HTMLElement | null>(null);

/**
 * Format chapter content for display
 * Wraps paragraphs in proper elements
 */
const formatContent = (content: string): string => {
  if (!content) return '<p>No content available</p>';

  // Split by double newlines to identify paragraphs
  return content
    .split('\n\n')
    .filter(p => p.trim())
    .map(para => `<p>${para.trim()}</p>`)
    .join('');
};

/**
 * Handle reading progress updates
 */
const handleProgressUpdate = (progress: { scroll: number; chapterId?: string; timeSpent: number }) => {
  // Progress is updated in real-time without saving
  console.log('Reading progress updated:', progress);
};

/**
 * Handle progress saved event
 */
const handleProgressSaved = (progress: { scroll: number; chapterId?: string; timeSpent: number }) => {
  // Save progress data via API or localStorage
  if (currentChapter.value) {
    saveChapterProgress(
      currentChapter.value.id,
      progress.scroll,
      progress.timeSpent,
      Math.round((progress.scroll / 100) * (currentChapter.value.wordCount || 2500))
    );
    console.log('Progress saved:', progress);
  }
};

/**
 * Handle chapter changes in progress tracker
 */
const handleChapterChanged = (chapterId?: string) => {
  console.log('Chapter changed in progress tracker:', chapterId);
  // Reset any chapter-specific UI state if needed
};

/**
 * Initialize reading on component mount
 * Extract bookId and optional chapterId from route params
 */
onMounted(async () => {
  const bookId = route.params.id as string;
  const chapterId = route.query.chapterId as string | undefined;

  if (!bookId) {
    error.value = 'Book ID is missing. Please navigate from a book page.';
    return;
  }

  await initializeReading(bookId, chapterId);
  
  // Set main content ref after chapter loads
  setTimeout(() => {
    mainContentRef.value = document.querySelector('main');
  }, 100);
});

/**
 * Watch for route changes to support direct navigation via URL
 */
watch(
  () => route.params.id,
  async (newBookId) => {
    if (newBookId && newBookId !== currentChapter.value?.bookId) {
      const chapterId = route.query.chapterId as string | undefined;
      await initializeReading(newBookId as string, chapterId);
    }
  }
);

/**
 * Watch for query changes to support chapter-specific URLs
 */
watch(
  () => route.query.chapterId,
  async (newChapterId) => {
    if (newChapterId && newChapterId !== currentChapter.value?.id) {
      // The chapter navigation will be handled by goToChapter
      // This watch is just for supporting deep links
    }
  }
);
</script>

<style scoped>
.reader-shell ::-webkit-scrollbar {
  width: 6px;
}

.reader-shell ::-webkit-scrollbar-track {
  background: transparent;
}

.reader-shell ::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.reader-shell ::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
