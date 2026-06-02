<template>
  <div class="reading-progress-container">
    <!-- Fixed Progress Bar at Top -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50 hidden sm:block">
      <div
        class="h-full bg-linear-to-r from-[#093A3F] to-[#B4690E] transition-all duration-300"
        :style="{ width: scrollProgress + '%' }"
      ></div>
    </div>

    <!-- Floating Progress Card (Mobile & Desktop) -->
    <transition name="fade">
      <div
        v-if="showProgressCard"
        class="fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-4 z-40 max-w-xs border border-gray-200"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <!-- Close Button -->
        <button
          @click="showProgressCard = false"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="mb-3 pr-6">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reading Progress</p>
          <h3 class="text-sm font-bold text-gray-900 line-clamp-2 mt-1">{{ chapterTitle }}</h3>
        </div>

        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-600 font-medium">Chapter Progress</span>
            <span class="text-xs font-bold text-[#B4690E]">{{ scrollProgress }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-[#093A3F] to-[#B4690E] rounded-full transition-all duration-300"
              :style="{ width: scrollProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Chapter</p>
            <p class="text-sm font-bold text-gray-900">{{ currentChapterNumber }}/{{ totalChapters }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-2">
            <p class="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Read Time</p>
            <p class="text-sm font-bold text-gray-900">{{ estimatedTimeRemaining }}m</p>
          </div>
        </div>

        <!-- Word Count -->
        <div class="text-xs text-gray-600 mb-3 flex items-center gap-1">
          <span>Words read:</span>
          <span class="font-semibold text-gray-900">{{ wordsRead }}/{{ totalWords }}</span>
        </div>

        <!-- Last Saved -->
        <div class="text-xs text-gray-500 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Saved {{ lastSavedTime }}
        </div>

        <!-- Action Button -->
        <button
          @click="saveProgress"
          :disabled="isSaving"
          class="w-full mt-3 px-3 py-2 bg-[#093A3F] text-white text-xs font-semibold rounded-lg hover:bg-[#0a4a50] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSaving ? 'Saving...' : 'Save Progress' }}
        </button>
      </div>
    </transition>

    <!-- Toggle Button (Mobile) -->
    <button
      v-if="!showProgressCard"
      @click="showProgressCard = true"
      class="fixed bottom-6 right-6 w-12 h-12 bg-[#B4690E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#a0600a] transition-all duration-200 z-40 sm:hidden"
      title="Show reading progress"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Chapter Change Notification -->
    <transition name="slide">
      <div
        v-if="showChapterNotification"
        class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs bg-green-50 border border-green-200 rounded-lg p-4 z-50 shadow-lg"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-green-900">Progress Saved</p>
            <p class="text-xs text-green-700 mt-0.5">{{ chapterTitle }} - {{ scrollProgress }}% complete</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  chapterId?: string
  chapterTitle: string
  currentChapterNumber: number
  totalChapters: number
  contentElement?: HTMLElement | null
  totalWords?: number
  readingTimeMinutes?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalWords: 2500,
  readingTimeMinutes: 10,
})

// State
const scrollProgress = ref(0)
const showProgressCard = ref(true)
const isHovering = ref(false)
const isSaving = ref(false)
const showChapterNotification = ref(false)
const lastSavedTime = ref('just now')
const lastScrollPosition = ref(0)

// Emit events
const emit = defineEmits<{
  progressUpdate: [progress: { scroll: number; chapterId?: string; timeSpent: number }]
  progressSaved: [progress: { scroll: number; chapterId?: string; timeSpent: number }]
  chapterChanged: [chapterId?: string]
}>()

// Computed
const wordsRead = computed(() => {
  return Math.round((scrollProgress.value / 100) * props.totalWords)
})

const estimatedTimeRemaining = computed(() => {
  const remainingPercentage = (100 - scrollProgress.value) / 100
  const remainingTime = Math.ceil(remainingPercentage * props.readingTimeMinutes)
  return remainingTime > 0 ? remainingTime : 0
})

// Track reading start time for session duration
const sessionStartTime = ref<number>(Date.now())
const timeSpentMinutes = computed(() => {
  return Math.round((Date.now() - sessionStartTime.value) / 60000)
})

/**
 * Get the actual scroll container element
 */
const getScrollContainer = (): Element => {
  if (props.contentElement) return props.contentElement
  const main = document.querySelector('main')
  if (main) {
    const style = getComputedStyle(main)
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return main
    }
  }
  return document.documentElement
}

/**
 * Get scroll metrics from the container element
 */
const getScrollMetrics = (container: Element) => {
  return {
    scrollTop: container.scrollTop,
    scrollHeight: container.scrollHeight,
    clientHeight: container.clientHeight,
  }
}

/**
 * Calculate scroll progress based on scroll position
 */
