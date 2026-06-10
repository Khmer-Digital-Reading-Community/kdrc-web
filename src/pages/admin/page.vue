<template>
  <section class="admin-page">
    <div v-if="loading" class="admin-loading">Loading dashboard…</div>

    <template v-else>
      <div class="admin-stats-grid">
        <div v-for="card in statCards" :key="card.label" class="admin-stat-card">
          <div class="admin-stat-icon" :class="card.tone">
            <component :is="card.icon" :size="22" />
          </div>
          <div>
            <p class="admin-stat-label">{{ card.label }}</p>
            <p class="admin-stat-value">{{ card.value }}</p>
            <p v-if="card.hint" class="admin-stat-hint">{{ card.hint }}</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>Recent activity</h3>
            <router-link to="/admin/analytics" class="link">View analytics</router-link>
          </div>
          <div class="admin-card-body activity-list">
            <div v-if="!activity.length" class="admin-empty">No recent activity</div>
            <div v-for="item in activity" :key="`${item.type}-${item.id}`" class="activity-item">
              <span class="activity-icon" :class="item.type" />
              <div>
                <p class="activity-title">{{ item.title }}</p>
                <p class="activity-sub">{{ item.subtitle }}</p>
              </div>
              <span class="activity-time">{{ formatRelative(item.timestamp) }}</span>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h3>Quick actions</h3>
          </div>
          <div class="admin-card-body quick-actions">
            <router-link to="/admin/comments" class="quick-card">
              <MessageSquare :size="20" />
              <span>Moderate comments</span>
              <span v-if="stats?.pendingComments" class="quick-badge">{{ stats.pendingComments }} pending</span>
            </router-link>
            <router-link to="/admin/reports" class="quick-card">
              <Flag :size="20" />
              <span>Review reports</span>
              <span v-if="stats?.pendingReports" class="quick-badge">{{ stats.pendingReports }} open</span>
            </router-link>
            <router-link to="/admin/users" class="quick-card">
              <Users :size="20" />
              <span>Manage users</span>
            </router-link>
            <router-link to="/admin/books" class="quick-card">
              <BookOpen :size="20" />
              <span>Manage books</span>
            </router-link>
            <router-link to="/admin/exchanges" class="quick-card">
              <ArrowLeftRight :size="20" />
              <span>Manage exchanges</span>
              <span v-if="stats?.pendingExchangeRequests" class="quick-badge">{{ stats.pendingExchangeRequests }} pending</span>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  BookOpen,
  Users,
  MessageSquare,
  Flag,
  Trophy,
  ArrowLeftRight,
} from 'lucide-vue-next';
import {
  fetchAdminStats,
  fetchAdminActivity,
  type AdminStats,
  type AdminActivityItem,
} from '../../services/adminApi';

const loading = ref(true);
const stats = ref<AdminStats | null>(null);
const activity = ref<AdminActivityItem[]>([]);

const statCards = computed(() => {
  const s = stats.value;
  if (!s) return [];
  return [
    {
      label: 'Total books',
      value: s.totalBooks.toLocaleString(),
      hint: `+${s.newBooksThisMonth} this month`,
      icon: BookOpen,
      tone: 'green',
    },
    {
      label: 'Users',
      value: s.totalUsers.toLocaleString(),
      hint: `+${s.newUsersThisMonth} this month`,
      icon: Users,
      tone: 'blue',
    },
    {
      label: 'Comments',
      value: s.totalComments.toLocaleString(),
      hint: `${s.pendingComments} awaiting review`,
      icon: MessageSquare,
      tone: 'amber',
    },
    {
      label: 'Challenges',
      value: s.totalChallenges.toLocaleString(),
      hint: `${s.totalReviews} reviews`,
      icon: Trophy,
      tone: 'green',
    },
    {
      label: 'Exchange listings',
      value: (s.totalExchangeListings ?? 0).toLocaleString(),
      hint: `${s.activeExchangeListings ?? 0} active · ${s.pendingExchangeRequests ?? 0} pending trades`,
      icon: ArrowLeftRight,
      tone: 'blue',
    },
  ];
});

const formatRelative = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

onMounted(async () => {
  try {
    const [s, a] = await Promise.all([fetchAdminStats(), fetchAdminActivity(8)]);
    stats.value = s;
    activity.value = a;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.25rem;
}

.link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-accent);
  text-decoration: none;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 !important;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f0f3f1;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-icon.user_registered { background: var(--admin-accent); }
.activity-icon.book_added { background: var(--admin-info); }
.activity-icon.comment { background: var(--admin-warning); }
.activity-icon.report { background: var(--admin-danger); }
.activity-icon.exchange_listing { background: #8b5cf6; }
.activity-icon.exchange_trade { background: #0ea5e9; }

.activity-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.activity-sub {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: var(--admin-muted);
}

.activity-time {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--admin-muted);
  white-space: nowrap;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-sm);
  text-decoration: none;
  color: var(--admin-text);
  transition: border-color 0.15s, background 0.15s;
}

.quick-card:hover {
  border-color: var(--admin-accent);
  background: var(--admin-accent-soft);
}

.quick-badge {
  font-size: 0.75rem;
  color: var(--admin-accent);
  font-weight: 600;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
