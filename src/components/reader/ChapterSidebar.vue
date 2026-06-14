<template>
  <div
    :class="[
      'chapter-sidebar flex-shrink-0 transition-all duration-300',
      isMobile ? 'fixed inset-0 z-50 pointer-events-none' : 'relative h-full',
    ]"
  >
    <!-- Mobile backdrop -->
    <transition name="fade">
      <div
        v-if="isOpen && isMobile"
        class="absolute inset-0 bg-black/40 z-40 pointer-events-auto"
        @click="$emit('close')"
      ></div>
    </transition>

    <!-- Sidebar panel -->
    <aside
      :class="[
        'flex flex-col h-full transition-all duration-300',
        isMobile
          ? [
              'absolute inset-y-0 left-0 z-50 w-[280px] shadow-2xl pointer-events-auto overflow-hidden',
              isOpen ? 'translate-x-0' : '-translate-x-full',
            ]
          : [
              'relative border-r overflow-hidden',
              isOpen ? 'w-[280px]' : 'w-0',
            ],
      ]"
      :style="sidebarStyle"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b shrink-0 whitespace-nowrap" :style="borderStyle">
        <h3 class="text-sm font-bold uppercase tracking-wider opacity-70">Chapters</h3>
        <button
          v-if="isMobile"
          @click="$emit('close')"
          class="p-1.5 rounded-lg hover:bg-black/10 transition-colors shrink-0"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Chapter count -->
      <div class="px-4 py-2 text-xs font-medium opacity-50 shrink-0 whitespace-nowrap">
        {{ chapters.length }} chapter{{ chapters.length !== 1 ? "s" : "" }}
      </div>

      <!-- Chapter list -->
      <nav class="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <div
          v-for="chapter in sortedChapters"
          :key="chapter.id"
          @click="selectChapter(chapter.id)"
          :class="[
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
            isActiveChapter(chapter.id)
              ? activeChapterClass
              : 'hover:bg-black/5',
          ]"
          :style="isActiveChapter(chapter.id) ? activeChapterStyle : {}"
        >
          <!-- Chapter number badge -->
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200',
              isActiveChapter(chapter.id)
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-black/5 text-current/60 group-hover:bg-black/10',
            ]"
          >
            {{ chapter.chapterNumber }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'text-sm font-medium truncate leading-tight',
                isActiveChapter(chapter.id) ? 'text-amber-700' : 'text-current/80',
              ]"
            >
              {{ chapter.title || `Chapter ${chapter.chapterNumber}` }}
            </p>
            <p class="text-[11px] font-medium opacity-40 mt-0.5">
              {{ chapter.wordCount || 0 }} words
              <template v-if="chapter.readingTimeMinutes">
                · {{ chapter.readingTimeMinutes }} min
              </template>
            </p>
          </div>

          <!-- Progress indicator -->
          <div
            v-if="getChapterProgress(chapter.id) > 0"
            class="shrink-0 w-1.5 h-8 rounded-full overflow-hidden bg-black/10 relative"
          >
            <div
              class="absolute bottom-0 w-full rounded-full transition-all duration-300"
              :class="[
                getChapterProgress(chapter.id) >= 100 ? 'bg-green-500' : 'bg-amber-500',
              ]"
              :style="{ height: getChapterProgress(chapter.id) + '%' }"
            ></div>
          </div>
        </div>

        <div v-if="chapters.length === 0" class="text-center py-12">
          <BookOpen class="mx-auto mb-3 opacity-20" :size="40" />
          <p class="text-sm font-medium opacity-50">No chapters available</p>
        </div>
      </nav>

      <!-- Bottom book info -->
      <div class="px-4 py-3 border-t text-xs font-medium opacity-40 truncate shrink-0 whitespace-nowrap" :style="borderStyle">
        {{ bookTitle }}
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { BookOpen, X } from "lucide-vue-next";
import type { Chapter } from "../../composables/useChapterNavigation";

interface Props {
  chapters: Chapter[];
  activeChapterId?: string;
  bookTitle?: string;
  currentTheme?: keyof typeof themes;
  isOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  activeChapterId: "",
  bookTitle: "",
  currentTheme: "light" as any,
  isOpen: false,
});

const emit = defineEmits<{
  selectChapter: [chapterId: string];
  close: [];
}>();

const themes = {
  light: { name: "Light", bg: "#ffffff", text: "#1f2937" },
  sepia: { name: "Sepia", bg: "#f4ecd8", text: "#5b4636" },
  dark: { name: "Dark", bg: "#1a1a1a", text: "#d1d1d1" },
};

const isMobile = ref(false);

const sortedChapters = computed(() =>
  [...props.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber)
);

const borderColor = computed(() => {
  const t = themes[props.currentTheme];
  return `color-mix(in srgb, ${t.text} 12%, transparent)`;
});

const sidebarStyle = computed(() => ({
  backgroundColor: themes[props.currentTheme].bg,
  color: themes[props.currentTheme].text,
  borderColor: borderColor.value,
}));

const borderStyle = computed(() => ({
  borderColor: borderColor.value,
}));

const activeChapterClass = computed(() =>
  props.currentTheme === "dark" ? "bg-amber-900/20" : "bg-amber-50"
);

const activeChapterStyle = computed(() => ({
  backgroundColor: `color-mix(in srgb, #d97706 10%, transparent)`,
}));

const isActiveChapter = (chapterId: string) =>
  chapterId === props.activeChapterId;

const chapterProgressCache = ref<Map<string, number>>(new Map());

const buildProgressCache = () => {
  const cache = new Map<string, number>();
  for (const chapter of props.chapters) {
    try {
      const saved = localStorage.getItem(`reading_progress_${chapter.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        cache.set(chapter.id, data.scroll || 0);
      }
    } catch {}
  }
  chapterProgressCache.value = cache;
};

const getChapterProgress = (chapterId: string): number => {
  return chapterProgressCache.value.get(chapterId) ?? 0;
};

const selectChapter = (chapterId: string) => {
  emit("selectChapter", chapterId);
  if (isMobile.value) {
    emit("close");
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

watch(() => props.chapters, () => {
  buildProgressCache();
}, { immediate: true });

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.chapter-sidebar {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--reader-text, #1f2937) 20%, transparent) transparent;
}

aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--reader-text, #1f2937) 15%, transparent);
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
