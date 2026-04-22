<template>
  <section class="auth-page auth-signup">
    <div class="auth-split">
      <aside class="auth-visual">
        <div class="visual-inner">
          <div class="brand-badge">
            <span>KDRC</span>
          </div>
          <p class="visual-kicker">Create account</p>
          <h1>Your journey starts here.</h1>
          <p class="visual-copy">
            Join Cambodia's premier digital sanctuary for readers. Discover timeless wisdom, modern
            insights, and a community that shares your passion.
          </p>
          <div class="visual-tags">
            <span>Curation</span>
            <span>Heritage</span>
            <span>Community</span>
          </div>
        </div>
      </aside>

      <div class="auth-panel">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p class="auth-subtitle">
              Already have an account?
              <router-link to="/login">Log in</router-link>
            </p>
          </div>

          <div class="social-row">
            <button class="social" type="button">
              <span class="dot google"></span>
              Google
            </button>
            <button class="social" type="button" disabled>
              <span class="dot facebook"></span>
              Facebook
            </button>
          </div>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <form @submit.prevent="handleSignup" novalidate>
            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                v-model.trim="name"
                autocomplete="name"
                placeholder="Sokha Reach"
                :aria-invalid="errors.name ? 'true' : 'false'"
                @blur="validateName"
                required
              />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                v-model.trim="email"
                autocomplete="email"
                placeholder="reach@khmer-reads.com"
                :aria-invalid="errors.email ? 'true' : 'false'"
                @blur="validateEmail"
                required
              />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  v-model="password"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                  @blur="validatePassword"
                  required
                />
                <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
              </div>

              <div class="form-group">
                <label for="signup-confirm">Confirm</label>
                <input
                  id="signup-confirm"
                  type="password"
                  v-model="confirmPassword"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
                  @blur="validateConfirm"
                  required
                />
                <span v-if="errors.confirmPassword" class="field-error">
                  {{ errors.confirmPassword }}
                </span>
              </div>
            </div>

            <label class="checkbox">
              <input type="checkbox" />
              <span>
                I agree to the <a href="#">Terms of Service</a> and
                <a href="#">Privacy Policy</a>.
              </span>
            </label>

            <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

            <button class="primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
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
import { useAuth } from './useAuth';

export default defineComponent({
  name: 'SignupForm',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const isSubmitting = ref(false);
    const errors = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: '',
    });
    const { signup } = useAuth();

    const validateName = () => {
      if (!name.value) {
        errors.name = 'Name is required.';
        return false;
      }

      if (name.value.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
        return false;
      }

      errors.name = '';
      return true;
    };

    const validateEmail = () => {
      if (!email.value) {
        errors.email = 'Email is required.';
        return false;
      }

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
      errors.email = isValid ? '' : 'Enter a valid email address.';
      return isValid;
    };

    const validatePassword = () => {
      if (!password.value) {
        errors.password = 'Password is required.';
        return false;
      }

      if (password.value.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
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

    const handleSignup = async () => {
      errors.form = '';
      const nameOk = validateName();
      const emailOk = validateEmail();
      const passwordOk = validatePassword();
      const confirmOk = validateConfirm();
      if (!nameOk || !emailOk || !passwordOk || !confirmOk) {
        return;
      }

      isSubmitting.value = true;
      try {
        await signup({ name: name.value, email: email.value, password: password.value });
      } catch (error) {
        errors.form = error instanceof Error ? error.message : 'Signup failed.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      isSubmitting,
      errors,
      handleSignup,
      validateName,
      validateEmail,
      validatePassword,
      validateConfirm,
    };
  },
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: stretch;
}

.auth-split {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(15, 25, 20, 0.08);
  box-shadow: 0 40px 80px rgba(12, 18, 16, 0.12);
}

.auth-visual {
  position: relative;
  padding: 56px 60px;
  color: #f1ece7;
  background:
    radial-gradient(circle at top right, rgba(122, 90, 63, 0.45), transparent 55%),
    linear-gradient(165deg, #2c221b 0%, #1e1915 60%, #3b2b21 100%);
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
}

.auth-panel {
  display: grid;
  place-items: center;
  background: #fbfbfc;
  padding: 60px 56px;
}

.auth-card {
  width: min(440px, 100%);
}

.auth-header {
  margin-bottom: 20px;
  text-align: left;
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

.social-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.social {
  border-radius: 12px;
  border: 1px solid #e3e7ea;
  background: #fff;
  color: #1c2422;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.google {
  background: conic-gradient(
    #4285f4 0deg,
    #4285f4 90deg,
    #34a853 90deg,
    #34a853 180deg,
    #fbbc05 180deg,
    #fbbc05 270deg,
    #ea4335 270deg,
    #ea4335 360deg
  );
}

.facebook {
  background: #1877f2;
}

.divider {
  position: relative;
  margin: 20px 0 16px;
  text-align: center;
  color: #9aa5a2;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 38%;
  height: 1px;
  background: #e5e8eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.form-group {
  margin-bottom: 16px;
  text-align: left;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
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

.field-error {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #b42318;
}

.checkbox {
  display: inline-flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 12px;
  color: #5f6a68;
  margin: 8px 0 18px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.checkbox input {
  width: 14px;
  height: 14px;
  margin-top: 3px;
}

.checkbox a {
  color: #6a40d7;
  font-weight: 600;
  text-decoration: none;
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

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .social-row {
    grid-template-columns: 1fr;
  }
}
</style>
