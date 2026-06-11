<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import {
  Lock,
  Loader2,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  Check,
  UserCircle2,
  ChevronRight,
  KeyRound,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { changeUserPassword } from "../../services/userApi";
import { useLanguage } from "../../composables/useLanguage";
import { useAuth } from "../../stores/useAuth";

const toast = useToast();
const router = useRouter();
const { currentLang, setLanguage } = useLanguage();
const { logout, loginRole } = useAuth();

// Active tab
const activeTab = ref<"security" | "account">("security");

// Password form
const changingPassword = ref(false);
const showOldPw = ref(false);
const showNewPw = ref(false);
const showConfirmPw = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Password strength
const passwordStrength = computed(() => {
  const pw = newPassword.value;
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
});

const strengthLabel = computed(() => {
  const s = passwordStrength.value;
  if (!newPassword.value) return "";
  if (s <= 1) return "Weak";
  if (s === 2) return "Fair";
  if (s === 3) return "Good";
  return "Strong";
});

const strengthColorClass = computed(() => {
  const s = passwordStrength.value;
  if (s <= 1) return "text-red-500";
  if (s === 2) return "text-amber-500";
  if (s === 3) return "text-teal-500";
  return "text-emerald-500";
});

const strengthBarColor = computed(() => {
  const s = passwordStrength.value;
  if (s <= 1) return "bg-red-500";
  if (s === 2) return "bg-amber-400";
  if (s === 3) return "bg-teal-400";
  return "bg-emerald-500";
});

const translations = {
  EN: {
    title: "Settings",
    subtitle: "Manage your preferences and account security",
    tabs: {
      security: "Security",
      account: "Account",
    },
    security: "Change Password",
    securityDesc: "Choose a strong password to protect your account.",
    oldPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    updating: "Updating…",
    passwordPlaceholder: "••••••••",
    strength: "Password strength",
    account: "Account",
    profileDesc: "Update your name, avatar, bio and contact details.",
    goToProfile: "Edit Profile",
    logoutLabel: "Sign Out",
    logoutDesc: "End your current session on this device.",
    successPassword: "Password updated successfully!",
    errorPasswordMatch: "Passwords do not match!",
    errorGeneric: "Something went wrong. Please try again.",
  },
  KH: {
    title: "ការកំណត់",
    subtitle: "គ្រប់គ្រងចំណង់ចំណូលចិត្ត និងសុវត្ថិភាពគណនី",
    tabs: {
      security: "សុវត្ថិភាព",
      account: "គណនី",
    },
    security: "ប្តូរពាក្យសម្ងាត់",
    securityDesc: "ជ្រើសរើសពាក្យសម្ងាត់ខ្លាំងដើម្បីការពារគណនីរបស់អ្នក។",
    oldPassword: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
    newPassword: "ពាក្យសម្ងាត់ថ្មី",
    confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
    updatePassword: "ធ្វើបច្ចុប្បន្នភាព",
    updating: "កំពុងធ្វើបច្ចុប្បន្នភាព…",
    passwordPlaceholder: "••••••••",
    strength: "ភាពខ្លាំងពាក្យសម្ងាត់",
    account: "គណនី",
    profileDesc: "ធ្វើបច្ចុប្បន្នភាពឈ្មោះ រូបភាព និងព័ត៌មានទំនាក់ទំនង។",
    goToProfile: "កែប្រែប្រវត្តិរូប",
    logoutLabel: "ចាកចេញ",
    logoutDesc: "បញ្ចប់វគ្គបច្ចុប្បន្នរបស់អ្នកនៅលើឧបករណ៍នេះ។",
    successPassword: "បានធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ដោយជោគជ័យ!",
    errorPasswordMatch: "ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!",
    errorGeneric: "មានបញ្ហា។ សូមព្យាយាមម្តងទៀត។",
  },
};

const t = computed(() => translations[currentLang.value === "KH" ? "KH" : "EN"]);

const tabs = computed(() => [
  { id: "security", label: t.value.tabs.security, icon: ShieldCheck },
  { id: "account", label: t.value.tabs.account, icon: UserCircle2 },
]);

const savePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error(t.value.errorPasswordMatch);
    return;
  }
  changingPassword.value = true;
  try {
    await changeUserPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    toast.success(t.value.successPassword);
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    changingPassword.value = false;
  }
};
</script>

