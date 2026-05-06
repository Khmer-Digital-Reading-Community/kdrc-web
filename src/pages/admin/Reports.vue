<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>User Reports & Issues</h2>
        <p>Review and manage all user-reported issues and inappropriate content</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="exportReports">
          <Download :size="20" />
          Export
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by user, ID, or description..."
          class="search-input"
          @input="filteredReports"
        />
      </div>

      <div class="filter-buttons">
        <button 
          v-for="status in ['All', 'Pending', 'Under Review', 'Resolved']" 
          :key="status"
          class="filter-btn"
          :class="{ active: selectedStatus === status }"
          @click="filterByStatus(status)"
        >
          {{ status }}
        </button>
      </div>

      <div class="filter-type">
        <label for="report-type">Report Type:</label>
        <select v-model="selectedType" id="report-type" class="filter-select">
          <option value="all">All Types</option>
          <option value="inappropriate">Inappropriate Content</option>
          <option value="harassment">Harassment</option>
          <option value="spam">Spam</option>
          <option value="copyright">Copyright Violation</option>
          <option value="scam">Scam/Fraud</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- Reports Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <AlertCircle :size="24" class="stat-icon pending" />
        <div>
          <p class="stat-label">Pending</p>
          <p class="stat-value">{{ pendingCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <Clock :size="24" class="stat-icon review" />
        <div>
          <p class="stat-label">Under Review</p>
          <p class="stat-value">{{ reviewCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <CheckCircle :size="24" class="stat-icon resolved" />
        <div>
          <p class="stat-label">Resolved</p>
          <p class="stat-value">{{ resolvedCount }}</p>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="table-container">
      <table class="reports-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" class="checkbox" @change="selectAllReports" />
            </th>
            <th @click="sortBy('id')" class="sortable">Report ID</th>
            <th @click="sortBy('type')" class="sortable">Type</th>
            <th @click="sortBy('reportedUser')" class="sortable">Reported User</th>
            <th @click="sortBy('reporter')" class="sortable">Reported By</th>
            <th @click="sortBy('description')" class="sortable">Description</th>
            <th @click="sortBy('date')" class="sortable">Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in paginatedReports" :key="report.id" class="report-row">
            <td>
              <input 
                type="checkbox" 
                class="checkbox"
                v-model="selectedReports"
                :value="report.id"
              />
            </td>
            <td class="report-id">
              <span class="id-badge">{{ report.id }}</span>
            </td>
            <td>
              <span class="type-badge" :class="report.type.toLowerCase()">
                {{ formatType(report.type) }}
              </span>
            </td>
            <td class="user-info-cell">
              <div class="user-info">
                <div class="user-avatar">{{ report.reportedUser?.charAt(0) ?? 'U' }}</div>
                <span>{{ report.reportedUser }}</span>
              </div>
            </td>
            <td class="user-info-cell">
              <div class="user-info">
                <div class="user-avatar">{{ report.reporter?.charAt(0) ?? 'U' }}</div>
                <span>{{ report.reporter }}</span>
              </div>
            </td>
            <td class="description-cell">
              <p class="description-text" :title="report.description">
                {{ truncateText(report.description, 50) }}
              </p>
            </td>
            <td>{{ formatDate(report.date) }}</td>
            <td>
              <span class="status-badge" :class="report.status.toLowerCase()">
                {{ report.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  class="action-btn view"
                  title="View Details"
                  @click="openReportDetail(report)"
                >
                  <Eye :size="18" />
                </button>
                <button 
                  v-if="report.status !== 'resolved'"
                  class="action-btn resolve"
                  title="Mark as Resolved"
                  @click="markAsResolved(report)"
                >
                  <CheckCircle :size="18" />
                </button>
                <button 
                  class="action-btn delete"
                  title="Delete Report"
                  @click="deleteReport(report)"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredReportsList.length === 0" class="empty-state">
        <Filter :size="48" class="empty-icon" />
        <p>No reports found</p>
        <small>Try adjusting your filters or search terms</small>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredReportsList.length > 0" class="pagination">
      <button 
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ← Previous
      </button>

      <div class="page-numbers">
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>

      <button 
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next →
      </button>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedReports.length > 0" class="bulk-actions">
      <p>{{ selectedReports.length }} report(s) selected</p>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="bulkResolve">Mark as Resolved</button>
        <button class="btn btn-danger" @click="bulkDelete">Delete Selected</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Report Details</h3>
          <button class="close-btn" @click="showDetailModal = false">×</button>
        </div>
        <div v-if="selectedReport" class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Report ID:</label>
              <p>{{ selectedReport.id }}</p>
            </div>
            <div class="detail-item">
              <label>Report Type:</label>
              <p>
                <span class="type-badge" :class="selectedReport.type.toLowerCase()">
                  {{ formatType(selectedReport.type) }}
                </span>
              </p>
            </div>
            <div class="detail-item">
              <label>Reported User:</label>
              <p>{{ selectedReport.reportedUser }}</p>
            </div>
            <div class="detail-item">
              <label>Reported By:</label>
              <p>{{ selectedReport.reporter }}</p>
            </div>
            <div class="detail-item full-width">
              <label>Description:</label>
              <p>{{ selectedReport.description }}</p>
            </div>
            <div class="detail-item">
              <label>Date:</label>
              <p>{{ formatDate(selectedReport.date) }}</p>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <p>
                <span class="status-badge" :class="selectedReport.status.toLowerCase()">
                  {{ selectedReport.status }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDetailModal = false">Close</button>
          <button 
            v-if="selectedReport?.status !== 'resolved'"
            class="btn btn-primary" 
            @click="markAsResolved(selectedReport); showDetailModal = false"
          >
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertCircle, CheckCircle, Clock, Download, Eye, Filter, Search, Trash2 } from 'lucide-vue-next';

interface Report {
  id: string;
  type: string;
  reportedUser: string;
  reporter: string;
  description: string;
  date: Date;
  status: 'pending' | 'under review' | 'resolved';
}

const searchQuery = ref('');
const selectedStatus = ref('All');
const selectedType = ref('all');
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedReports = ref<string[]>([]);
const showDetailModal = ref(false);
const selectedReport = ref<Report | null>(null);

const reportTypes = {
  inappropriate: 'Inappropriate Content',
  harassment: 'Harassment',
  spam: 'Spam',
  copyright: 'Copyright Violation',
  scam: 'Scam/Fraud',
  other: 'Other',
};

// Mock data - replace with API call
const reports = ref<Report[]>([
  {
    id: 'RPT001',
    type: 'inappropriate',
    reportedUser: 'John_Doe',
    reporter: 'Jane_Smith',
    description: 'Offensive language and inappropriate content in book review',
    date: new Date('2024-04-28'),
    status: 'pending',
  },
  {
    id: 'RPT002',
    type: 'harassment',
    reportedUser: 'Alex_Johnson',
    reporter: 'Mike_Wilson',
    description: 'Harassing comments directed at other users',
    date: new Date('2024-04-27'),
    status: 'under review',
  },
  {
    id: 'RPT003',
    type: 'spam',
    reportedUser: 'Bot_User123',
    reporter: 'Sarah_Connor',
    description: 'Repetitive spam messages in comments section',
    date: new Date('2024-04-26'),
    status: 'resolved',
  },
  {
    id: 'RPT004',
    type: 'copyright',
    reportedUser: 'Creator_XYZ',
    reporter: 'Legal_Team',
    description: 'Uploading copyrighted book without permission',
    date: new Date('2024-04-25'),
    status: 'pending',
  },
  {
    id: 'RPT005',
    type: 'scam',
    reportedUser: 'Fraud_Account',
    reporter: 'Tom_Hardy',
    description: 'Suspicious book selling scheme detected',
    date: new Date('2024-04-24'),
    status: 'under review',
  },
  {
    id: 'RPT006',
    type: 'inappropriate',
    reportedUser: 'Profile_Admin',
    reporter: 'User_Report',
    description: 'Inappropriate profile picture',
    date: new Date('2024-04-23'),
    status: 'pending',
  },
  {
    id: 'RPT007',
    type: 'other',
    reportedUser: 'Mystery_User',
    reporter: 'Anonymous',
    description: 'General concern about platform abuse',
    date: new Date('2024-04-22'),
    status: 'resolved',
  },
]);

const filteredReportsList = computed(() => {
  return reports.value.filter((report) => {
    const matchesSearch = 
      searchQuery.value === '' ||
      report.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.reportedUser.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      selectedStatus.value === 'All' || report.status === selectedStatus.value.toLowerCase().replace(' ', ' ');

    const matchesType = selectedType.value === 'all' || report.type === selectedType.value;

    return matchesSearch && matchesStatus && matchesType;
  });
});

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReportsList.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredReportsList.value.length / itemsPerPage));

const pendingCount = computed(() => reports.value.filter((r) => r.status === 'pending').length);
const reviewCount = computed(() => reports.value.filter((r) => r.status === 'under review').length);
const resolvedCount = computed(() => reports.value.filter((r) => r.status === 'resolved').length);

const formatType = (type: string): string => {
  return reportTypes[type as keyof typeof reportTypes] || type;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const filterByStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1;
};

const filteredReports = () => {
  currentPage.value = 1;
};

const sortBy = (field: string) => {
  reports.value.sort((a, b) => {
    const aVal = a[field as keyof Report];
    const bVal = b[field as keyof Report];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal as string);
    }
    return 0;
  });
};

const selectAllReports = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedReports.value = paginatedReports.value.map((r) => r.id);
  } else {
    selectedReports.value = [];
  }
};

