<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

defineProps<{
  streakDays: number;
}>();

const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Writing Activity",
      data: [2, 4, 3, 6, 8, 7, 10],
      borderColor: "#9C6700",
      backgroundColor: "#9C6700",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="bg-white rounded-3xl p-6 h-full">

    <div class="mb-4">
      <p class="text-[11px] uppercase tracking-[2px] text-gray-400">
        Writing Analytics
      </p>

      <h2 class="text-2xl font-bold text-[#123C3A] mt-2">
        {{ streakDays }} Day Streak
      </h2>
    </div>

    <div class="h-[300px]">
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>

  </div>
</template>