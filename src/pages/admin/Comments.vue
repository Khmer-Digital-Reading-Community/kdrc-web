<template>
  <section class="admin-page">
    <!-- Page Header -->
    <!-- <div class="admin-page-header">
      <div>
        <h2>Comments Management</h2>
        <p>Review, moderate, and manage all user comments</p>
      </div>
    </div> -->

    <!-- Filters and Search -->
    <div class="admin-toolbar">
      <div class="admin-search">
        <Search :size="18" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search comments..."
          @keyup.enter="fetchComments"
        />
      </div>

      <div class="admin-filter-pills">
        <button
          v-for="status in ['All', 'Pending', 'Approved', 'Rejected']"
          :key="status"
          type="button"
          class="admin-pill"
          :class="{ active: selectedStatus === status }"
          @click="filterByStatus(status)"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="admin-loading">
      <div
        style="
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 3px border-t-transparent border-emerald-600 rounded-full
            animate-spin;
          margin-bottom: 0.5rem;
        "
      ></div>
      <p>Loading comments...</p>
    </div>

    <!-- Comments Table Card -->
    <div v-else class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 40px">
                <input
                  type="checkbox"
                  class="checkbox"
                  @change="selectAllComments"
                />
              </th>
              <th>Comment</th>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in filteredComments" :key="comment.id">
              <td>
                <input
                  type="checkbox"
                  class="checkbox"
                  v-model="selectedComments"
                  :value="comment.id"
                />
              </td>
              <td>
                <div class="comment-preview">
                  <p class="comment-text">
                    {{ truncateText(comment.content, 100) }}
                  </p>
                  <small class="book-info">
                    <span v-if="comment.chapter">
                      Chapter {{ comment.chapter.chapterNumber }}:
                      <strong>{{ comment.chapter.title }}</strong>
                    </span>
                    <span v-else-if="comment.chapterId">
                      Chapter ID:
                      <code class="code-id">{{ comment.chapterId }}</code>
                    </span>
                    <span v-else>
                      Chapter ID:
                      <code class="code-id">{{ comment.bookId }}</code>
                    </span>
                    <span v-if="comment.pageNumber">
                      (Page {{ comment.pageNumber }})</span
                    >
                  </small>
                </div>
              </td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ comment.user?.name?.charAt(0).toUpperCase() ?? "U" }}
                  </div>
                  <div class="user-meta">
                    <span class="user-name">{{
                      comment.user?.name ?? "Unknown"
                    }}</span>
                    <span class="user-email">{{
                      comment.user?.email ?? "N/A"
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="date-col">{{ formatDate(comment.createdAt) }}</td>
              <td>
                <span class="admin-badge" :class="statusClass(comment.status)">
                  {{ comment.status }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button
                    v-if="comment.status !== 'approved'"
                    class="admin-icon-btn approve-btn"
                    title="Approve Comment"
                    @click="approveComment(comment)"
                  >
                    <Check :size="16" />
                  </button>
                  <button
                    v-if="comment.status !== 'rejected'"
                    class="admin-icon-btn reject-btn"
                    title="Reject Comment"
                    @click="openRejectModal(comment)"
                  >
                    <X :size="16" />
                  </button>
                  <button
                    class="admin-icon-btn view-btn"
                    title="View Details"
                    @click="openCommentDetail(comment)"
                  >
                    <Eye :size="16" />
                  </button>
                  <button
                    class="admin-icon-btn danger"
                    title="Delete Comment"
                    @click="deleteComment(comment)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredComments.length === 0" class="admin-empty">
          <MessageSquare :size="40" />
          <p>No comments found</p>
          <small>Try adjusting your status filter or search query</small>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalComments > 0" class="admin-pagination">
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="currentPage === 1"
        @click="
          currentPage--;
          fetchComments();
        "
      >
        ← Previous
      </button>

      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        :disabled="currentPage === totalPages"
        @click="
          currentPage++;
          fetchComments();
        "
      >
        Next →
      </button>

      <span class="total-info">Total: {{ totalComments }} comments</span>
    </div>

    <!-- Bulk Actions Card -->
    <div
      v-if="selectedComments.length > 0"
      class="bulk-actions-card animate-slide-up"
    >
      <p>{{ selectedComments.length }} comment(s) selected</p>
      <div class="action-buttons">
        <button class="admin-btn admin-btn-primary" @click="bulkApprove">
          Approve Selected
        </button>
        <button
          class="admin-btn admin-btn-secondary"
          @click="openBulkRejectModal"
        >
          Reject Selected
        </button>
        <button class="admin-btn admin-btn-danger" @click="bulkDelete">
          Delete Selected
        </button>
      </div>
    </div>

    <!-- Comment Detail Modal -->
    <div
      v-if="showDetailModal"
      class="admin-modal-backdrop"
      @click="closeDetailModal"
    >
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3>Comment Details</h3>
          <button class="admin-icon-btn" @click="closeDetailModal">
            <X :size="18" />
          </button>
        </div>
        <div class="admin-modal-body">
          <div v-if="selectedComment" class="comment-detail">
            <div class="admin-form-group">
              <label>Content</label>
              <textarea readonly class="modal-textarea" rows="4">{{
                selectedComment.content
              }}</textarea>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>User</label>
                <input
                  readonly
                  type="text"
                  :value="`${selectedComment.user?.name ?? 'Unknown'} (${selectedComment.user?.email ?? 'N/A'})`"
                />
              </div>
              <div class="admin-form-group">
                <label>Status</label>
                <div style="margin-top: 6px">
                  <span
                    class="admin-badge"
                    :class="statusClass(selectedComment.status)"
                  >
                    {{ selectedComment.status }}
                  </span>
                </div>
              </div>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Created At</label>
                <input
                  readonly
                  type="text"
                  :value="formatDate(selectedComment.createdAt)"
                />
              </div>
              <div class="admin-form-group">
                <label>Chapter</label>
                <input
                  readonly
                  type="text"
                  :value="
                    selectedComment.chapter
                      ? `Chapter ${selectedComment.chapter.chapterNumber}: ${selectedComment.chapter.title}`
                      : selectedComment.chapterId ||
                        selectedComment.bookId ||
                        'N/A'
                  "
                />
              </div>
            </div>

            <div v-if="selectedComment.moderatorNotes" class="admin-form-group">
              <label>Moderator Notes</label>
              <textarea readonly class="modal-textarea" rows="2">{{
                selectedComment.moderatorNotes
              }}</textarea>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button
            class="admin-btn admin-btn-secondary"
            @click="closeDetailModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="admin-modal-backdrop"
      @click="closeRejectModal"
    >
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3>Reject Comment</h3>
          <button class="admin-icon-btn" @click="closeRejectModal">
            <X :size="18" />
          </button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form-group">
            <label>Explain why this comment is rejected (optional)</label>
            <textarea
              v-model="rejectNotes"
              placeholder="Provide context for the rejection..."
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button
            class="admin-btn admin-btn-secondary"
            @click="closeRejectModal"
          >
            Cancel
          </button>
          <button class="admin-btn admin-btn-danger" @click="confirmReject">
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Reject Modal -->
    <div
      v-if="showBulkRejectModal"
      class="admin-modal-backdrop"
      @click="closeBulkRejectModal"
    >
      <div class="admin-modal" @click.stop>
        <div class="admin-modal-header">
          <h3>Reject {{ selectedComments.length }} Comment(s)</h3>
          <button class="admin-icon-btn" @click="closeBulkRejectModal">
            <X :size="18" />
          </button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form-group">
            <label>Explain why these comments are rejected (optional)</label>
            <textarea
              v-model="rejectNotes"
              placeholder="Provide context for the rejection..."
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button
            class="admin-btn admin-btn-secondary"
            @click="closeBulkRejectModal"
          >
            Cancel
          </button>
          <button class="admin-btn admin-btn-danger" @click="confirmBulkReject">
            Reject All
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
import { Search, MessageSquare, Eye, Check, X, Trash2 } from "lucide-vue-next";
import api from "../../services/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Comment {
  id: string;
  content: string;
  bookId?: string;
  chapterId?: string;
  chapter?: {
    id: string;
    title: string;
    chapterNumber: number;
  };
  pageNumber?: number;
  userId: string;
  user?: User;
  likes: number;
  status: "pending" | "approved" | "rejected";
  moderatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// State
const comments = ref<Comment[]>([]);
const selectedComments = ref<string[]>([]);
const selectedComment = ref<Comment | null>(null);
const searchQuery = ref("");
const selectedStatus = ref("All");
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
const totalComments = ref(0);
const loading = ref(false);

const toast = ref("");
const toastError = ref(false);

// Modals
const showDetailModal = ref(false);
const showRejectModal = ref(false);
const showBulkRejectModal = ref(false);
const rejectNotes = ref("");
const commentToReject = ref<Comment | null>(null);

// Computed
const filteredComments = computed(() => {
  return comments.value;
});

const totalPages = computed(() => {
  return Math.ceil(totalComments.value / pageSize.value);
});

// Toast notification
const showToast = (msg: string, err = false) => {
  toast.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toast.value = "";
  }, 3000);
};

// Methods
const fetchComments = async () => {
  try {
    loading.value = true;
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (selectedStatus.value !== "All") {
      params.status = selectedStatus.value.toLowerCase();
    }

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await api.get("/comments", { params });
    const payload = response.data as { data?: Comment[]; total?: number };
    comments.value = payload.data ?? [];
    totalComments.value = payload.total ?? 0;
  } catch (error) {
    console.error("Error fetching comments:", error);
    showToast("Failed to fetch comments", true);
  } finally {
    loading.value = false;
  }
};

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1;
  fetchComments();
};

