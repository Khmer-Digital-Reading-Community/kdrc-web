<template>
  <section class="admin-page">
    <!-- <div class="admin-page-header">
      <div>
        <h2>Books</h2>
        <p>All manuscripts and published titles on the platform</p>
      </div>
    </div> -->

    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="search"
          type="search"
          placeholder="Search by title…"
          @keyup.enter="load(1)"
        />
      </div>
      <div class="admin-filter-pills">
        <button
          v-for="s in statusFilters"
          :key="s"
          type="button"
          class="admin-pill"
          :class="{ active: statusFilter === s }"
          @click="
            statusFilter = s;
            load(1);
          "
        >
          {{ s === "ALL" ? "All" : s }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">Loading books…</div>

    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>
                <strong>{{ book.title }}</strong>
              </td>
              <td>{{ book.author?.name || "—" }}</td>
              <td>
                <span class="admin-badge" :class="statusClass(book.status)">{{
                  book.status
                }}</span>
              </td>
              <td>{{ formatDate(book.updatedAt) }}</td>
              <td>
                <div class="row-actions">
                  <select
                    class="status-select"
                    :value="book.status"
                    @change="
                      onStatusChange(
                        book,
                        ($event.target as HTMLSelectElement).value,
                      )
                    "
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                    <option value="DISCONTINUED">DISCONTINUED</option>
                  </select>
                  <button
                    type="button"
                    class="admin-icon-btn danger"
                    title="Delete"
                    @click="remove(book)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!books.length" class="admin-empty">
          <BookOpen :size="40" />
          <p>No books found</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="admin-pagination">
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="page <= 1"
        @click="load(page - 1)"
      >
        Previous
      </button>
      <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="page >= totalPages"
        @click="load(page + 1)"
      >
        Next
      </button>
    </div>

    <p v-if="toast" class="admin-toast" :class="{ error: toastError }">
      {{ toast }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Search, Trash2, BookOpen } from "lucide-vue-next";
import {
  fetchAdminBooks,
  updateAdminBook,
  deleteAdminBook,
} from "../../services/adminApi";
import type { Book } from "../../services/bookApi";

const books = ref<Book[]>([]);
const loading = ref(true);
const search = ref("");
const statusFilter = ref("ALL");
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

const page = ref(1);
const total = ref(0);
const limit = getPageSizePreference();
const toast = ref("");
const toastError = ref(false);

const statusFilters = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED", "DISCONTINUED"];
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toast.value = "";
  }, 3000);
};

const statusClass = (s: string) => {
  if (s === "PUBLISHED") return "success";
  if (s === "DRAFT") return "warning";
  if (s === "ARCHIVED") return "neutral";
  return "danger";
};

const formatDate = (d: string) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const load = async (p = page.value) => {
  loading.value = true;
  page.value = p;
  try {
    const params: Record<string, unknown> = { page: p, limit };
    if (search.value.trim()) params.search = search.value.trim();
    if (statusFilter.value !== "ALL") params.status = statusFilter.value;
    const res = await fetchAdminBooks(params);
    books.value = res.data ?? [];
    total.value = res.total ?? 0;
  } catch {
    showToast("Failed to load books", true);
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const onStatusChange = async (book: Book, status: string) => {
  try {
    await updateAdminBook(book.id, { status: status as Book["status"] });
    book.status = status as Book["status"];
    showToast("Status updated");
  } catch {
    showToast("Could not update status", true);
    load(page.value);
  }
};

const remove = async (book: Book) => {
  if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
  try {
    await deleteAdminBook(book.id);
    showToast("Book deleted");
    load(page.value);
  } catch {
    showToast("Delete failed — you may need admin permissions", true);
  }
};

onMounted(() => load());
</script>

<style scoped>
.row-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
