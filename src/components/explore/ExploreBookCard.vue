<template>
    <router-link
        :to="`/book-detail/${book.id}`"
        class="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
        <!-- Cover area -->
        <div
            class="relative h-[220px] shrink-0 overflow-hidden"
            :style="{ background: headerGradient }"
        >
            <!-- Cover image -->
            <img
                v-if="book.coverImage"
                :src="book.coverImage"
                :alt="book.title"
                @error="imgError = true"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                :class="imgError ? 'hidden' : ''"
            />

            <!-- Fallback when no cover or broken image -->
            <div
                v-if="!book.coverImage || imgError"
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

            <!-- Bottom gradient overlay -->
            <div
                class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"
            />

            <!-- Category badge pinned to top-left -->
            <span
                class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white border border-white/30"
            >
                {{ book.category }}
            </span>

            <!-- Rating pinned to top-right -->
            <div
                class="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/30"
            >
                <span class="text-yellow-300 text-xs leading-none">★</span>
                <span class="text-white text-[11px] font-bold leading-none">
                    {{ book.rating > 0 ? book.rating.toFixed(1) : "New" }}
                </span>
            </div>
        </div>

        <!-- Card body -->
        <div class="flex flex-col flex-grow p-5">
            <!-- Title -->
            <h3
                class="text-[16px] font-bold text-[#093A3F] leading-snug line-clamp-2 group-hover:text-[#B4690E] transition-colors mb-1"
            >
                {{ book.title }}
            </h3>

            <!-- Author -->
            <p
                class="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3"
            >
                By {{ book.author }}
            </p>

            <!-- Description (clean plain text) -->
            <p
                class="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-grow mb-4"
            >
                {{ book.description || "No description available." }}
            </p>

            <!-- Footer: lang badge + read button -->
            <div
                class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100"
            >
                <div class="flex gap-2">
                    <span
                        class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider"
                    >
                        {{ book.lang }}
                    </span>
                    <span
                        class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider"
                    >
                        E-Book
                    </span>
                </div>

                <router-link
                    :to="`/reading/${book.id}`"
                    @click.stop
                    class="flex items-center gap-1 text-[12px] font-bold text-[#B4690E] hover:text-[#8a510b] transition-all bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100"
                >
                    Read
                    <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </router-link>
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ExploreBook } from "../../types/exploreBook";

const props = defineProps<{ book: ExploreBook }>();

const imgError = ref(false);

const CATEGORY_GRADIENTS: Record<string, string> = {
    "Khmer Literature": "linear-gradient(135deg, #4A7274 0%, #2d5456 100%)",
    Novels: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
    Education: "linear-gradient(135deg, #1C4E5C 0%, #0a2e38 100%)",
    "Sci-Fi": "linear-gradient(135deg, #1a1a5e 0%, #0d0d3b 100%)",
    Romance: "linear-gradient(135deg, #7c3a5c 0%, #4a1a35 100%)",
    Mystery: "linear-gradient(135deg, #2d3561 0%, #1a1f40 100%)",
    Fantasy: "linear-gradient(135deg, #3d1a5c 0%, #1f0a30 100%)",
};

const headerGradient = computed(
    () =>
        CATEGORY_GRADIENTS[props.book.category] ??
        "linear-gradient(135deg, #093A3F 0%, #042326 100%)",
);
</script>
