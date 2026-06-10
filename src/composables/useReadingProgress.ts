import { ref, computed } from 'vue'

export interface ReadingProgressData {
  chapterId: string
  scroll: number
  timestamp: string
  timeSpent: number
  wordsRead: number
}

export interface ProgressStats {
  totalBooksRead: number
  totalWordsRead: number
  totalReadingTime: number
  averageSessionDuration: number
  lastChaptersRead: ReadingProgressData[]
}

/**
 * Composable for managing reading progress across the application
 */
export const useReadingProgress = () => {
  const progressData = ref<Map<string, ReadingProgressData>>(new Map())
  const stats = ref<ProgressStats>({
    totalBooksRead: 0,
    totalWordsRead: 0,
    totalReadingTime: 0,
    averageSessionDuration: 0,
    lastChaptersRead: [],
  })

  /**
   * Save chapter progress to localStorage
   */
  const saveChapterProgress = (
    chapterId: string,
    scroll: number,
    timeSpent: number,
    wordsRead: number
  ) => {
    const data: ReadingProgressData = {
      chapterId,
      scroll,
      timestamp: new Date().toISOString(),
      timeSpent,
      wordsRead,
    }

    // Save to localStorage
    localStorage.setItem(`reading_progress_${chapterId}`, JSON.stringify(data))

    // Update in-memory cache
    progressData.value.set(chapterId, data)

    // Update stats
    updateStats()

    return progressData
  }

  /**
   * Get saved progress for a chapter
   */
  const getChapterProgress = (chapterId: string): ReadingProgressData | null => {
    // Check cache first
    if (progressData.value.has(chapterId)) {
      return progressData.value.get(chapterId) || null
    }

    // Load from localStorage
    const saved = localStorage.getItem(`reading_progress_${chapterId}`)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        progressData.value.set(chapterId, data)
        return data
      } catch (error) {
        console.error('Failed to parse progress data:', error)
        return null
      }
    }

    return null
  }

  /**
   * Populate in-memory cache from localStorage on first access
   */
  const loadAllFromLocalStorage = () => {
    const map = new Map<string, ReadingProgressData>()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reading_progress_')) {
        try {
          const chapterId = key.replace('reading_progress_', '')
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          map.set(chapterId, data)
        } catch {}
      }
    }
    progressData.value = map
  }

  /**
   * Get all reading progress from in-memory cache
   */
  const getAllProgress = (): ReadingProgressData[] => {
    if (progressData.value.size === 0) {
      loadAllFromLocalStorage()
    }

    return Array.from(progressData.value.values()).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }

  /**
   * Update reading statistics
   */
  const updateStats = () => {
    const allProgress = getAllProgress()

    stats.value = {
      totalBooksRead: new Set(allProgress.map(p => p.chapterId.split('_')[0])).size,
      totalWordsRead: allProgress.reduce((sum, p) => sum + p.wordsRead, 0),
      totalReadingTime: allProgress.reduce((sum, p) => sum + p.timeSpent, 0),
      averageSessionDuration:
        allProgress.length > 0
          ? Math.round(allProgress.reduce((sum, p) => sum + p.timeSpent, 0) / allProgress.length)
          : 0,
      lastChaptersRead: allProgress.slice(0, 10),
    }
  }

  /**
   * Clear progress for a chapter
   */
  const clearChapterProgress = (chapterId: string) => {
    localStorage.removeItem(`reading_progress_${chapterId}`)
    progressData.value.delete(chapterId)
    updateStats()
  }

  /**
   * Clear all progress
   */
  const clearAllProgress = () => {
    for (const chapterId of progressData.value.keys()) {
      localStorage.removeItem(`reading_progress_${chapterId}`)
    }
    progressData.value.clear()
    updateStats()
  }

  /**
   * Mark a book as completed in localStorage
   */
  const markBookCompleted = (bookId: string) => {
    localStorage.setItem(`reading_completed_${bookId}`, JSON.stringify({ bookId, completedAt: new Date().toISOString() }))
  }

  /**
   * Check if a book is marked as completed
   */
  const isBookCompleted = (bookId: string): boolean => {
    return localStorage.getItem(`reading_completed_${bookId}`) !== null
  }

  /**
   * Get all completed book IDs
   */
  const getCompletedBooks = (): string[] => {
    const ids: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reading_completed_')) {
        ids.push(key.replace('reading_completed_', ''))
      }
    }
    return ids
  }

  /**
   * Get reading streak information
   */
  const getReadingStreak = (): { days: number; lastReadDate: string | null } => {
    const allProgress = getAllProgress()
    if (allProgress.length === 0) {
      return { days: 0, lastReadDate: null }
    }

    const dates = allProgress.map(p => new Date(p.timestamp).toDateString())
    const uniqueDates = Array.from(new Set(dates)).sort().reverse()

    let streak = 0
    let currentDate = new Date()

    for (const dateStr of uniqueDates) {
      const progressDate = new Date(dateStr)
      const daysDiff = Math.floor(
        (currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff === streak) {
        streak++
        currentDate = progressDate
      } else {
        break
      }
    }

    return {
      days: streak,
      lastReadDate: uniqueDates[0] || null,
    }
  }

  // Initialize stats on load
  updateStats()

  return {
    progressData: computed(() => progressData.value),
    stats: computed(() => stats.value),
    saveChapterProgress,
    getChapterProgress,
    getAllProgress,
    clearChapterProgress,
    clearAllProgress,
    getReadingStreak,
    updateStats,
    markBookCompleted,
    isBookCompleted,
    getCompletedBooks,
  }
}
