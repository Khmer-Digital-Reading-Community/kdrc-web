<template>
  <div class="reader-shell min-h-screen w-full" :style="themeVariables">
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

    <!-- Access Denied State (login / purchase / subscription required) -->
    <div
      v-else-if="accessError && !currentChapter"
      class="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50"
      style="background-color: var(--reader-bg)"
    >
      <div class="w-full max-w-md animate-fade-in-up">
        <div class="bg-[#093A3F] rounded-2xl shadow-2xl overflow-hidden">
          <!-- Thin gold accent -->
          <div
            class="h-1 bg-gradient-to-r from-amber-500/70 via-amber-400 to-amber-500/70"
          ></div>

          <div class="px-6 py-10 sm:px-10 sm:py-12 text-center">
            <!-- Icon -->
            <div
              class="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center"
            >
              <Lock
                v-if="accessError.requiresPurchase"
                class="text-amber-400 w-7 h-7"
              />
              <Crown
                v-else-if="accessError.requiresSubscription"
                class="text-amber-400 w-7 h-7"
              />
              <LogIn v-else class="text-amber-400 w-7 h-7" />
            </div>

            <!-- Title -->
            <h2
              class="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight"
              style="font-family: var(--heading)"
            >
              {{
                accessError.requiresSubscription
                  ? "Premium Content"
                  : accessError.requiresPurchase
                    ? "Paid Chapter"
                    : "Welcome Back"
              }}
            </h2>

            <!-- Reason -->
            <p
              class="text-white/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto"
            >
              {{ accessError.reason }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col items-center gap-3">
              <button
                v-if="accessError.requiresLogin"
                @click="router.push('/login')"
                class="inline-flex items-center justify-center gap-2 w-full max-w-[260px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#093A3F] font-bold text-sm transition-colors"
              >
                <LogIn :size="18" />
                Log In to Continue
              </button>
              <button
                v-if="accessError.requiresSubscription"
                @click="router.push('/subscriptions')"
                class="inline-flex items-center justify-center gap-2 w-full max-w-[260px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#093A3F] font-bold text-sm transition-colors"
              >
                <Crown :size="18" />
                View Subscription Plans
              </button>
              <button
                v-if="accessError.requiresPurchase"
                @click="router.push(`/book-detail/${route.params.id}`)"
                class="inline-flex items-center justify-center gap-2 w-full max-w-[260px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#093A3F] font-bold text-sm transition-colors"
              >
                <ShoppingCart :size="18" />
                Purchase This Chapter
              </button>

              <button
                @click="router.push(`/book-detail/${route.params.id}`)"
                class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white/45 hover:text-white/80 hover:bg-white/6 font-medium text-sm transition-all mt-2"
              >
                <ArrowLeft :size="16" />
                Back to Book Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- General Error State -->
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
          @click="router.push(`/book-detail/${route.params.id}`)"
          class="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-md"
        >
          <ArrowLeft :size="18" />
          Back to Book Details
        </button>
      </div>
    </div>

    <!-- Main Reader UI -->
    <div v-else-if="currentChapter" class="flex h-screen overflow-hidden">
      <!-- Chapter Sidebar (inline on desktop, overlay on mobile) -->
      <ChapterSidebar
        :chapters="chapters"
        :active-chapter-id="currentChapter.id"
        :book-title="bookTitle"
        :current-theme="currentTheme"
        :is-open="showSidebar"
        @select-chapter="handleSelectChapter"
        @close="showSidebar = false"
      />

      <!-- Content area (right of sidebar) -->
      <div class="flex-1 flex flex-col h-full min-h-0 relative">
        <!-- Floating Top Header (sticky) -->
        <header
          class="sticky top-0 z-40 px-4 py-3 flex items-center justify-between backdrop-blur-md border-b"
          :class="[isScrolled ? 'border-white/10' : 'border-transparent']"
          :style="headerStyle"
        >
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-full hover:bg-black/10 transition-colors"
              :title="showSidebar ? 'Close chapters' : 'View chapters'"
            >
              <PanelLeft :size="20" />
            </button>
            <button
              @click="router.push('/book-detail/' + route.params.id)"
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
                Ch {{ currentChapter.chapterNumber }}:
                {{ currentChapter.title }}
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="showCommentsDrawer = !showCommentsDrawer"
              class="p-2 rounded-full hover:bg-black/10 transition-colors relative"
              title="Page Comments"
            >
              <MessageSquare :size="20" />
              <span
                v-if="comments.length > 0"
                class="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90 animate-pulse"
              >
                {{ comments.length }}
              </span>
            </button>

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
            style="
              background-color: var(--reader-bg);
              color: var(--reader-text);
              border-color: color-mix(
                in srgb,
                var(--reader-text) 15%,
                transparent
              );
            "
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

        <!-- Main Content Area -->
        <main
          class="flex-1 overflow-y-auto overflow-x-hidden no-select"
          ref="mainContentRef"
        >
          <div class="max-w-3xl mx-auto px-6 sm:px-8 py-8">
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
              <div v-html="displayContent" class="article-body"></div>
              <!-- Sentinel for progressive loading -->
              <div ref="contentSentinel" class="h-4"></div>
            </article>

            <!-- Interaction Footer -->
            <div class="mt-20 pt-10 border-t border-black/10 text-center">
              <p class="text-sm italic opacity-60 mb-8">
                End of Chapter {{ currentChapter.chapterNumber }}
              </p>

              <!-- Inline Comments Banner -->
              <div class="mb-8 flex justify-center">
                <button
                  @click="showCommentsDrawer = true"
                  class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-amber-600/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-800 font-bold text-xs transition-all duration-200"
                >
                  <MessageSquare :size="16" />
                  Discussion for Page {{ currentPageNumber }} ({{
                    comments.length
                  }})
                </button>
              </div>

              <div
                class="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  @click="navigatePreviousChapter"
                  v-if="hasPreviousChapter"
                  class="w-full sm:w-auto px-8 py-3 rounded-full border border-black/10 hover:bg-black/5 transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ChevronLeft :size="18" />
                  Previous
                </button>

                <button
                  @click="navigateNextChapter"
                  v-if="hasNextChapter"
                  class="w-full sm:w-auto px-10 py-3 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                >
                  Next Chapter
                  <ChevronRight :size="18" />
                </button>

                <button
                  v-else
                  @click="navigateFinishReading"
                  class="w-full sm:w-auto px-10 py-3 rounded-full bg-[#123C3A] text-white hover:bg-[#0d2e2c] transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#123C3A]/20"
                >
                  Finish Reading
                  <Check :size="18" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Comments Sliding Drawer -->
    <transition name="drawer-slide">
      <div
        v-if="showCommentsDrawer"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white/95 backdrop-blur-lg shadow-2xl border-l border-gray-200/50 flex flex-col transition-all duration-300 text-gray-800"
      >
        <!-- Drawer Header -->
        <div
          class="p-6 border-b border-gray-100 flex items-center justify-between"
        >
          <div>
            <h3 class="font-bold text-lg font-serif">
              Page {{ currentPageNumber }} Comments
            </h3>
            <p class="text-xs opacity-60">
              Discuss this section with other readers
            </p>
          </div>
          <button
            @click="showCommentsDrawer = false"
            class="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Comments List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-if="isCommentsLoading"
            class="flex flex-col items-center justify-center py-12 gap-3"
          >
            <div
              class="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-xs opacity-60">Loading comments...</span>
          </div>
          <template v-else>
            <div
              v-if="comments.length === 0"
              class="text-center py-12 opacity-50"
            >
              <MessageSquare
                class="mx-auto mb-2 opacity-40 text-amber-600"
                :size="32"
              />
              <p class="text-sm font-semibold">No comments on this page yet</p>
              <p class="text-xs">Be the first to share your thoughts!</p>
            </div>
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex gap-3 items-start"
            >
              <div
                class="w-8 h-8 rounded-full bg-amber-600/10 text-amber-700 font-bold flex items-center justify-center flex-none text-xs"
              >
                {{ comment.user?.name?.charAt(0).toUpperCase() || "U" }}
              </div>
              <div
                class="flex-1 min-w-0 bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100/50"
              >
                <div class="flex justify-between items-baseline mb-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="text-xs font-bold truncate max-w-[120px]">{{
                      comment.user?.name || "Reader"
                    }}</span>
                    <span
                      v-if="comment.status === 'pending'"
                      class="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-sm flex-none uppercase tracking-wider"
                    >
                      Pending
                    </span>
                  </div>
                  <span class="text-[10px] opacity-40">{{
                    formatDate(comment.createdAt)
                  }}</span>
                </div>
                <p
                  class="text-xs leading-relaxed break-words whitespace-pre-wrap"
                >
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <!-- Submit Toast -->
        <transition name="fade">
          <div
            v-if="showSubmitMessage"
            class="mx-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 font-medium flex items-start gap-2"
          >
            <MessageSquare :size="16" class="shrink-0 mt-0.5 opacity-60" />
            <span>{{ submitMessage }}</span>
          </div>
        </transition>

        <!-- Drawer Input -->
        <div class="p-6 border-t border-gray-100 flex gap-2 items-end">
          <div class="flex-1 relative">
            <textarea
              v-model="newCommentContent"
              class="w-full bg-gray-50 border border-gray-200/50 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-amber-600 focus:bg-white transition-all duration-200 resize-none max-h-24"
              placeholder="Write a comment on page..."
              rows="2"
              @keydown.enter.prevent="handleAddComment"
            ></textarea>
          </div>
          <button
            @click="handleAddComment"
            :disabled="isSubmittingComment || !newCommentContent.trim()"
            class="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-600/20 flex-none"
          >
            <span
              v-if="isSubmittingComment"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Backdrop overlay -->
    <div
      v-if="showCommentsDrawer"
      @click="showCommentsDrawer = false"
      class="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity duration-300"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  watch,
  ref,
  computed,
  shallowRef,
  nextTick,
} from "vue";
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
  LogIn,
  ShoppingCart,
  Crown,
  Lock,
  MessageSquare,
} from "lucide-vue-next";
import { useChapterNavigation } from "../../composables/useChapterNavigation";
import { renderContent } from "../../utils/content";
import { useReadingProgress } from "../../composables/useReadingProgress";
import ReadingProgress from "../../components/reader/ReadingProgress.vue";
import ChapterSidebar from "../../components/reader/ChapterSidebar.vue";
import { getBookBasic } from "../../services/bookApi";
import {
  upsertReadingProgress,
  upsertChapterProgress,
  fetchSingleChapterProgress,
} from "../../services/community";
import {
  getCommentsForPage,
  submitComment,
  type Comment,
} from "../../services/commentApi";
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
  accessError,
  currentChapterIndex,
  hasNextChapter,
  hasPreviousChapter,
  totalChapters,
  initializeReading,
  goToNextChapter,
  goToPreviousChapter,
  goToChapter,
} = useChapterNavigation();

