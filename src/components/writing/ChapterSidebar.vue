<template>
  <aside class="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="text-sm font-bold text-[#123C3A] uppercase tracking-wider">Chapters</h3>
      <button
        v-if="showClose"
        @click="$emit('close')"
        class="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        title="Close sidebar"
      >
        <X :size="18" />
      </button>
    </div>

    <!-- Filter tabs -->
    <div class="px-4 pt-4">
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          v-for="f in filters"
          :key="f"
          @click="activeFilter = f"
          :class="[
            'flex-1 text-xs font-semibold py-1.5 rounded-md transition',
            activeFilter === f
              ? 'bg-white text-[#123C3A] shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <!-- New Chapter dropdown -->
    <div class="px-4 mt-3 relative" ref="newMenuRef">
      <button
        @click="showNewMenu = !showNewMenu"
        class="w-full flex items-center justify-center gap-2 bg-[#093A3F] hover:bg-[#0d4a50] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
      >
        <Plus :size="16" />
        New Chapter
      </button>

      <div
        v-if="showNewMenu"
        class="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
      >
        <button
          v-for="opt in newChapterTypes"
          :key="opt.type"
          @click="handleNewChapter(opt.type); showNewMenu = false"
          class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F1E8] transition flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full" :class="opt.dotClass"></span>
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Chapter list -->
    <nav class="flex-1 overflow-y-auto mt-4 px-3 space-y-1 pb-2">
      <div
        v-for="(chapter, idx) in filteredChapters"
        :key="chapter.id"
        :draggable="true"
        @dragstart="onDragStart($event, idx)"
        @dragover.prevent="onDragOver($event, idx)"
        @drop="onDrop($event, idx)"
        @dragend="dragIdx = null"
        :class="[
          'group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150',
          dragIdx === idx ? 'opacity-50' : '',
          activeChapterId === chapter.id
            ? 'bg-amber-50 border border-[#c5a050]/30'
            : 'hover:bg-gray-50 border border-transparent',
        ]"
        @click="$emit('selectChapter', chapter.id)"
      >
        <!-- Drag handle -->
        <GripVertical :size="14" class="text-gray-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition cursor-grab" />

        <!-- Type dot -->
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          :class="typeDot(chapter.type)"
        ></span>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800 truncate">{{ chapter.title }}</p>
          <p class="text-[10px] text-gray-400">{{ chapter.wordCount ?? 0 }} words</p>
        </div>

        <!-- Status dot -->
        <span
          class="w-1.5 h-1.5 rounded-full flex-shrink-0"
          :class="statusDot(chapter.status)"
          :title="chapter.status"
        ></span>

        <!-- Context menu -->
        <div class="relative" @click.stop>
          <button
            @click="openMenu = openMenu === chapter.id ? null : chapter.id"
            class="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition"
          >
            <MoreHorizontal :size="14" class="text-gray-500" />
          </button>

          <div
            v-if="openMenu === chapter.id"
            class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 py-1"
          >
            <button
              v-if="chapter.status !== 'PUBLISHED'"
              @click="$emit('updateStatus', chapter.id, 'PUBLISHED'); openMenu = null"
              class="w-full text-left px-3 py-2 text-xs hover:bg-[#F6F1E8] transition"
            >
              Publish
            </button>
            <button
              v-if="chapter.status !== 'DRAFT'"
              @click="$emit('updateStatus', chapter.id, 'DRAFT'); openMenu = null"
              class="w-full text-left px-3 py-2 text-xs hover:bg-[#F6F1E8] transition"
            >
              Unpublish
            </button>
            <button
              v-if="chapter.status !== 'ARCHIVED'"
              @click="$emit('updateStatus', chapter.id, 'ARCHIVED'); openMenu = null"
              class="w-full text-left px-3 py-2 text-xs hover:bg-[#F6F1E8] transition"
            >
              Archive
            </button>
            <hr class="my-1 border-gray-100" />
            <button
              @click="$emit('deleteChapter', chapter.id); openMenu = null"
              class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredChapters.length === 0" class="text-center py-8">
        <p class="text-xs text-gray-400">No chapters in this view</p>
      </div>
    </nav>

    <!-- Archived accordion -->
    <div class="border-t border-gray-100">
      <button
        @click="showArchived = !showArchived"
        class="w-full flex items-center gap-2 px-5 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
      >
        <Archive :size="14" />
        Archive
        <span v-if="archivedChapters.length" class="text-gray-400">({{ archivedChapters.length }})</span>
        <ChevronDown
          :size="14"
          :class="['ml-auto transition-transform', showArchived ? 'rotate-180' : '']"
        />
      </button>

      <div v-if="showArchived" class="px-4 pb-3 space-y-1 max-h-48 overflow-y-auto">
        <div
          v-for="ch in archivedChapters"
          :key="ch.id"
          @click="$emit('selectChapter', ch.id)"
          :class="[
            'px-3 py-2 rounded-lg text-xs text-gray-500 cursor-pointer hover:bg-gray-100 transition',
            activeChapterId === ch.id ? 'bg-amber-50' : '',
          ]"
        >
          {{ ch.title }}
        </div>
        <div v-if="archivedChapters.length === 0" class="text-xs text-gray-400 px-3 py-2">
          No archived chapters
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, GripVertical, MoreHorizontal, Archive, ChevronDown, X } from "lucide-vue-next";
import type { Chapter } from "../../services/chapterApi";
import type { ChapterCreateType } from "../../composables/useChapterManagement";

