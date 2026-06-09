<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import {
  Lock,
  Globe,
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
const activeTab = ref<"appearance" | "security" | "account">("appearance");

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

const strengthColor = computed(() => {
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
      appearance: "Appearance",
      security: "Security",
      account: "Account",
    },
    language: "Language",
    languageDesc: "Choose your preferred language for the interface.",
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
      appearance: "រូបរាង",
      security: "សុវត្ថិភាព",
      account: "គណនី",
    },
    language: "ភាសា",
    languageDesc: "ជ្រើសរើសភាសាដែលអ្នកចូលចិត្ត។",
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
  { id: "appearance", label: t.value.tabs.appearance, icon: Globe },
  { id: "security",   label: t.value.tabs.security,   icon: ShieldCheck },
  { id: "account",    label: t.value.tabs.account,    icon: UserCircle2 },
]);

const savePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error(t.value.errorPasswordMatch);
    return;
  }
  changingPassword.value = true;
  try {
    await changeUserPassword({ oldPassword: oldPassword.value, newPassword: newPassword.value });
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
  <div class="settings-root">
    <Sidebar />

    <div class="settings-main">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="settings-content">
        <!-- Page Header -->
        <div class="settings-header">
          <div class="settings-header-text">
            <div class="settings-breadcrumb">Atelier › <span>{{ t.title }}</span></div>
            <h1 class="settings-title">{{ t.title }}</h1>
            <p class="settings-subtitle">{{ t.subtitle }}</p>
          </div>
        </div>

        <!-- Layout: Tabs + Panel -->
        <div class="settings-body">

          <!-- Tab Rail (Left) -->
          <nav class="settings-tab-rail">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = (tab.id as any)"
            >
              <component :is="tab.icon" class="tab-icon" :size="17" />
              <span class="tab-label">{{ tab.label }}</span>
              <ChevronRight class="tab-chevron" :size="14" />
            </button>
          </nav>

          <!-- Panel (Right) -->
          <div class="settings-panel">

            <!-- ── APPEARANCE ── -->
            <Transition name="panel-fade" mode="out-in">
              <div v-if="activeTab === 'appearance'" key="appearance" class="panel-section">

                <!-- Language -->
                <div class="setting-group">
                  <div class="setting-group-label">
                    <Globe :size="15" class="label-icon" />
                    {{ t.language }}
                  </div>
                  <p class="setting-group-desc">{{ t.languageDesc }}</p>
                  <div class="lang-grid">
                    <button
                      type="button"
                      class="lang-card"
                      :class="{ active: currentLang === 'EN' }"
                      @click="setLanguage('EN')"
                    >
                      <span class="lang-flag">🇬🇧</span>
                      <span class="lang-name">English</span>
                      <span v-if="currentLang === 'EN'" class="lang-check"><Check :size="12" /></span>
                    </button>
                    <button
                      type="button"
                      class="lang-card"
                      :class="{ active: currentLang === 'KH' }"
                      @click="setLanguage('KH')"
                    >
                      <span class="lang-flag">🇰🇭</span>
                      <span class="lang-name">ខ្មែរ</span>
                      <span v-if="currentLang === 'KH'" class="lang-check"><Check :size="12" /></span>
                    </button>
                  </div>
                </div>

              </div>
            </Transition>

            <!-- ── SECURITY ── -->
            <Transition name="panel-fade" mode="out-in">
              <div v-if="activeTab === 'security'" key="security" class="panel-section">
                <div class="setting-group">
                  <div class="setting-group-label">
                    <KeyRound :size="15" class="label-icon" />
                    {{ t.security }}
                  </div>
                  <p class="setting-group-desc">{{ t.securityDesc }}</p>

                  <form @submit.prevent="savePassword" class="pw-form">
                    <!-- Current PW -->
                    <div class="pw-field">
                      <label class="pw-label">{{ t.oldPassword }}</label>
                      <div class="pw-input-wrap">
                        <Lock :size="15" class="pw-prefix-icon" />
                        <input
                          :type="showOldPw ? 'text' : 'password'"
                          v-model="oldPassword"
                          class="pw-input"
                          :placeholder="t.passwordPlaceholder"
                          required
                        />
                        <button type="button" class="pw-eye" @click="showOldPw = !showOldPw">
                          <EyeOff v-if="showOldPw" :size="15" />
                          <Eye v-else :size="15" />
                        </button>
                      </div>
                    </div>

                    <!-- New PW -->
                    <div class="pw-field">
                      <label class="pw-label">{{ t.newPassword }}</label>
                      <div class="pw-input-wrap">
                        <Lock :size="15" class="pw-prefix-icon" />
                        <input
                          :type="showNewPw ? 'text' : 'password'"
                          v-model="newPassword"
                          class="pw-input"
                          :placeholder="t.passwordPlaceholder"
                          required
                          minlength="6"
                        />
                        <button type="button" class="pw-eye" @click="showNewPw = !showNewPw">
                          <EyeOff v-if="showNewPw" :size="15" />
                          <Eye v-else :size="15" />
                        </button>
                      </div>
                      <!-- Strength bar -->
                      <div v-if="newPassword" class="strength-wrap">
                        <div class="strength-bars">
                          <span
                            v-for="i in 4"
                            :key="i"
                            class="strength-bar"
                            :class="{ active: i <= passwordStrength, [strengthColor]: i <= passwordStrength }"
                          ></span>
                        </div>
                        <span class="strength-label" :class="{
                          'text-red-500': passwordStrength <= 1,
                          'text-amber-500': passwordStrength === 2,
                          'text-teal-500': passwordStrength === 3,
                          'text-emerald-500': passwordStrength === 4,
                        }">{{ strengthLabel }}</span>
                      </div>
                    </div>

                    <!-- Confirm PW -->
                    <div class="pw-field">
                      <label class="pw-label">{{ t.confirmPassword }}</label>
                      <div class="pw-input-wrap">
                        <span class="pw-prefix-icon">
                          <Check v-if="confirmPassword && confirmPassword === newPassword" :size="15" class="text-emerald-500" />
                          <Lock v-else :size="15" />
                        </span>
                        <input
                          :type="showConfirmPw ? 'text' : 'password'"
                          v-model="confirmPassword"
                          class="pw-input"
                          :class="{ 'pw-input--error': confirmPassword && confirmPassword !== newPassword }"
                          :placeholder="t.passwordPlaceholder"
                          required
                        />
                        <button type="button" class="pw-eye" @click="showConfirmPw = !showConfirmPw">
                          <EyeOff v-if="showConfirmPw" :size="15" />
                          <Eye v-else :size="15" />
                        </button>
                      </div>
                      <p v-if="confirmPassword && confirmPassword !== newPassword" class="pw-error-msg">
                        Passwords don't match
                      </p>
                    </div>

                    <button type="submit" class="btn-primary" :disabled="changingPassword">
                      <Loader2 v-if="changingPassword" :size="15" class="spin" />
                      <ShieldCheck v-else :size="15" />
                      {{ changingPassword ? t.updating : t.updatePassword }}
                    </button>
                  </form>
                </div>
              </div>
            </Transition>

            <!-- ── ACCOUNT ── -->
            <Transition name="panel-fade" mode="out-in">
              <div v-if="activeTab === 'account'" key="account" class="panel-section">

                <!-- Go to Profile -->
                <div class="account-row" @click="router.push(loginRole === 'admin' ? '/admin/profile' : '/settings/profile')">
                  <div class="account-row-icon profile-icon">
                    <UserCircle2 :size="20" />
                  </div>
                  <div class="account-row-text">
                    <p class="account-row-title">{{ t.goToProfile }}</p>
                    <p class="account-row-desc">{{ t.profileDesc }}</p>
                  </div>
                  <ChevronRight :size="16" class="account-row-chevron" />
                </div>

                <div class="setting-divider"></div>

                <!-- Sign Out -->
                <div class="account-row danger-row" @click="logout">
                  <div class="account-row-icon logout-icon">
                    <LogOut :size="20" />
                  </div>
                  <div class="account-row-text">
                    <p class="account-row-title danger-text">{{ t.logoutLabel }}</p>
                    <p class="account-row-desc">{{ t.logoutDesc }}</p>
                  </div>
                  <ChevronRight :size="16" class="account-row-chevron danger-chevron" />
                </div>
              </div>
            </Transition>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ──────────────────────────────
   Root Layout