const openReportDetail = (report: Report) => {
  selectedReport.value = report;
  showDetailModal.value = true;
};

const markAsResolved = (report: Report) => {
  const idx = reports.value.findIndex((r) => r.id === report.id);
  if (idx !== -1) {
    reports.value[idx].status = 'resolved';
  }
};

const deleteReport = (report: Report) => {
  if (confirm('Are you sure you want to delete this report?')) {
    reports.value = reports.value.filter((r) => r.id !== report.id);
  }
};

const bulkResolve = () => {
  selectedReports.value.forEach((id) => {
    const idx = reports.value.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reports.value[idx].status = 'resolved';
    }
  });
  selectedReports.value = [];
};

const bulkDelete = () => {
  if (confirm(`Delete ${selectedReports.value.length} report(s)?`)) {
    reports.value = reports.value.filter((r) => !selectedReports.value.includes(r.id));
    selectedReports.value = [];
  }
};

const exportReports = () => {
  const csv = [
    ['Report ID', 'Type', 'Reported User', 'Reporter', 'Description', 'Date', 'Status'],
    ...filteredReportsList.value.map((r) => [
      r.id,
      formatType(r.type),
      r.reportedUser,
      r.reporter,
      r.description,
      formatDate(r.date),
      r.status,
    ]),
  ]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h2 {
  font-size: 1.875rem;
  color: #1f2d20;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #5a6b5a;
  margin: 0;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #7cb342;
  color: white;
}

.btn-primary:hover {
  background: #689f38;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #e0e4e0;
}

.btn-secondary:hover {
  background: #e8ebe6;
}

.btn-danger {
  background: #ef5350;
  color: white;
}

.btn-danger:hover {
  background: #e53935;
}

/* Filters Section */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  color: #999;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 14px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #7cb342;
  color: white;
  border-color: #7cb342;
}

