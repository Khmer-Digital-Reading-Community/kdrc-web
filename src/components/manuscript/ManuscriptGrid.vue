<script setup lang="ts">
import { useRouter } from "vue-router";
import ManuscriptCard from "./ManuscriptCard.vue";
import CreateStoryCard from "./CreateStoryCard.vue";
import type { Book } from "@/services/bookApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

defineProps<{
  books: Book[];
}>();

const emit = defineEmits<{
  delete: [id: string];
  setStatus: [id: string, status: "PUBLISHED" | "DRAFT" | "ARCHIVED"];
}>();

const router = useRouter();

const handleCreate = () => {
  router.push("/dashboard/books/new");
};

const handleEdit = (id: string) => {
  router.push(`/${id}/write`);
};

const formatWordCount = (book: Book): string => {
  const total = (book.chapters || []).reduce(
    (acc, ch) => acc + (ch.wordCount || 0),
    0,
  );
  if (total >= 1000) {
    return `${(total / 1000).toFixed(1)}k words`;
  }
  return `${total.toLocaleString()} words`;
};

const formatLastEdit = (book: Book): string => {
  if (!book.updatedAt) return "Just now";
  const d = dayjs(book.updatedAt);
  if (!d.isValid()) return "Just now";
  return d.fromNow();
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
    <CreateStoryCard @click="handleCreate" />

    <ManuscriptCard
      v-for="book in books"
      :key="book.id"
      :title="book.title"
      :description="book.description"
      :words="formatWordCount(book)"
      :edit="formatLastEdit(book)"
      :status="book.status"
      :cover-image-url="book.coverImageUrl"
      @edit="handleEdit(book.id)"
      @delete="emit('delete', book.id)"
      @setStatus="emit('setStatus', book.id, $event)"
    />
  </div>
</template>
