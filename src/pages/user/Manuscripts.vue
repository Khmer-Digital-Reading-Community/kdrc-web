<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import ManuscriptFilters from "@/components/manuscript/ManuscriptFilters.vue";
import ManuscriptGrid from "@/components/manuscript/ManuscriptGrid.vue";
import { getMyBooks, deleteBook, updateBook, type Book } from "@/services/bookApi";

const books = ref<Book[]>([]);
const searchQuery = ref("");
const statusFilter = ref("All");
const isLoading = ref(true);

const fetchBooks = async () => {
  isLoading.value = true;
  try {
    books.value = await getMyBooks();
  } catch (error) {
    console.error("Failed to fetch books:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesStatus =
      statusFilter.value === "All" ||
      (statusFilter.value === "Drafts" && book.status === "DRAFT") ||
      (statusFilter.value === "Published" && book.status === "PUBLISHED") ||
      (statusFilter.value === "Archived" && book.status === "ARCHIVED");
    return matchesSearch && matchesStatus;
  });
});

const handleDeleteBook = async (id: string) => {
  if (
    confirm(
      "Are you sure you want to delete this book? This action cannot be undone.",
    )
  ) {
    try {
      await deleteBook(id);
      books.value = books.value.filter((b: Book) => b.id !== id);
    } catch (error) {
      alert("Failed to delete book");
    }
  }
};

const handleSetStatus = async (id: string, status: "PUBLISHED" | "DRAFT" | "ARCHIVED") => {
  try {
    await updateBook(id, { status } as any);
    const book = books.value.find((b) => b.id === id);
    if (book) book.status = status;
  } catch (error) {
    alert("Failed to update book status");
  }
};

onMounted(fetchBooks);
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <p class="text-3xl sm:text-4xl font-bold mt-2">
        Manuscript Management
      </p>

      <p class="text-gray-500 text-lg mt-2 text-[17px] pt-2">
        Manage your manuscripts, track their status, and publish your stories.
      </p>

    </div>
    <ManuscriptFilters
          v-model:search="searchQuery"
          v-model:status="statusFilter"
        />

        <div v-if="isLoading" class="flex justify-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123C3A]"
          ></div>
        </div>

        <ManuscriptGrid
          v-else
          :books="filteredBooks"
          @delete="handleDeleteBook"
          @setStatus="handleSetStatus"
        />
  </div>
</template>
