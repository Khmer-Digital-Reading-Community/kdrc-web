<template>
    <div
        class="flex w-full justify-between md:justify-end items-center mb-8"
    >

    <!-- Mobile Filter -->
    <button
        type="button"
        @click="emit('toggleFilter')"
        class="md:hidden flex items-center
             ]gap-1.5 bg-white px-4
             py-2.5 rounded-lg
             border border-gray-200
             text-[#093A3F]
             font-bold text-[11px]
             uppercase tracking-[0.1em]
             shadow-sm hover:bg-gray-50
             transition-colors"
    >
      Filters
    </button>

    <!-- Sort -->
    <button
      @click="emit('toggleSort')"
      class="bg-white px-4 sm:px-5
             py-2.5 rounded-lg sm:rounded-xl
             flex items-center gap-2 sm:gap-4
             border border-gray-200
             shadow-sm hover:bg-gray-50
             transition-colors"
    >

      <span
        class="text-[10px]
               font-bold uppercase
               tracking-[0.15em]
               text-gray-400
               hidden sm:inline-block"
      >
        Sort By
      </span>

      <span
        class="text-[11px]
               font-bold text-[#093A3F]"
      >
        {{ sortBy }}
      </span>

    </button>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  sortBy: string;
}>();

const emit = defineEmits([
  "toggleFilter",
  "toggleSort",
]);
</script>