<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>User Management</h2>
        <p>View and manage all user accounts and their activity</p>
      </div>
      <button class="btn btn-primary" @click="showAddUserModal = true">
         Add User
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by name or email..."
          class="search-input"
        />
      </div>

      <div class="filter-buttons">
        <button 
          v-for="status in ['All', 'Active', 'Inactive']" 
          :key="status"
          class="filter-btn"
          :class="{ active: selectedStatus === status }"
          @click="selectedStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" class="checkbox" @change="selectAllUsers" />
            </th>
            <th @click="sortBy('name')" class="sortable">Name</th>
            <th @click="sortBy('email')" class="sortable">Email</th>
            <th @click="sortBy('role')" class="sortable">Role</th>
            <th @click="sortBy('joinDate')" class="sortable">Join Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td>
              <input 
                type="checkbox" 
                class="checkbox"
                v-model="selectedUsers"
                :value="user.id"
              />
            </td>
            <td class="user-name">
              <div class="user-info">
                <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                <span>{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.joinDate) }}</td>
            <td>
              <span class="status-badge" :class="user.status.toLowerCase()">
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  class="action-btn edit"
                  title="Edit User"
                  @click="editUser(user)"
                >
                  <img src="@/assets/images/edit.svg" alt="Edit" class="icon" />
                </button>
                <button 
                  class="action-btn delete"
                  title="Delete User"
                  @click="deleteUser(user)"
                >
                  <img src="@/assets/images/delete.svg" alt="Delete" class="icon" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>No users found</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
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
    <div v-if="selectedUsers.length > 0" class="bulk-actions">
      <p>{{ selectedUsers.length }} user(s) selected</p>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="bulkActivate">Activate</button>
        <button class="btn btn-secondary" @click="bulkDeactivate">Deactivate</button>
        <button class="btn btn-danger" @click="bulkDelete">Delete Selected</button>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-backdrop" @click="showEditUserModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Edit User</h3>
          <button class="close-btn" @click="showEditUserModal = false">✕</button>
        </div>

        <div class="modal-content">
          <form @submit.prevent="updateUser">
            <div class="form-group">
              <label for="edit-name">Full Name</label>
              <input 
                id="edit-name"
                v-model="editUserForm.name" 
                type="text" 
                placeholder="Enter full name"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-email">Email Address</label>
              <input 
                id="edit-email"
                v-model="editUserForm.email" 
                type="email" 
                placeholder="Enter email address"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-role">Role</label>
              <select id="edit-role" v-model="editUserForm.role" required>
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            <div class="form-group">
              <label for="edit-status">Status</label>
              <select id="edit-status" v-model="editUserForm.status" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditUserModal = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="modal-backdrop" @click="showAddUserModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Add New User</h3>
          <button class="close-btn" @click="showAddUserModal = false">✕</button>
        </div>

        <div class="modal-content">
          <form @submit.prevent="addNewUser">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                id="name"
                v-model="newUserForm.name" 
                type="text" 
                placeholder="Enter full name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                id="email"
                v-model="newUserForm.email" 
                type="email" 
                placeholder="Enter email address"
                required
              />
            </div>

            <div class="form-group">
              <label for="role">Role</label>
              <select id="role" v-model="newUserForm.role" required>
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="newUserForm.password" 
                type="password" 
                placeholder="Enter password"
                required
              />
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="newUserForm.status" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddUserModal = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: string;
}

// Sample user data
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joinDate: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', joinDate: '2024-02-20', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Moderator', joinDate: '2024-03-10', status: 'Active' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'User', joinDate: '2024-01-05', status: 'Inactive' },
  { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'User', joinDate: '2024-04-12', status: 'Active' },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'User', joinDate: '2024-02-28', status: 'Active' },
  { id: 7, name: 'David Wilson', email: 'david@example.com', role: 'User', joinDate: '2024-03-15', status: 'Inactive' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'User', joinDate: '2024-04-01', status: 'Active' },
]);

const searchQuery = ref('');
const selectedStatus = ref('All');
const selectedUsers = ref<number[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const sortField = ref('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const editingUserId = ref<number | null>(null);

// New user form data
const newUserForm = ref({
  name: '',
  email: '',
  role: '',
  password: '',
  status: 'Active',
});

// Edit user form data
const editUserForm = ref({
  name: '',
  email: '',
  role: '',
  status: 'Active',
});

const filteredUsers = computed(() => {
  let filtered = users.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(user => user.status === selectedStatus.value);
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField.value as keyof User];
    const bVal = b[sortField.value as keyof User];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  // Paginate
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  let total = users.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    total = total.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  if (selectedStatus.value !== 'All') {
    total = total.filter(user => user.status === selectedStatus.value);
  }
  return Math.ceil(total.length / itemsPerPage.value);
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const selectAllUsers = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedUsers.value = filteredUsers.value.map(u => u.id);
  } else {
    selectedUsers.value = [];
  }
};

const viewUser = (user: User) => {
  console.log('View user:', user);
};

const editUser = (user: User) => {
  editingUserId.value = user.id;
  editUserForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  showEditUserModal.value = true;
};

const updateUser = () => {
  if (!editingUserId.value) return;

  // Find the user being edited
  const userIndex = users.value.findIndex(u => u.id === editingUserId.value);
  if (userIndex === -1) return;

  const currentUser = users.value[userIndex];

  // Check if email already exists (but allow current user's email)
  if (editUserForm.value.email !== currentUser.email) {
    if (users.value.some(u => u.email === editUserForm.value.email)) {
      alert('Email already exists!');
      return;
    }
  }

  // Update user
  users.value[userIndex] = {
    ...currentUser,
    name: editUserForm.value.name,
    email: editUserForm.value.email,
    role: editUserForm.value.role,
    status: editUserForm.value.status,
  };

  // Reset form and close modal
  editUserForm.value = {
    name: '',
    email: '',
    role: '',
    status: 'Active',
  };
  editingUserId.value = null;
  showEditUserModal.value = false;

  // Show success message
  alert(`User ${users.value[userIndex].name} has been updated successfully!`);
};

const deleteUser = (user: User) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    users.value = users.value.filter(u => u.id !== user.id);
  }
};

