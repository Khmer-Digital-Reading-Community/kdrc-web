<template>
  <div class="bg-[#FBF7F0] rounded-3xl p-6">

    <p class="text-[11px] uppercase tracking-[2px] text-gray-500 mb-6">
      {{ title }}
    </p>

    <div class="flex justify-center mb-6">

      <div
        class="w-28 h-28 rounded-full border-[10px] border-[#9C6700] flex items-center justify-center"
      >
        <span class="text-2xl font-bold">
          {{ value }}
        </span>
      </div>

    </div>

    <div class="text-center">

      <h2 class="font-bold text-xl">
        {{ subtitle }}
      </h2>

      <p class="text-gray-500 text-sm">
        {{ description }}
      </p>

    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string
  subtitle: string
  description: string
}>()
</script>