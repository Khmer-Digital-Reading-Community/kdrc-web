<template>
  <section class="min-h-screen flex items-center justify-center px-4 py-10 font-sans overflow-hidden relative">

    <!-- Ambient grain overlay -->
    <div class="pointer-events-none absolute inset-0 opacity-[0.035]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E'); background-size: 200px;">
    </div>

    <!-- Warm glow blobs -->
    <div class="pointer-events-none absolute top-[-120px] left-[-80px] w-[520px] h-[520px] rounded-full opacity-[0.12]"
      style="background: radial-gradient(circle, #c8862a 0%, transparent 70%);">
    </div>
    <div class="pointer-events-none absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-[0.08]"
      style="background: radial-gradient(circle, #7c5c2e 0%, transparent 70%);">
    </div>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/[0.06]">

      <!-- LEFT PANEL -->
      <aside
        class="hidden lg:flex relative flex-col justify-between px-10 py-12 text-[#e8dcc8] overflow-hidden bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(160deg, rgba(26,18,8,0.8) 0%, rgba(14,11,6,0.85) 60%, rgba(18,16,10,0.9) 100%), url('https://i.pinimg.com/736x/73/52/39/735239814b6155298efb8341d55293b3.jpg'); background-blend-mode: multiply;"
      >
        <!-- Decorative book spine lines -->
        <div class="absolute inset-y-0 right-0 flex gap-[3px] opacity-20">
          <div class="w-[2px] h-full" style="background: linear-gradient(to bottom, transparent, #c8862a, transparent);"></div>
          <div class="w-[1px] h-full" style="background: linear-gradient(to bottom, transparent, #8a5f1e, transparent);"></div>
        </div>

        <!-- Top: brand -->
        <div>
          <div class="flex items-center gap-3 mb-14">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-[#c8862a]/30 bg-[#c8862a]/10">
              <svg class="w-5 h-5 text-[#c8862a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-[#c8862a] font-semibold tracking-widest text-xs uppercase">The Library</span>
          </div>

          <p class="text-[#c8862a]/60 text-sm tracking-[0.2em] uppercase mb-4 font-light">Reset Your Password</p>

          <h1 class="text-[2.6rem] leading-[1.1] font-serif font-bold text-[#e8dcc8] mb-6"
            style="font-family: 'Georgia', 'Times New Roman', serif; text-shadow: 0 2px 24px rgba(200,134,42,0.15);">
            Create a new<br />password.<br />
            <span class="italic text-[#c8862a]">Stay secure.</span>
          </h1>

          <p class="text-[#a99278] text-sm leading-relaxed max-w-[280px]">
            Choose a strong password to keep your account safe. Make sure it's unique and something only you can remember.
          </p>

          <!-- Tags -->
          <div class="flex gap-4 mt-8">
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Strong</span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Secure</span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Unique</span>
          </div>
        </div>

        <!-- Bottom: footnote -->
        <div class="mt-12">
          <div class="w-8 h-[1px] bg-[#c8862a]/40 mb-4"></div>
          <p class="text-[#6b5a45] text-[10px] tracking-[0.25em] uppercase">Established 2026</p>
        </div>
      </aside>

      <!-- RIGHT PANEL -->
      <div class="flex items-center justify-center bg-white px-8 py-12 lg:px-12">
        <div class="w-full max-w-[360px]">

          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-[1.75rem] font-serif font-bold text-[#1a1208] mb-1"
              style="font-family: 'Georgia', 'Times New Roman', serif;">
              Reset Password
            </h2>
            <p class="text-[#666666] text-sm">
              Remember it?
              <router-link to="/login" class="ml-1 text-[#c8862a] font-semibold hover:text-[#a86818] transition-colors duration-150">Log in</router-link>
            </p>
          </div>

          <!-- Error banner -->
          <transition name="fade">
            <div v-if="errors.form" role="alert"
              class="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3 bg-red-900/30 border border-red-700/30 text-red-400 text-sm">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {{ errors.form }}
            </div>
          </transition>

          <form @submit.prevent="handleResetPassword" novalidate class="space-y-4">

            <!-- New Password -->
            <div>
              <label for="password"
                class="block mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666666]">
                New Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                  @blur="validatePassword"
                  required
                  class="w-full rounded-xl px-4 py-3 pr-12 text-sm bg-white border text-[#333333] placeholder-[#999999] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#c8862a]/40 focus:border-[#c8862a]/50"
                  :class="errors.password ? 'border-red-700/60' : 'border-[#dddddd] focus:border-transparent'"
                />
                <button type="button" @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#c8862a] transition-colors duration-150 p-1">
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.password }}
              </p>

              <!-- Strength bar -->
              <div class="mt-3 space-y-1.5">
                <div class="h-1 w-full rounded-full bg-[#eeeeee] overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"
                  ></div>
                </div>
                <p class="text-[11px] font-semibold" :style="{ color: strengthColor }">{{ strengthText }}</p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirm"
                class="block mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666666]">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  id="confirm"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
                  @blur="validateConfirm"
                  required
                  class="w-full rounded-xl px-4 py-3 pr-12 text-sm bg-white border text-[#333333] placeholder-[#999999] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#c8862a]/40 focus:border-[#c8862a]/50"
                  :class="errors.confirmPassword ? 'border-red-700/60' : 'border-[#dddddd] focus:border-transparent'"
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#c8862a] transition-colors duration-150 p-1">
                  <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Password requirements -->
            <div class="rounded-xl border border-[#f0e8da] bg-[#fdf8f2] px-4 py-3 space-y-1.5">
              <p class="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#666666] mb-2">Password must contain</p>
              <ul class="space-y-1">
                <li v-for="req in requirements" :key="req.label"
                  class="flex items-center gap-2 text-xs transition-colors duration-150"
                  :class="req.met ? 'text-emerald-600' : 'text-[#999999]'">
                  <svg v-if="req.met" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  {{ req.label }}
                </li>
              </ul>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style="background: linear-gradient(135deg, #b87820 0%, #c8862a 50%, #a86818 100%); color: #1a0e04; box-shadow: 0 8px 28px rgba(200,134,42,0.25);">
              <span class="relative z-10 flex items-center justify-center gap-2">
                <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isSubmitting ? 'Resetting password…' : 'Reset Password' }}
              </span>
              <div class="absolute inset-0 bg-white/10 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </form>

          <!-- Footer -->
          <p class="mt-8 pt-4 text-center text-xs text-[#666666]">
            © 2026 KDRC • Built for Khmer heritage
          </p>

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
    const email = ref((route.query.email as string) || '');
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
      if (passwordStrength.value < 30) return '#ef4444';
      if (passwordStrength.value < 60) return '#f59e0b';
      if (passwordStrength.value < 80) return '#10b981';
      return '#c8862a';
    });

    const requirements = computed(() => [
      { label: 'At least 8 characters', met: password.value.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password.value) },
      { label: 'One lowercase letter', met: /[a-z]/.test(password.value) },
      { label: 'One number', met: /\d/.test(password.value) },
    ]);

    const validatePassword = () => {
      if (!password.value) { errors.password = 'Password is required.'; return false; }
      if (password.value.length < 8) { errors.password = 'Password must be at least 8 characters.'; return false; }
      if (!/[A-Z]/.test(password.value)) { errors.password = 'Password must contain an uppercase letter.'; return false; }
      if (!/[a-z]/.test(password.value)) { errors.password = 'Password must contain a lowercase letter.'; return false; }
      if (!/\d/.test(password.value)) { errors.password = 'Password must contain a number.'; return false; }
      errors.password = '';
      return true;
    };

    const validateConfirm = () => {
      if (!confirmPassword.value) { errors.confirmPassword = 'Please confirm your password.'; return false; }
      if (confirmPassword.value !== password.value) { errors.confirmPassword = 'Passwords do not match.'; return false; }
      errors.confirmPassword = '';
      return true;
    };

    const handleResetPassword = async () => {
      errors.form = '';
      const passwordOk = validatePassword();
      const confirmOk = validateConfirm();
      if (!passwordOk || !confirmOk) return;

      isSubmitting.value = true;
      try {
        await api.post('/auth/reset-password', { email: email.value, newPassword: password.value });
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
      requirements,
      validatePassword,
      validateConfirm,
      handleResetPassword,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>