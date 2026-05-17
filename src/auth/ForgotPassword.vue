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

          <p class="text-[#c8862a]/60 text-sm tracking-[0.2em] uppercase mb-4 font-light">Password Recovery</p>

          <h1 class="text-[2.6rem] leading-[1.1] font-serif font-bold text-[#e8dcc8] mb-6"
            style="font-family: 'Georgia', 'Times New Roman', serif; text-shadow: 0 2px 24px rgba(200,134,42,0.15);">
            Get back to<br />your account.<br />
            <span class="italic text-[#c8862a]">We've got you.</span>
          </h1>

          <p class="text-[#a99278] text-sm leading-relaxed max-w-[280px]">
            We'll send a verification code to your email address to help you reset your password and regain access.
          </p>

          <!-- Tags -->
          <div class="flex gap-4 mt-8">
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Secure</span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Quick</span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-[#c8862a]/50">Easy</span>
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
              Forgot Password
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

          <form @submit.prevent="handleSendOTP" novalidate class="space-y-5">

            <!-- Email -->
            <div>
              <label for="email"
                class="block mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666666]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                v-model.trim="email"
                autocomplete="email"
                placeholder="your@email.com"
                :aria-invalid="errors.email ? 'true' : 'false'"
                @blur="validateEmail"
                required
                class="w-full rounded-xl px-4 py-3 text-sm bg-white border text-[#333333] placeholder-[#999999] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#c8862a]/40 focus:border-[#c8862a]/50"
                :class="errors.email ? 'border-red-700/60' : 'border-[#dddddd] focus:border-transparent'"
              />
              <p v-if="errors.email" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.email }}
              </p>
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
                {{ isSubmitting ? 'Sending OTP…' : 'Send OTP' }}
              </span>
              <div class="absolute inset-0 bg-white/10 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </form>

          <!-- Footer -->
          <p class="mt-10 pt-4 text-center text-xs text-[#666666]">
            © 2026 KDRC • Built for Khmer heritage
          </p>

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