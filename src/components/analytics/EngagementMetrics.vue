<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm h-full">
    <h2 class="text-xl font-bold text-black mb-6">Engagement Metrics</h2>

    <div class="space-y-4">
      <div
        v-for="(metric, index) in metrics"
        :key="index"
        class="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div class="flex justify-between items-start mb-2">
          <p class="text-gray-700 font-medium text-sm">{{ metric.title }}</p>
          <div
            :class="[
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
              metric.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700',
            ]"
          >
            <span v-if="metric.isPositive">↑</span>
            <span v-else>↓</span>
            {{ metric.change }}
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ metric.value }}</p>
      </div>
    </div>

    <!-- Additional Insights -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <p class="text-xs uppercase tracking-wider text-gray-600 mb-3">Quick Insights</p>
      <ul class="space-y-2 text-xs text-gray-600">
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Comments up 15.2% - great engagement
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Bookmarks growing steadily
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Bounce rate improving
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  metrics: Array<{
    title: string
    value: string | number
    change: string
    isPositive: boolean
  }>
}>()
</script>
