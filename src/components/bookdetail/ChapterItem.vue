<template>
  <div
    class="group flex items-center justify-between
           p-4 bg-white rounded-lg shadow-sm
           border border-gray-100
           hover:border-gray-300
           transition-colors cursor-pointer"
  >

    <div class="flex items-center gap-6">

      <span class="text-gray-300 font-mono text-lg w-6">
        {{ String(index + 1).padStart(2, "0") }}
      </span>

      <div>

        <h3
          class="font-semibold text-gray-900
                 group-hover:text-[#134e4a]
                 transition-colors"
        >
          {{ chapter.title }}
        </h3>

        <p class="text-xs text-gray-500 mt-0.5">
          {{ chapter.duration }}
        </p>

      </div>

    </div>

    <div>

      <span
        v-if="chapter.isPublic"
        class="bg-[#e6f4ea] text-[#1e8e3e]
               text-[10px] font-bold
               px-2 py-1 rounded tracking-wide"
      >
        PUBLIC
      </span>

      <span
        v-else
        class="bg-gray-200/80 text-gray-500
               text-[10px] font-bold
               px-2 py-1 rounded tracking-wide"
      >
        PREMIUM
      </span>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Chapter } from "../../types/bookDetails";

defineProps<{
  chapter: Chapter;
  index: number;
}>();
</script>