<template>
  <section class="admin-page">
    <div class="admin-page-header">
      <div class="admin-page-header-content">
        <p>{{ notifications.length }} total · {{ unreadCount }} unread</p>
      </div>
      <div class="header-btns">
        <button
          v-if="unreadCount > 0"
          type="button"
          class="admin-btn admin-btn-secondary"
          @click="markAllAsRead"
        >
          <Check :size="18" /> Mark all read
        </button>
        <button
          v-if="notifications.length"
          type="button"
          class="admin-btn admin-btn-danger"
          @click="onClearAll"
        >
          <Trash2 :size="18" /> Clear all
        </button>
      </div>
    </div>

    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="search"
          type="search"
          placeholder="Search notifications…"
        />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="t in typeFilters"
          :key="t"
          type="button"
          class="admin-pill"
          :class="{ active: typeFilter === t }"
          @click="typeFilter = t"
        >
          {{ t === "all" ? "All" : t }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading…</div>

    <div v-else class="admin-card notif-list">
      <div v-if="!filtered.length" class="admin-empty">
        <Bell :size="40" />
        <p>No notifications</p>
      </div>
      <article
        v-for="n in filtered"
        :key="n.id"
        class="notif-item"
        :class="{ unread: !n.read }"
        @click="toggleRead(n)"
      >
        <span class="type-dot" :class="n.type" />
        <div class="notif-body">
          <div class="notif-top">
            <h4>{{ n.title }}</h4>
            <span class="time">{{ formatTime(n.createdAt) }}</span>
          </div>
          <p>{{ n.message }}</p>
        </div>
        <button
          type="button"
          class="admin-icon-btn danger"
          title="Delete"
          @click.stop="remove(n.id)"
        >
          <Trash2 :size="16" />
        </button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Bell, Search, Trash2, Check } from "lucide-vue-next";
import { useAdminNotifications } from "../../composables/useAdminNotifications";
import type { Notification } from "../../services/notification.service";

const search = ref("");
const typeFilter = ref("all");
const typeFilters = ["all", "info", "success", "warning", "error"];

const {
  notifications,
  unreadCount,
  loading,
  load,
  markAsRead,
  markAllAsRead,
  remove,
  clearAll,
  formatTime,
} = useAdminNotifications();

const filtered = computed(() => {
  let list = notifications.value;
  if (typeFilter.value !== "all") {
    list = list.filter((n) => n.type === typeFilter.value);
  }
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q),
    );
  }
  return list;
});

const toggleRead = async (n: Notification) => {
  if (!n.read) await markAsRead(n.id);
};

const onClearAll = async () => {
  if (!confirm("Delete all notifications?")) return;
  await clearAll();
};

onMounted(() => load(true));
</script>

<style scoped>
.header-btns {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.notif-list {
  display: flex;
  flex-direction: column;
}

.notif-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f3f1;
  cursor: pointer;
  transition: background 0.15s;
}

.notif-item:hover {
  background: #fafcfb;
}

.notif-item.unread {
  background: var(--admin-accent-soft);
}

.type-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.type-dot.info {
  background: var(--admin-info);
}
.type-dot.success {
  background: var(--admin-accent);
}
.type-dot.warning {
  background: var(--admin-warning);
}
.type-dot.error {
  background: var(--admin-danger);
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.notif-top h4 {
  margin: 0;
  font-size: 0.95rem;
}

.time {
  font-size: 0.75rem;
  color: var(--admin-muted);
  white-space: nowrap;
}

.notif-body p {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--admin-muted);
}
</style>