const { saveChapterProgress, getChapterProgress, markBookCompleted } =
  useReadingProgress();
const mainContentRef = ref<HTMLElement | null>(null);
const chapterScrollMap = ref<Map<string, number>>(new Map());
const contentSentinel = ref<HTMLElement | null>(null);
const bookTitle = ref("");

// Reader UI State
const isScrolled = ref(false);
const showSettings = ref(false);
const showSidebar = ref(true);
const fontSize = ref(18);
const currentTheme = ref<keyof typeof themes>("light");
const currentFont = ref<"serif" | "sans">("serif");
const isTransitioning = ref(false);

const isMobile = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Comments state
const comments = ref<Comment[]>([]);
const isCommentsLoading = ref(false);
const showCommentsDrawer = ref(false);
const newCommentContent = ref("");
const isSubmittingComment = ref(false);
const submitMessage = ref("");
const showSubmitMessage = ref(false);
const currentScrollPercent = ref(0);

const currentPageNumber = computed(() => {
  return Math.min(10, Math.floor(currentScrollPercent.value / 10) + 1);
});

const fetchComments = async () => {
  if (!currentChapter.value) return;
  try {
    isCommentsLoading.value = true;
    comments.value = await getCommentsForPage(
      currentChapter.value.id,
      currentPageNumber.value,
    );
  } catch (err) {
    console.error("Failed to load comments:", err);
  } finally {
    isCommentsLoading.value = false;
  }
};

