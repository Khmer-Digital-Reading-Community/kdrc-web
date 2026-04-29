<template>
  <section class="admin-page">
    <h1>Admin Dashboard</h1>
    <p>Admin tools and content management will live here.</p>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-page {
	min-height: 60vh;
	display: grid;
	place-content: center;
	gap: 12px;
	text-align: center;
	color: #1f2d20;
}

.admin-page h1 {
	font-size: clamp(2rem, 4vw, 3.5rem);
	font-weight: 700;
}

.admin-page p {
	max-width: 32rem;
	margin: 0 auto;
	color: #5a675f;
}
</style>
