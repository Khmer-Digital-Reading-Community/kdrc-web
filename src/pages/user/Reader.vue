<template>
  <div
    class="reader-shell min-h-screen w-full"
    :style="themeVariables"
  >
    <!-- Loading State (initial load) -->
    <div
      v-if="isLoading && !currentChapter"
      class="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
      style="background-color: var(--reader-bg)"
    >
      <div
        class="w-12 h-12 border-4 border-[#093A3F]/20 border-t-[#093A3F] rounded-full animate-spin"
      ></div>
      <p class="text-gray-500 font-medium animate-pulse">
        Entering the world of stories...
      </p>
    </div>

    <!-- Skeleton Loading (chapter transition) -->
    <div
      v-if="isLoading && currentChapter && showSkeleton"
      class="fixed inset-0 z-40 flex items-start justify-center pt-32"
      style="background-color: var(--reader-bg)"
    >
      <div class="max-w-3xl mx-auto px-6 sm:px-8 w-full animate-pulse">
        <div class="text-center mb-16">
          <div class="h-8 bg-current/10 rounded-lg w-64 mx-auto mb-4"></div>
          <div class="h-4 bg-current/10 rounded-lg w-32 mx-auto"></div>
        </div>
        <div class="space-y-4">
          <div class="h-4 bg-current/10 rounded w-full"></div>
          <div class="h-4 bg-current/10 rounded w-5/6"></div>
          <div class="h-4 bg-current/10 rounded w-4/6"></div>
          <div class="h-4 bg-current/10 rounded w-full"></div>
          <div class="h-4 bg-current/10 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error && !currentChapter"
      class="fixed inset-0 flex items-center justify-center p-4 z-50"
      style="background-color: var(--reader-bg)"
    >
      <div
        class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center shadow-xl"
      >
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <AlertTriangle class="text-red-600 w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-red-900 mb-2">
          Something went wrong
        </h3>
        <p class="text-red-700 font-medium mb-6">{{ error }}</p>
        <button
          @click="router.push('/home')"
          class="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-md"
        >
          <ArrowLeft :size="18" />
          Back to Home
        </button>
      </div>
    </div>

    <!-- Main Reader UI -->
    <div v-else-if="currentChapter" class="relative flex flex-col min-h-screen">
      <!-- Anti-copy overlay (invisible) -->
      <div
        class="fixed inset-0 pointer-events-none select-none z-[100] print:hidden"
      ></div>

      <!-- Reading Progress Tracker -->
      <ReadingProgress
        :chapter-id="currentChapter.id"
        :chapter-title="currentChapter.title"
        :current-chapter-number="currentChapterIndex + 1"
        :total-chapters="totalChapters"
        :content-element="null"
        :total-words="currentChapter.wordCount || 2500"
        :reading-time-minutes="currentChapter.readingTimeMinutes || 10"
        @progress-update="handleProgressUpdate"
        @progress-saved="handleProgressSaved"
        @chapter-changed="handleChapterChanged"
      />

      <!-- Floating Top Header (Auto-hide) -->
      <header
        class="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between transition-all duration-300 backdrop-blur-md"
        :class="[
          isScrolled
            ? 'translate-y-0 opacity-100 border-b border-white/10'
            : 'translate-y-0 opacity-100',
        ]"
        :style="headerStyle"
      >
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/home')"
            class="p-2 rounded-full hover:bg-black/10 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft :size="20" />
          </button>
          <div class="hidden sm:block">
            <p
              class="text-[10px] font-bold uppercase tracking-widest opacity-60"
            >
              {{ bookTitle }}
            </p>
            <h2 class="text-sm font-bold truncate max-w-[200px]">
              Ch {{ currentChapter.chapterNumber }}: {{ currentChapter.title }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="showSettings = !showSettings"
            class="p-2 rounded-full hover:bg-black/10 transition-colors"
            title="Reader Settings"
          >
            <Settings :size="20" />
          </button>

          <button
            class="p-2 rounded-full hover:bg-black/10 transition-colors"
            title="Bookmark"
          >
            <BookmarkIcon :size="20" />
          </button>
        </div>
      </header>

      <!-- Settings Modal -->
      <transition name="slide-fade">
        <div
          v-if="showSettings"
          class="fixed top-16 right-4 z-50 w-72 rounded-2xl shadow-2xl border p-6"
          style="background-color: var(--reader-bg); color: var(--reader-text); border-color: color-mix(in srgb, var(--reader-text) 15%, transparent)"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg">Appearance</h3>
            <button
              @click="showSettings = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Themes -->
          <div class="mb-6">
            <p
              class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3"
            >
              Theme
            </p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(theme, key) in themes"
                :key="key"
                @click="currentTheme = key"
                class="flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all"
                :class="[
                  currentTheme === key
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-100 hover:border-amber-200',
                ]"
              >
                <div
                  class="w-8 h-8 rounded-full border border-gray-200 shadow-inner"
                  :style="{ backgroundColor: theme.bg }"
                ></div>
                <span class="text-[10px] font-bold">{{ theme.name }}</span>
              </button>
            </div>
          </div>

          <!-- Font Size -->
          <div class="mb-6">
            <p
              class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3"
            >
              Font Size
            </p>
            <div class="flex items-center gap-4 bg-gray-50 rounded-xl p-2">
              <button
                @click="changeFontSize(-2)"
                class="p-2 hover:bg-white rounded-lg transition-all"
              >
                <Minus :size="16" />
              </button>
              <span class="flex-1 text-center font-bold text-sm"
                >{{ fontSize }}px</span
              >
              <button
                @click="changeFontSize(2)"
                class="p-2 hover:bg-white rounded-lg transition-all"
              >
                <Plus :size="16" />
              </button>
            </div>
          </div>

          <!-- Font Family -->
          <div>
            <p
              class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3"
            >
              Font Style
            </p>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="currentFont = 'serif'"
                class="p-2 rounded-lg border-2 text-sm font-serif transition-all"
                :class="[
                  currentFont === 'serif'
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-100 hover:border-amber-200',
                ]"
              >
                Serif
              </button>
              <button
                @click="currentFont = 'sans'"
                class="p-2 rounded-lg border-2 text-sm font-sans transition-all"
                :class="[
                  currentFont === 'sans'
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-100 hover:border-amber-200',
                ]"
              >
                Sans
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Main Content Area -->
      <main
        class="flex-1 overflow-x-hidden pt-24 pb-32 no-select"
        ref="mainContentRef"
      >
        <div class="max-w-3xl mx-auto px-6 sm:px-8">
          <!-- Chapter Header -->
          <div class="text-center mb-16">
            <h1
              class="text-4xl sm:text-5xl font-bold leading-tight"
              :class="[currentFont === 'serif' ? 'font-serif' : 'font-sans']"
            >
              {{ currentChapter.title }}
            </h1>
            <div
              class="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold tracking-[0.3em] uppercase opacity-60"
            >
              <Hash :size="12" />
              Chapter {{ currentChapter.chapterNumber }}
            </div>

            <div
              class="flex items-center justify-center gap-4 mt-8 text-xs opacity-50 font-medium"
            >
              <span class="flex items-center gap-1"
                ><BookOpen :size="14" />
                {{ currentChapter.wordCount || 0 }} words</span
              >
              <span>•</span>
              <span class="flex items-center gap-1"
                ><Clock :size="14" /> ~{{
                  currentChapter.readingTimeMinutes || 0
                }}
                min read</span
              >
            </div>

            <div
              class="w-12 h-1 bg-amber-600/30 mx-auto mt-8 rounded-full"
            ></div>
          </div>

          <!-- Content -->
          <article
            class="prose prose-lg max-w-none reader-content leading-relaxed"
            :class="[currentFont === 'serif' ? 'font-serif' : 'font-sans']"
            :style="contentStyle"
          >
            <div
              v-html="renderedContent"
              class="article-body"
            ></div>
            <!-- Sentinel for progressive loading -->
            <div ref="contentSentinel" class="h-4"></div>
          </article>

          <!-- Interaction Footer -->
          <div class="mt-20 pt-10 border-t border-black/10 text-center">
            <p class="text-sm italic opacity-60 mb-8">
              End of Chapter {{ currentChapter.chapterNumber }}
            </p>

            <div
              class="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                @click="goToPreviousChapter"
                v-if="hasPreviousChapter"
                class="w-full sm:w-auto px-8 py-3 rounded-full border border-black/10 hover:bg-black/5 transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                <ChevronLeft :size="18" />
                Previous
              </button>

              <button
                @click="goToNextChapter"
                v-if="hasNextChapter"
                class="w-full sm:w-auto px-10 py-3 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
              >
                Next Chapter
                <ChevronRight :size="18" />
              </button>

              <button
                v-else
                @click="router.push('/home')"
                class="w-full sm:w-auto px-10 py-3 rounded-full bg-[#123C3A] text-white hover:bg-[#0d2e2c] transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#123C3A]/20"
              >
                Finish Reading
                <Check :size="18" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Floating Nav -->
      <nav
        class="fixed bottom-0 left-0 right-0 z-40 p-4 transition-all duration-300"
        :class="[isScrolled ? 'translate-y-0' : 'translate-y-20 opacity-0']"
      >
        <div
          class="max-w-xs mx-auto rounded-full border border-white/10 shadow-2xl p-1 flex items-center"
          :style="{ backgroundColor: themes[currentTheme].bg + 'e6', backdropFilter: 'blur(12px)' }"
        >
          <button
            @click="goToPreviousChapter"
            :disabled="!hasPreviousChapter"
            class="p-3 rounded-full hover:bg-black/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft :size="20" />
          </button>

          <div class="flex-1 text-center">
            <span
              class="text-[10px] font-bold uppercase tracking-widest opacity-60"
              >Chapter</span
            >
            <p class="text-xs font-bold leading-none">
              {{ currentChapterIndex + 1 }} of {{ totalChapters }}
            </p>
          </div>

          <button
            @click="goToNextChapter"
            :disabled="!hasNextChapter"
            class="p-3 rounded-full hover:bg-black/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref, computed, shallowRef, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import {
  ArrowLeft,
  Settings,
  Bookmark as BookmarkIcon,
  X,
  Minus,
  Plus,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Hash,
} from "lucide-vue-next";
import { useChapterNavigation } from "../../composables/useChapterNavigation";
import { renderContent } from "../../utils/content";
import { useReadingProgress } from "../../composables/useReadingProgress";
import ReadingProgress from "../../components/reader/ReadingProgress.vue";
import { getBookBasic } from "../../services/bookApi";
import { upsertReadingProgress } from "../../services/community";
import debounce from "lodash/debounce";

