<template>
  <section class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2>Books Management</h2>
        <p>View and manage all books in your collection</p>
      </div>
      <button class="btn btn-primary" @click="showAddBookModal = true">
        <Plus :size="20" />
        Add Book
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by title, author or ISBN..."
          class="search-input"
        />
      </div>

      <div class="filter-buttons">
        <button 
          v-for="status in ['All', 'Available', 'Borrowed', 'Discontinued']" 
          :key="status"
          class="filter-btn"
          :class="{ active: selectedStatus === status }"
          @click="selectedStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Books Table -->
    <div class="table-container">
      <table class="books-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" class="checkbox" @change="selectAllBooks" />
            </th>
            <th @click="sortBy('title')" class="sortable">Title</th>
            <th @click="sortBy('author')" class="sortable">Author</th>
            <th @click="sortBy('isbn')" class="sortable">ISBN</th>
            <th @click="sortBy('category')" class="sortable">Category</th>
            <th @click="sortBy('year')" class="sortable">Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id" class="book-row">
            <td>
              <input 
                type="checkbox" 
                class="checkbox"
                v-model="selectedBooks"
                :value="book.id"
              />
            </td>
            <td class="book-title">
              <strong>{{ book.title }}</strong>
            </td>
            <td>{{ book.author }}</td>
            <td class="isbn">{{ book.isbn }}</td>
            <td>{{ book.category }}</td>
            <td>{{ book.year }}</td>
            <td>
              <span class="status-badge" :class="book.status.toLowerCase()">
                {{ book.status }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  class="action-btn edit"
                  title="Edit Book"
                  @click="editBook(book)"
                >
                  <Pencil :size="18" />
                </button>
                <button 
                  class="action-btn delete"
                  title="Delete Book"
                  @click="deleteBook(book)"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredBooks.length === 0" class="empty-state">
        <BookOpen :size="48" />
        <p>No books found</p>
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
    <div v-if="selectedBooks.length > 0" class="bulk-actions">
      <p>{{ selectedBooks.length }} book(s) selected</p>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="bulkMarkAvailable">Mark Available</button>
        <button class="btn btn-secondary" @click="bulkMarkBorrowed">Mark Borrowed</button>
        <button class="btn btn-danger" @click="bulkDelete">Delete Selected</button>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div v-if="showEditBookModal" class="modal-backdrop" @click="showEditBookModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Edit Book</h3><X :size="24" />
          <button class="close-btn" @click="showEditBookModal = false">✕</button>
        </div>

        <div class="modal-content">
          <form @submit.prevent="updateBook">
            <div class="form-group">
              <label for="edit-title">Title</label>
              <input 
                id="edit-title"
                v-model="editBookForm.title" 
                type="text" 
                placeholder="Enter book title"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="edit-author">Author</label>
                <input 
                  id="edit-author"
                  v-model="editBookForm.author" 
                  type="text" 
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div class="form-group">
                <label for="edit-isbn">ISBN</label>
                <input 
                  id="edit-isbn"
                  v-model="editBookForm.isbn" 
                  type="text" 
                  placeholder="Enter ISBN"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="edit-category">Category</label>
                <input 
                  id="edit-category"
                  v-model="editBookForm.category" 
                  type="text" 
                  placeholder="Enter category"
                  required
                />
              </div>

              <div class="form-group">
                <label for="edit-year">Publication Year</label>
                <input 
                  id="edit-year"
                  v-model="editBookForm.year" 
                  type="number" 
                  placeholder="2024"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="edit-description">Description</label>
              <textarea 
                id="edit-description"
                v-model="editBookForm.description" 
                placeholder="Enter book description"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="edit-status">Status</label>
              <select id="edit-status" v-model="editBookForm.status" required>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditBookModal = false">
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

    <!-- Add Book Modal -->
    <div v-if="showAddBookModal" class="modal-backdrop" @click="showAddBookModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Add New Book</h3><X :size="24" />
          <button class="close-btn" @click="showAddBookModal = false">✕</button>
        </div>

        <div class="modal-content">
          <form @submit.prevent="addNewBook">
            <div class="form-group">
              <label for="title">Title</label>
              <input 
                id="title"
                v-model="newBookForm.title" 
                type="text" 
                placeholder="Enter book title"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="author">Author</label>
                <input 
                  id="author"
                  v-model="newBookForm.author" 
                  type="text" 
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div class="form-group">
                <label for="isbn">ISBN</label>
                <input 
                  id="isbn"
                  v-model="newBookForm.isbn" 
                  type="text" 
                  placeholder="Enter ISBN"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input 
                  id="category"
                  v-model="newBookForm.category" 
                  type="text" 
                  placeholder="Enter category"
                  required
                />
              </div>

              <div class="form-group">
                <label for="year">Publication Year</label>
                <input 
                  id="year"
                  v-model="newBookForm.year" 
                  type="number" 
                  placeholder="2024"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description"
                v-model="newBookForm.description" 
                placeholder="Enter book description"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="newBookForm.status" required>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddBookModal = false">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Add Book
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
import { Plus, Search, Pencil, Trash2, BookOpen, X } from 'lucide-vue-next';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  year: number;
  description: string;
  status: string;
  addedDate: string;
}

