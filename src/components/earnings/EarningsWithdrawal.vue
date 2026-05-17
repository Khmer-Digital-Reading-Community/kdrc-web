<template>
  <div class="bg-[#FBF7F0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm h-full flex flex-col">
    <div class="mb-4 sm:mb-6">
      <h3 class="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.15em] text-gray-700 mb-2">
        Withdrawal
      </h3>
      <p class="text-[11px] sm:text-[12px] text-gray-500">Manage payouts</p>
    </div>

    <!-- Pending Amount -->
    <div class="bg-gradient-to-br from-[#c1712a] to-[#e8953d] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-4 sm:mb-6">
      <p class="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/80 mb-2">Available to Withdraw</p>
      <p class="text-2xl sm:text-3xl font-bold mb-1">${{ Number(pending).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
      <p class="text-[11px] sm:text-[12px] text-white/70">Ready for transfer</p>
    </div>

    <!-- Withdrawal Info -->
    <div class="space-y-2 sm:space-y-4 flex-1">
      <div class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100">
        <p class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1 sm:mb-2">Payment Method</p>
        <p class="text-[12px] sm:text-[13px] font-bold text-gray-800">Bank Transfer</p>
        <p class="text-[10px] sm:text-[11px] text-gray-500 mt-1">Cambodian Commercial Bank</p>
      </div>

      <div class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100">
        <p class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1 sm:mb-2">Next Withdrawal</p>
        <p class="text-[12px] sm:text-[13px] font-bold text-gray-800">May 25, 2024</p>
        <p class="text-[10px] sm:text-[11px] text-gray-500 mt-1">Usually within 2-3 days</p>
      </div>

      <div class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100">
        <p class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1 sm:mb-2">Processing Fee</p>
        <p class="text-[12px] sm:text-[13px] font-bold text-gray-800">2.5%</p>
        <p class="text-[10px] sm:text-[11px] text-gray-500 mt-1">Applied to withdrawal amount</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-2 sm:space-y-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
      <button
        class="w-full bg-[#c1712a] hover:bg-[#a15c20] text-white font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition text-[12px] sm:text-sm"
      >
        Withdraw Now
      </button>
      <button
        class="w-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition text-[12px] sm:text-sm"
      >
        Withdrawal History
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pending: number
}>()
</script>
