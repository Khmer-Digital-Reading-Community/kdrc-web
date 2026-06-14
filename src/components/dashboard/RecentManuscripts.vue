<template>
  <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-[#123C3A]">
        Recent Manuscripts
      </h2>

      <button
        @click="viewAll"
        class="text-[#9C6700] font-semibold hover:underline"
      >
        View All
      </button>
    </div>

    <div
      v-if="books.length"
      class="hidden md:grid grid-cols-[3fr_1.5fr_1fr_40px]
      text-xs uppercase tracking-wider
      text-gray-500 font-semibold
      border-b border-gray-100 pb-3 mb-2"
    >
      <div>Story Title</div>
      <div>Last Edited</div>
      <div>Status</div>
      <div></div>
    </div>

    <div v-if="books.length">
      <div
        v-for="book in books"
        :key="book.id"
        @click="navigateToEdit(book.id)"
        class="grid md:grid-cols-[3fr_1.5fr_1fr_40px]
        gap-4 items-center
        py-4
        border-b border-gray-100
        hover:bg-gray-50
        transition
        cursor-pointer"
      >
        <div class="flex items-center gap-4">

          <img
            :src="
              book.coverImageUrl ||
              'https://placehold.co/60x80/F5F5F5/999999?text=Book'
            "
            alt="Book Cover"
            class="w-12 h-16 rounded-lg object-cover shadow-sm"
          />

          <div>
            <h3 class="font-bold text-[#123C3A]">
              {{ book.title }}
            </h3>

            <p class="text-sm text-gray-500">
              {{ book.genre?.name || "Uncategorized" }}
              •
              {{ getWordCount(book).toLocaleString() }} words
            </p>
          </div>
        </div>

        <div class="text-gray-500 text-sm">
          {{ formatDate(book.updatedAt) }}
        </div>

        <div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getStatusClass(book.status)
            ]"
          >
            {{ getStatusLabel(book.status) }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <p class="text-gray-400 mb-4">
        No manuscripts found yet.
      </p>

      <button
        @click="router.push('/dashboard/books/new')"
        class="text-[#9C6700] font-bold hover:underline"
      >
        + Begin your first story
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Book } from "@/services/bookApi";

defineProps<{
  books: Book[];
}>();

const router = useRouter();

const navigateToEdit = (id: string) => {
  router.push(`/${id}/write`);
};

const viewAll = () => {
  router.push("/dashboard/manuscripts");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getWordCount = (book: Book) => {
  if (book.chapters?.length) {
    return book.chapters.reduce(
      (total, chapter) => total + (chapter.wordCount || 0),
      0
    );
  }

  if (book.content?.trim()) {
    return book.content.trim().split(/\s+/).length;
  }

  return 0;
};

const getStatusLabel = (status: Book["status"]) => {
  switch (status) {
    case "PUBLISHED":
      return "Published";
    case "ARCHIVED":
      return "Archived";
    case "DISCONTINUED":
      return "Discontinued";
    default:
      return "Draft";
  }
};

const getStatusClass = (status: Book["status"]) => {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";

    case "ARCHIVED":
      return "bg-gray-100 text-gray-700";

    case "DISCONTINUED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
};
</script>