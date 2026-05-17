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
    const progressData: ReadingProgressData = {
      chapterId,
      scroll,
      timestamp: new Date().toISOString(),
      timeSpent,
      wordsRead,
    }

    // Save to localStorage
    localStorage.setItem(`reading_progress_${chapterId}`, JSON.stringify(progressData))

    // Update in-memory cache
    progressData.value.set(chapterId, progressData)

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
   * Get all reading progress
   */
  const getAllProgress = (): ReadingProgressData[] => {
    const allProgress: ReadingProgressData[] = []

    // Load all from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reading_progress_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          allProgress.push(data)
        } catch (error) {
          console.error('Failed to parse progress data:', error)
        }
      }
    }

    return allProgress.sort((a, b) => {
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
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith('reading_progress_')) {
        localStorage.removeItem(key)
      }
    }
    progressData.value.clear()
    updateStats()
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
  }
}
