<template>

  <NavBar v-if="!isDashboard" />

  <router-view />

  <Footer v-if="!isDashboard" />

</template>
<script lang="ts">
export default {
  computed: {
    isDashboard() {
      return this.$route.path.includes('/dashboard')
    }
  }
}
</script>