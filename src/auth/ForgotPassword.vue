<template>
  <section class="auth-page auth-forgot-password">
    <div class="auth-split">
      <aside class="auth-visual">
        <div class="visual-inner">
          <div class="brand-badge">
            <img src="../assets/images/logo.png" alt="Logo" />
          </div>
          <p class="visual-kicker">Password Recovery</p>
          <h1>Get back to your account.</h1>
          <p class="visual-copy">
            We'll send a verification code to your email address to help you reset your password
            and regain access to your account.
          </p>
          <div class="visual-tags">
            <span>Secure</span>
            <span>Quick</span>
            <span>Easy</span>
          </div>
        </div>
      </aside>

      <div class="auth-panel">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Forgot Password</h2>
            <p class="auth-subtitle">
              Remember your password?
              <router-link to="/login">Log in</router-link>
            </p>
          </div>

          <form @submit.prevent="handleSendOTP" novalidate>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                v-model.trim="email"
                autocomplete="email"
                placeholder="your@email.com"
                :aria-invalid="errors.email ? 'true' : 'false'"
                @blur="validateEmail"
                required
              />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

            <button class="primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending OTP...' : 'Send OTP' }}
            </button>
          </form>

          <p class="auth-footer">© 2024 KDRC • Built for Khmer heritage</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const email = ref('');
    const isSubmitting = ref(false);
    const router = useRouter();

    const errors = reactive({
      email: '',
      form: '',
    });

    const validateEmail = () => {
      if (!email.value) {
        errors.email = 'Email is required.';
        return false;
      }

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
      errors.email = isValid ? '' : 'Enter a valid email address.';
      return isValid;
    };

    const handleSendOTP = async () => {
      errors.form = '';
      if (!validateEmail()) {
        return;
      }

      isSubmitting.value = true;
      try {
        await api.post('/auth/forgot-password', { email: email.value });
        // Redirect to verify OTP with email in query
        await router.push({
          name: 'verify-otp-reset',
          query: { email: email.value, step: 'verify' },
        });
      } catch (error) {
        errors.form =
          error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      email,
      isSubmitting,
      errors,
      validateEmail,
      handleSendOTP,
    };
  },
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 900px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(15, 25, 20, 0.08);
  box-shadow: 0 20px 50px rgba(12, 18, 16, 0.15);
}

.auth-visual {
  position: relative;
  padding: 30px 20px;
  color: #f1ece7;
  background: linear-gradient(135deg, rgba(20, 15, 10, 0.7) 0%, rgba(40, 30, 20, 0.6) 50%, rgba(20, 15, 10, 0.7) 100%),
    url('https://i.pinimg.com/736x/73/52/39/735239814b6155298efb8341d55293b3.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Cpath d="M0 80h160" stroke="rgba(255,255,255,0.08)"/%3E%3Cpath d="M80 0v160" stroke="rgba(255,255,255,0.06)"/%3E%3C/svg%3E');
  opacity: 0.35;
  pointer-events: none;
}

.visual-inner {
  position: relative;
  z-index: 1;
  max-width: 420px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-badge {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 28px;
  overflow: hidden;
}

.brand-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.visual-kicker {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.7);
}

h1 {
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.1;
  margin: 0 0 16px;
  color: #f7efe6;
}

.visual-copy {
  margin: 0 0 28px;
  color: rgba(241, 236, 231, 0.78);
  font-size: 15px;
}

.visual-tags {
  display: flex;
  gap: 18px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 10px;
  color: rgba(241, 236, 231, 0.6);
  justify-content: center;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fbfbfc;
  padding: 40px 30px;
}

.auth-card {
  width: 100%;
}

.auth-header {
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  font-size: 28px;
  margin: 0 0 6px;
  color: #1f2422;
}

.auth-subtitle {
  margin: 0;
  color: #737c7b;
  font-size: 13px;
}

.auth-subtitle a {
  color: #6a40d7;
  font-weight: 600;
  text-decoration: none;
}

.form-group {
  margin-bottom: 16px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #2e3634;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e4e7ea;
  background: #f7f8fa;
  font-size: 14px;
  color: #1f2b29;
}

input:focus {
  outline: 2px solid rgba(15, 109, 95, 0.35);
  border-color: transparent;
  background: #fff;
}

.field-error {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #b42318;
}

.form-error {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fbe5e5;
  color: #8b1c1c;
  font-size: 13px;
}

button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary {
  background: #0f3b3f;
  color: #fff;
  box-shadow: 0 16px 28px rgba(12, 40, 38, 0.25);
}

.auth-footer {
  margin: 20px 0 0;
  text-align: center;
  color: #6d7070;
  font-size: 13px;
}
</style>
