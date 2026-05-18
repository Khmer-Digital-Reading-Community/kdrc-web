<script setup lang="ts">
defineProps<{
  saved: boolean;
}>();

const emit = defineEmits(["toggle"]);
</script>

<template>
  <button
    @click="emit('toggle')"
    class="p-3 rounded-full transition"
    :class="
      saved
        ? 'bg-[#0B2B2F] text-white'
        : 'bg-gray-200 text-black'
    "
  >
    🔖
  </button>
</template>