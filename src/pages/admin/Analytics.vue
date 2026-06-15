<template>
  <section class="admin-page">
    <!-- <div class="admin-page-header">
      <div>
        <h2>Analytics</h2>
        <p>Platform growth and content breakdown</p>
      </div>
    </div> -->

    <div v-if="loading" class="admin-loading">Loading analytics…</div>

    <template v-else-if="data">
      <!-- Row 1: User Growth area + Books Distribution pie -->
      <div class="charts-row charts-row-wide">
        <div class="admin-card">
          <div class="admin-card-header"><h3>User Growth</h3></div>
          <div class="admin-card-body chart-body chart-body-tall">
            <div v-if="!userGrowth.length" class="admin-empty">
              Not enough data yet
            </div>
            <Line v-else :data="userGrowthChartData" :options="areaOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Books Distribution</h3></div>
          <div class="admin-card-body chart-body chart-body-tall">
            <div v-if="!booksByStatus.length" class="admin-empty">
              No books yet
            </div>
            <Pie v-else :data="booksPieData" :options="pieOptions" />
          </div>
        </div>
      </div>

      <!-- Row 2: Exchanges + Trades horizontal bars -->
      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>Exchange Listings by Status</h3>
          </div>
          <div class="admin-card-body chart-body">
            <div v-if="!exchangesByStatus.length" class="admin-empty">
              No exchange listings yet
            </div>
            <Bar
              v-else
              :data="exchangesChartData"
              :options="horizontalBarOptions"
            />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Trades by Status</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!tradesByStatus.length" class="admin-empty">
              No trade proposals yet
            </div>
            <Bar
              v-else
              :data="tradesChartData"
              :options="horizontalBarOptions"
            />
          </div>
        </div>
      </div>

      <!-- Row 3: Content Moderation donut + Platform Metrics radial bars -->
      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header"><h3>Content Moderation</h3></div>
          <div class="admin-card-body chart-body">
            <Doughnut :data="moderationDonutData" :options="donutOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Platform Metrics</h3></div>
          <div class="admin-card-body chart-body">
            <apexchart
              type="radialBar"
              height="100%"
              :options="radialOptions"
              :series="radialSeries"
            />
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Line, Bar, Doughnut, Pie } from "vue-chartjs";
import VueApexCharts from "vue3-apexcharts";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from "chart.js";
import { fetchAdminAnalytics } from "../../services/adminApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
);

const apexchart = VueApexCharts;

interface AnalyticsPayload {
  stats: {
    totalUsers: number;
    totalBooks: number;
    totalComments: number;
    pendingComments: number;
    totalReports: number;
    pendingReports: number;
    totalExchangeListings: number;
    activeExchangeListings: number;
    totalExchangeRequests: number;
    pendingExchangeRequests: number;
    newUsersThisMonth: number;
    newBooksThisMonth: number;
    newExchangeListingsThisMonth: number;
  };
  userGrowth: { month: string; count: string }[];
  booksByStatus: { status: string; count: string }[];
  exchangesByStatus?: { status: string; count: string }[];
  tradesByStatus?: { status: string; count: string }[];
}

const loading = ref(true);
const data = ref<AnalyticsPayload | null>(null);

const userGrowth = computed(() => data.value?.userGrowth ?? []);
const booksByStatus = computed(() => data.value?.booksByStatus ?? []);
const exchangesByStatus = computed(() => data.value?.exchangesByStatus ?? []);
const tradesByStatus = computed(() => data.value?.tradesByStatus ?? []);

// -- Row 1: User Growth (area) + Books (pie) --

const areaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f0f3f1" },
      ticks: { precision: 0 },
    },
    x: { grid: { display: false } },
  },
  elements: {
    line: { tension: 0.4, borderWidth: 2.5 },
    point: { radius: 3, hoverRadius: 6 },
  },
};

