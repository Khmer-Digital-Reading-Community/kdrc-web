<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-black">Reads Per Book</h2>
        <p class="text-gray-600 text-sm mt-1">Total reads across your published books</p>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
        <span class="text-gray-600">Readers</span>
      </div>
    </div>

    <div class="h-56">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
      <div class="text-center">
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Total Reads</p>
        <p class="text-2xl font-bold text-purple-500">
          {{ totalReads.toLocaleString() }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-gray-600 text-xs uppercase tracking-wider mb-2">Avg Per Book</p>
        <p class="text-2xl font-bold text-amber-500">
          {{ avgPerBook.toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const props = defineProps<{
  data: {
    labels: string[];
    views: number[];
    readers: number[];
  };
}>();

const totalReads = computed(() =>
  props.data.readers.reduce((a, b) => a + b, 0),
);

const avgPerBook = computed(() =>
  props.data.readers.length
    ? Math.round(totalReads.value / props.data.readers.length)
    : 0,
);

const maxVal = computed(() => Math.max(...props.data.readers, 1));

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      label: 'Readers',
      data: props.data.readers,
      backgroundColor: props.data.readers.map((v) => {
        const ratio = v / maxVal.value;
        return ratio > 0.7
          ? 'rgba(139, 92, 246, 0.85)'
          : 'rgba(139, 92, 246, 0.45)';
      }),
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: { precision: 0, font: { size: 11 } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, maxRotation: 45 },
    },
  },
};
</script>
