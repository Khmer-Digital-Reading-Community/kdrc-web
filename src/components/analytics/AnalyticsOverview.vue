<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
  >
    <div
      v-for="(stat, index) in stats"
      :key="index"
      :class="[
        'rounded-2xl p-6 transition-transform hover:shadow-lg',
        stat.color,
      ]"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-[11px] uppercase tracking-[2px] text-gray-500 mb-3">
            {{ stat.title }}
          </p>
          <h3 class="text-3xl font-bold text-black mb-3">
            {{ stat.value }}
          </h3>
          <div v-if="stat.change" class="flex items-center gap-2">
            <div
              :class="[
                'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium',
                stat.isPositive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              ]"
            >
              <component
                :is="stat.isPositive ? 'ArrowUpRight' : 'ArrowDownLeft'"
                :size="16"
              />
              {{ stat.change }}
            </div>
            <span class="text-gray-600 text-xs">vs last period</span>
          </div>
        </div>
        <div class="text-gray-400">
          <component :is="stat.icon" :size="28" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: any;
    color: string;
  }>;
}>();
</script>
