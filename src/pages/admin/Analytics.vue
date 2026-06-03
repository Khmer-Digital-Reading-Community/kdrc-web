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
      <div class="admin-stats-grid">
        <div v-for="card in metricCards" :key="card.label" class="admin-stat-card">
          <div class="admin-stat-icon" :class="card.tone">
            <component :is="card.icon" :size="22" />
          </div>
          <div>
            <p class="admin-stat-label">{{ card.label }}</p>
            <p class="admin-stat-value">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="admin-card">
          <div class="admin-card-header"><h3>User growth (by month)</h3></div>
          <div class="admin-card-body">
            <div v-if="!userGrowth.length" class="admin-empty">Not enough data yet</div>
            <div v-else class="bar-chart">
              <div
                v-for="row in userGrowth"
                :key="row.month"
                class="bar-col"
              >
                <div
                  class="bar-fill"
                  :style="{ height: barHeight(row.count) + '%' }"
                  :title="`${row.count} users`"
                />
                <span class="bar-label">{{ row.month.slice(5) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header"><h3>Books by status</h3></div>
          <div class="admin-card-body">
            <div v-if="!booksByStatus.length" class="admin-empty">No books yet</div>
            <ul v-else class="status-list">
              <li v-for="row in booksByStatus" :key="row.status">
                <span class="admin-badge" :class="statusTone(row.status)">{{ row.status }}</span>
                <span class="count">{{ row.count }}</span>
                <div class="bar-track">
                  <div
                    class="bar-track-fill"
                    :style="{ width: statusPercent(row.count) + '%' }"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Users, BookOpen, MessageSquare, Flag } from 'lucide-vue-next';
import { fetchAdminAnalytics } from '../../services/adminApi';

interface AnalyticsPayload {
  stats: {
    totalUsers: number;
    totalBooks: number;
    totalComments: number;
    pendingComments: number;
    totalReports: number;
  };
  userGrowth: { month: string; count: string }[];
  booksByStatus: { status: string; count: string }[];
}

const loading = ref(true);
const data = ref<AnalyticsPayload | null>(null);

const userGrowth = computed(() => data.value?.userGrowth ?? []);
const booksByStatus = computed(() => data.value?.booksByStatus ?? []);

const maxUsers = computed(() =>
  Math.max(...userGrowth.value.map((r) => Number(r.count)), 1),
);

const maxBooks = computed(() =>
  Math.max(...booksByStatus.value.map((r) => Number(r.count)), 1),
);

const metricCards = computed(() => {
  const s = data.value?.stats;
  if (!s) return [];
  return [
    { label: 'Users', value: s.totalUsers, icon: Users, tone: 'blue' },
    { label: 'Books', value: s.totalBooks, icon: BookOpen, tone: 'green' },
    { label: 'Comments', value: s.totalComments, icon: MessageSquare, tone: 'amber' },
    { label: 'Open reports', value: s.totalReports, icon: Flag, tone: 'red' },
  ];
});

const barHeight = (count: string) =>
  Math.round((Number(count) / maxUsers.value) * 100);

const statusPercent = (count: string) =>
  Math.round((Number(count) / maxBooks.value) * 100);

const statusTone = (s: string) => {
  if (s === 'PUBLISHED') return 'success';
  if (s === 'DRAFT') return 'warning';
  return 'neutral';
};

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
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 180px;
  padding-top: 1rem;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  max-width: 36px;
  background: linear-gradient(180deg, #4a8f65, #2d5a40);
  border-radius: 6px 6px 0 0;
  min-height: 4px;
}

.bar-label {
  font-size: 0.65rem;
  color: var(--admin-muted);
  margin-top: 0.35rem;
}

.status-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.status-list li {
  display: grid;
  grid-template-columns: auto 40px 1fr;
  align-items: center;
  gap: 0.75rem;
}

.count {
  font-weight: 700;
  text-align: right;
}

.bar-track {
  height: 8px;
  background: #f0f3f1;
  border-radius: 4px;
  overflow: hidden;
}

.bar-track-fill {
  height: 100%;
  background: var(--admin-accent);
  border-radius: 4px;
}

@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
