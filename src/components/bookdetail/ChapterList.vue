<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">Table of Contents</h2>
      <p class="text-sm text-gray-500">{{ chapterCountText }}</p>
    </div>

    <div v-if="grouped.free.length" class="mb-6">
      <h3 class="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
        <Globe :size="12" />
        Free Chapters
        <span class="text-gray-300 font-normal tracking-normal">{{ grouped.free.length }}</span>
      </h3>
      <div class="space-y-2">
        <ChapterItem
          v-for="(chapter, index) in grouped.free"
          :key="chapter.id"
          :chapter="chapter"
          :index="chapterIndex(chapter.id)"
          :accessible="true"
          @click="emit('chapterClick', chapter.id)"
        />
      </div>
    </div>

    <div v-if="grouped.paid.length" class="mb-6">
      <h3 class="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">
        <ShoppingCart :size="12" />
        Paid Chapters
        <span class="text-gray-300 font-normal tracking-normal">{{ grouped.paid.length }}</span>
      </h3>
      <div class="space-y-2">
        <ChapterItem
          v-for="chapter in grouped.paid"
          :key="chapter.id"
          :chapter="chapter"
          :index="chapterIndex(chapter.id)"
          :accessible="checkAccess(chapter)"
          @click="handleChapterClick(chapter)"
          @purchase="emit('chapterPurchase', chapter)"
        />
      </div>
    </div>

    <div v-if="grouped.premium.length" class="mb-6">
      <h3 class="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3 flex items-center gap-2">
        <Star :size="12" />
        Premium Chapters
        <span class="text-gray-300 font-normal tracking-normal">{{ grouped.premium.length }}</span>
      </h3>
      <div class="space-y-2">
        <ChapterItem
          v-for="chapter in grouped.premium"
          :key="chapter.id"
          :chapter="chapter"
          :index="chapterIndex(chapter.id)"
          :accessible="checkAccess(chapter)"
          @click="handleChapterClick(chapter)"
          @purchase="emit('chapterPurchase', chapter)"
        />
      </div>
    </div>

    <div v-if="grouped.draft.length" class="mb-6">
      <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
        <FileText :size="12" />
        Draft
        <span class="text-gray-300 font-normal tracking-normal">{{ grouped.draft.length }}</span>
      </h3>
      <div class="space-y-2">
        <ChapterItem
          v-for="chapter in grouped.draft"
          :key="chapter.id"
          :chapter="chapter"
          :index="chapterIndex(chapter.id)"
          :accessible="false"
        />
      </div>
    </div>

    <div
      v-if="chapters.length === 0"
      class="text-center py-12 bg-white rounded-xl border border-gray-100"
    >
      <BookOpen :size="32" class="text-gray-300 mx-auto mb-3" />
      <p class="text-gray-400 font-medium">No chapters yet</p>
      <p class="text-xs text-gray-400 mt-1">The author hasn't added any chapters.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Globe, ShoppingCart, Star, FileText, BookOpen } from "lucide-vue-next";
import type { Chapter } from "../../types/bookDetails";
import ChapterItem from "./ChapterItem.vue";

const props = defineProps<{
  chapters: Chapter[];
  isChapterAccessible?: (ch: Chapter) => boolean;
}>();

const emit = defineEmits<{
  chapterClick: [chapterId: string];
  blockedClick: [chapter: Chapter];
  chapterPurchase: [chapter: Chapter];
}>();

const checkAccess = props.isChapterAccessible ?? (() => true);

const chapterIndex = (id: string) => props.chapters.findIndex((c) => c.id === id);

const chapterCountText = computed(() => {
  const count = props.chapters.length;
  if (count === 0) return "No chapters published yet.";
  const published = props.chapters.filter((c) => c.isPublic).length;
  return `${published} of ${count} chapter${count !== 1 ? "s" : ""} published`;
});

const grouped = computed(() => {
  const free: Chapter[] = [];
  const paid: Chapter[] = [];
  const premium: Chapter[] = [];
  const draft: Chapter[] = [];

  for (const ch of props.chapters) {
    if (!ch.isPublic) {
      draft.push(ch);
    } else if (ch.isPremium) {
      premium.push(ch);
    } else if (!ch.isFree && ch.isPurchasable && ch.price > 0) {
      paid.push(ch);
    } else {
      free.push(ch);
    }
  }

  return { free, paid, premium, draft };
});

function handleChapterClick(chapter: Chapter) {
  if (checkAccess(chapter)) {
    emit("chapterClick", chapter.id);
  } else {
    emit("blockedClick", chapter);
  }
}
</script>
