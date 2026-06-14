<template>
  <section class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>Exchanges</h2>
        <p>Manage physical book listings and trade proposals</p>
      </div>
    </div>

    <div class="admin-stats-grid compact">
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Total listings</p>
        <p class="admin-stat-value">{{ summary.totalListings }}</p>
      </div>
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Active listings</p>
        <p class="admin-stat-value">{{ summary.activeListings }}</p>
      </div>
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Total trades</p>
        <p class="admin-stat-value">{{ summary.totalTrades }}</p>
      </div>
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Pending trades</p>
        <p class="admin-stat-value">{{ summary.pendingTrades }}</p>
      </div>
    </div>

    <div class="tab-bar">
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'listings' }"
        @click="switchTab('listings')"
      >
        Listings
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'trades' }"
        @click="switchTab('trades')"
      >
        Trades
      </button>
    </div>

    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="search"
          type="search"
          :placeholder="activeTab === 'listings' ? 'Search listings…' : 'Search trades…'"
          @keyup.enter="load(1)"
        />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="s in currentFilters"
          :key="s"
          type="button"
          class="admin-pill"
          :class="{ active: statusFilter === s }"
          @click="statusFilter = s; load(1)"
        >
          {{ s === 'ALL' ? 'All' : s.replace('_', ' ') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">
      {{ activeTab === 'listings' ? 'Loading listings…' : 'Loading trades…' }}
    </div>

    <div v-else-if="activeTab === 'listings'" class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="listing in listings" :key="listing.id">
              <td>
                <div class="book-cell">
                  <img :src="listing.imageUrl" :alt="listing.title" class="thumb" />
                  <div>
                    <strong>{{ listing.title }}</strong>
                    <p class="sub">{{ listing.author }}</p>
                  </div>
                </div>
              </td>
              <td>{{ listing.owner?.name || listing.owner?.email || '—' }}</td>
              <td><span class="admin-badge neutral">{{ listing.exchangeType }}</span></td>
              <td>{{ listing.location }}</td>
              <td>
                <select
                  class="status-select"
                  :value="listing.listingStatus"
                  @change="onListingStatusChange(listing, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </td>
              <td>{{ formatDate(listing.createdAt) }}</td>
              <td>
                <button type="button" class="admin-icon-btn danger" title="Delete" @click="removeListing(listing)">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!listings.length" class="admin-empty">
          <ArrowLeftRight :size="40" />
          <p>No exchange listings found</p>
        </div>
      </div>
    </div>

    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Requested book</th>
              <th>Offered book</th>
              <th>Requester</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trade in trades" :key="trade.id">
              <td>
                <div class="book-cell">
                  <img :src="trade.exchange?.imageUrl" :alt="trade.exchange?.title" class="thumb" />
                  <div>
                    <strong>{{ trade.exchange?.title || '—' }}</strong>
                    <p class="sub">{{ trade.exchange?.author }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="book-cell">
                  <img :src="trade.offeredExchange?.imageUrl" :alt="trade.offeredExchange?.title" class="thumb" />
                  <div>
                    <strong>{{ trade.offeredExchange?.title || '—' }}</strong>
                    <p class="sub">{{ trade.offeredExchange?.author }}</p>
                  </div>
                </div>
              </td>
              <td>{{ trade.requester?.name || trade.requester?.email || '—' }}</td>
              <td>{{ trade.exchange?.owner?.name || trade.exchange?.owner?.email || '—' }}</td>
              <td>
                <select
                  class="status-select"
                  :value="trade.status"
                  @change="onTradeStatusChange(trade, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="MEETING_SCHEDULED">MEETING SCHEDULED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </td>
              <td>{{ formatDate(trade.createdAt) }}</td>
              <td>
                <button type="button" class="admin-icon-btn danger" title="Delete" @click="removeTrade(trade)">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!trades.length" class="admin-empty">
          <ArrowLeftRight :size="40" />
          <p>No trade proposals found</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="admin-pagination">
      <button type="button" class="admin-btn admin-btn-secondary" :disabled="page <= 1" @click="load(page - 1)">Previous</button>
      <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
      <button type="button" class="admin-btn admin-btn-secondary" :disabled="page >= totalPages" @click="load(page + 1)">Next</button>
    </div>

    <p v-if="toast" class="admin-toast" :class="{ error: toastError }">{{ toast }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Search, Trash2, ArrowLeftRight } from 'lucide-vue-next';
import {
  deleteAdminExchange,
  deleteAdminExchangeRequest,
  fetchAdminExchangeRequests,
  fetchAdminExchanges,
  fetchAdminStats,
  updateAdminExchange,
  updateAdminExchangeRequest,
  type AdminExchangeListing,
  type AdminExchangeRequest,
} from '../../services/adminApi';

const activeTab = ref<'listings' | 'trades'>('listings');
const listings = ref<AdminExchangeListing[]>([]);
const trades = ref<AdminExchangeRequest[]>([]);
const loading = ref(true);
const search = ref('');
const statusFilter = ref('ALL');
const getPageSizePreference = (): number => {
  const PREFS_KEY = 'kdrc-admin-prefs';
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.itemsPerPage) {
        const val = parseInt(parsed.itemsPerPage, 10);
        if (!isNaN(val)) return val;
      }
    }
  } catch (e) {
    console.warn('Failed to parse admin prefs:', e);
  }
  return 10;
};