// Sample book data
const books = ref<Book[]>([
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', year: 1925, description: 'A classic American novel set in the Jazz Age.', status: 'Available', addedDate: '2024-01-15' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Fiction', year: 1960, description: 'A gripping tale of racial injustice and childhood innocence.', status: 'Available', addedDate: '2024-01-20' },
  { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Dystopian', year: 1949, description: 'A dark, futuristic novel about totalitarianism.', status: 'Borrowed', addedDate: '2024-02-10' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Romance', year: 1813, description: 'A witty romance of manners set in Regency England.', status: 'Available', addedDate: '2024-02-25' },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769174', category: 'Fiction', year: 1951, description: 'The controversial coming-of-age story of Holden Caulfield.', status: 'Available', addedDate: '2024-03-05' },
  { id: 6, title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060085239', category: 'Dystopian', year: 1932, description: 'A prophetic novel about a future society.', status: 'Discontinued', addedDate: '2024-03-12' },
]);

const searchQuery = ref('');
const selectedStatus = ref('All');
const selectedBooks = ref<number[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const sortField = ref('title');
const sortOrder = ref<'asc' | 'desc'>('asc');
const showAddBookModal = ref(false);
const showEditBookModal = ref(false);
const editingBookId = ref<number | null>(null);

// New book form data
const newBookForm = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  year: new Date().getFullYear(),
  description: '',
  status: 'Available',
});

// Edit book form data
const editBookForm = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  year: new Date().getFullYear(),
  description: '',
  status: 'Available',
});

const filteredBooks = computed(() => {
  let filtered = books.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(book => book.status === selectedStatus.value);
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField.value as keyof Book];
    const bVal = b[sortField.value as keyof Book];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  // Paginate
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  let total = books.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    total = total.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    );
  }
  if (selectedStatus.value !== 'All') {
    total = total.filter(book => book.status === selectedStatus.value);
  }
  return Math.ceil(total.length / itemsPerPage.value);
});

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const selectAllBooks = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedBooks.value = filteredBooks.value.map(b => b.id);
  } else {
    selectedBooks.value = [];
  }
};

const editBook = (book: Book) => {
  editingBookId.value = book.id;
  editBookForm.value = {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    year: book.year,
    description: book.description,
    status: book.status,
  };
  showEditBookModal.value = true;
};

