<template>
  <div class="flex flex-col md:flex-row gap-10 lg:gap-16 mb-20">

    <!-- Cover -->
    <div class="w-full md:w-[320px] shrink-0">

      <img
        :src="book.coverImage"
        @error="onCoverError"
        alt="Book cover"
        class="w-full aspect-2/3 rounded shadow-xl object-cover"
      />

    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col justify-center">

      <!-- Rating -->
      <div class="flex flex-wrap items-center gap-4 mb-4">

        <span
          class="bg-gray-200/80 text-gray-600
                 text-[10px] font-bold uppercase
                 tracking-widest px-2.5 py-1 rounded"
        >
          Editorial Choice
        </span>

        <div class="flex items-center gap-1">

          <div class="flex text-yellow-500 text-sm">

            <svg
              v-for="i in 5"
              :key="i"
              class="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921
                1.902 0l1.07 3.292a1 1 0 00.95.69
                h3.462c.969 0 1.371 1.24.588 1.81
                l-2.8 2.034a1 1 0 00-.364 1.118
                l1.07 3.292c.3.921-.755 1.688-1.54
                1.118l-2.8-2.034a1 1 0 00-1.175 0
                l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118
                l1.07-3.292a1 1 0 00-.364-1.118
                L2.98 8.72c-.783-.57-.38-1.81.588-1.81
                h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>

          </div>

          <span class="text-xs text-gray-900 font-medium ml-1">
            {{ book.rating }}

            <span class="text-gray-500 font-normal">
              ({{ book.reviewCount }} Reviews)
            </span>
          </span>

        </div>

      </div>

      <!-- Title -->
      <h1
        class="text-4xl md:text-5xl
               font-extrabold text-gray-900
               tracking-tight mb-2"
      >
        {{ book.title }}
      </h1>

      <!-- Author -->
      <p class="text-gray-500 mb-8">

        by

        <span class="text-[#134e4a] font-bold">
          {{ book.author.name }}
        </span>

      </p>

      <!-- Description -->
      <div
        class="text-gray-600 text-sm md:text-base
               leading-relaxed space-y-4 mb-8"
      >
        <p>
          {{ book.description }}
        </p>
      </div>

      <!-- Buttons -->
      <BookActionButtons @read="$emit('read')" />

      <!-- Stats -->
      <BookMetaStats
        :pages="book.pages"
        :language="book.language"
        :publisher="book.publisher"
      />

    </div>

  </div>
</template>

<script setup lang="ts">
import type { BookDetails } from "../../types/bookDetails";

import BookActionButtons from "./BookActionButtons.vue";
import BookMetaStats from "./BookMetaStats.vue";

defineProps<{
  book: BookDetails;
}>();

function onCoverError(event: Event) {
  const target = event.target as HTMLImageElement;

  target.src =
    "https://placehold.co/320x480?text=Book+Cover";
}
</script>