const route = useRoute();
const router = useRouter();

const {
  chapters,
  currentChapter,
  currentChapterContent,
  contentCacheKey,
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
const contentSentinel = ref<HTMLElement | null>(null);
const bookTitle = ref("");

// Reader UI State
const isScrolled = ref(false);
const showSettings = ref(false);
const fontSize = ref(18);
const currentTheme = ref<keyof typeof themes>("light");
const currentFont = ref<"serif" | "sans">("serif");
const showSkeleton = ref(false);

// Progressive content rendering state
const contentChunks = shallowRef<string[]>([]);
const visibleChunks = ref(1);
const CHUNK_SIZE = 50;

const themes = {
  light: {
    name: "Light",
    bg: "#ffffff",
    text: "#1f2937",
  },
  sepia: {
    name: "Sepia",
    bg: "#f4ecd8",
    text: "#5b4636",
  },
  dark: {
    name: "Dark",
    bg: "#1a1a1a",
    text: "#d1d1d1",
  },
};

// CSS custom properties for theme — avoids class-based re-renders
const themeVariables = computed(() => ({
  "--reader-bg": themes[currentTheme.value].bg,
  "--reader-text": themes[currentTheme.value].text,
  "--reader-font-size": fontSize.value + "px",
  "--reader-font-family":
    currentFont.value === "serif" ? "'Georgia', serif" : "'Inter', sans-serif",
}));

// Header background with transparency when scrolled
const headerStyle = computed(() => {
  if (!isScrolled.value) return {};
  const bg = themes[currentTheme.value].bg;
  return { backgroundColor: bg + "cc" };
});

// Memoized rendered content — only re-parses when cache key changes
const renderedContent = computed(() => {
  void contentCacheKey.value;
  void visibleChunks.value;

  if (contentChunks.value.length > 0) {
    return contentChunks.value.slice(0, visibleChunks.value).join("");
  }

  const full = renderContent(currentChapterContent.value);
  if (!full) return "";

  // Split into chunks for progressive rendering
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<div id="root">${full}</div>`,
    "text/html",
  );
  const root = doc.getElementById("root");
  if (!root) return full;

  const blockElements = Array.from(root.children);
  const chunks: string[] = [];
  for (let i = 0; i < blockElements.length; i += CHUNK_SIZE) {
    const slice = Array.from(blockElements).slice(i, i + CHUNK_SIZE);
    chunks.push(slice.map((el) => el.outerHTML).join(""));
  }

  contentChunks.value = chunks;
  visibleChunks.value = 1;
  return chunks.slice(0, 1).join("");
});

// Font + font-size as inline style to avoid re-rendering content
const contentStyle = computed(() => ({
  fontSize: fontSize.value + "px",
  fontFamily:
    currentFont.value === "serif" ? "'Georgia', serif" : "'Inter', sans-serif",
}));

const changeFontSize = (delta: number) => {
  fontSize.value = Math.min(Math.max(fontSize.value + delta, 14), 32);
};

// IntersectionObserver for progressive content loading
let contentObserver: IntersectionObserver | null = null;

const setupContentObserver = () => {
  contentObserver?.disconnect();

  if (!contentSentinel.value) return;

  contentObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        visibleChunks.value < contentChunks.value.length
      ) {
        visibleChunks.value = Math.min(
          visibleChunks.value + 3,
          contentChunks.value.length,
        );
      }
    },
    { rootMargin: "400px" },
  );

  contentObserver.observe(contentSentinel.value);
};

// Anti-Copy Logic
const setupAntiCopy = () => {
  const preventAction = (e: Event) => {
    e.preventDefault();
    return false;
  };

  const preventKeys = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ["c", "v", "u", "s", "p"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      return false;
    }

    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      ["i", "j", "c"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener("contextmenu", preventAction);
  document.addEventListener("copy", preventAction);
  document.addEventListener("selectstart", preventAction);
  document.addEventListener("keydown", preventKeys);

  return () => {
    document.removeEventListener("contextmenu", preventAction);
    document.removeEventListener("copy", preventAction);
    document.removeEventListener("selectstart", preventAction);
    document.removeEventListener("keydown", preventKeys);
  };
};

/**
 * Debounced function to sync progress with the backend
 */
const syncProgressToBackend = debounce(async (scroll: number) => {
  if (!currentChapter.value) return;
  try {
    await upsertReadingProgress(
      currentChapter.value.bookId,
      scroll,
      currentChapter.value.id,
    );
  } catch (err) {
    console.warn("Failed to sync reading progress to backend:", err);
  }
}, 5000);

/**
 * Handle reading progress updates
 */
const handleProgressUpdate = (progress: {
  scroll: number;
  chapterId?: string;
  timeSpent: number;
}) => {
  syncProgressToBackend(progress.scroll);
};

/**
 * Handle progress saved event — syncs to both localStorage and backend
 */
const handleProgressSaved = (progress: {
  scroll: number;
  chapterId?: string;
  timeSpent: number;
}) => {
  if (currentChapter.value) {
    saveChapterProgress(
      currentChapter.value.id,
      progress.scroll,
      progress.timeSpent,
      Math.round(
        (progress.scroll / 100) * (currentChapter.value.wordCount || 2500),
      ),
    );
    // Also sync to backend immediately
    upsertReadingProgress(
      currentChapter.value.bookId,
      progress.scroll,
      currentChapter.value.id,
    ).catch((err) =>
      console.warn("Failed to sync reading progress to backend:", err),
    );
  }
};

const handleChapterChanged = (chapterId?: string) => {
  if (chapterId) {
    const saved = getChapterProgress(chapterId);
    if (saved && saved.scroll > 5) {
      requestAnimationFrame(() => {
        const main = document.querySelector("main");
        if (main) {
          const target =
            (saved.scroll / 100) * (main.scrollHeight - main.clientHeight);
          main.scrollTo({ top: target, behavior: "smooth" });
        }
      });
    }
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Flush pending progress sync on tab close or route leave
const flushProgressSync = () => {
  syncProgressToBackend.flush();
};

// Reset chunks when content changes
watch(contentCacheKey, () => {
  contentChunks.value = [];
  visibleChunks.value = 1;
  showSkeleton.value = true;

  requestAnimationFrame(() => {
    showSkeleton.value = false;
    setupContentObserver();
  });
});

onMounted(async () => {
  const bookId = route.params.id as string;
  const chapterId = route.query.chapterId as string | undefined;

  if (bookId) {
    getBookBasic(bookId).then((book) => {
      bookTitle.value = book.title || "";
    });
    await initializeReading(bookId, chapterId);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("beforeunload", flushProgressSync);
  const cleanupAntiCopy = setupAntiCopy();

  nextTick(() => {
    setupContentObserver();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("beforeunload", flushProgressSync);
    cleanupAntiCopy();
    contentObserver?.disconnect();
    syncProgressToBackend.flush();
  });
});

onBeforeRouteLeave(() => {
  syncProgressToBackend.flush();
});

watch(
  () => route.params.id,
  async (newBookId) => {
    if (newBookId && newBookId !== currentChapter.value?.bookId) {
      const chapterId = route.query.chapterId as string | undefined;
      contentChunks.value = [];
      visibleChunks.value = 1;
      await initializeReading(newBookId as string, chapterId);
    }
  },
);
</script>

<style scoped>
.reader-shell {
  scroll-behavior: smooth;
  background-color: var(--reader-bg, #ffffff);
  color: var(--reader-text, #1f2937);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media print {
  body {
    display: none !important;
  }
}

.reader-content :deep(p) {
  margin-bottom: 1.6em;
  line-height: 1.8;
}

.reader-content :deep(h1),
.reader-content :deep(h2),
.reader-content :deep(h3) {
  color: inherit;
  margin: 1.8em 0 0.8em;
  font-weight: 700;
}

.reader-content :deep(blockquote) {
  border-left: 4px solid #d97706;
  padding: 1.5rem 2rem;
  color: inherit;
  opacity: 0.8;
  font-style: italic;
  background: color-mix(in srgb, var(--reader-text, #1f2937) 4%, transparent);
  border-radius: 0 1rem 1rem 0;
  margin: 2em 0;
}

.reader-content :deep(.table-wrapper) {
  overflow-x: auto;
  margin: 2em 0;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--reader-text, #1f2937) 12%, transparent);
}

.reader-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.reader-content :deep(th),
.reader-content :deep(td) {
  border: 1px solid color-mix(in srgb, var(--reader-text, #1f2937) 8%, transparent);
  padding: 1rem;
  text-align: left;
}

.reader-content :deep(th) {
  background-color: color-mix(in srgb, var(--reader-text, #1f2937) 4%, transparent);
  font-weight: 700;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px) translateX(20px);
  opacity: 0;
}

.article-body {
  transition: font-size 0.2s ease;
}

/* Skeleton shimmer uses current text color at low opacity */
:deep(.animate-pulse .bg-current\/10) {
  background-color: color-mix(in srgb, var(--reader-text, #1f2937) 10%, transparent);
  border-radius: 0.5rem;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--reader-text, #1f2937) 12%, transparent);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--reader-text, #1f2937) 24%, transparent);
}
</style>
