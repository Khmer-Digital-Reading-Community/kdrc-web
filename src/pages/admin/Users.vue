<template>
  <section class="admin-page">
    <div class="admin-page-header">
      <div>
        <h2>Users</h2>
        <p>{{ users.length }} registered accounts</p>
      </div>
    </div>

    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input v-model="search" type="search" placeholder="Search name or email…" />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="r in roleFilters"
          :key="r"
          type="button"
          class="admin-pill"
          :class="{ active: roleFilter === r }"
          @click="roleFilter = r"
        >
          {{ r === 'ALL' ? 'All roles' : r }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading users…</div>

    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <div class="user-cell">
                  <span class="avatar">{{ (user.name || user.email).charAt(0).toUpperCase() }}</span>
                  {{ user.name || '—' }}
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <select
                  class="role-select"
                  :value="user.role"
                  @change="changeRole(user, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="READER">READER</option>
                  <option value="WRITER">WRITER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button type="button" class="admin-icon-btn danger" @click="remove(user)">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!filteredUsers.length" class="admin-empty">No users match your filters</div>
      </div>
    </div>

    <p v-if="toast" class="admin-toast" :class="{ error: toastError }">{{ toast }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Trash2 } from 'lucide-vue-next';
import {
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
} from '../../services/adminApi';

const users = ref<AdminUser[]>([]);
const loading = ref(true);
const search = ref('');
const roleFilter = ref('ALL');
const toast = ref('');
const toastError = ref(false);

const roleFilters = ['ALL', 'READER', 'WRITER', 'ADMIN'];

const filteredUsers = computed(() => {
  let list = users.value;
  if (roleFilter.value !== 'ALL') {
    list = list.filter((u) => u.role === roleFilter.value);
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

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => { toast.value = ''; }, 3000);
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const load = async () => {
  loading.value = true;
  try {
    users.value = await fetchAdminUsers();
  } catch {
    showToast('Failed to load users', true);
  } finally {
    loading.value = false;
  }
};

const changeRole = async (user: AdminUser, role: string) => {
  try {
    await updateAdminUser(user.id, { role });
    user.role = role;
    showToast('Role updated');
  } catch {
    showToast('Could not update role', true);
    load();
  }
};

const remove = async (user: AdminUser) => {
  if (!confirm(`Delete ${user.email}?`)) return;
  try {
    await deleteAdminUser(user.id);
    users.value = users.value.filter((u) => u.id !== user.id);
    showToast('User deleted');
  } catch {
    showToast('Delete failed', true);
  }
};

onMounted(load);
</script>

<style scoped>
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
}

.role-select {
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--admin-border);
  border-radius: 6px;
}
</style>
