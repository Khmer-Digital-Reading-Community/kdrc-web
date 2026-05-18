<template>
  <div class="relative flex h-screen overflow-hidden bg-[#F6F1E8]">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">

      <!-- Sticky Navbar -->
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto">

        <div class="p-3 sm:p-4 lg:p-6">

          <!-- Breadcrumb -->
          <div
            class="text-[11px] sm:text-sm uppercase tracking-[0.15em]
                   text-gray-500 mb-4 sm:mb-6"
          >
            Atelier >

            <span class="font-bold text-black">
              Bookmarks
            </span>
          </div>

          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold mt-2">
              Your Books Saved
            </h1>

            <p class="text-gray-500 mt-2">
              Access all your saved books and inspirations.
            </p>
          </div>

          <!-- Tabs -->
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

          <!-- Loading -->
          <div v-if="loading">
            Loading...
          </div>

          <!-- Empty -->
          <EmptyBookmark
            v-else-if="!filteredBookmarks || filteredBookmarks.length === 0"
          />

          <!-- Cards -->
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
            />

          </div>

        </div>

      </main>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";

import BookmarkTabs from "@/components/bookmarks/BookmarkTabs.vue";
import BookmarkCard from "@/components/bookmarks/BookmarkCard.vue";
import EmptyBookmark from "@/components/bookmarks/EmptyBookmark.vue";

import { useBookmarks } from "../../composables/useBookmarks";

const activeTab = ref("All Saved");

const { bookmarks, loading } = useBookmarks();

const filteredBookmarks = computed(() => {
  if (activeTab.value === "All Saved") {
    return bookmarks.value;
  }

  return bookmarks.value.filter(
    (item) =>
      item.type.toLowerCase() ===
      activeTab.value.toLowerCase().slice(0, -1)
  );
});
</script>