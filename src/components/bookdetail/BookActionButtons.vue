<template>
  <div class="flex items-center gap-3 mb-10 md:mb-14">

    <button
      @click="emit('read')"
      class="bg-[#0f3b35] hover:bg-[#0a2622]
             transition-colors text-white
             px-6 py-3 rounded-md
             font-semibold text-sm
             flex items-center gap-2"
    >
      <BookOpen class="w-5 h-5" />
      Read Now
    </button>

    <button
      @click="emit('bookmark')"
      class="bg-white border border-gray-300
             hover:bg-gray-50 transition-colors
             text-gray-700 p-3 rounded-md"
    >
      <BookmarkIcon
        class="w-5 h-5"
        :fill="saved ? 'currentColor' : 'none'"
      />
    </button>

  </div>
</template>

<script setup lang="ts">
import { BookmarkIcon, BookOpen } from "lucide-vue-next";

defineProps<{
  saved: boolean;
}>();

const emit = defineEmits([
  "read",
  "bookmark",
]);
</script>
