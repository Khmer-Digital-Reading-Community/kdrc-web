<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";

import ManuscriptFilters from "@/components/manuscript/ManuscriptFilters.vue";
import ManuscriptGrid from "@/components/manuscript/ManuscriptGrid.vue";
import { getMyBooks, deleteBook, type Book } from "@/services/bookApi";

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

onMounted(fetchBooks);
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#F6F1E8]">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="flex-1 overflow-y-auto p-6">
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
        />
      </main>
    </div>
  </div>
</template>
