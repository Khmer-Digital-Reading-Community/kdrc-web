<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>Comments Management</h2>
        <p>Review, moderate, and manage all user comments</p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search comments..."
          class="search-input"
          @keyup.enter="fetchComments"
        />
      </div>

      <div class="filter-buttons">
        <button 
          v-for="status in ['All', 'Pending', 'Approved', 'Rejected']" 
          :key="status"
          class="filter-btn"
          :class="{ active: selectedStatus === status }"
          @click="filterByStatus(status)"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Comments Table -->
    <div class="table-container">
      <table class="comments-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" class="checkbox" @change="selectAllComments" />
            </th>
            <th @click="sortBy('content')" class="sortable">Comment</th>
            <th @click="sortBy('user')" class="sortable">User</th>
            <th @click="sortBy('createdAt')" class="sortable">Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in filteredComments" :key="comment.id" class="comment-row">
            <td>
              <input 
                type="checkbox" 
                class="checkbox"
                v-model="selectedComments"
                :value="comment.id"
              />
            </td>
            <td class="comment-content">
              <div class="content-preview">
                <p class="comment-text">{{ truncateText(comment.content, 80) }}</p>
                <p v-if="comment.bookId" class="book-info">Book ID: {{ comment.bookId }}</p>
              </div>
            </td>
            <td class="user-name">
              <div class="user-info">
                <div class="user-avatar">{{ comment.user?.name?.charAt(0) ?? 'U' }}</div>
                <span>{{ comment.user?.name ?? 'Unknown' }}</span>
              </div>
            </td>
            <td>{{ formatDate(comment.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="comment.status.toLowerCase()">
                {{ comment.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  v-if="comment.status !== 'approved'"
                  class="action-btn approve"
                  title="Approve Comment"
                  @click="approveComment(comment)"
                >
                  <Check :size="18" />
                </button>
                <button 
                  v-if="comment.status !== 'rejected'"
                  class="action-btn reject"
                  title="Reject Comment"
                  @click="openRejectModal(comment)"
                >
                  <X :size="18" />
                </button>
                <button 
                  class="action-btn view"
                  title="View Details"
                  @click="openCommentDetail(comment)"
                >
                  <Eye :size="18" />
                </button>
                <button 
                  class="action-btn delete"
                  title="Delete Comment"
                  @click="deleteComment(comment)"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredComments.length === 0" class="empty-state">
        <Filter :size="48" class="empty-icon" />
        <p>No comments found</p>
        <small>Try adjusting your filters or search terms</small>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalComments > 0" class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--; fetchComments()"
      >
        ← Previous
      </button>

      <div class="page-numbers">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page; fetchComments()"
        >
          {{ page }}
        </button>
      </div>

      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++; fetchComments()"
      >
        Next →
      </button>

      <span class="total-info">Total: {{ totalComments }} comments</span>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedComments.length > 0" class="bulk-actions">
      <p>{{ selectedComments.length }} comment(s) selected</p>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="bulkApprove">Approve Selected</button>
        <button class="btn btn-secondary" @click="openBulkRejectModal">Reject Selected</button>
        <button class="btn btn-danger" @click="bulkDelete">Delete Selected</button>
      </div>
    </div>

    <!-- Comment Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Comment Details</h3>
          <button class="close-btn" @click="closeDetailModal">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedComment" class="comment-detail">
            <div class="detail-section">
              <label>Content:</label>
              <p>{{ selectedComment.content }}</p>
            </div>
            <div class="detail-row">
              <div class="detail-section">
                <label>User:</label>
                <p>{{ selectedComment.user?.name ?? 'Unknown' }} ({{ selectedComment.user?.email ?? 'N/A' }})</p>
              </div>
              <div class="detail-section">
                <label>Status:</label>
                <p>
                  <span class="status-badge" :class="selectedComment.status.toLowerCase()">
                    {{ selectedComment.status }}
                  </span>
                </p>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-section">
                <label>Created:</label>
                <p>{{ formatDate(selectedComment.createdAt) }}</p>
              </div>
              <div class="detail-section">
                <label>Book ID:</label>
                <p>{{ selectedComment.bookId ?? 'N/A' }}</p>
              </div>
            </div>
            <div v-if="selectedComment.moderatorNotes" class="detail-section">
              <label>Moderator Notes:</label>
              <p>{{ selectedComment.moderatorNotes }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetailModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="modal-overlay" @click="closeRejectModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Reject Comment</h3>
          <button class="close-btn" @click="closeRejectModal">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">Add moderator notes (optional):</p>
          <textarea 
            v-model="rejectNotes"
            class="textarea"
            placeholder="Explain why this comment was rejected..."
            rows="5"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeRejectModal">Cancel</button>
          <button class="btn btn-danger" @click="confirmReject">Reject</button>
        </div>
      </div>
    </div>

    <!-- Bulk Reject Modal -->
    <div v-if="showBulkRejectModal" class="modal-overlay" @click="closeBulkRejectModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Reject {{ selectedComments.length }} Comment(s)</h3>
          <button class="close-btn" @click="closeBulkRejectModal">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">Add moderator notes (optional):</p>
          <textarea 
            v-model="rejectNotes"
            class="textarea"
            placeholder="Explain why these comments were rejected..."
            rows="5"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeBulkRejectModal">Cancel</button>
          <button class="btn btn-danger" @click="confirmBulkReject">Reject All</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Filter, Eye, Check, X, Trash2 } from 'lucide-vue-next';
import api from '../../services/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Comment {
  id: string;
  content: string;
  bookId?: string;
  userId: string;
  user?: User;
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// State
const comments = ref<Comment[]>([]);
const selectedComments = ref<string[]>([]);
const selectedComment = ref<Comment | null>(null);
const searchQuery = ref('');
const selectedStatus = ref('All');
const currentPage = ref(1);
const pageSize = ref(10);
const totalComments = ref(0);
const sortColumn = ref('createdAt');
const sortDirection = ref<'ASC' | 'DESC'>('DESC');

// Modals
const showDetailModal = ref(false);
const showRejectModal = ref(false);
const showBulkRejectModal = ref(false);
const rejectNotes = ref('');
const commentToReject = ref<Comment | null>(null);

// Computed
const filteredComments = computed(() => {
  return comments.value;
});

const totalPages = computed(() => {
  return Math.ceil(totalComments.value / pageSize.value);
});

// Methods
const fetchComments = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value,
    };

    if (selectedStatus.value !== 'All') {
      params.status = selectedStatus.value.toLowerCase();
    }

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await api.get('/comments', { params });
    comments.value = response.data.data || [];
    totalComments.value = response.data.total || 0;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1;
  fetchComments();
};

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'DESC';
  }
  // Note: Backend sorting would need to be implemented in the API
};

const truncateText = (text: string, length: number = 80) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const selectAllComments = (event: any) => {
  if (event.target.checked) {
    selectedComments.value = comments.value.map(c => c.id);
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
  rejectNotes.value = '';
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
  commentToReject.value = null;
  rejectNotes.value = '';
};

const openBulkRejectModal = () => {
  rejectNotes.value = '';
  showBulkRejectModal.value = true;
};

const closeBulkRejectModal = () => {
  showBulkRejectModal.value = false;
  rejectNotes.value = '';
};

const approveComment = async (comment: Comment) => {
  try {
    await api.patch(`/comments/${comment.id}/approve`);
    await fetchComments();
  } catch (error) {
    console.error('Error approving comment:', error);
  }
};

const confirmReject = async () => {
  if (!commentToReject.value) return;

  try {
    await api.patch(`/comments/${commentToReject.value.id}/reject`, {
      moderatorNotes: rejectNotes.value,
    });
    await fetchComments();
    closeRejectModal();
  } catch (error) {
    console.error('Error rejecting comment:', error);
  }
};

const bulkApprove = async () => {
  try {
    for (const commentId of selectedComments.value) {
      await api.patch(`/comments/${commentId}/approve`);
    }
    selectedComments.value = [];
    await fetchComments();
  } catch (error) {
    console.error('Error approving comments:', error);
  }
};

const confirmBulkReject = async () => {
  try {
    for (const commentId of selectedComments.value) {
      await api.patch(`/comments/${commentId}/reject`, {
        moderatorNotes: rejectNotes.value,
      });
    }
    selectedComments.value = [];
    closeBulkRejectModal();
    await fetchComments();
  } catch (error) {
    console.error('Error rejecting comments:', error);
  }
};

const deleteComment = async (comment: Comment) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    try {
      await api.delete(`/comments/${comment.id}`);
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
};

const bulkDelete = async () => {
  if (confirm(`Are you sure you want to delete ${selectedComments.value.length} comment(s)?`)) {
    try {
      await api.delete('/comments', {
        data: { ids: selectedComments.value },
      });
      selectedComments.value = [];
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comments:', error);
    }
  }
};

// Load data on mount
onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #faf9f7;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e4e0;
}

.page-header h2 {
  font-size: 1.75rem;
  color: #1f2d20;
  margin: 0;
  font-weight: 700;
}

.page-header p {
  color: #6b7566;
  font-size: 0.95rem;
  margin: 4px 0 0 0;
}

.filters-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
}

