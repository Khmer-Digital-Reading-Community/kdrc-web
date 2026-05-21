<template>
  <div
    class="grid grid-cols-1
           md:grid-cols-2
           xl:grid-cols-3
           gap-y-8 md:gap-y-12
           gap-x-8 items-stretch
           w-full
           max-w-[270px]
           sm:max-w-[320px]
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