<template>
  <section class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>Analytics</h2>
        <p>Platform growth and content breakdown</p>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading analytics…</div>

    <template v-else-if="data">
      <!-- KPI Cards -->
      <div class="admin-stats-grid">
        <div v-for="card in metricCards" :key="card.label" class="admin-stat-card">
          <div class="admin-stat-icon" :class="card.tone">
            <component :is="card.icon" :size="22" />
          </div>
          <div>
            <p class="admin-stat-label">{{ card.label }}</p>
            <p class="admin-stat-value">{{ card.value }}</p>
            <p v-if="card.trend" class="admin-stat-hint" :class="card.trend > 0 ? 'up' : 'down'">
              {{ card.trend > 0 ? '+' : '' }}{{ card.trend }} this month
            </p>
          </div>
        </div>
      </div>

      <!-- Row 1: User Growth + Books by Status -->
      <div class="charts-row">
        <div class="admin-card chart-card-wide">
          <div class="admin-card-header"><h3>User Growth</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!userGrowth.length" class="admin-empty">Not enough data yet</div>
            <Line v-else :data="userGrowthChartData" :options="lineChartOptions" />
          </div>
        </div>

        <div class="admin-card chart-card-narrow">
          <div class="admin-card-header"><h3>Books by Status</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!booksByStatus.length" class="admin-empty">No books yet</div>
            <Doughnut v-else :data="booksDoughnutData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- Row 2: Exchanges + Trades -->
      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header"><h3>Exchange Listings by Status</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!exchangesByStatus.length" class="admin-empty">No exchange listings yet</div>
            <Bar v-else :data="exchangesChartData" :options="horizontalBarOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Trades by Status</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!tradesByStatus.length" class="admin-empty">No trade proposals yet</div>
            <Bar v-else :data="tradesChartData" :options="horizontalBarOptions" />
          </div>
        </div>
      </div>

      <!-- Row 3: Comments + Reports -->
      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header"><h3>Comments Overview</h3></div>
          <div class="admin-card-body chart-body">
            <Bar :data="commentsChartData" :options="verticalBarOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Reports Overview</h3></div>
          <div class="admin-card-body chart-body">
            <Bar :data="reportsChartData" :options="verticalBarOptions" />
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Users, BookOpen, MessageSquare, Flag, ArrowLeftRight } from 'lucide-vue-next';
import { Line, Bar, Doughnut } from 'vue-chartjs';
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
} from 'chart.js';
import { fetchAdminAnalytics } from '../../services/adminApi';

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

const metricCards = computed(() => {
  const s = data.value?.stats;
  if (!s) return [];
  return [
    { label: 'Users', value: s.totalUsers, icon: Users, tone: 'blue', trend: s.newUsersThisMonth },
    { label: 'Books', value: s.totalBooks, icon: BookOpen, tone: 'green', trend: s.newBooksThisMonth },
    { label: 'Comments', value: s.totalComments, icon: MessageSquare, tone: 'amber', trend: null },
    { label: 'Open Reports', value: s.pendingReports, icon: Flag, tone: 'red', trend: null },
    { label: 'Exchange Listings', value: s.totalExchangeListings, icon: ArrowLeftRight, tone: 'blue', trend: s.newExchangeListingsThisMonth },
  ];
});

// -- Chart data --

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f0f3f1' }, ticks: { precision: 0 } },
    x: { grid: { display: false } },
  },
  elements: { line: { tension: 0.4, borderWidth: 2.5 }, point: { radius: 3, hoverRadius: 5 } },
};

const userGrowthChartData = computed(() => ({
  labels: userGrowth.value.map((r) => r.month.slice(5)),
  datasets: [{
    label: 'Users',
    data: userGrowth.value.map((r) => Number(r.count)),
    borderColor: '#4a8f65',
    backgroundColor: (ctx: any) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, 'rgba(74,143,101,0.25)');
      g.addColorStop(1, 'rgba(74,143,101,0.02)');
      return g;
    },
    fill: true,
  }],
}));

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
};

const booksDoughnutData = computed(() => ({
  labels: booksByStatus.value.map((r) => r.status),
  datasets: [{
    data: booksByStatus.value.map((r) => Number(r.count)),
    backgroundColor: ['#10B981', '#FBBF24', '#6B7280', '#EF4444'],
    borderWidth: 0,
  }],
}));

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: { x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f3f1' } }, y: { grid: { display: false } } },
};

const exchangesChartData = computed(() => ({
  labels: exchangesByStatus.value.map((r) => r.status),
  datasets: [{
    data: exchangesByStatus.value.map((r) => Number(r.count)),
    backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    borderRadius: 4,
  }],
}));

const tradesChartData = computed(() => ({
  labels: tradesByStatus.value.map((r) => r.status.replace(/_/g, ' ')),
  datasets: [{
    data: tradesByStatus.value.map((r) => Number(r.count)),
    backgroundColor: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
    borderRadius: 4,
  }],
}));

const verticalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f3f1' } }, x: { grid: { display: false } } },
};

const commentsChartData = computed(() => {
  const s = data.value?.stats;
  const resolved = (s?.totalComments ?? 0) - (s?.pendingComments ?? 0);
  return {
    labels: ['Approved', 'Pending'],
    datasets: [{
      data: [resolved, s?.pendingComments ?? 0],
      backgroundColor: ['#10B981', '#FBBF24'],
      borderRadius: 6,
    }],
  };
});

const reportsChartData = computed(() => {
  const s = data.value?.stats;
  const resolved = (s?.totalReports ?? 0) - (s?.pendingReports ?? 0);
  return {
    labels: ['Resolved', 'Pending'],
    datasets: [{
      data: [resolved, s?.pendingReports ?? 0],
      backgroundColor: ['#6B7280', '#EF4444'],
      borderRadius: 6,
    }],
  };
});

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

.chart-card-wide {
  grid-column: span 1;
}

.chart-card-narrow {
  grid-column: span 1;
}

.charts-row:first-of-type {
  grid-template-columns: 1.4fr 1fr;
}

.chart-body {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 900px) {
  .charts-row,
  .charts-row:first-of-type {
    grid-template-columns: 1fr;
  }
  .chart-body {
    height: 240px;
  }
}
</style>
