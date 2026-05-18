<template>

  <NavBar v-if="!isDashboard" />

  <router-view />

  <Footer v-if="!isDashboard" />

</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/common/Navbar.vue'
import Footer from '../components/common/Footer.vue'

const route = useRoute()

const isDashboard = computed(() => route.path.includes('/dashboard'))
</script>