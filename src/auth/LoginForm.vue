<template>
  <section class="auth-page auth-login">
    <div class="auth-split">
      <aside class="auth-visual">
        <div class="visual-inner">
          <div class="brand-badge">
            <img src="../assets/images/logo.png" alt="Logo" />
          </div>
          <p class="visual-kicker">តោះអានសៀវភៅ</p>
          <h1>Your next great adventure begins here.</h1>
          <p class="visual-copy">
            Join our community of book lovers and discover timeless stories, cultural heritage, and
            modern literature in one elegant space.
          </p>
          <p class="visual-footnote">Established 2024</p>
        </div>
      </aside>

      <div class="auth-panel">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Welcome back</h2>
            <p class="auth-subtitle">Enter your details to access your library.</p>
          </div>

          <form @submit.prevent="handleLogin" novalidate>
            <div class="form-group">
              <label for="login-email">Email or Username</label>
              <input
                id="login-email"
                type="email"
                v-model.trim="email"
                autocomplete="email"
                placeholder="you@example.com"
                :aria-invalid="errors.email ? 'true' : 'false'"
                @blur="validateEmail"
                required
              />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="password-input-wrapper">
                <input
                  id="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="current-password"
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
            </div>

            <div class="form-row">
              <label class="checkbox">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>
              
              <router-link to="/forgot-password" class="link">Forgot password?</router-link>
            </div>

            <p v-if="registered" class="form-success">Account created. Please sign in.</p>
            <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

            <button class="primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
            </button>

            <div class="divider">
              <span>or continue with</span>
            </div>

            <div class="social-row">
              <button
                class="social"
                type="button"
                @click="startGoogleLogin"
                :disabled="isSubmitting"
              >
                <img src="../assets/images/google.svg" alt="Google" class="social-logo" />
                Google
              </button>
              <button class="social" type="button" @click="startFacebookLogin" :disabled="isSubmitting">
                <img src="../assets/images/facebook.svg" alt="Facebook" class="social-logo" />
                Facebook
              </button>
            </div>
          </form>

          <p class="auth-footer">
            Don't have an account?
            <router-link to="/signup">Join the library</router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './useAuth';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const isSubmitting = ref(false);
    const errors = reactive({
      email: '',
      password: '',
      form: '',
    });
    const route = useRoute();
    const { login, startGoogleLogin, startFacebookLogin } = useAuth();

    const registered = computed(() => route.query.registered === '1');

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

    const handleLogin = async () => {
      errors.form = '';
      const emailOk = validateEmail();
      const passwordOk = validatePassword();
      if (!emailOk || !passwordOk) {
        return;
      }

      isSubmitting.value = true;
      try {
        const redirectTarget =
          typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
            ? route.query.redirect
            : '/';
        await login({ email: email.value, password: password.value }, redirectTarget);
      } catch (error) {
        errors.form = error instanceof Error ? error.message : 'Login failed.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      email,
      password,
      showPassword,
      isSubmitting,
      errors,
      registered,
      handleLogin,
      startGoogleLogin,
      startFacebookLogin,
      validateEmail,
      validatePassword,
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
  gap: 0;
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
  color: #e7f1ef;
  
  background:
    linear-gradient(135deg, rgba(20, 15, 10, 0.7) 0%, rgba(40, 30, 20, 0.6) 50%, rgba(20, 15, 10, 0.7) 100%),
    url('https://i.pinimg.com/736x/3c/81/0d/3c810deb946b18db150a3c472afa2602.jpg');
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
  background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Cpath d="M0 60h120" stroke="rgba(255,255,255,0.08)"/%3E%3Cpath d="M60 0v120" stroke="rgba(255,255,255,0.06)"/%3E%3C/svg%3E');
  opacity: 0.4;
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
  font-size: 40px;
  margin: 0 0 10px;
  color: rgba(255, 255, 255, 0.7);
}

h1 {
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.1;
  margin: 0 0 16px;
  color: #f5fbfa;
}

.visual-copy {
  margin: 0;
  color: rgba(231, 241, 239, 0.8);
  font-size: 15px;
}

.visual-footnote {
  margin-top: 120px;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(231, 241, 239, 0.5);
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
  margin-bottom: 24px;
  text-align: center;
}

h2 {
  font-size: 28px;
  margin: 0 0 8px;
  color: #1c2422;
}

.auth-subtitle {
  margin: 0;
  color: #667070;
  font-size: 14px;
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

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 6px 0 18px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #5f6a68;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.checkbox input {
  width: 14px;
  height: 14px;
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

.link {
  border: none;
  background: none;
  font-size: 12px;
  color: #5f6a68;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  display: inline;
}

.link:hover {
  color: #6a40d7;
  text-decoration: underline;
}

.form-error {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fbe5e5;
  color: #8b1c1c;
  font-size: 13px;
}

.form-success {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: #e6f4ef;
  color: #0f6d5f;
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

.social-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
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

.social-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
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

.auth-footer {
  margin: 20px 0 0;
  text-align: center;
  color: #6d7070;
  font-size: 13px;
}

.auth-footer a {
  color: #6a40d7;
  font-weight: 600;
  text-decoration: none;
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

  .visual-footnote {
    margin-top: 56px;
  }

  .auth-panel {
    padding: 40px 28px;
  }
}

@media (max-width: 520px) {
  .social-row {
    grid-template-columns: 1fr;
  }
}
</style>
