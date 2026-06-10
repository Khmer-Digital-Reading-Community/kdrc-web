<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{
  sortBy: string;
  activeCategory: string;
  activeLanguage: string;
  showFreeOnly: boolean;
}>();

const emit = defineEmits([
  "toggleFilter",
  "updateSort",
  "toggleFree",
]);

const sortOpen = ref(false);

const sortOptions = [
  "Newest Arrivals",
  "Latest",
  "Popular",
];

function selectSort(option: string) {
  emit("updateSort", option);
  sortOpen.value = false;
}

function handleDocumentClick() {
  sortOpen.value = false;
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("click", handleDocumentClick);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleDocumentClick);
  }
});
</script>

<template>
  <div
    class="sticky top-3 z-20 mb-5 flex w-full flex-wrap items-center justify-between gap-3 border-b border-[#ece6da] bg-[#f8f9f8]/95 py-3 backdrop-blur lg:mb-6"
  >
    <div class="min-w-0">
      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a0aaba]">
        Results
      </p>
      <div class="mt-1 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#093A3F]">
        <span class="rounded-full bg-[#f5f1e8] px-3 py-1">
          {{ activeCategory }}
        </span>
        <span
          v-if="activeLanguage !== 'All'"
          class="rounded-full bg-[#edf3f2] px-3 py-1"
        >
          {{ activeLanguage }}
        </span>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] shadow-sm transition-colors"
        :class="showFreeOnly
          ? 'border-[#c5a050] bg-[#c5a050] text-white'
          : 'border-[#e6dece] bg-white text-[#093A3F] hover:bg-white'"
        @click="emit('toggleFree')"
      >
        Free Books
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg border border-[#e6dece] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#093A3F] shadow-sm transition-colors hover:bg-white lg:hidden"
        @click="emit('toggleFilter')"
      >
        Filters
      </button>

      <div
        class="relative"
        @click.stop
      >
        <button
          class="flex items-center gap-2 rounded-lg border border-[#e6dece] bg-white px-4 py-2 shadow-sm transition-colors hover:bg-[#fcfbf8] sm:gap-4 sm:px-5"
          @click="sortOpen = !sortOpen"
        >
          <span
            class="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 sm:inline-block"
          >
            Sort By
          </span>

          <span class="text-[11px] font-bold text-[#093A3F]">
            {{ sortBy }}
          </span>

          <span
            class="text-[11px] text-[#7f8da5] transition-transform"
            :class="{ 'rotate-180': sortOpen }"
          >
            &#9662;
          </span>
        </button>

        <div
          v-if="sortOpen"
          class="absolute right-0 top-full mt-2 min-w-[180px] overflow-hidden rounded-lg border border-[#e6dece] bg-white shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
        >
          <button
            v-for="option in sortOptions"
            :key="option"
            class="block w-full px-4 py-3 text-left text-[12px] font-semibold transition-colors"
            :class="
              sortBy === option
                ? 'bg-[#f6f3ed] text-[#093A3F]'
                : 'text-[#48556a] hover:bg-[#faf7f1]'
            "
            @click="selectSort(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