.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #a8b39f;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d4d9d1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #86a65f;
  box-shadow: 0 0 0 2px rgba(134, 166, 95, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #d4d9d1;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7566;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #86a65f;
  color: #86a65f;
}

.filter-btn.active {
  background: #86a65f;
  color: white;
  border-color: #86a65f;
}

.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
  overflow: auto;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.comments-table thead {
  background: #f8f7f4;
  border-bottom: 2px solid #e0e4e0;
}

.comments-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #1f2d20;
  cursor: default;
  white-space: nowrap;
}

.comments-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.comments-table th.sortable:hover {
  background: #f0f2ee;
}

.comments-table td {
  padding: 16px;
  border-bottom: 1px solid #e0e4e0;
  color: #3d4a3e;
}

.comment-row:hover {
  background: #faf9f7;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #86a65f;
}

.comment-content {
  max-width: 400px;
}

.content-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-text {
  margin: 0;
  color: #3d4a3e;
  word-wrap: break-word;
  line-height: 1.4;
}

.book-info {
  margin: 0;
  font-size: 0.85rem;
  color: #a8b39f;
}

.user-name {
  min-width: 150px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #86a65f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fff4e6;
  color: #d97706;
}

.status-badge.approved {
  background: #e6f7eb;
  color: #10b981;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #d4d9d1;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6b7566;
}

