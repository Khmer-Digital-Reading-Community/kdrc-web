<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm">
    <h2 class="text-xl font-bold text-black mb-6">Chapter Performance</h2>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-4 px-4 font-semibold text-gray-700">Chapter</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-700">Views</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-700">Completion</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-700">Avg Time</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-700">Rating</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-700">Drop Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="chapter in chapters"
            :key="chapter.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <!-- Chapter Title -->
            <td class="py-4 px-4">
              <p class="font-medium text-gray-900">{{ chapter.title }}</p>
            </td>

            <!-- Views -->
            <td class="text-center py-4 px-4">
              <span class="text-gray-900 font-semibold">{{ chapter.views.toLocaleString() }}</span>
            </td>

            <!-- Completion Rate -->
            <td class="py-4 px-4">
              <div class="flex items-center justify-center gap-2">
                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    :style="{ width: `${chapter.completionRate}%` }"
                  ></div>
                </div>
                <span class="text-xs font-semibold text-gray-700 w-8">{{ chapter.completionRate }}%</span>
              </div>
            </td>

            <!-- Average Reading Time -->
            <td class="text-center py-4 px-4">
              <span class="text-gray-900 font-medium">{{ chapter.avgTime }}m</span>
            </td>

            <!-- Rating -->
            <td class="text-center py-4 px-4">
              <div class="flex items-center justify-center gap-1">
                <span class="text-yellow-500">★</span>
                <span class="font-semibold text-gray-900">{{ chapter.rating }}</span>
              </div>
            </td>

            <!-- Drop Rate -->
            <td class="text-center py-4 px-4">
              <div
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium',
                  chapter.drop <= -10
                    ? 'bg-red-50 text-red-700'
                    : chapter.drop <= -5
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-green-50 text-green-700',
                ]"
              >
                <span v-if="chapter.drop < 0">↓</span>
                <span v-else>↑</span>
                {{ Math.abs(chapter.drop) }}%
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
      <div>
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Avg Completion</p>
        <p class="text-2xl font-bold text-blue-500">
          {{ (chapters.reduce((sum, ch) => sum + ch.completionRate, 0) / chapters.length).toFixed(1) }}%
        </p>
      </div>
      <div>
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Avg Rating</p>
        <p class="text-2xl font-bold text-yellow-500">
          {{ (chapters.reduce((sum, ch) => sum + ch.rating, 0) / chapters.length).toFixed(1) }}
        </p>
      </div>
      <div>
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Views</p>
        <p class="text-2xl font-bold text-purple-500">
          {{ chapters.reduce((sum, ch) => sum + ch.views, 0).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  chapters: Array<{
    id: number
    title: string
    views: number
    completionRate: number
    avgTime: number
    rating: number
    drop: number
  }>
}>()
</script>