const userGrowthChartData = computed(() => ({
  labels: userGrowth.value.map((r) => r.month.slice(5)),
  datasets: [
    {
      label: "Users",
      data: userGrowth.value.map((r) => Number(r.count)),
      borderColor: "#4a8f65",
      backgroundColor: (ctx: any) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
        g.addColorStop(0, "rgba(74,143,101,0.3)");
        g.addColorStop(1, "rgba(74,143,101,0.02)");
        return g;
      },
      fill: true,
    },
  ],
}));

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { padding: 16, usePointStyle: true },
    },
  },
};

const booksPieData = computed(() => ({
  labels: booksByStatus.value.map((r) => r.status),
  datasets: [
    {
      data: booksByStatus.value.map((r) => Number(r.count)),
      backgroundColor: ["#10B981", "#FBBF24", "#6B7280", "#EF4444"],
      borderWidth: 2,
      borderColor: "#fff",
    },
  ],
}));

// -- Row 2: Exchanges + Trades (horizontal bars) --

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: "#f0f3f1" },
    },
    y: { grid: { display: false } },
  },
};

const exchangesChartData = computed(() => ({
  labels: exchangesByStatus.value.map((r) => r.status),
  datasets: [
    {
      data: exchangesByStatus.value.map((r) => Number(r.count)),
      backgroundColor: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
      borderRadius: 4,
    },
  ],
}));

const tradesChartData = computed(() => ({
  labels: tradesByStatus.value.map((r) => r.status.replace(/_/g, " ")),
  datasets: [
    {
      data: tradesByStatus.value.map((r) => Number(r.count)),
      backgroundColor: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"],
      borderRadius: 4,
    },
  ],
}));

// -- Row 3: Content Moderation (donut) --

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { padding: 14, usePointStyle: true },
    },
  },
};

const moderationDonutData = computed(() => {
  const s = data.value?.stats;
  return {
    labels: [
      "Approved Comments",
      "Pending Comments",
      "Resolved Reports",
      "Pending Reports",
    ],
    datasets: [
      {
        data: [
          (s?.totalComments ?? 0) - (s?.pendingComments ?? 0),
          s?.pendingComments ?? 0,
          (s?.totalReports ?? 0) - (s?.pendingReports ?? 0),
          s?.pendingReports ?? 0,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#6B7280", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };
});

// -- Row 3: Platform Metrics (ApexCharts radial bars) --

const radialSeries = computed(() => {
  const s = data.value?.stats;
  if (!s) return [0, 0, 0, 0];
  const totalExchanges = s.totalExchangeListings || 1;
  const totalTrades = s.totalExchangeRequests || 1;
  const totalComments = s.totalComments || 1;
  const totalReports = s.totalReports || 1;
  return [
    Math.round(((s.activeExchangeListings ?? 0) / totalExchanges) * 100),
    Math.round(
      ((s.totalExchangeRequests - (s.pendingExchangeRequests ?? 0)) /
        totalTrades) *
        100,
    ),
    Math.round(((s.totalComments - s.pendingComments) / totalComments) * 100),
    Math.round(((s.totalReports - s.pendingReports) / totalReports) * 100),
  ];
});

const radialOptions = computed(() => ({
  chart: {
    type: "radialBar" as const,
    toolbar: { show: false },
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { fontSize: "12px", color: "#6b7280" },
        value: {
          fontSize: "18px",
          fontWeight: "700",
          formatter: (v: number) => `${v}%`,
        },
      },
      track: { background: "#f0f3f1" },
    },
  },
  labels: [
    "Active Exchanges",
    "Completed Trades",
    "Approved Comments",
    "Resolved Reports",
  ],
  colors: ["#8b5cf6", "#0ea5e9", "#10B981", "#6B7280"],
}));

onMounted(async () => {
  try {
    data.value = await fetchAdminAnalytics();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.charts-row-wide {
  grid-template-columns: 1.4fr 1fr;
}

.chart-body {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-body-tall {
  height: 320px;
}

@media (max-width: 900px) {
  .charts-row,
  .charts-row-wide {
    grid-template-columns: 1fr;
  }
  .chart-body,
  .chart-body-tall {
    height: 260px;
  }
}
</style>
