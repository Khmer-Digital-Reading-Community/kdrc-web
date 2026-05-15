<script setup lang="ts">
defineProps<{
  title: string
  words: string
  edit: string
  status: string
}>()
</script>

<template>
  <div
    class="bg-[#FBF7F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
  >

    <!-- Cover -->
    <div
      class="h-64 bg-gradient-to-br from-[#2A241D] to-[#0B0A09] relative"
    >

      <!-- Status Badge -->
      <span
        class="absolute top-3 right-3 bg-[#2FE0A5] text-[10px] px-3 py-1 rounded-full font-bold uppercase"
      >
        {{ status }}
      </span>

    </div>

    <!-- Content -->
    <div class="p-4">

      <!-- Title -->
      <h2
        class="font-bold text-[#123C3A] text-lg leading-snug mb-2"
      >
        {{ title }}
      </h2>

      <!-- Meta -->
      <div class="text-sm text-gray-500 space-y-1 mb-4">

        <p>{{ words }}</p>

        <p>Last Edit: {{ edit }}</p>

      </div>

      <!-- Bottom -->
      <div class="flex items-center justify-between">

        <!-- Button -->
        <button
          class="bg-[#1BC47D] hover:bg-[#16a56a] text-white text-xs px-4 py-2 rounded-lg font-medium transition"
        >
          Continue Edit
        </button>

        <!-- Menu -->
        <button class="text-gray-400 text-xl">
          ⋮
        </button>

      </div>

    </div>

  </div>
</template>