<template>
  <div
    class="flex items-center gap-8
           mb-12 border-b border-gray-100"
  >

    <button
      @click="emit('change-tab', 'author')"
      :class="
        activeTab === 'author'
          ? 'text-[#CC9552] border-[#CC9552]'
          : 'text-gray-400 border-transparent'
      "
      class="pb-4 font-bold text-sm
             tracking-wide border-b-2
             transition-all"
    >
      About Author
    </button>

    <button
      @click="emit('change-tab', 'reviews')"
      :class="
        activeTab === 'reviews'
          ? 'text-[#CC9552] border-[#CC9552]'
          : 'text-gray-400 border-transparent'
      "
      class="pb-4 font-bold text-sm
             tracking-wide border-b-2
             transition-all"
    >
      Reviews
    </button>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: "author" | "reviews";
}>();

const emit = defineEmits([
  "change-tab",
]);
</script>