<template>
  <div
    v-if="totalPages > 1"
    class="mt-12 flex items-center justify-center gap-2 md:mt-14 md:gap-3"
  >
    <button
      @click="emit('prev')"
      class="px-2 text-lg font-bold text-gray-400 transition-colors hover:text-[#093A3F]"
      aria-label="Previous page"
    >
      &lsaquo;
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="emit('go', page)"
      :class="
        currentPage === page
          ? 'bg-[#1c3a2e] text-white'
          : 'text-gray-500 hover:bg-gray-100'
      "
      class="flex h-8 w-8 items-center justify-center rounded-[8px] text-[12px] font-bold transition-all md:h-9 md:w-9 md:text-[13px]"
    >
      {{ page }}
    </button>

    <button
      @click="emit('next')"
      class="px-2 text-lg font-bold text-gray-400 transition-colors hover:text-[#093A3F]"
      aria-label="Next page"
    >
      &rsaquo;
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits([
  "next",
  "prev",
  "go",
]);
</script>