const updateBook = () => {
  if (!editingBookId.value) return;

  const bookIndex = books.value.findIndex(b => b.id === editingBookId.value);
  if (bookIndex === -1) return;

  const currentBook = books.value[bookIndex];

  // Check if ISBN already exists (but allow current book's ISBN)
  if (editBookForm.value.isbn !== currentBook.isbn) {
    if (books.value.some(b => b.isbn === editBookForm.value.isbn)) {
      alert('ISBN already exists!');
      return;
    }
  }

  // Update book
  books.value[bookIndex] = {
    ...currentBook,
    title: editBookForm.value.title,
    author: editBookForm.value.author,
    isbn: editBookForm.value.isbn,
    category: editBookForm.value.category,
    year: editBookForm.value.year,
    description: editBookForm.value.description,
    status: editBookForm.value.status,
  };

  // Reset form and close modal
  editBookForm.value = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    status: 'Available',
  };
  editingBookId.value = null;
  showEditBookModal.value = false;

  alert(`Book "${books.value[bookIndex].title}" has been updated successfully!`);
};

const deleteBook = (book: Book) => {
  if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
    books.value = books.value.filter(b => b.id !== book.id);
  }
};

const bulkMarkAvailable = () => {
  books.value.forEach(book => {
    if (selectedBooks.value.includes(book.id)) {
      book.status = 'Available';
    }
  });
  selectedBooks.value = [];
};

const bulkMarkBorrowed = () => {
  books.value.forEach(book => {
    if (selectedBooks.value.includes(book.id)) {
      book.status = 'Borrowed';
    }
  });
  selectedBooks.value = [];
};

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedBooks.value.length} book(s)?`)) {
    books.value = books.value.filter(b => !selectedBooks.value.includes(b.id));
    selectedBooks.value = [];
  }
};

const addNewBook = () => {
  // Check if ISBN already exists
  if (books.value.some(b => b.isbn === newBookForm.value.isbn)) {
    alert('ISBN already exists!');
    return;
  }

  // Create new book
  const newBook: Book = {
    id: Math.max(...books.value.map(b => b.id), 0) + 1,
    title: newBookForm.value.title,
    author: newBookForm.value.author,
    isbn: newBookForm.value.isbn,
    category: newBookForm.value.category,
    year: newBookForm.value.year,
    description: newBookForm.value.description,
    status: newBookForm.value.status,
    addedDate: new Date().toISOString().split('T')[0],
  };

  // Add to books list
  books.value.push(newBook);

  // Reset form and close modal
  newBookForm.value = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    status: 'Available',
  };
  showAddBookModal.value = false;

  alert(`Book "${newBook.title}" has been added successfully!`);
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
  display: flex;
  align-items: center;
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

.books-table {
  width: 100%;
  border-collapse: collapse;
}

.books-table thead {
  background: #f8f9f7;
  border-bottom: 1px solid #e0e4e0;
}

.books-table th {
  padding: 16px;
  text-align: left;
  color: #5a675f;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  user-select: none;
}

.books-table th.sortable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.books-table th.sortable:hover {
  color: #1f2d20;
}

.books-table td {
  padding: 16px;
  border-top: 1px solid #f0f2ee;
  color: #1f2d20;
}

.book-row:hover {
  background: #f8f9f7;
}

.book-title {
  font-weight: 600;
}

.isbn {
  font-family: monospace;
  font-size: 0.9rem;
  color: #5a675f;
}

/* Status Badges */
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.available {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.status-badge.borrowed {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.status-badge.discontinued {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
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
  font-size: 1.2rem;
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
  background: rgba(231, 76, 60, 0.2);
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #8a9f8f;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state svg {
  opacity: 0.5;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 8px;
  color: #1f2d20;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f2ee;
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
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #1f2d20;
}

.page-btn:hover {
  border-color: #1f2d20;
}

.page-btn.active {
  background: #1f2d20;
  color: white;
  border-color: #1f2d20;
}

/* Bulk Actions */
.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9f7;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #e0e4e0;
  margin-top: 20px;
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

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
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
  color: #1f2d20;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #8a9f8f;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  padding: 0;
}

.close-btn:hover {
  color: #1f2d20;
}

.modal-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #1f2d20;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e4e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1f2d20;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1f2d20;
  box-shadow: 0 0 0 3px rgba(31, 45, 32, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e0e4e0;
}

/* Checkbox */
.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1f2d20;
}
</style>