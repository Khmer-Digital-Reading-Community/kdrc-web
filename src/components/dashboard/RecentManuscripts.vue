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
</script>

<template>
    <div class="bg-white rounded-3xl p-6 min-h-[400px]">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">Recent Manuscripts</h2>

            <button
                @click="viewAll"
                class="text-[#9C6700] font-medium hover:underline"
            >
                View All
            </button>
        </div>

        <div class="space-y-4">
            <div
                v-for="book in books"
                :key="book.id"
                @click="navigateToEdit(book.id)"
                class="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100"
            >
                <div>
                    <h3 class="font-semibold text-[#123C3A]">
                        {{ book.title }}
                    </h3>

                    <p class="text-sm text-gray-500">
                        {{ book.content?.length || book.description?.length || 0 }} characters
                    </p>
                </div>

                <span
                    :class="[
                        'text-xs px-3 py-1 rounded-full',
                        book.status === 'PUBLISHED'
                            ? 'bg-[#D9F2E6] text-[#0D7A4B]'
                            : 'bg-amber-100 text-amber-700',
                    ]"
                >
                    {{ book.status }}
                </span>
            </div>

            <div
                v-if="books.length === 0"
                class="flex flex-col items-center justify-center py-20 text-center"
            >
                <p class="text-gray-400 mb-4">No manuscripts found yet.</p>
                <button
                    @click="router.push('/dashboard/books/new')"
                    class="text-[#9C6700] font-bold hover:underline"
                >
                    + Begin your first story
                </button>
            </div>
        </div>
    </div>
</template>