const bulkActivate = () => {
  users.value.forEach(user => {
    if (selectedUsers.value.includes(user.id)) {
      user.status = 'Active';
    }
  });
  selectedUsers.value = [];
};

const bulkDeactivate = () => {
  users.value.forEach(user => {
    if (selectedUsers.value.includes(user.id)) {
      user.status = 'Inactive';
    }
  });
  selectedUsers.value = [];
};

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedUsers.value.length} user(s)?`)) {
    users.value = users.value.filter(u => !selectedUsers.value.includes(u.id));
    selectedUsers.value = [];
  }
};

const addNewUser = () => {
  // Check if email already exists
  if (users.value.some(u => u.email === newUserForm.value.email)) {
    alert('Email already exists!');
    return;
  }

  // Create new user with current date
  const newUser: User = {
    id: Math.max(...users.value.map(u => u.id), 0) + 1,
    name: newUserForm.value.name,
    email: newUserForm.value.email,
    role: newUserForm.value.role,
    joinDate: new Date().toISOString().split('T')[0],
    status: newUserForm.value.status,
  };

  // Add to users list
  users.value.push(newUser);

  // Reset form and close modal
  newUserForm.value = {
    name: '',
    email: '',
    role: '',
    password: '',
    status: 'Active',
  };
  showAddUserModal.value = false;

  // Show success message
  alert(`User ${newUser.name} has been added successfully!`);
};
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 4px;
}

.page-header p {
  color: #8a9f8f;
  margin: 0;
  font-size: 0.95rem;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: #1f2d20;
  color: white;
}

.btn-primary:hover {
  background: #162310;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #e0e4e0;
}

.btn-secondary:hover {
  background: #e0e4e0;
}

.btn-danger {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.btn-danger:hover {
  background: rgba(231, 76, 60, 0.2);
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  padding: 10px 16px;
  gap: 8px;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  font-size: 1rem;
  color: #8a9f8f;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: #1f2d20;
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: #a8b3aa;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  color: #5a675f;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #1f2d20;
  color: #1f2d20;
}

.filter-btn.active {
  background: #1f2d20;
  color: white;
  border-color: #1f2d20;
}

/* Table Container */
.table-container {
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f8f9f7;
  border-bottom: 1px solid #e0e4e0;
}

.users-table th {
  padding: 16px;
  text-align: left;
  color: #5a675f;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  user-select: none;
}

.users-table th.sortable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.users-table th.sortable:hover {
  color: #1f2d20;
}

.users-table td {
  padding: 16px;
  border-top: 1px solid #f0f2ee;
  color: #1f2d20;
}

.user-row:hover {
  background: #f8f9f7;
}

.user-name {
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Badges */
.status-badge,
.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.status-badge.inactive {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.role-badge.admin {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.role-badge.moderator {
  background: rgba(241, 196, 15, 0.1);
  color: #f39c12;
}

.role-badge.user {
  background: rgba(149, 165, 166, 0.1);
  color: #7f8c8d;
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f0f2ee;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.action-btn:hover {
  background: #e0e4e0;
}

.action-btn.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}

.action-btn .icon {
  width: 18px;
  height: 18px;
  color: #1f2d20;
  stroke: #1f2d20;
}

.action-btn.delete .icon {
  stroke: #e74c3c;
}

.action-btn.delete:hover .icon {
  stroke: #c0392b;
}

/* Checkbox */
.checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #1f2d20;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.pagination-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 6px;
  color: #1f2d20;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9f7;
  border-color: #1f2d20;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e4e0;
  border-radius: 6px;
  background: #ffffff;
  color: #1f2d20;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.page-btn:hover {
  border-color: #1f2d20;
}

.page-btn.active {
  background: #1f2d20;
  color: white;
  border-color: #1f2d20;
}

/* Empty State */
.empty-state {
  padding: 48px 16px;
  text-align: center;
  color: #8a9f8f;
}

/* Bulk Actions */
.bulk-actions {
  position: fixed;
  bottom: 32px;
  left: 260px;
  right: 32px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(31, 45, 32, 0.08);
  z-index: 20;
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

/* Responsive */
@media (max-width: 1024px) {
  .users-table {
    font-size: 0.9rem;
  }

  .users-table th,
  .users-table td {
    padding: 12px;
  }

  .bulk-actions {
    left: 16px;
    right: 16px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: auto;
  }

  .users-table {
    font-size: 0.85rem;
  }

  .users-table th,
  .users-table td {
    padding: 8px;
  }

  .user-info span {
    display: none;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .bulk-actions {
    left: 0;
    right: 0;
    border-radius: 0;
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Modal Styles */
.modal-backdrop {
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

.modal {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(31, 45, 32, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e4e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2d20;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #8a9f8f;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #1f2d20;
}

.modal-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1f2d20;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1f2d20;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1f2d20;
}

.form-group input::placeholder {
  color: #a8b3aa;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 0 0;
  border-top: 1px solid #e0e4e0;
  margin-top: 24px;
}

.modal-footer .btn {
  flex: 0;
}
</style>