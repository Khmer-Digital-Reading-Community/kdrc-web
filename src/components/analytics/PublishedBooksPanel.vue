<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm h-full">
    <h2 class="text-xl font-bold text-black mb-6">Published Books</h2>

    <div v-if="loading" class="text-center text-gray-400 py-8">Loading...</div>

    <div v-else-if="books.length === 0" class="text-center text-gray-400 py-8">
      No published books yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="book in books"
        :key="book.id"
        class="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="book.coverImageUrl"
            :src="book.coverImageUrl"
            class="w-9 h-12 object-cover rounded"
          />
          <div
            v-else
            class="w-9 h-12 rounded flex items-center justify-center flex-shrink-0"
            style="background-color: #093A3F"
          >
            <BookOpen class="w-4 h-4 text-white opacity-60" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm truncate">{{ book.title }}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <Eye class="w-3 h-3" /> {{ (book.readCount ?? 0).toLocaleString() }} reads
              </span>
              <span class="flex items-center gap-1">
                <Star class="w-3 h-3 text-amber-400 fill-amber-400" />
                {{ book.rating ? Number(book.rating).toFixed(1) : "—" }}
              </span>
              <span>{{ book.chapters?.length ?? 0 }} ch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Eye, Star } from "lucide-vue-next";
import type { Book } from "@/services/bookApi";

defineProps<{
  books: Book[];
  loading: boolean;
}>();
</script>
