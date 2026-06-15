<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="admin-page-header">
      <!-- <div>
        <h2>Chat Messages</h2>
        <p>Monitor and moderate live book-exchange chat messages</p>
      </div> -->
      <div class="header-stats">
        <div class="stat-pill">
          <span class="stat-value">{{ totalMessages }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-pill today">
          <span class="stat-value">{{ todayCount }}</span>
          <span class="stat-label">Today</span>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by message content or user..."
          @keyup.enter="fetchMessages"
        />
      </div>
      <button class="admin-btn admin-btn-secondary" @click="fetchMessages">
        <RefreshCw :size="15" />
        Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <p>Loading chat messages...</p>
    </div>

    <!-- Table -->
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 40px">
                <input type="checkbox" class="checkbox" @change="selectAll" />
              </th>
              <th>Message</th>
              <th>User</th>
              <th>Sent At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="msg in messages" :key="msg.id">
              <td>
                <input
                  type="checkbox"
                  class="checkbox"
                  v-model="selected"
                  :value="msg.id"
                />
              </td>
              <td>
                <p class="msg-text">{{ truncate(msg.content, 120) }}</p>
              </td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ msg.user?.name?.charAt(0).toUpperCase() ?? "U" }}
                  </div>
                  <div class="user-meta">
                    <span class="user-name">{{
                      msg.user?.name ?? "Deleted user"
                    }}</span>
                    <span class="user-email">{{
                      msg.user?.email ?? "N/A"
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="date-col">{{ formatDate(msg.createdAt) }}</td>
              <td>
                <div class="actions">
                  <button
                    class="admin-icon-btn view-btn"
                    title="View full message"
                    @click="viewMsg = msg"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    class="admin-icon-btn danger"
                    title="Delete"
                    @click="deleteOne(msg)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="messages.length === 0" class="admin-empty">
          <MessageSquare :size="40" />
          <p>No chat messages found</p>
          <small>Try adjusting your search query</small>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalMessages > 0" class="admin-pagination">
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="currentPage === 1"
        @click="
          currentPage--;
          fetchMessages();
        "
      >
        ← Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="currentPage >= totalPages"
        @click="
          currentPage++;
          fetchMessages();
        "
      >
        Next →
      </button>
      <span class="total-info">Total: {{ totalMessages }} messages</span>
    </div>

    <!-- Bulk actions -->
    <div v-if="selected.length > 0" class="bulk-actions-card animate-slide-up">
      <p>{{ selected.length }} message(s) selected</p>
      <div class="action-buttons">
        <button class="admin-btn admin-btn-danger" @click="bulkDelete">
          Delete Selected
        </button>
        <button class="admin-btn admin-btn-secondary" @click="selected = []">
          Clear
        </button>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="viewMsg" class="admin-modal-backdrop" @click="viewMsg = null">
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3>Chat Message</h3>
          <button class="admin-icon-btn" @click="viewMsg = null">
            <X :size="18" />
          </button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form-group">
            <label>Content</label>
            <textarea readonly class="modal-textarea" rows="5">{{
              viewMsg.content
            }}</textarea>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label>Sender</label>
              <input
                readonly
                type="text"
                :value="
                  viewMsg.user
                    ? `${viewMsg.user.name ?? 'Unknown'} (${viewMsg.user.email ?? 'N/A'})`
                    : 'Deleted user'
                "
              />
            </div>
            <div class="admin-form-group">
              <label>Sent At</label>
              <input
                readonly
                type="text"
                :value="formatDate(viewMsg.createdAt)"
              />
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button
            class="admin-btn admin-btn-danger"
            @click="
              deleteOne(viewMsg!);
              viewMsg = null;
            "
          >
            Delete This Message
          </button>
          <button class="admin-btn admin-btn-secondary" @click="viewMsg = null">
            Close
          </button>
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
import {
  Search,
  Eye,
  Trash2,
  MessageSquare,
  X,
  RefreshCw,
} from "lucide-vue-next";
import {
  getAdminChatMessages,
  deleteAdminChatMessage,
  bulkDeleteAdminChatMessages,
  getAdminChatStats,
  type ChatMessage,
} from "../../services/chatApi";

const messages = ref<ChatMessage[]>([]);
const selected = ref<string[]>([]);
const viewMsg = ref<ChatMessage | null>(null);
const searchQuery = ref("");
const getPageSizePreference = (): number => {
  const PREFS_KEY = "kdrc-admin-prefs";
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
    console.warn("Failed to parse admin prefs:", e);
  }
  return 10;
};

const currentPage = ref(1);
const pageSize = ref(getPageSizePreference());
const totalMessages = ref(0);
const todayCount = ref(0);
const loading = ref(false);
const toast = ref("");
const toastError = ref(false);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalMessages.value / pageSize.value)),
);

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toast.value = "";
  }, 3000);
};

