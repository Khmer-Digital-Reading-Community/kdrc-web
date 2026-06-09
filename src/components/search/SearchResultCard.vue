<template>
    <router-link
        :to="`/book-detail/${book.id}`"
        :class="[
            'group block bg-white transition-all duration-300',
            isListView
                ? 'rounded-[16px] border border-gray-100 p-4 md:p-6 flex gap-4 md:gap-6 hover:shadow-lg'
                : 'rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full'
        ]"
    >
        <!-- Grid/Card View -->
        <template v-if="!isListView">
        <div
            class="relative h-[220px] shrink-0 overflow-hidden"
            :style="{ background: getHeaderGradient(book.category) }"
        >
            <img
            v-if="book.coverImage"
            :src="book.coverImage"
            :alt="book.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div
            v-else
            class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4"
            >
            <svg
                class="w-14 h-14 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477
                    3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5
                    1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477
                    4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746
                    0-3.332.477-4.5 1.253"
                />
            </svg>

            <span
                class="text-white/80 text-xs font-semibold text-center line-clamp-2 max-w-[140px]"
            >
                {{ book.title }}
            </span>
            </div>

            <div
            class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"
            />

            <span
            class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white border border-white/30"
            >
            {{ book.category }}
            </span>

            <div
            class="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/30"
            >
            <span class="text-yellow-300 text-xs">★</span>
            <span class="text-white text-[11px] font-bold">
                {{ book.rating || "New" }}
            </span>
            </div>
        </div>

        <div class="flex flex-col flex-grow p-5">
            <h3
            class="text-[16px] font-bold text-[#093A3F] leading-snug line-clamp-2 group-hover:text-[#B4690E] transition-colors mb-1"
            >
            {{ book.title }}
            </h3>

            <p
            class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3"
            >
            By {{ book.author.name }}
            </p>

            <p
            class="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-grow mb-4"
            >
            {{ book.description }}
            </p>

            <div
            class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100"
            >
            <span
                class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider"
            >
                E-BOOK
            </span>

            <span
                class="text-[12px] font-bold text-[#B4690E]"
            >
                Read →
            </span>
            </div>
        </div>
        </template>

        <!-- List View -->
        <template v-else>
            <div class="flex-shrink-0 w-24 md:w-32 h-32 md:h-40 flex items-center justify-center relative overflow-hidden rounded-[12px]" :style="{ background: getHeaderGradient(book.category) }">
                <img
                    :src="book.coverImage"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    :alt="book.title"
                />
            </div>

            <div class="flex-grow flex flex-col justify-between py-2">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-2">
                        <h3 class="text-[16px] md:text-[18px] font-bold text-[#093A3F] group-hover:text-[#B4690E] transition-colors line-clamp-2">
                            {{ book.title }}
                        </h3>
                        <div v-if="book.rating" class="flex items-center gap-1 text-[12px] font-bold text-[#B4690E] shrink-0">
                            <span>★</span>
                            <span>{{ book.rating }}</span>
                        </div>
                    </div>

                    <p class="text-[13px] text-gray-600 font-semibold mb-2">
                        By {{ book.author.name }}
                    </p>

                    <p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {{ book.description }}
                    </p>
                </div>

                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-[#FDE9D0] text-[#B4690E] text-[11px] font-bold rounded-md uppercase tracking-wider">
                        E-book
                    </span>
                </div>
            </div>
        </template>
    </router-link>
</template>

<script setup lang="ts">
import type { SearchResult } from '../../services/searchApi';

defineProps<{
    book: SearchResult;
    isListView?: boolean;
}>();

function getHeaderGradient(category?: string) {
  const gradients: Record<string, string> = {
    "Khmer Literature":
      "linear-gradient(135deg, #4A7274 0%, #2d5456 100%)",
    Novels:
      "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
    Education:
      "linear-gradient(135deg, #1C4E5C 0%, #0a2e38 100%)",
    "Sci-Fi":
      "linear-gradient(135deg, #1a1a5e 0%, #0d0d3b 100%)",
    Romance:
      "linear-gradient(135deg, #7c3a5c 0%, #4a1a35 100%)",
    Mystery:
      "linear-gradient(135deg, #2d3561 0%, #1a1f40 100%)",
    Fantasy:
      "linear-gradient(135deg, #3d1a5c 0%, #1f0a30 100%)",
  };

  return (
    gradients[category || ""] ??
    "linear-gradient(135deg, #093A3F 0%, #042326 100%)"
  );
}
</script>
