<script setup lang="ts">
defineProps<{
  activeTab: string;
}>();

const emit = defineEmits(["change"]);

const tabs = [
  "All Saved",
  "Books",
  "Chapters",
];
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="emit('change', tab)"
      class="px-4 py-2 rounded-full text-sm transition"
      :class="
        activeTab === tab
          ? 'bg-[#0B2B2F] text-white'
          : 'bg-white border text-gray-700'
      "
    >
      {{ tab }}
    </button>
  </div>
</template>
