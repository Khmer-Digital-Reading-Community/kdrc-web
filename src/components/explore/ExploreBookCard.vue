<template>
    <router-link
        :to="`/book-detail/${book.id}`"
        class="group flex h-full flex-col overflow-hidden rounded-[10px] border border-[#efe8db] bg-white shadow-[0_2px_8px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(17,24,39,0.08)]"
    >
        <div
            :class="getHeaderColor(book.category)"
            class="relative flex h-[230px] w-full shrink-0 items-end justify-center overflow-hidden pt-6 md:h-[255px] md:pt-8"
        >
            <img
                :src="book.coverImage"
                :alt="book.title"
                class="h-[90%] aspect-[2/3] object-cover object-center rounded-t-[4px] shadow-[0_-5px_20px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-[1.03]"
            />
        </div>

        <div class="flex flex-grow flex-col p-4 text-left md:p-5">
            <div class="mb-1.5 flex min-h-[42px] items-start justify-between gap-3">
                <h3
                    class="pr-2 text-[15px] font-bold leading-snug text-[#093A3F] transition-colors group-hover:text-[#B4690E] md:text-[16px]"
                >
                    {{ book.title }}
                </h3>

                <div class="mt-1 shrink-0 text-[11px] font-bold text-[#B4690E]">
                    &#9733; {{ book.rating }}
                </div>
            </div>

            <p class="mb-3 text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
                By {{ book.author }}
            </p>

            <p class="mb-4 min-h-[88px] text-[11px] font-medium leading-6 text-gray-500 line-clamp-4 md:text-[12px]">
                {{ book.description }}
            </p>

            <div class="mt-auto flex flex-wrap gap-2 pt-2">
                <span
                    class="rounded-[4px] bg-[#FDE9D0] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#B4690E]"
                >
                    E-book
                </span>

                <span
                    class="rounded-[4px] bg-[#FDE9D0] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#B4690E]"
                >
                    {{ book.lang }}
                </span>
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import type { ExploreBook } from "../../types/exploreBook";

defineProps<{
    book: ExploreBook;
}>();

function getHeaderColor(category: string) {
    switch (category) {
        case "Khmer Literature":
            return "bg-[#4A7274]";

        case "Novels":
            return "bg-[#1A1A1A]";

        case "Education":
            return "bg-[#1C4E5C]";

        case "Sci-Fi":
            return "bg-[#191970]";

        default:
            return "bg-[#093A3F]";
    }
}
</script>
