<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
    <!-- Total Earnings -->
    <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <p class="text-[10px] sm:text-[11px] uppercase tracking-[2px] text-gray-400 mb-3 sm:mb-4">Total Earnings</p>
      <div class="mb-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-[#093A3F] mb-1">
          ${{ Number(data.totalEarnings).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </h2>
        <p class="text-[11px] sm:text-[12px] text-gray-500 font-medium">All-time earnings</p>
      </div>
      <div class="pt-3 sm:pt-4 border-t border-gray-200">
        <p class="text-[11px] sm:text-[12px] text-gray-600">
          <span class="text-[#52B788] font-bold">+15.3%</span> vs last month
        </p>
      </div>
    </div>

    <!-- This Month -->
    <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <p class="text-[10px] sm:text-[11px] uppercase tracking-[2px] text-gray-400 mb-3 sm:mb-4">This Month</p>
      <div class="mb-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-[#093A3F] mb-1">
          ${{ Number(data.thisMonth).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </h2>
        <p class="text-[11px] sm:text-[12px] text-gray-500 font-medium">Current month</p>
      </div>
      <div class="pt-3 sm:pt-4 border-t border-gray-200">
        <p class="text-[11px] sm:text-[12px] text-gray-600">
          <span class="text-[#52B788] font-bold">+8.2%</span> vs last month
        </p>
      </div>
    </div>

    <!-- Pending Withdrawal -->
    <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <p class="text-[10px] sm:text-[11px] uppercase tracking-[2px] text-gray-400 mb-3 sm:mb-4">Pending Withdrawal</p>
      <div class="mb-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-[#c1712a] mb-1">
          ${{ Number(data.pendingWithdrawal).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </h2>
        <p class="text-[11px] sm:text-[12px] text-gray-500 font-medium">Available to withdraw</p>
      </div>
      <div class="pt-3 sm:pt-4 border-t border-gray-200">
        <button class="text-[11px] sm:text-[12px] font-bold text-[#c1712a] hover:text-[#a15c20] transition">
          Withdraw now →
        </button>
      </div>
    </div>

    <!-- Average Per Day -->
    <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <p class="text-[10px] sm:text-[11px] uppercase tracking-[2px] text-gray-400 mb-3 sm:mb-4">Average Per Day</p>
      <div class="mb-4">
        <h2 class="text-2xl sm:text-3xl font-bold text-[#093A3F] mb-1">
          ${{ Number(data.averagePerDay).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </h2>
        <p class="text-[11px] sm:text-[12px] text-gray-500 font-medium">Daily average</p>
      </div>
      <div class="pt-3 sm:pt-4 border-t border-gray-200">
        <p class="text-[11px] sm:text-[12px] text-gray-600">
          <span class="text-[#E8753C] font-bold">-2.1%</span> vs last month
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EarningsData {
  totalEarnings: number
  thisMonth: number
  pendingWithdrawal: number
  averagePerDay: number
}

defineProps<{
  data: EarningsData
}>()
</script>
