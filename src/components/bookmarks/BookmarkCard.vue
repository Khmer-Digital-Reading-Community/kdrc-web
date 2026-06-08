<template>
  <div
    class="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer"
    role="button"
    tabindex="0"
    @click="goToContinueReading"
    @keydown.enter="goToContinueReading"
    @keydown.space.prevent="goToContinueReading"
  >
    <div class="relative">
      <img
        :src="coverImageSrc"
        :alt="bookmark.title"
        class="w-full h-52 object-cover"
        @error="handleImageError"
      />

      <div class="absolute top-3 left-3">
        <span
          class="bg-[#0B2B2F] text-white text-xs px-3 py-1 rounded-full"
        >
          {{ bookmark.type === "BOOK" ? "Book" : "Chapter" }}
        </span>
      </div>

      <button
        @click.stop="emit('toggle')"
        class="absolute top-3 right-3
          bg-white/90 backdrop-blur-sm
          p-2 rounded-full
          shadow-md
          hover:scale-105
          transition"
      >
        <BookmarkIcon
          class="w-4 h-4 text-[#0B2B2F]"
          fill="#0B2B2F"
        />
      </button>
    </div>

    <div class="p-4">
      <p class="text-xs text-gray-400 mb-2">
        SAVED {{ bookmark.createdAt }}
      </p>

      <h3 class="font-semibold text-lg line-clamp-2">
        {{ bookmark.title }}
      </h3>

      <div class="flex items-center justify-between mt-4">
        <div>
          <p
            v-if="bookmark.author"
            class="text-sm text-gray-600"
          >
            {{ bookmark.author }}
          </p>

          <p
            v-if="bookmark.source"
            class="text-sm text-gray-600"
          >
            {{ bookmark.source }}
          </p>
        </div>

        <button @click.stop>
          <MoreVertical class="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { BookmarkIcon, MoreVertical } from "lucide-vue-next";
import type { Bookmark } from "../../types/bookmark";

const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits(["toggle"]);
const router = useRouter();

const fallbackCover = "https://placehold.co/600x400?text=Book+Cover";

const coverImageSrc = computed(() => {
  return props.bookmark.coverImage || fallbackCover;
});

const goToContinueReading = async () => {
  const bookId =
    props.bookmark.bookId ??
    (props.bookmark.type === "BOOK" ? props.bookmark.targetId : undefined);
  const chapterId =
    props.bookmark.type === "CHAPTER"
      ? (props.bookmark.chapterId ?? props.bookmark.targetId)
      : undefined;

  if (!bookId) {
    return;
  }

  await router.push({
    name: "readingpage",
    params: { id: bookId },
    query: chapterId ? { chapterId } : {},
  });
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = fallbackCover;
};
</script>
