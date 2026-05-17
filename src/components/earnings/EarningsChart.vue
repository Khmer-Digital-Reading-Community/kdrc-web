<template>
  <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm">
    <div class="mb-4 sm:mb-6">
      <h3 class="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
        Earnings Trend
      </h3>
      <p class="text-[11px] sm:text-[12px] text-gray-500">Daily earnings this week</p>
    </div>

    <!-- Chart Container -->
    <div class="flex items-end justify-around h-40 sm:h-48 md:h-64 gap-1 sm:gap-2 mb-4 sm:mb-6">
      <div v-for="(value, index) in data.earnings" :key="index" class="flex flex-col items-center flex-1">
        <!-- Bar -->
        <div class="relative w-full flex items-end justify-center h-32 sm:h-40 md:h-48">
          <div
            :style="{ height: (value / 750) * 100 + '%' }"
            class="w-4 sm:w-6 md:w-8 lg:w-10 bg-gradient-to-t from-[#c1712a] to-[#e8953d] rounded-t-lg transition-all hover:shadow-lg hover:from-[#a15c20] hover:to-[#d88530]"
          />
        </div>

        <!-- Label -->
        <p class="text-[9px] sm:text-[11px] font-bold text-gray-600 mt-2 sm:mt-3">{{ data.labels[index] }}</p>

        <!-- Value -->
        <p class="text-[10px] sm:text-[12px] font-bold text-[#093A3F]\">{{ value }}</p>
      </div>
    </div>

    <!-- Summary -->
    <div class="pt-4 sm:pt-6 border-t border-gray-200 grid grid-cols-3 gap-2 sm:gap-4">
      <div>
        <p class="text-[9px] sm:text-[11px] text-gray-400 uppercase tracking-wide mb-1">Total</p>
        <p class="text-base sm:text-lg font-bold text-[#093A3F]">{{ data.earnings.reduce((a, b) => a + b, 0) }}</p>
      </div>
      <div>
        <p class="text-[9px] sm:text-[11px] text-gray-400 uppercase tracking-wide mb-1">Average</p>
        <p class="text-base sm:text-lg font-bold text-[#093A3F]">
          {{ Math.round(data.earnings.reduce((a, b) => a + b, 0) / data.earnings.length) }}
        </p>
      </div>
      <div>
        <p class="text-[9px] sm:text-[11px] text-gray-400 uppercase tracking-wide mb-1">Peak</p>
        <p class="text-base sm:text-lg font-bold text-[#c1712a]\">{{ Math.max(...data.earnings) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartData {
  labels: string[]
  earnings: number[]
}

defineProps<{
  data: ChartData
}>()
</script>