const props = defineProps<{
  chapters: Chapter[];
  activeChapterId: string | null;
  showClose?: boolean;
}>();

const emit = defineEmits<{
  selectChapter: [chapterId: string];
  newChapter: [type: ChapterCreateType];
  deleteChapter: [chapterId: string];
  updateStatus: [chapterId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED"];
  reorder: [orderedIds: string[]];
  close: [];
}>();

const activeFilter = ref<string>("All");
const showNewMenu = ref(false);
const showArchived = ref(false);
const openMenu = ref<string | null>(null);
const dragIdx = ref<number | null>(null);


const filters = ["All", "Drafts", "Published"];

const newChapterTypes: { type: ChapterCreateType; label: string; dotClass: string }[] = [
  { type: "CHAPTER", label: "Chapter", dotClass: "bg-blue-400" },
  { type: "PROLOGUE", label: "Prologue", dotClass: "bg-purple-400" },
  { type: "EPILOGUE", label: "Epilogue", dotClass: "bg-teal-400" },
  { type: "BONUS", label: "Bonus Content", dotClass: "bg-amber-400" },
];

const archivedChapters = computed(() =>
  props.chapters.filter((c) => c.status === "ARCHIVED"),
);

const filteredChapters = computed(() => {
  const nonArchived = props.chapters.filter((c) => c.status !== "ARCHIVED");
  if (activeFilter.value === "Drafts") return nonArchived.filter((c) => c.status === "DRAFT");
  if (activeFilter.value === "Published") return nonArchived.filter((c) => c.status === "PUBLISHED");
  return nonArchived;
});

function typeDot(type: string) {
  return {
    PROLOGUE: "bg-purple-400",
    EPILOGUE: "bg-teal-400",
    BONUS: "bg-amber-400",
    CHAPTER: "bg-blue-400",
  }[type] || "bg-gray-400";
}

function statusDot(status: string) {
  return {
    PUBLISHED: "bg-green-500",
    DRAFT: "bg-amber-400",
    ARCHIVED: "bg-gray-300",
  }[status] || "bg-gray-300";
}

function handleNewChapter(type: ChapterCreateType) {
  emit("newChapter", type);
}

// Drag and drop
let _draggedIdx: number | null = null;

function onDragStart(e: DragEvent, idx: number) {
  _draggedIdx = idx;
  dragIdx.value = idx;
  e.dataTransfer!.effectAllowed = "move";
}

function onDragOver(_e: DragEvent, _idx: number) {
  // Visual feedback handled by CSS
}

function onDrop(_e: DragEvent, targetIdx: number) {
  if (_draggedIdx === null || _draggedIdx === targetIdx) {
    dragIdx.value = null;
    return;
  }

  const items = [...filteredChapters.value];
  const [moved] = items.splice(_draggedIdx, 1);
  items.splice(targetIdx, 0, moved);

  const orderedIds = items.map((c) => c.id);
  emit("reorder", orderedIds);
  dragIdx.value = null;
  _draggedIdx = null;
}
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
</style>
