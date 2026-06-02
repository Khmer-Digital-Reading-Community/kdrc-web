<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ChevronDown,
  Plus,
  Archive,
  FileText,
  Eye,
  Share2,
} from "lucide-vue-next";
import type { Chapter } from "@/services/chapterApi";

type StatusFilter = "DRAFT" | "PUBLISHED";

interface Props {
  chapters?: Chapter[];
  activeChapterId?: string;
  statusFilter?: StatusFilter;
}

const props = withDefaults(defineProps<Props>(), {
  chapters: () => [],
  activeChapterId: undefined,
  statusFilter: "DRAFT",
});

const emit = defineEmits<{
  selectChapter: [chapterId: string];
  newChapter: [];
  updateStatusFilter: [status: StatusFilter];
  bulkPublish: [];
  previewChapter: [chapterId: string];
}>();

const isArchiveOpen = ref(false);

const visibleChapters = computed(() =>
  (props.chapters || []).filter((ch) => ch.status === props.statusFilter),
);

const archivedChapters = computed(() =>
  (props.chapters || []).filter((ch) => ch.status === "ARCHIVED"),
);

const calculateReadingTime = (wordCount?: number): number => {
  if (!wordCount) return 0;
  return Math.ceil(wordCount / 225);
};

const draftChapters = computed(() =>
  (props.chapters || []).filter((ch) => ch.status === "DRAFT"),
);
</script>

<template>
  <aside
    class="w-72 bg-gradient-to-b from-[#F5E6D3] to-[#F0DCC8] border-r border-gray-300 flex flex-col h-full shadow-sm"
  >
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-300 bg-white/40">
      <h3 class="text-lg font-semibold text-gray-900 tracking-wide">
        Manuscript
      </h3>
    </div>

    <!-- Status Toggle -->
    <div class="mx-5 mt-5">
      <div class="flex bg-white/70 border border-amber-200 rounded-lg p-1">
        <button
          class="flex-1 text-xs font-semibold py-2 rounded-md transition-colors"
          :class="
            statusFilter === 'DRAFT'
              ? 'bg-amber-700 text-white'
              : 'text-amber-900 hover:bg-amber-50'
          "
          @click="emit('updateStatusFilter', 'DRAFT')"
        >
          Drafts
        </button>
        <button
          class="flex-1 text-xs font-semibold py-2 rounded-md transition-colors"
          :class="
            statusFilter === 'PUBLISHED'
              ? 'bg-amber-700 text-white'
              : 'text-amber-900 hover:bg-amber-50'
          "
          @click="emit('updateStatusFilter', 'PUBLISHED')"
        >
          Published
        </button>
      </div>
    </div>

    <!-- New Chapter Button -->
    <button
      @click="emit('newChapter')"
      class="mx-5 mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
    >
      <Plus :size="18" class="flex-shrink-0" />
      <span>New Chapter</span>
    </button>

    <!-- Bulk Publish Button (if there are draft chapters) -->
    <button
      v-if="draftChapters.length > 0"
      @click="emit('bulkPublish')"
      class="mx-5 mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
    >
      <Share2 :size="16" class="flex-shrink-0" />
      <span>Publish All ({{ draftChapters.length }})</span>
    </button>

    <!-- Chapters List -->
    <nav class="flex-1 overflow-y-auto mt-6 px-4 space-y-3 pr-2">
      <div
        v-for="chapter in visibleChapters"
        :key="chapter.id"
        :class="[
          'group p-4 rounded-lg cursor-pointer transition-all duration-200 border-2',
          activeChapterId === chapter.id
            ? 'bg-yellow-100 border-yellow-300 shadow-md'
            : 'bg-white/60 border-transparent hover:bg-white hover:border-amber-200',
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
                : 'text-gray-500 group-hover:text-amber-600',
            ]"
          />
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <span
                @click="emit('selectChapter', chapter.id)"
                :class="[
                  'text-sm font-medium transition-colors duration-200 leading-tight hover:text-amber-700',
                  activeChapterId === chapter.id
                    ? 'text-amber-950'
                    : 'text-gray-800',
                ]"
              >
                {{ chapter.title }}
              </span>
              <span
                :class="[
                  'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase',
                  chapter.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700',
                ]"
              >
                {{ chapter.status }}
              </span>
            </div>
          </div>
          <!-- Preview Button -->
          <button
            @click.stop="emit('previewChapter', chapter.id)"
            :class="[
              'p-1.5 rounded transition-all opacity-0 group-hover:opacity-100',
              activeChapterId === chapter.id
                ? 'bg-yellow-200 text-amber-700 hover:bg-yellow-300'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
            ]"
            title="Preview chapter"
          >
            <Eye :size="16" />
          </button>
        </div>

        <!-- Word Count & Reading Time -->
        <div
          :class="[
            'text-xs font-medium ml-8 transition-colors duration-200 flex gap-4',
            activeChapterId === chapter.id ? 'text-amber-700' : 'text-gray-600',
          ]"
        >
          <span>{{ chapter.wordCount ?? 0 }} words</span>
          <span>{{ calculateReadingTime(chapter.wordCount) }} min</span>
        </div>
      </div>

      <!-- Empty state message -->
      <div v-if="visibleChapters.length === 0" class="text-center py-8">
        <p class="text-sm text-gray-500">No chapters in this view</p>
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
            v-for="chapter in archivedChapters"
            :key="chapter.id"
            class="p-3 rounded-lg text-xs text-gray-600 bg-gray-200/40 border border-gray-300/50 hover:bg-gray-200/60 transition-colors duration-200"
          >
            <FileText :size="14" class="inline mr-2 text-gray-500" />
            {{ chapter.title }}
          </div>
          <div v-if="archivedChapters.length === 0" class="text-center py-3">
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