watch([currentPageNumber, () => currentChapter.value?.id], () => {
  if (currentChapter.value?.id) {
    fetchComments();
  }
});

const handleAddComment = async () => {
  if (!newCommentContent.value.trim() || !currentChapter.value) return;
  try {
    isSubmittingComment.value = true;
    submitMessage.value = "";
    showSubmitMessage.value = false;

    await submitComment(
      currentChapter.value.id,
      currentPageNumber.value,
      newCommentContent.value.trim(),
    );

    newCommentContent.value = "";
    submitMessage.value = "Your comment has been posted successfully.";
    showSubmitMessage.value = true;

    setTimeout(() => {
      showSubmitMessage.value = false;
    }, 4000);

    await fetchComments();
  } catch (err: any) {
    submitMessage.value = err.message || "Failed to submit comment.";
    showSubmitMessage.value = true;
  } finally {
    isSubmittingComment.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

// Header background
const headerStyle = computed(() => {
  const bg = themes[currentTheme.value].bg;
  return { backgroundColor: bg + (isScrolled.value ? "e6" : "cc") };
});

// Display content ref — populated async to avoid blocking the main thread
const displayContent = ref("");

const processContent = () => {
  const full = renderContent(currentChapterContent.value);
  if (!full) {
    displayContent.value = "";
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<div id="root">${full}</div>`,
    "text/html",
  );
  const root = doc.getElementById("root");
  if (!root) {
    displayContent.value = full;
    return;
  }

  const blockElements = Array.from(root.children);
  const chunks: string[] = [];
  for (let i = 0; i < blockElements.length; i += CHUNK_SIZE) {
    const slice = Array.from(blockElements).slice(i, i + CHUNK_SIZE);
    chunks.push(slice.map((el) => el.outerHTML).join(""));
  }

  contentChunks.value = chunks;
  visibleChunks.value = 1;
  displayContent.value = chunks.slice(0, 1).join("");
};

// Font + font-size as inline style to avoid re-rendering content
const contentStyle = computed(() => ({
  fontSize: fontSize.value + "px",
  fontFamily:
    currentFont.value === "serif" ? "'Georgia', serif" : "'Inter', sans-serif",
}));

const changeFontSize = (delta: number) => {
  fontSize.value = Math.min(Math.max(fontSize.value + delta, 14), 32);
};

// Update display content when visible chunks change (progressive loading)
watch(visibleChunks, () => {
  if (contentChunks.value.length > 0) {
    displayContent.value = contentChunks.value
      .slice(0, visibleChunks.value)
      .join("");
  }
});

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
 * Debounced function to sync book-level progress with the backend
 */
const syncProgressToBackend = debounce(async (scroll: number) => {
  if (!currentChapter.value || !totalChapters.value) return;
  try {
    const chapterWeight = 100 / totalChapters.value;
    const bookPercentage = Math.min(
      Math.round(
        currentChapterIndex.value * chapterWeight +
          (scroll / 100) * chapterWeight,
      ),
      100,
    );
    await upsertReadingProgress(
      currentChapter.value.bookId,
      bookPercentage,
      currentChapter.value.id,
    );
  } catch (err) {
    console.warn("Failed to sync reading progress to backend:", err);
  }
}, 5000);

/**
 * Debounced function to sync chapter-level scroll position to backend
 */
const syncChapterScrollToBackend = debounce(async (scroll: number) => {
  if (!currentChapter.value) return;
  try {
    await upsertChapterProgress(
      currentChapter.value.bookId,
      currentChapter.value.id,
      scroll,
    );
  } catch (err) {
    console.warn("Failed to sync chapter scroll to backend:", err);
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
  currentScrollPercent.value = progress.scroll;
  syncProgressToBackend(progress.scroll);
  syncChapterScrollToBackend(progress.scroll);
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
    const chapterWeight = 100 / totalChapters.value;
    const bookPercentage = Math.min(
      Math.round(
        currentChapterIndex.value * chapterWeight +
          (progress.scroll / 100) * chapterWeight,
      ),
      100,
    );
    // Sync to backend immediately
    Promise.all([
      upsertReadingProgress(
        currentChapter.value.bookId,
        bookPercentage,
        currentChapter.value.id,
      ),
      upsertChapterProgress(
        currentChapter.value.bookId,
        currentChapter.value.id,
        progress.scroll,
      ),
    ]).catch((err) =>
      console.warn("Failed to sync reading progress to backend:", err),
    );
  }
};

/**
 * Load chapter scroll from backend and restore position
 */
const loadChapterScrollFromBackend = async (chapterId: string) => {
  try {
    const data = await fetchSingleChapterProgress(chapterId);
    if (data && data.scrollPercentage > 5) {
      chapterScrollMap.value.set(chapterId, data.scrollPercentage);
      return data.scrollPercentage;
    }
  } catch (err) {
    console.warn("Failed to fetch chapter progress:", err);
  }
  return null;
};

const handleChapterChanged = async (chapterId?: string) => {
  if (!chapterId) return;

  // Record book-level progress for reaching this chapter
  if (currentChapter.value && totalChapters.value > 0) {
    const chapterWeight = 100 / totalChapters.value;
    const bookPercentage = Math.min(
      Math.round((currentChapterIndex.value + 1) * chapterWeight),
      100,
    );
    upsertReadingProgress(
      currentChapter.value.bookId,
      bookPercentage,
      chapterId,
    ).catch((err) =>
      console.warn("Failed to record chapter reached progress:", err),
    );
  }

  // ReadingProgress.vue already restores from localStorage in loadSavedProgress.
  // Only fall back to backend if localStorage has no data.
  const local = getChapterProgress(chapterId);
  if (local && local.scroll > 5) return;

  const backendScroll = await loadChapterScrollFromBackend(chapterId);
  if (backendScroll) {
    restoreScrollPosition(backendScroll);
  }
};

const restoreScrollPosition = (scrollPercentage: number) => {
  requestAnimationFrame(() => {
    const main = document.querySelector("main");
    if (main) {
      const target =
        (scrollPercentage / 100) * (main.scrollHeight - main.clientHeight);
      main.scrollTo({ top: target, behavior: "smooth" });
    }
  });
};

const handleScroll = () => {
  const el = mainContentRef.value;
  if (el) {
    isScrolled.value = el.scrollTop > 50;
  }
};

/**
 * Save current chapter progress immediately to both localStorage and backend
 */
const saveCurrentProgress = async (scrollPercent = 100) => {
  if (!currentChapter.value || !totalChapters.value) return;
  const chapterId = currentChapter.value.id;
  const bookId = currentChapter.value.bookId;
  const timeSpent = 0;
  const wordsRead = Math.round(
    (scrollPercent / 100) * (currentChapter.value.wordCount || 2500),
  );

  saveChapterProgress(chapterId, scrollPercent, timeSpent, wordsRead);

  const chapterWeight = 100 / totalChapters.value;
  const bookPercentage = Math.min(
    Math.round(
      currentChapterIndex.value * chapterWeight +
        (scrollPercent / 100) * chapterWeight,
    ),
    100,
  );
  try {
    await Promise.all([
      upsertReadingProgress(bookId, bookPercentage, chapterId),
      upsertChapterProgress(bookId, chapterId, scrollPercent),
    ]);
  } catch (err) {
    console.warn("Failed to save progress:", err);
  }
};

/** Wrappers that save progress before navigating */
const navigateNextChapter = async () => {
  await saveCurrentProgress();
  await goToNextChapter();
};

const navigatePreviousChapter = async () => {
  await saveCurrentProgress();
  await goToPreviousChapter();
};

const navigateFinishReading = async () => {
  await saveCurrentProgress(100);
  if (currentChapter.value) {
    markBookCompleted(currentChapter.value.bookId);
  }
  router.push("/home");
};

const handleSelectChapter = async (chapterId: string) => {
  await saveCurrentProgress();
  await goToChapter(chapterId);
};

// Flush pending progress sync on tab close or route leave
const flushProgressSync = () => {
  syncProgressToBackend.flush();
  syncChapterScrollToBackend.flush();
};

// Reset chunks when content changes — yield twice so browser paints the overlay
watch(contentCacheKey, async () => {
  contentChunks.value = [];
  visibleChunks.value = 1;
  displayContent.value = "";
  isTransitioning.value = true;

  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));

  processContent();
  isTransitioning.value = false;

  await nextTick();
  setupContentObserver();
});

onMounted(async () => {
  const bookId = route.params.id as string;
  const chapterId = route.query.chapterId as string | undefined;

  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) showSidebar.value = false;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 1024;
  });

  if (bookId) {
    getBookBasic(bookId).then((book) => {
      bookTitle.value = book.title || "";
    });
    await initializeReading(bookId, chapterId);
    if (currentChapter.value) {
      handleChapterChanged(currentChapter.value.id);
    }
  }

  window.addEventListener("beforeunload", flushProgressSync);
  const cleanupAntiCopy = setupAntiCopy();

  nextTick(() => {
    setupContentObserver();
    const el = mainContentRef.value;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
    }
  });

  onUnmounted(() => {
    const el = mainContentRef.value;
    if (el) {
      el.removeEventListener("scroll", handleScroll);
    }
    window.removeEventListener("beforeunload", flushProgressSync);
    cleanupAntiCopy();
    contentObserver?.disconnect();
    syncProgressToBackend.flush();
    syncChapterScrollToBackend.flush();
  });
});

onBeforeRouteLeave(async () => {
  await saveCurrentProgress();
  syncProgressToBackend.flush();
  syncChapterScrollToBackend.flush();
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
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.reader-shell {
  scroll-behavior: smooth;
  background-color: var(--reader-bg, #ffffff);
  color: var(--reader-text, #1f2937);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
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
  border: 1px solid
    color-mix(in srgb, var(--reader-text, #1f2937) 12%, transparent);
}

.reader-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.reader-content :deep(th),
.reader-content :deep(td) {
  border: 1px solid
    color-mix(in srgb, var(--reader-text, #1f2937) 8%, transparent);
  padding: 1rem;
  text-align: left;
}

.reader-content :deep(th) {
  background-color: color-mix(
    in srgb,
    var(--reader-text, #1f2937) 4%,
    transparent
  );
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
  background-color: color-mix(
    in srgb,
    var(--reader-text, #1f2937) 10%,
    transparent
  );
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
