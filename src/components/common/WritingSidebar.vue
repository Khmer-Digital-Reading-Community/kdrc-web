<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Plus, Archive, FileText } from 'lucide-vue-next'

interface Chapter {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  wordCount: number
}

interface Props {
  chapters?: Chapter[]
  activeChapterId?: string
}

const props = withDefaults(defineProps<Props>(), {
  chapters: () => [
    { id: '1', title: 'Introduction', status: 'draft', wordCount: 0 },
    { id: '2', title: 'Chapter 1: The Beginning', status: 'draft', wordCount: 1200 },
    { id: '3', title: 'Chapter 2: Rising Action', status: 'draft', wordCount: 850 },
    { id: '4', title: 'Chapter 3: The Climax', status: 'draft', wordCount: 0 }
  ],
  activeChapterId: '1'
})

const emit = defineEmits<{
  selectChapter: [chapterId: string]
  newChapter: []
}>()

const isArchiveOpen = ref(false)

const draftChapters = () => props.chapters?.filter(ch => ch.status !== 'archived') || []
const archivedChapters = () => props.chapters?.filter(ch => ch.status === 'archived') || []
</script>

<template>
  <aside class="w-72 bg-gradient-to-b from-[#F5E6D3] to-[#F0DCC8] border-r border-gray-300 flex flex-col h-full shadow-sm">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-300 bg-white/40">
      <h3 class="text-lg font-semibold text-gray-900 tracking-wide">Manuscript</h3>
    </div>

    <!-- New Chapter Button -->
    <button
      @click="emit('newChapter')"
      class="mx-5 mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
    >
      <Plus :size="18" class="flex-shrink-0" />
      <span>New Chapter</span>
    </button>

    <!-- Chapters List -->
    <nav class="flex-1 overflow-y-auto mt-6 px-4 space-y-3 pr-2">
      <div
        v-for="chapter in draftChapters()"
        :key="chapter.id"
        @click="emit('selectChapter', chapter.id)"
        :class="[
          'group p-4 rounded-lg cursor-pointer transition-all duration-200 border-2',
          activeChapterId === chapter.id
            ? 'bg-yellow-100 border-yellow-300 shadow-md'
            : 'bg-white/60 border-transparent hover:bg-white hover:border-amber-200'
        ]"
      >
        <!-- Chapter Icon and Title -->
        <div class="flex items-start gap-3 mb-2">
          <FileText
            :size="20"
            :class="[
              'flex-shrink-0 transition-colors duration-200',
              activeChapterId === chapter.id
                ? 'text-amber-700'
                : 'text-gray-500 group-hover:text-amber-600'
            ]"
          />
          <span
            :class="[
              'flex-1 text-sm font-medium transition-colors duration-200 leading-tight',
              activeChapterId === chapter.id
                ? 'text-amber-950'
                : 'text-gray-800'
            ]"
          >
            {{ chapter.title }}
          </span>
        </div>

        <!-- Word Count -->
        <div
          :class="[
            'text-xs font-medium ml-8 transition-colors duration-200',
            activeChapterId === chapter.id
              ? 'text-amber-700'
              : 'text-gray-600'
          ]"
        >
          {{ chapter.wordCount }} words
        </div>
      </div>

      <!-- Empty state message -->
      <div v-if="draftChapters().length === 0" class="text-center py-8">
        <p class="text-sm text-gray-500">No chapters yet</p>
        <p class="text-xs text-gray-400 mt-1">Create one to get started</p>
      </div>
    </nav>

    <!-- Archive Section -->
    <div class="border-t border-gray-300 mt-auto bg-white/20">
      <button
        @click="isArchiveOpen = !isArchiveOpen"
        class="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-gray-800 hover:bg-white/30 transition-colors duration-200"
      >
        <Archive :size="18" class="flex-shrink-0 text-gray-700" />
        <span>Archive</span>
        <ChevronDown
          :size="16"
          :class="{ 'rotate-180': isArchiveOpen }"
          class="ml-auto transition-transform duration-200 text-gray-600"
        />
      </button>

      <transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="isArchiveOpen" class="px-5 pb-4 space-y-2 overflow-hidden">
          <div
            v-for="chapter in archivedChapters()"
            :key="chapter.id"
            class="p-3 rounded-lg text-xs text-gray-600 bg-gray-200/40 border border-gray-300/50 hover:bg-gray-200/60 transition-colors duration-200"
          >
            <FileText :size="14" class="inline mr-2 text-gray-500" />
            {{ chapter.title }}
          </div>
          <div v-if="archivedChapters().length === 0" class="text-center py-3">
            <p class="text-xs text-gray-500">No archived chapters</p>
          </div>
        </div>
      </transition>
    </div>
  </aside>
</template>

<style scoped>
/* Custom scrollbar for chapters list */
nav::-webkit-scrollbar {
  width: 8px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(180, 150, 120, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(180, 150, 120, 0.8);
  background-clip: padding-box;
}
</style>
