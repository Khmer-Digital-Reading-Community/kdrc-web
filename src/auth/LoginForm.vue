<template>
  <section class="min-h-screen flex items-center justify-center px-4 py-10 font-sans overflow-hidden relative">

    <!-- Ambient grain overlay -->
    <div class="pointer-events-none absolute inset-0 opacity-[0.035]"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E'); background-size: 200px;">
    </div>

    <!-- Warm glow blob -->
    <div class="pointer-events-none absolute top-[-120px] left-[-80px] w-[520px] h-[520px] rounded-full opacity-[0.12]"
      style="background: radial-gradient(circle, #c8862a 0%, transparent 70%);">
    </div>
    <div class="pointer-events-none absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-[0.08]"
      style="background: radial-gradient(circle, #7c5c2e 0%, transparent 70%);">
    </div>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl  overflow-hidden border border-white/[0.06]">

      <!-- ── LEFT PANEL ── -->
      <aside
        class="hidden lg:flex relative flex-col justify-between px-10 py-12 text-[#e8dcc8] overflow-hidden bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(160deg, rgba(26,18,8,0.8) 0%, rgba(14,11,6,0.85) 60%, rgba(18,16,10,0.9) 100%), url('https://i.pinimg.com/736x/73/52/39/735239814b6155298efb8341d55293b3.jpg' ); background-blend-mode: multiply;"
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
              <!-- Book icon -->
              <svg class="w-5 h-5 text-[#c8862a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-[#c8862a] font-semibold tracking-widest text-xs uppercase">The Library</span>
          </div>

          <!-- Khmer kicker -->
          <p class="text-[#c8862a]/60 text-sm tracking-[0.2em] uppercase mb-4 font-light">តោះអានសៀវភៅ</p>

          <h1 class="text-[2.6rem] leading-[1.1] font-serif font-bold text-[#4b900e] mb-6"
            style="font-family: 'Georgia', 'Times New Roman', serif; text-shadow: 0 2px 24px rgba(200,134,42,0.15);">
            Your next great<br />adventure<br />
            <span class="italic text-[#c8862a]">begins here.</span>
          </h1>

          <p class="text-[#a99278] text-sm leading-relaxed max-w-[280px]">
            Join our community of book lovers and discover timeless stories, cultural heritage, and modern literature in one elegant space.
          </p>
        </div>

        <!-- Bottom: quote / footnote -->
        <div class="mt-12">
          <div class="w-8 h-[1px] bg-[#c8862a]/40 mb-4"></div>
          <p class="text-[#6b5a45] text-[10px] tracking-[0.25em] uppercase">Established 2026</p>
        </div>
      </aside>

      <!-- ── RIGHT PANEL ── -->
      <div class="flex items-center justify-center bg-white px-8 py-12 lg:px-12">
        <div class="w-full max-w-[360px]">

          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-[1.75rem] font-serif font-bold text-[#1a1208] mb-1"
              style="font-family: 'Georgia', 'Times New Roman', serif;">
              Welcome back
            </h2>
            <p class="text-[#666666] text-sm">Enter your details to access your library.</p>
          </div>

          <!-- Success / Error banners -->
          <transition name="fade">
            <div v-if="registered"
              class="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3 bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 text-sm">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Account created. Please sign in.
            </div>
          </transition>

          <transition name="fade">
            <div v-if="errors.form" role="alert"
              class="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3 bg-red-900/30 border border-red-700/30 text-red-400 text-sm">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {{ errors.form }}
            </div>
          </transition>

          <form @submit.prevent="handleLogin" novalidate class="space-y-5">

            <!-- Email -->
            <div>
              <label for="login-email"
                class="block mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666666]">
                Email or Username
              </label>
              <input
                id="login-email"
                type="email"
                v-model.trim="email"
                autocomplete="email"
                placeholder="you@example.com"
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

            <!-- Password -->
            <div>
              <label for="login-password"
                class="block mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666666]">
                Password
              </label>
              <div class="relative">
                <input
                  id="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                  @blur="validatePassword"
                  required
                  class="w-full rounded-xl px-4 py-3 pr-12 text-sm bg-white border text-[#333333] placeholder-[#999999] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#c8862a]/40 focus:border-[#c8862a]/50"
                  :class="errors.password ? 'border-red-700/60' : 'border-[#dddddd] focus:border-transparent'"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#c8862a] transition-colors duration-150 p-1">
                  <!-- Eye open -->
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <!-- Eye off -->
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
            </div>

            <!-- Remember + Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2.5 cursor-pointer group">
                <div class="relative">
                  <input type="checkbox" class="sr-only peer" />
                  <div class="w-4 h-4 rounded border border-[#dddddd] bg-white peer-checked:bg-[#c8862a] peer-checked:border-[#c8862a] transition-all duration-150 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span class="text-[#666666] text-xs group-hover:text-[#333333] transition-colors">Remember me for 30 days</span>
              </label>
              <a href="/forgot-password" class="text-xs text-[#666666] hover:text-[#c8862a] transition-colors duration-150">
                Forgot password?
              </a>
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
                {{ isSubmitting ? 'Signing in…' : 'Sign In' }}
              </span>
              <!-- Shine effect -->
              <div class="absolute inset-0 bg-white/10 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 skew-x-12"></div>
            </button>

            <!-- Divider -->
            <div class="relative flex items-center gap-3 py-1">
              <div class="flex-1 h-px bg-[#e0e0e0]"></div>
              <span class="text-[10px] uppercase tracking-[0.2em] text-[#999999]">or continue with</span>
              <div class="flex-1 h-px bg-[#e0e0e0]"></div>
            </div>

            <!-- Social -->
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="startGoogleLogin"
                :disabled="isSubmitting"
                class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#dddddd] bg-white text-[#333333] text-sm font-medium hover:border-[#c8862a] hover:bg-[#f9f9f9] transition-all duration-150 disabled:opacity-50">
                <!-- Google SVG icon inline -->
                <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                @click="startFacebookLogin"
                :disabled="isSubmitting"
                class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#dddddd] bg-white text-[#333333] text-sm font-medium hover:border-[#c8862a] hover:bg-[#f9f9f9] transition-all duration-150 disabled:opacity-50">
                <!-- Facebook icon -->
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>

          <!-- Footer -->
          <p class="mt-12.5 pt-4 text-center text-xs text-[#666666]">
            Don't have an account?
            <a href="/signup" class="ml-1 text-[#c8862a] font-semibold hover:text-[#a86818] transition-colors duration-150">
              Join the library
            </a>
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../stores/useAuth';
import { login as loginService, parseApiError } from '../services/auth';
import { validateEmailValue, validatePasswordValue } from '../utils/auth-validation';
import { mapApiErrorToForm } from '../utils/form-error-mapper';

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
    const router = useRouter();
    const { startGoogleLogin, startFacebookLogin } = useAuth();

    const registered = computed(() => route.query.registered === '1');

    const validateEmail = () => {
      errors.email = validateEmailValue(email.value);
      return errors.email.length === 0;
    };

    const validatePassword = () => {
      errors.password = validatePasswordValue(password.value);
      return errors.password.length === 0;
    };

    const handleLogin = async () => {
      errors.form = '';
      const emailOk = validateEmail();
      const passwordOk = validatePassword();
      if (!emailOk || !passwordOk) return;

      isSubmitting.value = true;
      try {
        const redirectTarget =
          typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
            ? route.query.redirect
            : '/';
        await loginService({ email: email.value, password: password.value });
        await router.push(redirectTarget);
      } catch (error) {
        mapApiErrorToForm(
          error,
          errors,
          ['email', 'password'],
          'Login failed. Please try again.',
          parseApiError,
        );
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Custom checkbox tick — rendered via peer selector in Tailwind, but kept explicit for scoped safety */
input[type="checkbox"]:checked + div svg {
  opacity: 1;
}
</style>