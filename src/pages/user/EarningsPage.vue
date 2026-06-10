<script setup lang="ts">
import { ref } from "vue";
import EarningsOverview from "@/components/earnings/EarningsOverview.vue";
import EarningsChart from "@/components/earnings/EarningsChart.vue";
import EarningsBreakdown from "@/components/earnings/EarningsBreakdown.vue";
import TopPerformingBooks from "@/components/earnings/TopPerformingBooks.vue";
import RecentTransactions from "@/components/earnings/RecentTransactions.vue";
import EarningsWithdrawal from "@/components/earnings/EarningsWithdrawal.vue";

const selectedPeriod = ref("month");
const periods = ["week", "month", "year"];

// Mock data - replace with actual API calls
const earningsData = ref({
  totalEarnings: 12450.5,
  thisMonth: 3420.0,
  pendingWithdrawal: 1250.75,
  averagePerDay: 114.0,
});

const chartData = ref({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  earnings: [450, 520, 380, 690, 520, 450, 410],
});

const breakdownData = ref([
  { source: "Book Sales", amount: 8420.0, percentage: 67.5 },
  { source: "Premium Chapters", amount: 2150.0, percentage: 17.3 },
  { source: "Sponsorships", amount: 980.5, percentage: 7.9 },
  { source: "Donations", amount: 900.0, percentage: 7.2 },
]);

const topBooks = ref([
  {
    id: 1,
    title: "The Art of Stillness",
    author: "You",
    reads: 1240,
    earnings: 3420.5,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1507842217343-583f2270dba5?q=80&w=400",
  },
  {
    id: 2,
    title: "Cambodian Dreams",
    author: "You",
    reads: 980,
    earnings: 2150.0,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1516979187457-636afe6537c1?q=80&w=400",
  },
  {
    id: 3,
    title: "Echoes of Angkor",
    author: "You",
    reads: 756,
    earnings: 1890.25,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1504995617519-4058a7d8f6c4?q=80&w=400",
  },
]);

type Transaction = {
  id: number;
  type: "sale" | "chapter" | "withdrawal" | "donation" | "sponsorship";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
};

const transactions = ref<Transaction[]>([
  {
    id: 1,
    type: "sale",
    description: 'Book sale: "The Art of Stillness"',
    amount: 125.5,
    date: "2024-05-15",
    status: "completed",
  },
  {
    id: 2,
    type: "chapter",
    description: "Premium chapter unlock",
    amount: 45.0,
    date: "2024-05-14",
    status: "completed",
  },
  {
    id: 3,
    type: "withdrawal",
    description: "Withdrawal to bank account",
    amount: -500.0,
    date: "2024-05-10",
    status: "completed",
  },
  {
    id: 4,
    type: "donation",
    description: "Reader donation",
    amount: 25.0,
    date: "2024-05-08",
    status: "completed",
  },
  {
    id: 5,
    type: "sponsorship",
    description: "Sponsor payout",
    amount: 300.0,
    date: "2024-05-05",
    status: "completed",
  },
  {
    id: 6,
    type: "sale",
    description: 'Book sale: "Cambodian Dreams"',
    amount: 98.75,
    date: "2024-05-03",
    status: "pending",
  },
]);
</script>

<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Breadcrumb -->
          <div
            class="text-[10px] sm:text-[11px] lg:text-sm uppercase tracking-[0.15em] text-gray-500 mb-4 sm:mb-6"
          >
            Atelier >
            <span class="font-bold text-black">Earnings</span>
          </div>

          <!-- Header Section -->
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4"
          >
            <div class="w-full sm:w-auto">
              <h1
                class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2"
              >
                Earnings Dashboard
              </h1>
              <p class="text-gray-600 text-[12px] sm:text-[13px] lg:text-sm">
                Track your earnings and performance metrics
              </p>
            </div>
            <button
              class="w-full sm:w-auto mt-3 sm:mt-0 bg-[#c1712a] hover:bg-[#a15c20] text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition text-[12px] sm:text-sm"
            >
              + Withdraw Earnings
            </button>
          </div>

          <!-- Period Selector -->
          <div class="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
            <button
              v-for="period in periods"
              :key="period"
              @click="selectedPeriod = period"
              :class="
                selectedPeriod === period
                  ? 'bg-[#c1712a] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              "
              class="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[13px] font-bold uppercase tracking-wide transition"
            >
              {{
                period === "week"
                  ? "This Week"
                  : period === "month"
                    ? "This Month"
                    : "This Year"
              }}
            </button>
          </div>

          <!-- Overview Cards -->
          <EarningsOverview :data="earningsData" class="mb-6 sm:mb-8" />

          <!-- Charts and Breakdown Section -->
          <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8"
          >
            <!-- Chart -->
            <div class="lg:col-span-2">
              <EarningsChart :data="chartData" />
            </div>

            <!-- Breakdown -->
            <div class="col-span-1">
              <EarningsBreakdown :data="breakdownData" />
            </div>
          </div>

          <!-- Top Performing Books -->
          <TopPerformingBooks :books="topBooks" class="mb-6 sm:mb-8" />

          <!-- Transactions and Withdrawal -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <!-- Recent Transactions -->
            <div class="lg:col-span-2">
              <RecentTransactions :transactions="transactions" />
            </div>

            <!-- Withdrawal Card -->
            <div class="col-span-1">
              <EarningsWithdrawal :pending="earningsData.pendingWithdrawal" />
            </div>
          </div>
  </div>
</template>
