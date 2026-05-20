<template>
  <router-link
    :to="`/book-detail/${book.id}`"
    class="group block bg-white
           rounded-[24px] overflow-hidden
           border border-gray-100
           shadow-sm hover:shadow-xl
           hover:-translate-y-1.5
           transition-all duration-300
           flex flex-col h-full"
  >

    <!-- Cover -->
    <div
      :class="getHeaderColor(book.category)"
      class="h-[240px] md:h-[300px]
             w-full flex items-end
             justify-center pt-8 md:pt-10
             pb-0 relative overflow-hidden shrink-0"
    >

      <img
        :src="book.coverImage"
        class="h-full aspect-[2/3]
               object-cover object-center
               rounded-t-[8px] md:rounded-t-[12px]
               shadow-[0_-5px_20px_rgba(0,0,0,0.25)]
               transition-transform duration-500
               group-hover:scale-[1.03]"
      />

    </div>

    <!-- Content -->
    <div
      class="p-5 md:p-8
             flex flex-col flex-grow text-left"
    >

      <!-- Title -->
      <div
        class="flex justify-between
               items-start gap-3
               mb-1.5 h-[54px] md:h-[58px]"
      >

        <h3
          class="text-[18px] md:text-[20px]
                 xl:text-[21px]
                 font-sans font-bold
                 text-[#093A3F]
                 leading-snug
                 group-hover:text-[#B4690E]
                 transition-colors
                 line-clamp-2 pr-2"
        >
          {{ book.title }}
        </h3>

        <div
          class="flex items-center gap-1
                 text-[12px] md:text-[13px]
                 font-bold text-[#B4690E]
                 shrink-0 mt-1"
        >

          <span>★</span>

          <span>{{ book.rating }}</span>

        </div>

      </div>

      <!-- Author -->
      <p
        class="text-[9px] md:text-[10px]
               font-bold uppercase
               tracking-[0.1em]
               text-gray-400 mb-4"
      >
        By {{ book.author }}
      </p>

      <!-- Description -->
      <p
        class="text-[12px] md:text-[13px]
               text-gray-500 line-clamp-3
               leading-relaxed mb-4 md:mb-6
               font-medium
               min-h-[60px] md:min-h-[66px]"
      >
        {{ book.description }}
      </p>

      <!-- Tags -->
      <div
        class="flex flex-wrap gap-2
               md:gap-2.5 mt-auto pt-4"
      >

        <span
          class="px-3 md:px-3.5 py-1.5
                 bg-[#FDE9D0]
                 text-[#B4690E]
                 text-[9px] md:text-[10px]
                 font-bold rounded-md
                 uppercase tracking-wider"
        >
          E-book
        </span>

        <span
          class="px-3 md:px-3.5 py-1.5
                 bg-[#FDE9D0]
                 text-[#B4690E]
                 text-[9px] md:text-[10px]
                 font-bold rounded-md
                 uppercase tracking-wider"
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