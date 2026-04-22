<template>
  <div class="home-hero">
    <div class="hero-text">
      <p class="hero-kicker">Welcome to KDRC</p>
      <h1>
        {{ user?.name ? `Welcome back, ${user?.name}` : 'Keep the stories alive.' }}
      </h1>
      <p>
        Explore Khmer literature, join discussions, and build your personal reading
        archive.
      </p>
      <div class="hero-actions">
        <router-link class="primary" to="/community">Go to Community</router-link>
        <button v-if="user" class="ghost" @click="handleLogout">Logout</button>
      </div>
    </div>
    <div class="hero-card">
      <h2>Today in your library</h2>
      <ul>
        <li>Track new Khmer fiction releases</li>
        <li>Save quotes and reading notes</li>
        <li>Follow community writing prompts</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from '../auth/useAuth';

export default defineComponent({
  name: 'Home',
  setup() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
      logout();
    };

    return {
      user,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.home-hero {
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-kicker {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: #7a5b3e;
  margin: 0;
}

h1 {
  margin: 0;
  font-size: clamp(32px, 4vw, 52px);
  color: #1f2d20;
}

p {
  margin: 0;
  color: #524131;
  font-size: 16px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary {
  padding: 12px 20px;
  background: #0f6d5f;
  color: #fff;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
}

.ghost {
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid #0f6d5f;
  background: transparent;
  color: #0f6d5f;
  font-weight: 600;
  cursor: pointer;
}

.hero-card {
  padding: 24px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #ecd9c6;
  box-shadow: 0 18px 32px rgba(44, 30, 16, 0.1);
}

.hero-card h2 {
  margin: 0 0 12px;
  color: #1f2d20;
}

.hero-card ul {
  margin: 0;
  padding-left: 18px;
  color: #5a4a3a;
}
</style>
