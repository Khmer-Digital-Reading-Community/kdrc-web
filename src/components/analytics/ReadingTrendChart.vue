<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-black">Reading Trends</h2>
        <p class="text-gray-600 text-sm mt-1">Views and readers over time</p>
      </div>
      <div class="flex gap-4 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-gray-600">Views</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <span class="text-gray-600">Readers</span>
        </div>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="relative h-64 flex items-end justify-between gap-2 px-2">
      <div
        v-for="(day, index) in data.labels"
        :key="index"
        class="flex-1 flex flex-col items-center gap-2 group"
      >
        <!-- Bars -->
        <div class="w-full flex gap-1 items-end justify-center h-40">
          <!-- Views Bar -->
          <div
            class="flex-1 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer"
            :style="{ height: `${(data.views[index] / Math.max(...data.views)) * 160}px` }"
          >
            <div class="invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              {{ data.views[index] }} views
            </div>
          </div>
          <!-- Readers Bar -->
          <div
            class="flex-1 bg-purple-500 rounded-t-lg transition-all hover:bg-purple-600 cursor-pointer"
            :style="{ height: `${(data.readers[index] / Math.max(...data.readers)) * 160}px` }"
          >
            <div class="invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              {{ data.readers[index] }} readers
            </div>
          </div>
        </div>

        <!-- Labels -->
        <span class="text-xs text-gray-600 font-medium">{{ day }}</span>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
      <div class="text-center">
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Views</p>
        <p class="text-2xl font-bold text-blue-500">
          {{ data.views.reduce((a, b) => a + b, 0) }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Readers</p>
        <p class="text-2xl font-bold text-purple-500">
          {{ data.readers.reduce((a, b) => a + b, 0) }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Avg Views/Day</p>
        <p class="text-2xl font-bold text-amber-500">
          {{ Math.round(data.views.reduce((a, b) => a + b, 0) / data.views.length) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    labels: string[]
    views: number[]
    readers: number[]
  }
}>()
</script>
