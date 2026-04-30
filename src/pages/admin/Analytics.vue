<template>
  <div class="analytics-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Analytics & Reports</h1>
        <p class="text-gray-600">View detailed analytics and performance metrics for your platform.</p>
      </div>
      <button class="btn btn-secondary">
        <Download :size="20" />
        Export Data
      </button>
    </div>

    <!-- Date Range Filter -->
    <div class="filter-section">
      <label for="date-range" class="filter-label">Date Range:</label>
      <select v-model="selectedRange" id="date-range" class="filter-select">
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
        <option value="year">Last Year</option>
      </select>
    </div>

    <!-- Key Metrics Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <Users :size="24" class="metric-icon users-icon" />
          <span class="metric-badge positive">+12%</span>
        </div>
        <h3 class="metric-title">Total Users</h3>
        <p class="metric-value">2,543</p>
        <p class="metric-subtitle">+142 this period</p>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <BookOpen :size="24" class="metric-icon books-icon" />
          <span class="metric-badge positive">+8%</span>
        </div>
        <h3 class="metric-title">Total Books</h3>
        <p class="metric-value">1,284</p>
        <p class="metric-subtitle">+68 this period</p>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <MessageCircle :size="24" class="metric-icon comments-icon" />
          <span class="metric-badge positive">+24%</span>
        </div>
        <h3 class="metric-title">Comments</h3>
        <p class="metric-value">5,892</p>
        <p class="metric-subtitle">+1,204 this period</p>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <TrendingUp :size="24" class="metric-icon engagement-icon" />
          <span class="metric-badge neutral">+5%</span>
        </div>
        <h3 class="metric-title">Engagement Rate</h3>
        <p class="metric-value">68.5%</p>
        <p class="metric-subtitle">+3.2% this period</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- User Activity Chart -->
      <div class="chart-card">
        <h3 class="chart-title">User Activity (Last 7 Days)</h3>
        <div class="bar-chart">
          <div class="bar-container">
            <div class="bar-item">
              <div class="bar" style="height: 65%"></div>
              <span class="bar-label">Mon</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 72%"></div>
              <span class="bar-label">Tue</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 58%"></div>
              <span class="bar-label">Wed</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 85%"></div>
              <span class="bar-label">Thu</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 90%"></div>
              <span class="bar-label">Fri</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 78%"></div>
              <span class="bar-label">Sat</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 68%"></div>
              <span class="bar-label">Sun</span>
            </div>
          </div>
        </div>
        <div class="chart-stats">
          <div class="stat">
            <span class="stat-label">Avg Daily Users</span>
            <span class="stat-value">1,245</span>
          </div>
          <div class="stat">
            <span class="stat-label">Peak Day</span>
            <span class="stat-value">Friday</span>
          </div>
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="chart-card">
        <h3 class="chart-title">User Growth (Last 12 Months)</h3>
        <div class="line-chart">
          <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
            <polyline
              points="20,150 60,130 100,110 140,90 180,70 220,60 260,50 300,45 340,40 380,35"
              fill="none"
              stroke="#2d6a4f"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="20" cy="150" r="4" fill="#2d6a4f" />
            <circle cx="60" cy="130" r="4" fill="#2d6a4f" />
            <circle cx="100" cy="110" r="4" fill="#2d6a4f" />
            <circle cx="140" cy="90" r="4" fill="#2d6a4f" />
            <circle cx="180" cy="70" r="4" fill="#2d6a4f" />
            <circle cx="220" cy="60" r="4" fill="#2d6a4f" />
            <circle cx="260" cy="50" r="4" fill="#2d6a4f" />
            <circle cx="300" cy="45" r="4" fill="#2d6a4f" />
            <circle cx="340" cy="40" r="4" fill="#2d6a4f" />
            <circle cx="380" cy="35" r="4" fill="#2d6a4f" />
          </svg>
        </div>
        <div class="chart-stats">
          <div class="stat">
            <span class="stat-label">Growth Rate</span>
            <span class="stat-value">+32%</span>
          </div>
          <div class="stat">
            <span class="stat-label">Current Users</span>
            <span class="stat-value">2,543</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Charts -->
    <div class="charts-grid">
      <!-- Content Distribution -->
      <div class="chart-card">
        <h3 class="chart-title">Content Distribution</h3>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <div class="pie-segment fiction" style="--percentage: 45"></div>
            <div class="pie-segment non-fiction" style="--percentage: 30"></div>
            <div class="pie-segment mystery" style="--percentage: 15"></div>
            <div class="pie-segment other" style="--percentage: 10"></div>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #2d6a4f;"></span>
            <span>Fiction (45%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #52b788;"></span>
            <span>Non-Fiction (30%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #95d5b2;"></span>
            <span>Mystery (15%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #d8f3dc;"></span>
            <span>Other (10%)</span>
          </div>
        </div>
      </div>

      <!-- Top Books -->
      <div class="chart-card">
        <h3 class="chart-title">Top 5 Books</h3>
        <div class="top-books">
          <div class="book-item" v-for="(book, index) in topBooks" :key="index">
            <span class="book-rank">{{ index + 1 }}</span>
            <div class="book-info">
              <p class="book-name">{{ book.name }}</p>
              <p class="book-reads">{{ book.reads }} reads</p>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (book.reads / 500) * 100 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Statistics Table -->
    <div class="table-card">
      <h3 class="table-title">User Statistics</h3>
      <div class="table-wrapper">
        <table class="stats-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
              <th>This Period</th>
              <th>Change %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Active Users</td>
              <td>1,892</td>
              <td>+156</td>
              <td>+8.9%</td>
              <td><span class="status-badge positive">↑ Growing</span></td>
            </tr>
            <tr>
              <td>New Registrations</td>
              <td>342</td>
              <td>+142</td>
              <td>+41.5%</td>
              <td><span class="status-badge positive">↑ Growing</span></td>
            </tr>
            <tr>
              <td>Books Published</td>
              <td>1,284</td>
              <td>+68</td>
              <td>+5.6%</td>
              <td><span class="status-badge positive">↑ Growing</span></td>
            </tr>
            <tr>
              <td>Comments Posted</td>
              <td>5,892</td>
              <td>+1,204</td>
              <td>+25.7%</td>
              <td><span class="status-badge positive">↑ Growing</span></td>
            </tr>
            <tr>
              <td>Inactive Users</td>
              <td>651</td>
              <td>-32</td>
              <td>-4.7%</td>
              <td><span class="status-badge neutral">→ Stable</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Download, Users, BookOpen, MessageCircle, TrendingUp } from 'lucide-vue-next';

const selectedRange = ref('30days');

const topBooks = ref([
  { name: 'The Great Adventure', reads: 450 },
  { name: 'Mystery in the Mountains', reads: 380 },
  { name: 'Love and Time', reads: 320 },
  { name: 'Journey to Tomorrow', reads: 280 },
  { name: 'Whispers of the Past', reads: 240 }
]);
</script>

<style scoped>
.analytics-container {
  padding: 20px;
  background: #f9faf8;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1f2d20;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #2d6a4f;
  color: white;
  border: 1px solid #2d6a4f;
}

.btn-secondary:hover {
  background: #1f4d38;
  transform: translateY(-2px);
}

/* Filter Section */
.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.filter-label {
  font-weight: 600;
  color: #1f2d20;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d0d4cc;
  border-radius: 6px;
  background: white;
  color: #1f2d20;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #2d6a4f;
  outline: none;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.metric-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  color: #2d6a4f;
}

.metric-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.metric-badge.positive {
  background: #d1fae5;
  color: #047857;
}

.metric-badge.neutral {
  background: #fef3c7;
  color: #d97706;
}

.metric-title {
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 4px 0;
}

.metric-subtitle {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 20px 0;
}

/* Bar Chart */
.bar-chart {
  margin-bottom: 20px;
  padding: 20px 0;
}

.bar-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 8px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, #2d6a4f, #52b788);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s;
  min-height: 20px;
}

.bar-item:hover .bar {
  background: linear-gradient(to top, #1f4d38, #2d6a4f);
  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
}

.bar-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

/* Line Chart */
.line-chart {
  margin-bottom: 20px;
  height: 200px;
}

.line-chart svg {
  width: 100%;
  height: 100%;
}

/* Pie Chart */
.pie-chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.pie-chart {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #2d6a4f 0deg 162deg,
    #52b788 162deg 270deg,
    #95d5b2 270deg 324deg,
    #d8f3dc 324deg 360deg
  );
}

.legend {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

/* Chart Stats */
.chart-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f2ee;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d6a4f;
}

/* Top Books */
.top-books {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.book-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  background: #2d6a4f;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
}

.book-info {
  flex: 0 0 140px;
}

.book-name {
  font-weight: 600;
  color: #1f2d20;
  margin: 0;
  font-size: 0.95rem;
}

.book-reads {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f2ee;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #2d6a4f, #52b788);
  transition: width 0.3s;
}

/* Table Card */
.table-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 0 0 20px 0;
}

.table-wrapper {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table thead {
  background: #f9faf8;
  border-bottom: 2px solid #e0e4e0;
}

.stats-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #1f2d20;
  font-size: 0.9rem;
}

.stats-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f2ee;
  color: #666;
}

.stats-table tbody tr:hover {
  background: #f9faf8;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.positive {
  background: #d1fae5;
  color: #047857;
}

.status-badge.neutral {
  background: #fef3c7;
  color: #d97706;
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-stats {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .filter-section {
    flex-wrap: wrap;
  }
}
</style>