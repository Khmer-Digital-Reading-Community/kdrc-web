<template>
  <div
    class="grid grid-cols-1
           sm:grid-cols-2
           xl:grid-cols-3
           gap-y-6 md:gap-y-8
           gap-x-5 xl:gap-x-6 items-stretch
           w-full
           max-w-[280px]
           sm:max-w-none
           md:max-w-none
           mx-auto"
  >

    <ExploreBookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
    />

  </div>
</template>

<script setup lang="ts">
import type { ExploreBook } from "../../types/exploreBook";
import ExploreBookCard from "./ExploreBookCard.vue";

defineProps<{
  books: ExploreBook[];
}>();
</script>
