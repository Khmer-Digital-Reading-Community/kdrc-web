<template>
  <section class="admin-page">
    <div class="admin-page-header admin-page-header-sm pl-3">
      <p>{{ users.length }} registered accounts</p>
    </div>
    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="search"
          type="search"
          placeholder="Search name or email…"
        />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="r in roleFilters"
          :key="r"
          type="button"
          class="admin-pill"
          :class="{
            active: r === 'ALL' ? activeRoles.size === 0 : activeRoles.has(r),
          }"
          @click="toggleRole(r)"
        >
          {{ r === "ALL" ? "All roles" : r }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading users…</div>

    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th class="col-check">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                />
              </th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              :class="{ 'row-selected': selectedIds.has(user.id) }"
            >
              <td class="col-check">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(user.id)"
                  @change="toggleSelect(user.id)"
                />
              </td>
              <td>
                <div class="user-cell">
                  <span class="avatar">{{
                    (user.name || user.email).charAt(0).toUpperCase()
                  }}</span>
                  <span class="user-name">{{ user.name || "—" }}</span>
                </div>
              </td>
              <td>
                <span class="user-email">{{ user.email }}</span>
              </td>
              <td>
                <select
                  class="role-select"
                  :value="user.role"
                  @change="
                    changeRole(user, ($event.target as HTMLSelectElement).value)
                  "
                >
                  <!-- <option value="READER">READER</option> -->
                  <option value="WRITER">WRITER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button
                  type="button"
                  class="admin-icon-btn danger"
                  @click="remove(user)"
                >
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="selectedIds.size > 0" class="batch-bar">
          <span class="batch-count">{{ selectedIds.size }} selected</span>
          <div class="batch-actions">
            <select
              class="batch-role-select"
              :value="''"
              @change="
                batchChangeRole(($event.target as HTMLSelectElement).value)
              "
            >
              <option value="" disabled>Change role to…</option>
              <option value="WRITER">WRITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              type="button"
              class="admin-btn admin-btn-danger"
              @click="batchDelete"
            >
              <Trash2 :size="14" />
              Delete selected
            </button>
          </div>
        </div>

        <div v-if="!filteredUsers.length" class="admin-empty">
          <p>No users match your filters</p>
          <button
            v-if="search || activeRoles.size > 0"
            type="button"
            class="admin-btn admin-btn-secondary"
            @click="clearFilters"
          >
            Clear filters
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
import { Search, Trash2 } from "lucide-vue-next";
import {
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
} from "../../services/adminApi";

const users = ref<AdminUser[]>([]);
const loading = ref(true);
const search = ref("");
const activeRoles = ref<Set<string>>(new Set());
const selectedIds = ref<Set<string>>(new Set());
const toast = ref("");
const toastError = ref(false);

const roleFilters = ["ALL", "WRITER", "ADMIN"];

const filteredUsers = computed(() => {
  let list = users.value;

  if (activeRoles.value.size > 0) {
    list = list.filter((u) => activeRoles.value.has(u.role));
  }

  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name?.toLowerCase().includes(q) ?? false),
    );
  }
  return list;
});

const isAllSelected = computed(
  () =>
    filteredUsers.value.length > 0 &&
    filteredUsers.value.every((u) => selectedIds.value.has(u.id)),
);

const isIndeterminate = computed(
  () =>
    !isAllSelected.value &&
    filteredUsers.value.some((u) => selectedIds.value.has(u.id)),
);

const toggleSelect = (id: string) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(filteredUsers.value.map((u) => u.id));
  }
};

const toggleRole = (r: string) => {
  if (r === "ALL") {
    activeRoles.value = new Set();
    return;
  }
  const next = new Set(activeRoles.value);
  if (next.has(r)) {
    next.delete(r);
  } else {
    next.add(r);
  }
  activeRoles.value = next;
};

const clearFilters = () => {
  search.value = "";
  activeRoles.value = new Set();
};

const batchChangeRole = async (role: string) => {
  if (!role) return;
  const ids = [...selectedIds.value];
  let ok = 0;
  for (const id of ids) {
    try {
      await updateAdminUser(id, { role });
      const u = users.value.find((u) => u.id === id);
      if (u) u.role = role;
      ok++;
    } catch {
      // skip failed
    }
  }
  selectedIds.value = new Set();
  showToast(`Changed ${ok} of ${ids.length} users to ${role}`, ok < ids.length);
};

const batchDelete = async () => {
  const ids = [...selectedIds.value];
  if (!confirm(`Delete ${ids.length} selected users?`)) return;
  const idSet = new Set(ids);
  let ok = 0;
  for (const id of ids) {
    try {
      await deleteAdminUser(id);
      ok++;
    } catch {
      // skip failed
    }
  }
  users.value = users.value.filter((u) => !idSet.has(u.id));
  selectedIds.value = new Set();
  showToast(`Deleted ${ok} of ${ids.length} users`, ok < ids.length);
};

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toast.value = "";
  }, 3000);
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const load = async () => {
  loading.value = true;
  try {
    users.value = await fetchAdminUsers();
  } catch {
    showToast("Failed to load users", true);
  } finally {
    loading.value = false;
  }
};

const changeRole = async (user: AdminUser, role: string) => {
  try {
    await updateAdminUser(user.id, { role });
    user.role = role;
    showToast("Role updated");
  } catch {
    showToast("Could not update role", true);
    load();
  }
};

const remove = async (user: AdminUser) => {
  if (!confirm(`Delete ${user.email}?`)) return;
  try {
    await deleteAdminUser(user.id);
    users.value = users.value.filter((u) => u.id !== user.id);
    showToast("User deleted");
  } catch {
    showToast("Delete failed", true);
  }
};

onMounted(load);
</script>

<style scoped>
.col-check {
  width: 40px;
}

.col-check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--admin-accent);
  cursor: pointer;
}

.row-selected {
  background: var(--admin-accent-soft) !important;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--admin-accent-soft);
  color: var(--admin-accent);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.user-email {
  color: var(--admin-muted);
  font-size: 0.85rem;
}

.role-select {
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--admin-border);
  border-radius: 6px;
  background: var(--admin-surface);
  color: var(--admin-text);
}

.role-select:focus {
  outline: none;
  border-color: var(--admin-accent);
  box-shadow: 0 0 0 2px var(--admin-accent-soft);
}

.batch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--admin-border);
  background: var(--admin-table-head);
}

.batch-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-muted);
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.batch-role-select {
  font-size: 0.85rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-sm);
  background: var(--admin-surface);
  color: var(--admin-text);
}

.batch-role-select:focus {
  outline: none;
  border-color: var(--admin-accent);
  box-shadow: 0 0 0 2px var(--admin-accent-soft);
}

.admin-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
</style>
