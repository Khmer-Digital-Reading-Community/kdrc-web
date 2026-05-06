<template>
  <section class="auth-page auth-reset-password">
    <div class="auth-split">
      <aside class="auth-visual">
        <div class="visual-inner">
          <div class="brand-badge">
            <img src="../assets/images/logo.png" alt="Logo" />
          </div>
          <p class="visual-kicker">Reset Your Password</p>
          <h1>Create a new password.</h1>
          <p class="visual-copy">
            Choose a strong password to keep your account secure. Make sure it's unique and
            something only you can remember.
          </p>
          <div class="visual-tags">
            <span>Strong</span>
            <span>Secure</span>
            <span>Unique</span>
          </div>
        </div>
      </aside>

      <div class="auth-panel">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Reset Password</h2>
            <p class="auth-subtitle">
              Remember your password?
              <router-link to="/login">Log in</router-link>
            </p>
          </div>

          <form @submit.prevent="handleResetPassword" novalidate>
            <div class="form-group">
              <label for="password">New Password</label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                  @blur="validatePassword"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-indicator" :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"></div>
                </div>
                <span class="strength-text" :style="{ color: strengthColor }">{{ strengthText }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirm">Confirm Password</label>
              <div class="password-input-wrapper">
                <input
                  id="confirm"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
                  @blur="validateConfirm"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
            </div>

            <div class="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li :class="{ met: password.length >= 8 }">At least 8 characters</li>
                <li :class="{ met: /[A-Z]/.test(password) }">One uppercase letter</li>
                <li :class="{ met: /[a-z]/.test(password) }">One lowercase letter</li>
                <li :class="{ met: /\d/.test(password) }">One number</li>
              </ul>
            </div>

            <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

            <button class="primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Resetting password...' : 'Reset Password' }}
            </button>
          </form>

          <p class="auth-footer">© 2024 KDRC • Built for Khmer heritage</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

export default defineComponent({
  name: 'ResetPassword',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const email = ref(route.query.email as string || '');
    const password = ref('');
    const confirmPassword = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const isSubmitting = ref(false);

    const errors = reactive({
      password: '',
      confirmPassword: '',
      form: '',
    });

    const passwordStrength = computed(() => {
      let strength = 0;
      if (password.value.length >= 8) strength += 25;
      if (password.value.length >= 12) strength += 25;
      if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) strength += 25;
      if (/\d/.test(password.value)) strength += 15;
      if (/[!@#$%^&*]/.test(password.value)) strength += 10;
      return Math.min(strength, 100);
    });

    const strengthText = computed(() => {
      if (passwordStrength.value < 30) return 'Weak';
      if (passwordStrength.value < 60) return 'Fair';
      if (passwordStrength.value < 80) return 'Good';
      return 'Strong';
    });

    const strengthColor = computed(() => {
      if (passwordStrength.value < 30) return '#b42318';
      if (passwordStrength.value < 60) return '#f59e0b';
      if (passwordStrength.value < 80) return '#10b981';
      return '#059669';
    });

    const validatePassword = () => {
      if (!password.value) {
        errors.password = 'Password is required.';
        return false;
      }

      if (password.value.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
        return false;
      }

      if (!/[A-Z]/.test(password.value)) {
        errors.password = 'Password must contain an uppercase letter.';
        return false;
      }

      if (!/[a-z]/.test(password.value)) {
        errors.password = 'Password must contain a lowercase letter.';
        return false;
      }

      if (!/\d/.test(password.value)) {
        errors.password = 'Password must contain a number.';
        return false;
      }

      errors.password = '';
      return true;
    };

    const validateConfirm = () => {
      if (!confirmPassword.value) {
        errors.confirmPassword = 'Please confirm your password.';
        return false;
      }

      if (confirmPassword.value !== password.value) {
        errors.confirmPassword = 'Passwords do not match.';
        return false;
      }

      errors.confirmPassword = '';
      return true;
    };

    const handleResetPassword = async () => {
      errors.form = '';
      const passwordOk = validatePassword();
      const confirmOk = validateConfirm();

      if (!passwordOk || !confirmOk) {
        return;
      }

      isSubmitting.value = true;
      try {
        await api.post('/auth/reset-password', {
          email: email.value,
          newPassword: password.value,
        });
        await router.push('/password-reset-success');
      } catch (error) {
        errors.form = error instanceof Error ? error.message : 'Password reset failed.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isSubmitting,
      errors,
      passwordStrength,
      strengthText,
      strengthColor,
      validatePassword,
      validateConfirm,
      handleResetPassword,
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
  background:
    linear-gradient(135deg, rgba(20, 15, 10, 0.7) 0%, rgba(40, 30, 20, 0.6) 50%, rgba(20, 15, 10, 0.7) 100%),
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
  overflow-y: auto;
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
  outline: 2px solid rgba(106, 64, 215, 0.25);
  border-color: transparent;
  background: #fff;
}

input:disabled {
  background: #e8e8e8;
  color: #999;
  cursor: not-allowed;
}

.password-input-wrapper {
  position: relative;
  display: block;
}

.password-input-wrapper input {
  padding-right: 45px;
  width: 100%;
}


.toggle-password {
  position: absolute;
  right: -180px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px 8px;
  z-index: 1;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e4e7ea;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.strength-indicator {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
}

.password-requirements {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 12px;
}

.password-requirements p {
  margin: 0 0 8px;
  color: #2e3634;
  font-weight: 600;
}

.password-requirements ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.password-requirements li {
  padding: 4px 0;
  color: #737c7b;
  display: flex;
  align-items: center;
}

.password-requirements li::before {
  content: '○';
  display: inline-block;
  margin-right: 8px;
  font-weight: bold;
}

.password-requirements li.met {
  color: #10b981;
}

.password-requirements li.met::before {
  content: '✓';
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
  margin: 24px 0 0;
  text-align: center;
  color: #6d7070;
  font-size: 12px;
}

@media (max-width: 980px) {
  .auth-page {
    min-height: auto;
  }

  .auth-split {
    grid-template-columns: 1fr;
  }

  .auth-visual {
    padding: 40px 28px;
  }

  .auth-panel {
    padding: 40px 28px;
  }
}

@media (max-width: 520px) {
  .auth-panel {
    padding: 20px 16px;
  }

  .auth-card {
    width: 100%;
  }
}
</style>