const calculateScrollProgress = () => {
  const container = getScrollContainer()
  const { scrollTop, scrollHeight, clientHeight } = getScrollMetrics(container)
  const scrollableHeight = scrollHeight - clientHeight

  if (scrollableHeight <= 0) {
    scrollProgress.value = 0
    return
  }

  const progress = Math.round((scrollTop / scrollableHeight) * 100)
  const newProgress = Math.min(Math.max(progress, 0), 100)

  // Only emit if progress changed significantly (by 1%)
  if (Math.abs(newProgress - scrollProgress.value) >= 1) {
    scrollProgress.value = newProgress
    emit('progressUpdate', {
      scroll: scrollProgress.value,
      chapterId: props.chapterId,
      timeSpent: timeSpentMinutes.value,
    })
  }
}

/**
 * Save progress to localStorage and sync
 */
const saveProgress = async () => {
  isSaving.value = true

  try {
    // Save to localStorage
    const progressData = {
      chapterId: props.chapterId,
      scroll: scrollProgress.value,
      timestamp: new Date().toISOString(),
      timeSpent: timeSpentMinutes.value,
      wordsRead: wordsRead.value,
    }

    localStorage.setItem(
      `reading_progress_${props.chapterId}`,
      JSON.stringify(progressData)
    )

    // Emit save event
    emit('progressSaved', {
      scroll: scrollProgress.value,
      chapterId: props.chapterId,
      timeSpent: timeSpentMinutes.value,
    })

    // Show notification
    showChapterNotification.value = true
    updateLastSavedTime()

    setTimeout(() => {
      showChapterNotification.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to save progress:', error)
  } finally {
    isSaving.value = false
  }
}

/**
 * Load saved progress for the current chapter
 */
const loadSavedProgress = () => {
  try {
    const saved = localStorage.getItem(`reading_progress_${props.chapterId}`)
    if (saved) {
      const data = JSON.parse(saved)
      const savedTime = new Date(data.timestamp)
      const now = new Date()
      const diffMinutes = Math.round((now.getTime() - savedTime.getTime()) / 60000)

      if (diffMinutes < 1) {
        lastSavedTime.value = 'just now'
      } else if (diffMinutes < 60) {
        lastSavedTime.value = `${diffMinutes}m ago`
      } else {
        const diffHours = Math.round(diffMinutes / 60)
        lastSavedTime.value = `${diffHours}h ago`
      }

      // Scroll to saved position after layout settles
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToProgress(data.scroll)
        })
      })
    }
  } catch (error) {
    console.error('Failed to load progress:', error)
  }
}

/**
 * Scroll to a specific progress percentage
 */
const scrollToProgress = (percentage: number) => {
  const container = getScrollContainer()
  const { scrollHeight, clientHeight } = getScrollMetrics(container)
  const scrollableHeight = scrollHeight - clientHeight

  const targetScroll = (percentage / 100) * scrollableHeight
  container.scrollTop = targetScroll
}

/**
 * Update last saved time display
 */
const updateLastSavedTime = () => {
  lastSavedTime.value = 'just now'
}

/**
 * Auto-save progress periodically
 */
const setupAutoSave = () => {
  const autoSaveInterval = setInterval(() => {
    if (scrollProgress.value > 0 && Math.abs(lastScrollPosition.value - scrollProgress.value) > 2) {
      saveProgress()
      lastScrollPosition.value = scrollProgress.value
    }
  }, 30000) // Auto-save every 30 seconds if scrolled

  return autoSaveInterval
}

// Lifecycle hooks
onMounted(() => {
  // Load saved progress
  loadSavedProgress()

  // Setup scroll listener
  const scrollEl = getScrollContainer()
  scrollEl.addEventListener('scroll', calculateScrollProgress, { passive: true })

  // Save progress on page leave
  const saveOnLeave = () => {
    if (scrollProgress.value > 0) saveProgress()
  }
  window.addEventListener('beforeunload', saveOnLeave)

  // Setup auto-save
  const autoSaveInterval = setupAutoSave()

  // Cleanup
  onUnmounted(() => {
    scrollEl.removeEventListener('scroll', calculateScrollProgress)
    window.removeEventListener('beforeunload', saveOnLeave)
    clearInterval(autoSaveInterval)
  })
})

// Watch for chapter changes
watch(
  () => props.chapterId,
  (newChapterId) => {
    scrollProgress.value = 0
    lastScrollPosition.value = 0
    sessionStartTime.value = Date.now()
    lastSavedTime.value = 'just now'
    loadSavedProgress()
    emit('chapterChanged', newChapterId)
  }
)

// Watch for chapter number changes
watch(
  () => props.currentChapterNumber,
  () => {
    scrollProgress.value = 0
    sessionStartTime.value = Date.now()
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Responsive tweaks */
@media (max-width: 640px) {
  .reading-progress-container {
    /* Ensure mobile button doesn't overlap content */
    padding-bottom: 0;
  }
}
</style>
