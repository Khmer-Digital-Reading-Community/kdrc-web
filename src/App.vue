<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
    <router-view/>
  </div>
</template>
