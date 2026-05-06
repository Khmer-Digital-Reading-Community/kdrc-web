<template>
  <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mt-6">
    <h3 class="text-[11px] font-bold text-[#093A3F] uppercase tracking-[0.2em] mb-6">Top Contributors</h3>
    <div class="space-y-5">
      <div v-for="(user, i) in contributors" :key="user.name" class="flex items-center gap-3">
        <span class="text-[13px] font-bold w-4" :class="i === 0 ? 'text-[#c1712a]' : 'text-gray-300'">{{ i + 1 }}</span>
        <div class="w-8 h-8 rounded-full bg-gray-100 shrink-0"></div>
        <div class="text-[13px]">
          <p class="font-bold text-gray-900 leading-tight">{{ user.name }}</p>
          <p class="text-[10px] text-[#c1712a] font-bold uppercase mt-0.5">{{ user.swaps }} Swaps</p>
        </div>
      </div>
    </div>
    <button class="w-full mt-6 py-2.5 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
      View Leaderboard
    </button>
  </div>
</template>

<script setup lang="ts">
const contributors = [
  { name: 'Sokha M.', swaps: 12 },
  { name: 'Vutha P.', swaps: 11 },
  { name: 'Leakna R.', swaps: 10 }
];
</script>