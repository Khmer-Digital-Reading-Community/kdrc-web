<template>
  <div class="callback-card">
    <h2>Signing you in...</h2>
    <p v-if="message" class="status" :class="{ error: isError }">{{ message }}</p>
    <p v-if="!message" class="status">Hang tight while we finish the handshake.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../auth/useAuth';

const route = useRoute();
const router = useRouter();
const { completeOAuth } = useAuth();

const message = ref('');
const isError = ref(false);

onMounted(async () => {
  const token =
    (route.query.accessToken as string) ||
    (route.query.token as string) ||
    (route.query.access_token as string);

  if (!token) {
    message.value = 'Missing access token. Please try again.';
    isError.value = true;
    return;
  }

  try {
    await completeOAuth(token);
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'OAuth login failed.';
    isError.value = true;
    await router.push('/login');
  }
});
</script>

<style scoped>
.callback-card {
  width: min(420px, 100%);
  margin: 60px auto;
  padding: 32px;
  background: #f2f6ff;
  border: 1px solid #c8d6f2;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 24px 40px rgba(29, 45, 72, 0.12);
}

h2 {
  margin: 0 0 12px;
  color: #1d2d48;
}

.status {
  margin: 0;
  color: #4a5b72;
}

.status.error {
  color: #b42318;
}
</style>