const statusClass = (status: string) => {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  return "danger";
};

const truncateText = (text: string, length: number = 80) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const selectAllComments = (event: any) => {
  if (event.target.checked) {
    selectedComments.value = comments.value.map((c) => c.id);
  } else {
    selectedComments.value = [];
  }
};

const openCommentDetail = (comment: Comment) => {
  selectedComment.value = comment;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedComment.value = null;
};

const openRejectModal = (comment: Comment) => {
  commentToReject.value = comment;
  rejectNotes.value = "";
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  commentToReject.value = null;
  rejectNotes.value = "";
};

const openBulkRejectModal = () => {
  rejectNotes.value = "";
  showBulkRejectModal.value = true;
};

const closeBulkRejectModal = () => {
  showBulkRejectModal.value = false;
  rejectNotes.value = "";
};

const approveComment = async (comment: Comment) => {
  try {
    await api.patch(`/comments/${comment.id}/approve`);
    showToast("Comment approved successfully");
    await fetchComments();
  } catch (error) {
    console.error("Error approving comment:", error);
    showToast("Failed to approve comment", true);
  }
};

const confirmReject = async () => {
  if (!commentToReject.value) return;

  try {
    await api.patch(`/comments/${commentToReject.value.id}/reject`, {
      moderatorNotes: rejectNotes.value,
    });
    showToast("Comment rejected");
    await fetchComments();
    closeRejectModal();
  } catch (error) {
    console.error("Error rejecting comment:", error);
    showToast("Failed to reject comment", true);
  }
};

