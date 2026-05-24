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
}>();

const router = useRouter();

const handleCreate = () => {
    router.push("/dashboard/books/new");
};

const handleEdit = (id: string) => {
    router.push(`/${id}/write`);
};
</script>

<template>
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <CreateStoryCard @click="handleCreate" />

        <ManuscriptCard
            v-for="book in books"
            :key="book.id"
            :title="book.title"
            :description="book.description"
            :words="`${(book.chapters || []).reduce((acc, ch) => acc + (ch.wordCount || 0), 0)} words`"
            :edit="dayjs(book.updatedAt).fromNow()"
            :status="book.status"
            :coverImageUrl="book.coverImageUrl"
            @edit="handleEdit(book.id)"
            @delete="emit('delete', book.id)"
        />
    </section>
</template>