const page = ref(1);
const totalPages = ref(1);
const limit = getPageSizePreference();
const toast = ref('');
const toastError = ref(false);

const summary = ref({
  totalListings: 0,
  activeListings: 0,
  totalTrades: 0,
  pendingTrades: 0,
});

const listingFilters = ['ALL', 'ACTIVE', 'CLOSED'];
const tradeFilters = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'MEETING_SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'REJECTED',
];

const currentFilters = computed(() =>
  activeTab.value === 'listings' ? listingFilters : tradeFilters,
);

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => { toast.value = ''; }, 3000);
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const loadSummary = async () => {
  try {
    const stats = await fetchAdminStats();
    summary.value = {
      totalListings: stats.totalExchangeListings ?? 0,
      activeListings: stats.activeExchangeListings ?? 0,
      totalTrades: stats.totalExchangeRequests ?? 0,
      pendingTrades: stats.pendingExchangeRequests ?? 0,
    };
  } catch {
    /* ignore */
  }
};

const load = async (p = page.value) => {
  loading.value = true;
  page.value = p;
  try {
    if (activeTab.value === 'listings') {
      const params: Record<string, string | number> = { page: p, limit };
      if (search.value.trim()) params.search = search.value.trim();
      if (statusFilter.value !== 'ALL') params.listingStatus = statusFilter.value;
      const res = await fetchAdminExchanges(params);
      listings.value = res.data ?? [];
      totalPages.value = res.meta?.lastPage ?? 1;
    } else {
      const params: Record<string, string | number> = { page: p, limit };
      if (search.value.trim()) params.search = search.value.trim();
      if (statusFilter.value !== 'ALL') params.status = statusFilter.value;
      const res = await fetchAdminExchangeRequests(params);
      trades.value = res.data ?? [];
      totalPages.value = res.meta?.lastPage ?? 1;
    }
  } catch {
    showToast('Failed to load exchange data', true);
    listings.value = [];
    trades.value = [];
  } finally {
    loading.value = false;
  }
};

const switchTab = (tab: 'listings' | 'trades') => {
  activeTab.value = tab;
  statusFilter.value = 'ALL';
  search.value = '';
  load(1);
};

const onListingStatusChange = async (listing: AdminExchangeListing, listingStatus: string) => {
  try {
    await updateAdminExchange(listing.id, { listingStatus });
    listing.listingStatus = listingStatus;
    showToast('Listing status updated');
    loadSummary();
  } catch {
    showToast('Could not update listing status', true);
    load(page.value);
  }
};

const onTradeStatusChange = async (trade: AdminExchangeRequest, status: string) => {
  try {
    await updateAdminExchangeRequest(trade.id, status);
    trade.status = status;
    showToast('Trade status updated');
    loadSummary();
  } catch {
    showToast('Could not update trade status', true);
    load(page.value);
  }
};

const removeListing = async (listing: AdminExchangeListing) => {
  if (!confirm(`Delete listing "${listing.title}"? This cannot be undone.`)) return;
  try {
    await deleteAdminExchange(listing.id);
    showToast('Listing deleted');
    await Promise.all([load(page.value), loadSummary()]);
  } catch {
    showToast('Delete failed', true);
  }
};

const removeTrade = async (trade: AdminExchangeRequest) => {
  if (!confirm('Delete this trade proposal? This cannot be undone.')) return;
  try {
    await deleteAdminExchangeRequest(trade.id);
    showToast('Trade deleted');
    await Promise.all([load(page.value), loadSummary()]);
  } catch {
    showToast('Delete failed', true);
  }
};

onMounted(async () => {
  await loadSummary();
  await load();
});
</script>

<style scoped>
.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab-btn {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-muted);
  font-weight: 600;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--admin-accent-soft);
  border-color: var(--admin-accent);
  color: var(--admin-accent);
}

.book-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumb {
  width: 42px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
}

.sub {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: var(--admin-muted);
}

.status-select {
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--admin-border);
  border-radius: 6px;
}

.page-info {
  font-size: 0.9rem;
  color: var(--admin-muted);
}
</style>
