<template>
  <section class="admin-page">
    <div class="dashboard-grid">
      <!-- Statistics Cards -->
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <p class="stat-label">Total Books</p>
          <p class="stat-value">1,234</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <p class="stat-label">Active Users</p>
          <p class="stat-value">567</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-content">
          <p class="stat-label">Comments</p>
          <p class="stat-value">2,891</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <p class="stat-label">Growth Rate</p>
          <p class="stat-value">+12.5%</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-section">
      <h2>Recent Activity</h2>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <p class="activity-title">New book added</p>
            <p class="activity-time">2 hours ago</p>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <p class="activity-title">User registration</p>
            <p class="activity-time">4 hours ago</p>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <p class="activity-title">Comment reported</p>
            <p class="activity-time">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(31, 45, 32, 0.08);
  border-color: #d0d4d0;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #8a9f8f;
  margin: 0;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2d20;
  margin: 4px 0 0;
}

.recent-section {
  background: #ffffff;
  border: 1px solid #e0e4e0;
  border-radius: 12px;
  padding: 24px;
}

.recent-section h2 {
  margin: 0 0 20px;
  font-size: 1.25rem;
  color: #1f2d20;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9f7;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f0f2ee;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1f2d20;
  margin-top: 6px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  margin: 0;
  font-weight: 600;
  color: #1f2d20;
  font-size: 0.95rem;
}

.activity-time {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #8a9f8f;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .admin-page {
    gap: 16px;
  }
}
</style>
