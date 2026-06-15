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

      <!-- Row 1: User Growth (area) + Books by Status (doughnut) -->
      <div class="charts-row charts-row-wide">
        <div class="admin-card">
          <div class="admin-card-header"><h3>User Growth</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!userGrowth.length" class="admin-empty">Not enough data yet</div>
            <Line v-else :data="userGrowthChartData" :options="areaOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Books by Status</h3></div>
          <div class="admin-card-body chart-body">
            <div v-if="!booksByStatus.length" class="admin-empty">No books yet</div>
            <Doughnut v-else :data="booksDoughnutData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- Row 2: Exchanges + Trades (horizontal bars) -->
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

      <!-- Row 3: Content Moderation (polar area) + Insights -->
      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header"><h3>Content Moderation</h3></div>
          <div class="admin-card-body chart-body">
            <PolarArea :data="moderationPolarData" :options="polarAreaOptions" />
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Platform Health</h3></div>
          <div class="admin-card-body insights-panel">
            <div class="insight-item" v-for="m in platformMetrics" :key="m.label">
              <div class="insight-icon" :style="{ background: m.color }">
                <component :is="m.icon" :size="18" />
              </div>
              <div class="insight-info">
                <span class="insight-label">{{ m.label }}</span>
                <span class="insight-value">{{ m.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Users, BookOpen, MessageSquare, Flag, ArrowLeftRight, TrendingUp } from 'lucide-vue-next';
import { Line, Bar, Doughnut, PolarArea } from 'vue-chartjs';
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
  PolarAreaController,
  RadialLinearScale,
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
  PolarAreaController,
  RadialLinearScale,
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

// -- Chart options --

const areaOptions = {
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
  scales: {
    x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f3f1' } },
    y: { grid: { display: false } },
  },
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

// -- Polar area for content moderation --

const polarAreaOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const, labels: { padding: 14, usePointStyle: true } } },
};

const moderationPolarData = computed(() => {
  const s = data.value?.stats;
  return {
    labels: ['Approved Comments', 'Pending Comments', 'Resolved Reports', 'Pending Reports'],
    datasets: [{
      data: [
        (s?.totalComments ?? 0) - (s?.pendingComments ?? 0),
        s?.pendingComments ?? 0,
        (s?.totalReports ?? 0) - (s?.pendingReports ?? 0),
        s?.pendingReports ?? 0,
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#6B7280', '#EF4444'],
      borderWidth: 0,
    }],
  };
});

// -- Platform health insights --

const platformMetrics = computed(() => {
  const s = data.value?.stats;
  if (!s) return [];
  return [
    {
      label: 'Active exchange listings',
      value: (s.activeExchangeListings ?? 0).toLocaleString(),
      icon: TrendingUp,
      color: '#8b5cf6',
    },
    {
      label: 'Pending exchange requests',
      value: (s.pendingExchangeRequests ?? 0).toLocaleString(),
      icon: ArrowLeftRight,
      color: '#0ea5e9',
    },
    {
      label: 'Comments awaiting review',
      value: (s.pendingComments ?? 0).toLocaleString(),
      icon: MessageSquare,
      color: '#f59e0b',
    },
    {
      label: 'Open reports',
      value: (s.pendingReports ?? 0).toLocaleString(),
      icon: Flag,
      color: '#ef4444',
    },
  ];
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

.charts-row-wide {
  grid-template-columns: 1.4fr 1fr;
}

.chart-body {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Platform Health panel */
.insights-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
  height: 280px;
  padding: 0.5rem 1rem;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  transition: background 0.15s;
}

.insight-item:hover {
  background: #f3f4f6;
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.insight-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.insight-label {
  font-size: 0.8rem;
  color: var(--admin-muted);
}

.insight-value {
  font-size: 1.15rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .charts-row,
  .charts-row-wide {
    grid-template-columns: 1fr;
  }
  .chart-body {
    height: 240px;
  }
  .insights-panel {
    height: auto;
  }
}
</style>