const fetchMessages = async () => {
  loading.value = true;
  try {
    const res = await getAdminChatMessages({
      search: searchQuery.value || undefined,
      page: currentPage.value,
      limit: pageSize.value,
    });
    messages.value = res.data;
    totalMessages.value = res.total;
  } catch {
    showToast("Failed to load messages", true);
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const res = await getAdminChatStats();
    totalMessages.value = res.total;
    todayCount.value = res.todayCount;
  } catch (err) {
    console.error("Failed to load chat stats:", err);
  }
};

const truncate = (text: string, len: number) =>
  text.length > len ? text.slice(0, len) + "…" : text;

const formatDate = (d: string) =>
  new Date(d).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const selectAll = (e: Event) => {
  selected.value = (e.target as HTMLInputElement).checked
    ? messages.value.map((m) => m.id)
    : [];
};

const deleteOne = async (msg: ChatMessage) => {
  if (!confirm("Delete this message?")) return;
  try {
    await deleteAdminChatMessage(msg.id);
    showToast("Message deleted");
    await fetchMessages();
    await fetchStats();
  } catch {
    showToast("Failed to delete", true);
  }
};

const bulkDelete = async () => {
  if (!confirm(`Delete ${selected.value.length} message(s)?`)) return;
  try {
    await bulkDeleteAdminChatMessages(selected.value);
    showToast(`${selected.value.length} message(s) deleted`);
    selected.value = [];
    await fetchMessages();
    await fetchStats();
  } catch {
    showToast("Bulk delete failed", true);
  }
};

onMounted(() => {
  fetchMessages();
  fetchStats();
});
</script>

<style scoped>
.header-stats {
  display: flex;
  gap: 10px;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--admin-radius);
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  min-width: 70px;
}

.stat-pill.today {
  background: var(--admin-accent-soft);
  border-color: var(--admin-accent);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--admin-text);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--admin-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--admin-accent);
}

.msg-text {
  margin: 0;
  color: var(--admin-text);
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--admin-accent-soft);
  color: var(--admin-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--admin-text);
}

.user-email {
  font-size: 0.75rem;
  color: var(--admin-muted);
}

.date-col {
  color: var(--admin-muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 6px;
}

.view-btn {
  color: var(--admin-badge-info-text);
  background: var(--admin-badge-info-bg);
}

.view-btn:hover {
  filter: brightness(0.95);
}

.page-info {
  font-size: 0.9rem;
  color: var(--admin-muted);
}

.total-info {
  font-size: 0.85rem;
  color: var(--admin-muted);
  margin-left: auto;
}

.bulk-actions-card {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--admin-accent-soft);
  border: 1px solid var(--admin-accent);
  border-radius: var(--admin-radius);
  margin-top: 1.5rem;
  flex-wrap: wrap;
  gap: 12px;
}

.bulk-actions-card p {
  margin: 0;
  font-weight: 600;
  color: var(--admin-text);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.modal-textarea {
  resize: none;
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-sm);
  padding: 8px 12px;
  color: var(--admin-text);
  font-family: inherit;
  font-size: 0.9rem;
  width: 100%;
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
