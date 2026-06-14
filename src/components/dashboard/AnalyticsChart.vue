<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "vue-chartjs";
import type { Book } from "@/services/bookApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const props = defineProps<{
  books: Book[];
}>();

const chartData = computed(() => {
  const draft = props.books.filter(
    (book) => book.status === "DRAFT"
  ).length;

  const published = props.books.filter(
    (book) => book.status === "PUBLISHED"
  ).length;

  const archived = props.books.filter(
    (book) => book.status === "ARCHIVED"
  ).length;

  const discontinued = props.books.filter(
    (book) => book.status === "DISCONTINUED"
  ).length;

  return {
    labels: [
      "Draft",
      "Published",
      "Archived",
      "Discontinued",
    ],
    datasets: [
      {
        data: [
          draft,
          published,
          archived,
          discontinued,
        ],
        backgroundColor: [
          "#FBBF24",
          "#10B981",
          "#6B7280",
          "#EF4444",
        ],
        borderWidth: 0,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};
</script>

<template>
  <div class="bg-white rounded-3xl p-6 h-full">
    <div class="mb-4">
      <p class="text-[11px] uppercase tracking-[2px] text-gray-400">
        Manuscript Analytics
      </p>

      <h2 class="text-2xl font-bold text-[#123C3A] mt-2">
        Book Status Distribution
      </h2>
    </div>

    <div class="h-[300px]">
      <Doughnut
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>