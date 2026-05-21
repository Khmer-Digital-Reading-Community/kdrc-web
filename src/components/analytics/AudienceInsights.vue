<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
    <!-- Age Demographics -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-black mb-6">Audience by Age</h2>

      <div class="space-y-5">
        <div v-for="(demo, index) in audience.demographics" :key="index">
          <div class="flex justify-between items-center mb-2">
            <p class="text-gray-700 font-medium">{{ demo.label }}</p>
            <span class="text-sm font-bold text-gray-900">{{ demo.percentage }}%</span>
          </div>
          <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="[demo.color, 'h-full rounded-full transition-all']"
              :style="{ width: `${demo.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Demographics Stats -->
      <div class="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div>
          <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Largest Group</p>
          <p class="text-lg font-bold text-blue-500">
            {{ audience.demographics[1].label }}
          </p>
        </div>
        <div>
          <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Coverage</p>
          <p class="text-lg font-bold text-purple-500">{{ audience.demographics.length }} groups</p>
        </div>
      </div>
    </div>

    <!-- Geographic Distribution -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h2 class="text-xl font-bold text-black mb-6">Top Countries</h2>

      <div class="space-y-4">
        <div v-for="(country, index) in audience.topCountries" :key="index" class="group">
          <div class="flex justify-between items-center mb-2">
            <div>
              <p class="text-gray-900 font-medium">{{ index + 1 }}. {{ country.country }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ country.readers.toLocaleString() }} readers</p>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ country.percentage }}%</span>
          </div>
          <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden group-hover:shadow-sm transition-all">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              :style="{ width: `${country.percentage * 3}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Country Stats -->
      <div class="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div>
          <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Top Region</p>
          <p class="text-lg font-bold text-blue-500">{{ audience.topCountries[0].country }}</p>
        </div>
        <div>
          <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Countries</p>
          <p class="text-lg font-bold text-purple-500">{{ audience.topCountries.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  audience: {
    demographics: Array<{
      label: string
      percentage: number
      color: string
    }>
    topCountries: Array<{
      country: string
      readers: number
      percentage: number
    }>
  }
}>()
</script>
