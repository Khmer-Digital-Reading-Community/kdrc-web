<template>
  <section class="admin-page">
    <!-- <div class="admin-page-header">
      <div>
        <h2>Reports</h2>
        <p>User-submitted content reports</p>
      </div>
    </div> -->

    <div class="admin-stats-grid compact">
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Pending</p>
        <p class="admin-stat-value">{{ pendingCount }}</p>
      </div>
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Under review</p>
        <p class="admin-stat-value">{{ reviewCount }}</p>
      </div>
      <div class="admin-stat-card mini">
        <p class="admin-stat-label">Resolved</p>
        <p class="admin-stat-value">{{ resolvedCount }}</p>
      </div>
    </div>

    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input v-model="search" type="search" placeholder="Search reports…" />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="s in statusFilters"
          :key="s"
          type="button"
          class="admin-pill"
          :class="{ active: statusFilter === s }"
          @click="statusFilter = s"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading reports…</div>

    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Reported user</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filtered" :key="r.id">
              <td>
                <span class="admin-badge neutral">{{
                  formatType(r.type)
                }}</span>
              </td>
              <td class="desc">{{ r.description }}</td>
              <td>
                {{ r.reportedUser?.name || r.reportedUser?.email || "—" }}
              </td>
              <td>{{ r.reporter?.name || r.reporter?.email || "—" }}</td>
              <td>{{ formatDate(r.createdAt) }}</td>
              <td>
                <select
                  class="status-select"
                  :value="r.status"
                  @change="
                    updateStatus(r, ($event.target as HTMLSelectElement).value)
                  "
                >
                  <option value="pending">Pending</option>
                  <option value="under review">Under review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                  class="admin-icon-btn danger"
                  @click="remove(r)"
                >
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!filtered.length" class="admin-empty">
          <Flag :size="40" />
          <p>No reports yet</p>
          <small>Reports from users will appear here</small>
        </div>
      </div>
    </div>

    <p v-if="toast" class="admin-toast" :class="{ error: toastError }">
      {{ toast }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Search, Trash2, Flag } from "lucide-vue-next";
import {
  fetchAdminReports,
  updateReportStatus,
  deleteAdminReport,
  type AdminReport,
} from "../../services/adminApi";

const reports = ref<AdminReport[]>([]);
const loading = ref(true);
const search = ref("");
const statusFilter = ref("All");
const toast = ref("");
const toastError = ref(false);

const statusFilters = ["All", "pending", "under review", "resolved"];

const pendingCount = computed(
  () => reports.value.filter((r) => r.status === "pending").length,
);
const reviewCount = computed(
  () => reports.value.filter((r) => r.status === "under review").length,
);
const resolvedCount = computed(
  () => reports.value.filter((r) => r.status === "resolved").length,
);

const filtered = computed(() => {
  let list = reports.value;
  if (statusFilter.value !== "All") {
    list = list.filter((r) => r.status === statusFilter.value);
  }
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (r) =>
        r.description.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q),
    );
  }
  return list;
});

const formatType = (t: string) =>
  t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toast.value = "";
  }, 3000);
};

const load = async () => {
  loading.value = true;
  try {
    reports.value = await fetchAdminReports();
  } catch {
    showToast("Failed to load reports", true);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (r: AdminReport, status: string) => {
  try {
    await updateReportStatus(r.id, status);
    r.status = status;
    showToast("Status updated");
  } catch {
    showToast("Update failed", true);
    load();
  }
};

const remove = async (r: AdminReport) => {
  if (!confirm("Delete this report?")) return;
  try {
    await deleteAdminReport(r.id);
    reports.value = reports.value.filter((x) => x.id !== r.id);
    showToast("Report deleted");
  } catch {
    showToast("Delete failed", true);
  }
};

onMounted(load);
</script>

<style scoped>
.admin-stats-grid.compact {
  grid-template-columns: repeat(3, 1fr);
}

.admin-stat-card.mini {
  padding: 1rem;
  flex-direction: column;
  gap: 0.25rem;
}

.desc {
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-select {
  font-size: 0.8rem;
  padding: 0.35rem;
  border: 1px solid var(--admin-border);
  border-radius: 6px;
}

.admin-empty small {
  display: block;
  margin-top: 0.25rem;
  color: var(--admin-muted);
}
</style>
