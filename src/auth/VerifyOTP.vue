<template>
  <section class="auth-page auth-verify-otp">
    <div class="auth-split">
      <aside class="auth-visual">
        <div class="visual-inner">
          <div class="brand-badge">
            <img src="../assets/images/logo.png" alt="Logo" />
          </div>
          <p class="visual-kicker">Verify Your Identity</p>
          <h1>One more step.</h1>
          <p class="visual-copy">
            Enter the verification code sent to your email. This helps us keep your account secure
            and protect your data.
          </p>
          <div class="visual-tags">
            <span>Security</span>
            <span>Verified</span>
            <span>Protected</span>
          </div>
        </div>
      </aside>

      <div class="auth-panel">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Verify OTP</h2>
            <p class="auth-subtitle">
              Didn't receive the code?
              <button type="button" class="resend-btn" @click="handleResendOTP" :disabled="resendCooldown > 0">
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend' }}
              </button>
            </p>
          </div>

          <form @submit.prevent="handleVerifyOTP" novalidate>
            <div class="form-group">
              <label for="otp">Verification Code</label>
              <div class="otp-inputs">
                <input
                  v-for="(digit, index) in 6"
                  :key="index"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  class="otp-input"
                  :value="otp[index]"
                  @input="handleOtpInput(index, $event)"
                  @keydown="handleOtpKeydown(index, $event)"
                  :aria-invalid="errors.otp ? 'true' : 'false'"
                  :ref="`otpInput${index}`"
                />
              </div>
              <span v-if="errors.otp" class="field-error">{{ errors.otp }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                v-model.trim="email"
                placeholder="your@email.com"
                autocomplete="email"
                required
              />
            </div>

            <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

            <button class="primary" type="submit" :disabled="isSubmitting || otp.join('').length < 6">
              {{ isSubmitting ? 'Verifying...' : 'Verify OTP' }}
            </button>

            <router-link to="/login" class="auth-link">Back to Login</router-link>
          </form>

          <p class="auth-footer">© 2024 KDRC • Built for Khmer heritage</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from './useAuth';

export default defineComponent({
  name: 'VerifyOTP',
  setup() {
    const otp = ref(['', '', '', '', '', '']);
    const email = ref('');
    const isSubmitting = ref(false);
    const resendCooldown = ref(0);
    let cooldownTimer: number | null = null;

    const errors = reactive({
      otp: '',
      form: '',
    });

    const handleOtpInput = (index: number, event: any) => {
      const value = event.target.value;
      if (/^\d$/.test(value)) {
        otp.value[index] = value;
        if (index < 5) {
          const nextInput = document.querySelector(`.otp-inputs input:nth-child(${index + 2})`) as HTMLInputElement;
          nextInput?.focus();
        }
        errors.otp = '';
      } else {
        event.target.value = otp.value[index];
      }
    };

    const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
      if (event.key === 'Backspace' && otp.value[index] === '') {
        if (index > 0) {
          const prevInput = document.querySelector(`.otp-inputs input:nth-child(${index})`) as HTMLInputElement;
          prevInput?.focus();
        }
      }
    };

    const startResendCooldown = () => {
      resendCooldown.value = 60;
      cooldownTimer = window.setInterval(() => {
        resendCooldown.value--;
        if (resendCooldown.value <= 0) {
          if (cooldownTimer) clearInterval(cooldownTimer);
        }
      }, 1000);
    };

    const handleVerifyOTP = async () => {
      errors.form = '';
      const otpCode = otp.value.join('');

      if (otpCode.length < 6) {
        errors.otp = 'Please enter all 6 digits.';
        return;
      }

      isSubmitting.value = true;
      try {
        // Call your auth service to verify OTP
        console.log('Verifying OTP:', otpCode);
        // await verifyOTP({ email: email.value, otp: otpCode });
      } catch (error) {
        errors.form = error instanceof Error ? error.message : 'OTP verification failed.';
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleResendOTP = async () => {
      if (resendCooldown.value > 0) return;
      try {
        // Call your auth service to resend OTP
        console.log('Resending OTP to:', email.value);
        startResendCooldown();
      } catch (error) {
        errors.form = error instanceof Error ? error.message : 'Failed to resend OTP.';
      }
    };

    onMounted(() => {
      // Focus on first OTP input on mount
      const firstInput = document.querySelector('.otp-inputs input:first-child') as HTMLInputElement;
      firstInput?.focus();
      startResendCooldown();
    });

    onBeforeUnmount(() => {
      if (cooldownTimer) clearInterval(cooldownTimer);
    });

    return {
      otp,
      email,
      isSubmitting,
      resendCooldown,
      errors,
      handleOtpInput,
      handleOtpKeydown,
      handleVerifyOTP,
      handleResendOTP,
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

.resend-btn {
  background: none;
  border: none;
  color: #6a40d7;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
  text-decoration: underline;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.otp-inputs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.otp-input {
  padding: 14px 8px !important;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.1em;
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
  margin-bottom: 16px;
}

.auth-link {
  display: inline-block;
  text-align: center;
  width: 100%;
  color: #6a40d7;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
}

.auth-link:hover {
  text-decoration: underline;
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
  .otp-inputs {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 520px) {
  .otp-inputs {
    gap: 6px;
  }

  .otp-input {
    font-size: 18px;
  }
}
</style>
