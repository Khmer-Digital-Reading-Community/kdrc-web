<template>
  <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-[11px] font-bold text-[#093A3F] uppercase tracking-[0.2em]">Live Activity</h3>
      <div class="w-3 h-3 rounded-full bg-[#52B788] border-2 border-white shadow-sm"></div>
    </div>
    <div class="space-y-5">
      <div v-for="item in activities" :key="item.user" class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
        <div class="text-[13px]">
          <p class="font-bold text-gray-900 leading-tight">
            {{ item.user }} <span class="font-normal text-gray-500">posted to</span> 
            <span class="text-[#c1712a] font-bold ml-1">{{ item.type }}</span>
          </p>
          <p class="text-[11px] text-gray-400 mt-0.5">{{ item.time }} ago</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activities = [
  { user: 'Socheata P.', type: 'SWAP', time: '3m' },
  { user: 'Dara Samnang', type: 'LEND', time: '14m' },
  { user: 'Leakna R.', type: 'SELL', time: '1h' }
];
</script>