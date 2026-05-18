<template>
  <div
    class="flex flex-col lg:flex-row gap-6"
  >

    <!-- Left -->
    <div
      class="flex-1 bg-gray-100/50
             rounded-2xl p-10
             flex flex-col justify-between"
    >

      <div>

        <h2
          class="text-3xl font-bold
                 text-gray-900 mb-6"
        >
          About the Author
        </h2>

        <p
          class="text-gray-600
                 leading-relaxed text-base"
        >
          {{ author.bio }}
        </p>

      </div>

      <div class="mt-12 flex items-center gap-6">

        <button
          class="text-[#0f3b35]
                 font-bold text-sm
                 border-b-2 border-[#0f3b35]
                 pb-0.5 hover:text-[#1a5f56]
                 transition-colors"
        >
          Follow {{ author.name }}
        </button>

        <button
          class="text-gray-500 font-bold
                 text-sm hover:text-gray-900
                 transition-colors"
        >
          Author Bio
        </button>

      </div>

    </div>

    <!-- Right Image -->
    <div
      class="w-full lg:w-100 relative
             rounded-2xl overflow-hidden
             group"
    >

      <img
        :src="author.image"
        :alt="author.name"
        class="w-full h-87.5 object-cover
               grayscale brightness-75
               group-hover:scale-105
               transition-transform duration-500"
      />

      <div
        class="absolute inset-0
               bg-linear-to-t
               from-[#0f3b35]/90
               via-transparent to-transparent
               flex items-end p-8"
      >

        <p
          class="text-white italic
                 font-serif text-lg
                 leading-snug"
        >
          \"Writing is the only way I know
          how to listen to the silence.\"
        </p>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Author } from "../../types/bookDetails";

defineProps<{
  author: Author;
}>();
</script>