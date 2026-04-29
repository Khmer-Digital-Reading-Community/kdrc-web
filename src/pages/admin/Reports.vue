<template>
  <section class="admin-page">
    <div class="page-header">
      <h1>Reports & Issues</h1>
      <button class="btn btn-secondary">View Statistics</button>
    </div>
    <p>Handle user reports about inappropriate content or issues.</p>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-page {
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2d20;
  margin: 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f0f2ee;
  color: #1f2d20;
  border: 1px solid #e0e4e0;
}

.btn-secondary:hover {
  background: #e0e4e0;
}

.admin-page p {
  color: #5a675f;
  margin: 0;
}
</style>