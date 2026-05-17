<template>
  <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm h-full">
    <div class="mb-4 sm:mb-6">
      <h3 class="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
        Earnings Breakdown
      </h3>
      <p class="text-[11px] sm:text-[12px] text-gray-500">By source</p>
    </div>

    <!-- Breakdown Items -->
    <div class="space-y-3 sm:space-y-5">
      <div v-for="item in data" :key="item.source" class="space-y-1.5 sm:space-y-2">
        <div class="flex justify-between items-center mb-2">
          <p class="text-[12px] sm:text-[13px] font-bold text-gray-700">{{ item.source }}</p>
          <span class="text-[11px] sm:text-[12px] font-bold text-[#c1712a]">{{ item.percentage }}%</span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            :style="{ width: item.percentage + '%' }"
            class="h-full bg-gradient-to-r from-[#c1712a] to-[#e8953d] rounded-full transition-all"
          />
        </div>

        <!-- Amount -->
        <p class="text-[10px] sm:text-[12px] text-gray-500">
          ${{ Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </p>
      </div>
    </div>

    <!-- Total -->
    <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <p class="text-[12px] sm:text-[13px] font-bold text-gray-700">Total Earnings</p>
        <p class="text-[14px] sm:text-[16px] font-bold text-[#093A3F]">
          ${{ Number(data.reduce((sum, item) => sum + item.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreakdownItem {
  source: string
  amount: number
  percentage: number
}

defineProps<{
  data: BreakdownItem[]
}>()
</script>
