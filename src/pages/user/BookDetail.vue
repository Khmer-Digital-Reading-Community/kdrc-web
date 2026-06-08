<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import BookHero from "@/components/bookdetail/BookHero.vue";
import ChapterList from "@/components/bookdetail/ChapterList.vue";
import BookTabs from "@/components/bookdetail/BookTabs.vue";
import ReviewSection from "@/components/bookdetail/ReviewSection.vue";
import AuthorSection from "@/components/bookdetail/AuthorSection.vue";

import { useBookDetail } from "../../composables/useBookDetails";
import { useBookmarks } from "../../composables/useBookmarks";

const activeTab = ref<"author" | "reviews">("reviews");

const { book, loading, refreshBook } = useBookDetail();
const { isBookmarked, toggleBookBookmark } = useBookmarks();

const router = useRouter();

const handleRead = () => {
  if (book.value) {
    router.push(`/reading/${book.value.id}`);
  }
};

const handleBookmark = async () => {
  if (!book.value) {
    return;
  }

  await toggleBookBookmark(book.value.id);
};

const saved = computed(() => {
  return book.value ? isBookmarked(book.value.id) : false;
});
</script>

<template>
  <div
    class="bg-[#f9fafb] text-gray-800 font-sans antialiased min-h-screen flex flex-col"
  >
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Loading book details...</p>
    </div>

    <main
      v-else-if="book"
      class="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-10 md:py-16 w-full flex-1"
    >
      <nav class="text-xs text-gray-500 mb-8 font-medium">
        <RouterLink to="/explore" class="hover:text-gray-900 transition">
          Explore
        </RouterLink>

        <span class="mx-1"> > </span>

        <span class="text-gray-400"> Book Details </span>
      </nav>

      <BookHero
        :book="book"
        :saved="saved"
        @read="handleRead"
        @bookmark="handleBookmark"
      />

      <ChapterList :chapters="book.chapters" />

      <div class="mt-24">
        <BookTabs :activeTab="activeTab" @change-tab="activeTab = $event" />

        <ReviewSection
          v-if="activeTab === 'reviews'"
          :book="book"
          @review-submitted="refreshBook"
        />

        <AuthorSection v-else :author="book.author" />
      </div>
    </main>

    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Book not found.</p>
    </div>
  </div>
</template>