.action-btn:hover {
  border-color: #86a65f;
  background: #f0f7e8;
  color: #86a65f;
}

.action-btn.approve {
  color: #10b981;
}

.action-btn.approve:hover {
  border-color: #10b981;
  background: #e6f7eb;
}

.action-btn.reject,
.action-btn.delete {
  color: #ef4444;
}

.action-btn.reject:hover,
.action-btn.delete:hover {
  border-color: #ef4444;
  background: #fee2e2;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #a8b39f;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 12px 0 8px 0;
  color: #6b7566;
}

.empty-state small {
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d4d9d1;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7566;
  transition: all 0.2s ease;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  border-color: #86a65f;
  color: #86a65f;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d4d9d1;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7566;
  transition: all 0.2s ease;
}

.page-btn.active {
  background: #86a65f;
  color: white;
  border-color: #86a65f;
}

.page-btn:not(.active):hover {
  border-color: #86a65f;
  color: #86a65f;
}

.total-info {
  font-size: 0.9rem;
  color: #a8b39f;
  margin-left: auto;
}

.bulk-actions {
  padding: 16px 24px;
  background: #f0f7e8;
  border: 1px solid #86a65f;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.bulk-actions p {
  margin: 0;
  font-weight: 600;
  color: #1f2d20;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: #86a65f;
  color: white;
}

.btn-primary:hover {
  background: #6d8a4a;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #d4d9d1;
}

.btn-secondary:hover {
  background: #e0e4e0;
}

.btn-danger {
  background: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.btn-danger:hover {
  background: #fecaca;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e4e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2d20;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #a8b39f;
  transition: color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #6b7566;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.comment-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-section label {
  font-weight: 600;
  color: #1f2d20;
  font-size: 0.95rem;
}

.detail-section p {
  margin: 0;
  color: #3d4a3e;
  line-height: 1.5;
  word-wrap: break-word;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-subtitle {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #1f2d20;
}

.textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d4d9d1;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: #86a65f;
  box-shadow: 0 0 0 2px rgba(134, 166, 95, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e4e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .admin-page {
    gap: 16px;
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-buttons {
    width: 100%;
  }

  .comments-table {
    font-size: 0.85rem;
  }

  .comments-table th,
  .comments-table td {
    padding: 12px;
  }

  .comment-content {
    max-width: 200px;
  }

  .actions {
    gap: 4px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .detail-row {
    grid-template-columns: 1fr;
  }

  .bulk-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>