────────────────────────────── */
.settings-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}

:global(.dark) .settings-root { background: #171612; }

.settings-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem 3rem;
}

/* ──────────────────────────────
   Header
────────────────────────────── */
.settings-header {
  margin-bottom: 2rem;
}

.settings-breadcrumb {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.6rem;
}

.settings-breadcrumb span {
  color: #111;
  font-weight: 700;
}

:global(.dark) .settings-breadcrumb span { color: #fff; }

.settings-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 0.3rem;
  line-height: 1.1;
  color: #111827;
}

:global(.dark) .settings-title { color: #f3f4f6; }

.settings-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* ──────────────────────────────
   Body: tab rail + panel
────────────────────────────── */
.settings-body {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  max-width: 860px;
}

/* ──────────────────────────────
   Tab Rail
────────────────────────────── */
.settings-tab-rail {
  flex-shrink: 0;
  width: 190px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 18px;
  padding: 0.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  position: sticky;
  top: 1rem;
}

:global(.dark) .settings-tab-rail {
  background: rgba(31,30,26,0.7);
  border-color: rgba(255,255,255,0.07);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.18s, color 0.18s, transform 0.15s;
  position: relative;
}

:global(.dark) .tab-btn { color: #9ca3af; }

.tab-btn:hover {
  background: rgba(0,0,0,0.05);
  color: #111;
  transform: translateX(2px);
}

:global(.dark) .tab-btn:hover {
  background: rgba(255,255,255,0.06);
  color: #f3f4f6;
}

.tab-btn.active {
  background: #0f6d5f;
  color: #fff;
  box-shadow: 0 4px 14px rgba(15, 109, 95, 0.35);
  transform: none;
}

:global(.dark) .tab-btn.active {
  background: #4cc2a5;
  color: #093A3F;
  box-shadow: 0 4px 14px rgba(76, 194, 165, 0.35);
}

.tab-icon { flex-shrink: 0; }

.tab-label { flex: 1; }

.tab-chevron {
  opacity: 0;
  transition: opacity 0.2s;
}

.tab-btn.active .tab-chevron,
.tab-btn:hover .tab-chevron {
  opacity: 0.5;
}

/* ──────────────────────────────
   Panel
────────────────────────────── */
.settings-panel {
  flex: 1;
  min-width: 0;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
  min-height: 360px;
}

:global(.dark) .settings-panel {
  background: rgba(31,30,26,0.7);
  border-color: rgba(255,255,255,0.07);
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ──────────────────────────────
   Setting Groups
────────────────────────────── */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.setting-group-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

:global(.dark) .setting-group-label { color: #f3f4f6; }

.label-icon {
  color: #0f6d5f;
}

:global(.dark) .label-icon { color: #4cc2a5; }

.setting-group-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 0.75rem;
}

.setting-divider {
  height: 1px;
  background: rgba(0,0,0,0.07);
  margin: 1.5rem 0;
}

:global(.dark) .setting-divider { background: rgba(255,255,255,0.07); }

/* ──────────────────────────────
   Language Cards
────────────────────────────── */
.lang-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.lang-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1.5px solid rgba(0,0,0,0.09);
  background: rgba(255,255,255,0.5);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
  position: relative;
}

:global(.dark) .lang-card {
  border-color: rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #d1d5db;
}

.lang-card:hover {
  border-color: #0f6d5f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 109, 95, 0.12);
}

.lang-card.active {
  border-color: #0f6d5f;
  background: rgba(15, 109, 95, 0.06);
  color: #0f6d5f;
  box-shadow: 0 0 0 3px rgba(15, 109, 95, 0.1);
}

:global(.dark) .lang-card.active {
  border-color: #4cc2a5;
  background: rgba(76, 194, 165, 0.08);
  color: #4cc2a5;
  box-shadow: 0 0 0 3px rgba(76, 194, 165, 0.1);
}

.lang-flag { font-size: 1.3rem; }
.lang-name { flex: 1; }

.lang-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #0f6d5f;
  color: #fff;
}

:global(.dark) .lang-check { background: #4cc2a5; color: #093A3F; }

/* ──────────────────────────────
   Theme Cards
────────────────────────────── */
.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.theme-card {
  border-radius: 14px;
  border: 1.5px solid rgba(0,0,0,0.09);
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  padding: 0;
  text-align: left;
}

:global(.dark) .theme-card {
  border-color: rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}

.theme-card:hover {
  border-color: #0f6d5f;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 109, 95, 0.12);
}

.theme-card.active {
  border-color: #0f6d5f;
  box-shadow: 0 0 0 3px rgba(15, 109, 95, 0.12);
}

:global(.dark) .theme-card.active {
  border-color: #4cc2a5;
  box-shadow: 0 0 0 3px rgba(76, 194, 165, 0.12);
}

/* Preview area */
.theme-preview {
  height: 80px;
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.light-preview {
  background: #f8fafc;
}

.dark-preview {
  background: #1a1f2e;
}

.preview-bar {
  height: 10px;
  border-radius: 4px;
  background: #e5e7eb;
  width: 100%;
}

.dark-bar {
  background: #374151;
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
}

.preview-line {
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
}

.preview-line.long { width: 75%; }
.preview-line.short { width: 50%; }
.preview-line.dark-line { background: #374151; }

.theme-card-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.4);
}

:global(.dark) .theme-card-footer {
  color: #d1d5db;
  border-top-color: rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.2);
}

.theme-card-icon.sun { color: #f59e0b; }
.theme-card-icon.moon { color: #818cf8; }

.theme-active-dot {
  margin-left: auto;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #0f6d5f;
}

:global(.dark) .theme-active-dot { background: #4cc2a5; }

/* ──────────────────────────────
   Password Form
────────────────────────────── */
.pw-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 0.25rem;
}

.pw-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.pw-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #6b7280;
}

:global(.dark) .pw-label { color: #9ca3af; }

.pw-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.pw-prefix-icon {
  position: absolute;
  left: 0.85rem;
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.pw-input {
  width: 100%;
  padding: 0.7rem 2.6rem 0.7rem 2.4rem;
  border-radius: 12px;
  border: 1.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

:global(.dark) .pw-input {
  background: rgba(23,22,18,0.8);
  border-color: rgba(255,255,255,0.1);
  color: #f3f4f6;
}

.pw-input:focus {
  border-color: #0f6d5f;
  box-shadow: 0 0 0 3px rgba(15,109,95,0.12);
}

:global(.dark) .pw-input:focus {
  border-color: #4cc2a5;
  box-shadow: 0 0 0 3px rgba(76,194,165,0.12);
}

.pw-input--error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
}

.pw-eye {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.pw-eye:hover { color: #374151; }
:global(.dark) .pw-eye:hover { color: #e5e7eb; }

.pw-error-msg {
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
}

/* Strength */
.strength-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.strength-bars {
  display: flex;
  gap: 0.25rem;
}

.strength-bar {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0,0,0,0.1);
  transition: background 0.25s;
}

:global(.dark) .strength-bar { background: rgba(255,255,255,0.1); }

.strength-bar.active.bg-red-500 { background: #ef4444; }
.strength-bar.active.bg-amber-400 { background: #fbbf24; }
.strength-bar.active.bg-teal-400 { background: #2dd4bf; }
.strength-bar.active.bg-emerald-500 { background: #10b981; }

.strength-label {
  font-size: 0.72rem;
  font-weight: 700;
}

/* Button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: #0f6d5f;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-end;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(15,109,95,0.3);
}

:global(.dark) .btn-primary {
  background: #4cc2a5;
  color: #093A3F;
  box-shadow: 0 4px 14px rgba(76,194,165,0.3);
}

.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(15,109,95,0.38);
}

.btn-primary:active { transform: translateY(0); }

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ──────────────────────────────
   Account Rows
────────────────────────────── */
.account-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 14px;
  border: 1.5px solid rgba(0,0,0,0.06);
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, transform 0.15s;
}

:global(.dark) .account-row { border-color: rgba(255,255,255,0.06); }

.account-row:hover {
  background: rgba(0,0,0,0.04);
  border-color: rgba(0,0,0,0.12);
  transform: translateX(3px);
}

:global(.dark) .account-row:hover {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.1);
}

.danger-row:hover {
  background: rgba(239,68,68,0.05);
  border-color: rgba(239,68,68,0.2);
}

.account-row-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-icon {
  background: rgba(15,109,95,0.1);
  color: #0f6d5f;
}

:global(.dark) .profile-icon {
  background: rgba(76,194,165,0.12);
  color: #4cc2a5;
}

.logout-icon {
  background: rgba(239,68,68,0.08);
  color: #ef4444;
}

.account-row-text { flex: 1; }

.account-row-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

:global(.dark) .account-row-title { color: #f3f4f6; }

.danger-text { color: #ef4444 !important; }

.account-row-desc {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0.15rem 0 0;
}

.account-row-chevron {
  color: #9ca3af;
  flex-shrink: 0;
  transition: transform 0.15s;
}

.account-row:hover .account-row-chevron {
  transform: translateX(2px);
}

.danger-chevron { color: #ef4444; }

/* ──────────────────────────────
   Panel Transition
────────────────────────────── */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-fade-enter-from {
  opacity: 0;
  transform: translateX(8px);
}
.panel-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ──────────────────────────────
   Responsive
────────────────────────────── */
@media (max-width: 640px) {
  .settings-body {
    flex-direction: column;
  }

  .settings-tab-rail {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    position: static;
    padding: 0.4rem;
    gap: 0.25rem;
  }

  .tab-btn {
    flex: 1;
    min-width: 0;
    justify-content: center;
    padding: 0.6rem 0.5rem;
  }

  .tab-label { display: none; }
  .tab-chevron { display: none; }

  .settings-content {
    padding: 1rem;
  }

  .lang-grid,
  .theme-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
