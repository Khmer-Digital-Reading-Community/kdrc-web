<template>
  <div class="p-3 sm:p-4 lg:p-6">
          <div class="mb-8">
            <p class="text-3xl sm:text-4xl font-bold mt-2">
              Your Books Saved
            </p>

            <p class="text-gray-500 text-lg mt-2 text-[17px] pt-2">
              Access all your saved books and inspirations.
            </p>

          </div>

          <div
            class="bg-white rounded-2xl p-5 mb-8
                    flex flex-col md:flex-row
                    md:items-center md:justify-between gap-4"
          >

            <BookmarkTabs
              :activeTab="activeTab"
              @change="activeTab = $event"
            />

            <button class="text-sm text-gray-600">
              Sort by: Date Added
            </button>

          </div>

          <div v-if="loading">
            Loading...
          </div>

          <EmptyBookmark
            v-else-if="!filteredBookmarks || filteredBookmarks.length === 0"
          />

          <div
            v-else
            class="grid grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-6"
          >

            <BookmarkCard
              v-for="bookmark in filteredBookmarks"
              :key="bookmark.id"
              :bookmark="bookmark"
              @toggle="handleToggle(bookmark)"
            />
          </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import BookmarkTabs from "@/components/bookmarks/BookmarkTabs.vue";
import BookmarkCard from "@/components/bookmarks/BookmarkCard.vue";
import EmptyBookmark from "@/components/bookmarks/EmptyBookmark.vue";

import { useBookmarks } from "../../composables/useBookmarks";
import type { Bookmark } from "../../types/bookmark";

const activeTab = ref("All Saved");

const { bookmarks, loading, toggleBookmark } = useBookmarks();

const tabTypeMap: Record<string, Bookmark["type"]> = {
  Books: "BOOK",
  Chapters: "CHAPTER",
};

const filteredBookmarks = computed(() => {
  if (activeTab.value === "All Saved") {
    return bookmarks.value;
  }

  const selectedType = tabTypeMap[activeTab.value];

  return bookmarks.value.filter((item) => item.type === selectedType);
});

const handleToggle = async (bookmark: Bookmark) => {
  await toggleBookmark(bookmark.targetId, bookmark.type);
};
</script>