.filter-btn:hover {
  border-color: #7cb342;
}

.filter-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-type label {
  font-weight: 600;
  color: #1f2d20;
}

.filter-select {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-icon.pending {
  color: #ff9800;
}

.stat-icon.review {
  color: #2196f3;
}

.stat-icon.resolved {
  color: #4caf50;
}

.stat-label {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.stat-value {
  margin: 4px 0 0 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2d20;
}

/* Table Section */
.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
  overflow-x: auto;
  min-height: 300px;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.reports-table thead {
  background: #f5f7f5;
  border-bottom: 2px solid #e0e4e0;
}

.reports-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #1f2d20;
  user-select: none;
}

.reports-table th.sortable {
  cursor: pointer;
}

.reports-table th.sortable:hover {
  background: #eff1f0;
}

.reports-table tbody tr {
  border-bottom: 1px solid #e0e4e0;
  transition: background 0.2s ease;
}

.reports-table tbody tr:hover {
  background: #fafbfa;
}

.reports-table td {
  padding: 12px;
}

.checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.report-id {
  font-weight: 600;
}

.id-badge {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.type-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.type-badge.inappropriate {
  background: #ffebee;
  color: #c62828;
}

.type-badge.harassment {
  background: #fce4ec;
  color: #ad1457;
}

.type-badge.spam {
  background: #fff3e0;
  color: #e65100;
}

.type-badge.copyright {
  background: #e3f2fd;
  color: #1565c0;
}

.type-badge.scam {
  background: #f3e5f5;
  color: #6a1b9a;
}

.type-badge.other {
  background: #f5f5f5;
  color: #424242;
}

.user-info-cell {
  font-size: 0.85rem;
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
  background: #7cb342;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.description-cell {
  max-width: 300px;
}

.description-text {
  margin: 0;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.under {
  background: #cfe2ff;
  color: #084298;
}

.status-badge.resolved {
  background: #d1e7dd;
  color: #0f5132;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-btn.view {
  background: #2196f3;
}

.action-btn.view:hover {
  background: #1976d2;
}

.action-btn.resolve {
  background: #4caf50;
}

.action-btn.resolve:hover {
  background: #388e3c;
}

.action-btn.delete {
  background: #ef5350;
}

.action-btn.delete:hover {
  background: #e53935;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.empty-state small {
  color: #bbb;
  margin-top: 8px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 14px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  border-color: #7cb342;
  color: #7cb342;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.page-btn.active {
  background: #7cb342;
  color: white;
  border-color: #7cb342;
}

.page-btn:hover:not(.active) {
  border-color: #7cb342;
}

/* Bulk Actions */
.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f7f5;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.bulk-actions p {
  margin: 0;
  color: #1f2d20;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* Modal */
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
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e4e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2d20;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #1f2d20;
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #1f2d20;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.detail-item p {
  margin: 0;
  color: #666;
  word-break: break-word;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e4e0;
}

.modal-footer .btn {
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: unset;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }

  .reports-table {
    font-size: 0.8rem;
  }

  .reports-table th,
  .reports-table td {
    padding: 8px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>