<template>
  <div class="p-3 sm:p-4 lg:p-6">
    
    <!-- Page Header -->
    <div class="max-w-5xl mx-auto mb-6">
      <div class="text-[10px] sm:text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#7a5b3e] mb-6 font-bold">
        Atelier &gt;
        <span class="text-gray-900">{{ t.title }}</span>
      </div>
      
      <div class="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 shadow-sm transition-colors duration-300">
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1.5 font-['Playfair_Display',serif]">{{ t.title }}</h1>
        <p class="text-xs text-[#7a5b3e]">{{ t.subtitle }}</p>
      </div>
    </div>

    <!-- Layout: Tabs + Panel -->
    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
      
      <!-- Tab Rail (Navigation) -->
      <nav class="bg-white p-3 rounded-2xl border border-gray-200/50 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 sticky top-20 z-10 transition-colors duration-300">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-none font-bold text-xs cursor-pointer transition-all duration-200 whitespace-nowrap flex-1 md:flex-none justify-center md:justify-start"
          :class="
            activeTab === tab.id
              ? 'bg-[#0f6d5f] text-white shadow-md'
              : 'bg-transparent text-gray-500 hover:bg-[#F6F1E8]'
          "
          @click="activeTab = (tab.id as any)"
        >
          <component :is="tab.icon" :size="15" class="shrink-0" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>

      <!-- Panel Content -->
      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/50 shadow-sm min-h-[350px] transition-colors duration-300 text-left">
        
        <!-- SECURITY TAB -->
        <Transition name="panel-fade" mode="out-in">
          <div v-if="activeTab === 'security'" key="security" class="space-y-6">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <KeyRound :size="15" class="text-[#0f6d5f]" />
              {{ t.security }}
            </h3>
            <p class="text-xs text-gray-500">{{ t.securityDesc }}</p>

            <form @submit.prevent="savePassword" class="space-y-5">
              <!-- Current password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-[#7a5b3e]">{{ t.oldPassword }}</label>
                <div class="relative">
                  <Lock :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    :type="showOldPw ? 'text' : 'password'"
                    v-model="oldPassword"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150"
                    :placeholder="t.passwordPlaceholder"
                    required
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showOldPw = !showOldPw">
                    <EyeOff v-if="showOldPw" :size="14" />
                    <Eye v-else :size="14" />
                  </button>
                </div>
              </div>

              <!-- New password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-[#7a5b3e]">{{ t.newPassword }}</label>
                <div class="relative">
                  <Lock :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    :type="showNewPw ? 'text' : 'password'"
                    v-model="newPassword"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150"
                    :placeholder="t.passwordPlaceholder"
                    required
                    minlength="6"
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showNewPw = !showNewPw">
                    <EyeOff v-if="showNewPw" :size="14" />
                    <Eye v-else :size="14" />
                  </button>
                </div>

                <!-- Password Strength indicators -->
                <div v-if="newPassword" class="flex items-center gap-3 mt-2">
                  <div class="flex gap-1">
                    <span
                      v-for="i in 4"
                      :key="i"
                      class="w-7 h-1 rounded-full transition-all duration-300"
                      :class="i <= passwordStrength ? strengthBarColor : 'bg-gray-100'"
                    ></span>
                  </div>
                  <span class="text-[10px] font-extrabold uppercase tracking-wide" :class="strengthColorClass">
                    {{ strengthLabel }}
                  </span>
                </div>
              </div>

              <!-- Confirm password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-[#7a5b3e]">{{ t.confirmPassword }}</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Check v-if="confirmPassword && confirmPassword === newPassword" :size="14" class="text-emerald-500" />
                    <Lock v-else :size="14" />
                  </span>
                  <input
                    :type="showConfirmPw ? 'text' : 'password'"
                    v-model="confirmPassword"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150 text-xs font-medium"
                    :class="
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-200 bg-white text-gray-900'
                    "
                    :placeholder="t.passwordPlaceholder"
                    required
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="showConfirmPw = !showConfirmPw">
                    <EyeOff v-if="showConfirmPw" :size="14" />
                    <Eye v-else :size="14" />
                  </button>
                </div>
                <p v-if="confirmPassword && confirmPassword !== newPassword" class="text-[10px] text-red-500 font-bold mt-1.5">
                  Passwords don't match
                </p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end pt-3 border-t border-gray-100 mt-6">
                <button
                  type="submit"
                  class="flex items-center gap-2 px-6 py-2.5 bg-[#0f6d5f] hover:bg-[#0c574c] text-white font-bold text-xs rounded-xl transition duration-150 shadow-md shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="changingPassword"
                >
                  <Loader2 v-if="changingPassword" :size="14" class="animate-spin" />
                  <ShieldCheck v-else :size="14" />
                  <span>
                    {{ changingPassword ? t.updating : t.updatePassword }}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </Transition>

        <!-- ACCOUNT TAB -->
        <Transition name="panel-fade" mode="out-in">
          <div v-if="activeTab === 'account'" key="account" class="space-y-6">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <UserCircle2 :size="15" class="text-[#0f6d5f]" />
              {{ t.account }}
            </h3>

            <div class="grid grid-cols-1 gap-4">
              <!-- Edit Profile link -->
              <div
                class="flex items-center justify-between p-4 rounded-xl border border-gray-200/60 bg-white/40 cursor-pointer hover:bg-[#F6F1E8] transition duration-150 group"
                @click="router.push(loginRole === 'admin' ? '/admin/profile' : '/settings/profile')"
              >
                <div class="flex items-center gap-4">
                  <div class="p-2.5 bg-[#0f6d5f]/10 text-[#0f6d5f] rounded-xl">
                    <UserCircle2 :size="18" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-gray-900">{{ t.goToProfile }}</h4>
                    <p class="text-[10px] text-gray-500 mt-0.5">{{ t.profileDesc }}</p>
                  </div>
                </div>
                <ChevronRight :size="15" class="text-gray-400 group-hover:translate-x-0.5 transition" />
              </div>

              <!-- Sign Out link -->
              <div
                class="flex items-center justify-between p-4 rounded-xl border border-red-200/40 bg-red-50/5 cursor-pointer hover:bg-red-500/5 transition duration-150 group"
                @click="logout"
              >
                <div class="flex items-center gap-4">
                  <div class="p-2.5 bg-red-100/60 text-red-500 rounded-xl">
                    <LogOut :size="18" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-red-500">{{ t.logoutLabel }}</h4>
                    <p class="text-[10px] text-red-400/80 mt-0.5">{{ t.logoutDesc }}</p>
                  </div>
                </div>
                <ChevronRight :size="15" class="text-red-400 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.panel-fade-enter-from {
  opacity: 0;
  transform: translateX(6px);
}
.panel-fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
