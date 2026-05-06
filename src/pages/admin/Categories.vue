<template>
  <section class="admin-page">
    <div class="page-header">
      <h1>Categories</h1>
      <button class="btn btn-primary">Add Category</button>
    </div>
    <p>Create and manage book categories.</p>
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

.btn-primary {
  background: #1f2d20;
  color: white;
}

.btn-primary:hover {
  background: #162310;
}

.admin-page p {
  color: #5a675f;
  margin: 0;
}
</style>