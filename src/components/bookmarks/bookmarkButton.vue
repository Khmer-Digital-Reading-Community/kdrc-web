<template>
  <button
    @click="emit('toggle')"
    class="w-11 h-11 rounded-full
            flex items-center justify-center
            transition-all duration-200
            shadow-md hover:scale-105"
    :class="
      saved
        ? 'bg-[#0B2B2F] text-white'
        : 'bg-white border border-gray-200 text-[#0B2B2F]'
    "
  >
    <BookmarkIcon
      class="w-5 h-5"
      :fill="saved ? 'currentColor' : 'none'"
    />
  </button>
</template>

<script setup lang="ts">
import { BookmarkIcon } from "lucide-vue-next";

defineProps<{
  saved: boolean;
}>();

const emit = defineEmits(["toggle"]);
</script>