const bulkApprove = async () => {
  try {
    for (const commentId of selectedComments.value) {
      await api.patch(`/comments/${commentId}/approve`);
    }
    showToast("Selected comments approved");
    selectedComments.value = [];
    await fetchComments();
  } catch (error) {
    console.error("Error approving comments:", error);
    showToast("Bulk approval failed", true);
  }
};

const confirmBulkReject = async () => {
  try {
    for (const commentId of selectedComments.value) {
      await api.patch(`/comments/${commentId}/reject`, {
        moderatorNotes: rejectNotes.value,
      });
    }
    showToast("Selected comments rejected");
    selectedComments.value = [];
    closeBulkRejectModal();
    await fetchComments();
  } catch (error) {
    console.error("Error rejecting comments:", error);
    showToast("Bulk rejection failed", true);
  }
};

const deleteComment = async (comment: Comment) => {
  if (confirm("Are you sure you want to delete this comment?")) {
    try {
      await api.delete(`/comments/${comment.id}/admin`);
      showToast("Comment deleted");
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", true);
    }
  }
};

const bulkDelete = async () => {
  if (
    confirm(
      `Are you sure you want to delete ${selectedComments.value.length} comment(s)?`,
    )
  ) {
    try {
      await api.delete("/comments", {
        data: { ids: selectedComments.value },
      });
      showToast("Selected comments deleted");
      selectedComments.value = [];
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comments:", error);
      showToast("Bulk deletion failed", true);
    }
  }
};

// Load data on mount
onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--admin-accent);
}

.comment-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-text {
  margin: 0;
  color: var(--admin-text);
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.book-info {
  font-size: 0.75rem;
  color: var(--admin-muted);
}

.code-id {
  font-family: monospace;
  font-size: 0.75rem;
  background: var(--admin-bg);
  padding: 2px 4px;
  border-radius: 4px;
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
}

.actions {
  display: flex;
  gap: 6px;
}

.approve-btn {
  color: var(--admin-badge-success-text);
  background: var(--admin-badge-success-bg);
}

.approve-btn:hover {
  filter: brightness(0.95);
}

.reject-btn {
  color: var(--admin-danger);
  background: var(--admin-btn-danger-bg);
}

.reject-btn:hover {
  filter: brightness(0.95);
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

.comment-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}

.modal-textarea:focus {
  outline: none;
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
