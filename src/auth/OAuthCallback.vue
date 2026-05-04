<template>
  <section class="auth-page auth-oauth-callback">
    <div class="auth-card">
      <h2>Completing sign in</h2>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <p v-else>We are signing you in with Google. Please wait.</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../stores/useAuth';

export default defineComponent({
  name: 'OAuthCallback',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const error = ref('');
    const { completeOAuth } = useAuth();

    onMounted(async () => {
      const accessToken = route.query.accessToken;

      if (typeof accessToken !== 'string' || accessToken.length === 0) {
        error.value = 'Missing access token from Google login.';
        await router.replace('/login');
        return;
      }

      try {
        await completeOAuth(accessToken);
      } catch (caughtError) {
        error.value = caughtError instanceof Error ? caughtError.message : 'OAuth login failed.';
        await router.replace('/login');
      }
    });

    return {
      error,
    };
  },
});
</script>

<style scoped>
.auth-oauth-callback {
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.auth-card {
  width: min(100%, 480px);
  padding: 32px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(15, 25, 20, 0.08);
  box-shadow: 0 20px 50px rgba(12, 18, 16, 0.12);
}

.auth-card h2 {
  margin: 0 0 12px;
  font-size: 1.5rem;
  color: #0f1914;
}

.auth-card p {
  margin: 0;
  color: #5c625f;
}

.form-error {
  color: #b42318;
}
</style>