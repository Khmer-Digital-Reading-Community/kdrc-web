<template>
  <div
    v-if="totalPages > 1"
    class="mt-16 md:mt-20
           flex justify-center
           items-center gap-3 md:gap-6"
  >

    <button
      @click="emit('prev')"
      class="text-gray-400
             hover:text-[#093A3F]
             transition-colors
             font-bold text-xl px-2"
    >
      ‹
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="emit('go', page)"
      :class="
        currentPage === page
          ? 'bg-[#093A3F] text-white'
          : 'text-gray-500 hover:bg-gray-100'
      "
      class="w-10 h-10 md:w-11 md:h-11
             flex items-center justify-center
             rounded-[12px] md:rounded-[14px]
             text-[13px] md:text-[14px]
             font-bold transition-all"
    >
      {{ page }}
    </button>

    <button
      @click="emit('next')"
      class="text-gray-400
             hover:text-[#093A3F]
             transition-colors
             font-bold text-xl px-2"
    >
      ›
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