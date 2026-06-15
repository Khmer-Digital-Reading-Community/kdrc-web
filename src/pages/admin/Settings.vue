<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  Globe,
  Moon,
  Sun,
  Lock,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
  Check,
  User,
  Monitor,
} from "lucide-vue-next";
import api from "../../services/api";
import { useAdminTheme } from "../../composables/useAdminTheme";
import { useAuth } from "../../stores/useAuth";

const router = useRouter();
const { isDark, toggleTheme } = useAdminTheme();
const { logout: authLogout } = useAuth();

const PREFS_KEY = "kdrc-admin-prefs";
const prefs = ref({
  itemsPerPage: localStorage.getItem(PREFS_KEY)
    ? JSON.parse(localStorage.getItem(PREFS_KEY)!).itemsPerPage || "10"
    : "10",
  timezone: localStorage.getItem(PREFS_KEY)
    ? JSON.parse(localStorage.getItem(PREFS_KEY)!).timezone || "Asia/Phnom_Penh"
    : "Asia/Phnom_Penh",
});

const savingPrefs = ref(false);
const toastMsg = ref("");
const toastError = ref(false);

const changingPassword = ref(false);
const showOldPw = ref(false);
const showNewPw = ref(false);
const showConfirmPw = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const showToast = (msg: string, err = false) => {
  toastMsg.value = msg;
  toastError.value = err;
  setTimeout(() => {
    toastMsg.value = "";
  }, 3500);
};

const savePrefs = () => {
  savingPrefs.value = true;
  setTimeout(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs.value));
    savingPrefs.value = false;
    showToast("Preferences saved!");
  }, 300);
};

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showToast("Passwords do not match!", true);
    return;
  }
  changingPassword.value = true;
  try {
    await api.patch("/users/change-password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    showToast("Password updated successfully!");
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (e: any) {
    showToast(e?.response?.data?.message || "Failed to update password.", true);
  } finally {
    changingPassword.value = false;
  }
};

const logout = async () => {
  await authLogout();
  router.push("/login");
};
</script>

<template>
  <section class="admin-page">
    <!-- Header -->
    <div class="flex flex-row items-center justify-end">
      <button
        type="button"
        class="admin-btn admin-btn-secondary"
        @click="router.push('/admin/profile')"
      >
        <User :size="14" /> My Profile
      </button>
    </div>

    <div class="settings-grid">
      <!-- Display Preferences -->
      <div class="admin-card settings-card">
        <div class="admin-card-header">
          <h3 class="card-title">
            <Monitor :size="16" class="card-icon" /> Display Preferences
          </h3>
        </div>
        <div class="admin-card-body">
          <div class="settings-section-desc">
            Customize how the admin panel looks and feels.
          </div>

          <!-- Theme Toggle -->
          <div class="pref-row">
            <div class="pref-info">
              <p class="pref-label">Color Theme</p>
              <p class="pref-desc">Switch between light and dark interface.</p>
            </div>
            <button type="button" class="theme-toggle-btn" @click="toggleTheme">
              <span
                class="theme-icon-wrap"
                :class="isDark ? 'dark-mode' : 'light-mode'"
              >
                <Sun v-if="!isDark" :size="14" />
                <Moon v-else :size="14" />
              </span>
              <span class="theme-toggle-track" :class="{ active: isDark }">
                <span
                  class="theme-toggle-thumb"
                  :class="{ active: isDark }"
                ></span>
              </span>
            </button>
          </div>

          <div class="pref-divider"></div>

          <!-- Page Size -->
          <div class="admin-form-row settings-form-row">
            <div class="admin-form-group">
              <label for="items-per-page">Table Page Size</label>
              <select id="items-per-page" v-model="prefs.itemsPerPage">
                <option value="5">5 rows</option>
                <option value="10">10 rows</option>
                <option value="25">25 rows</option>
                <option value="50">50 rows</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label for="timezone">Timezone</label>
              <select id="timezone" v-model="prefs.timezone">
                <option value="UTC">UTC</option>
                <option value="Asia/Phnom_Penh">Asia / Phnom Penh</option>
                <option value="America/New_York">Eastern US</option>
                <option value="Europe/London">London</option>
              </select>
            </div>
          </div>

          <div class="card-actions">
            <button
              type="button"
              class="admin-btn admin-btn-primary"
              @click="savePrefs"
              :disabled="savingPrefs"
            >
              <Loader2 v-if="savingPrefs" :size="13" class="spin-icon" />
              <Check v-else :size="13" />
              {{ savingPrefs ? "Saving…" : "Save Preferences" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security / Password -->
      <div class="admin-card settings-card">
        <div class="admin-card-header">
          <h3 class="card-title">
            <ShieldCheck :size="16" class="card-icon" /> Security & Password
          </h3>
        </div>
        <div class="admin-card-body">
          <div class="settings-section-desc">
            Keep your admin account secure with a strong password.
          </div>
          <form @submit.prevent="changePassword" class="password-form">
            <!-- Current Password -->
            <div class="admin-form-group">
              <label for="old-pw">Current Password</label>
              <div class="pw-input-wrap">
                <Lock :size="14" class="pw-icon" />
                <input
                  id="old-pw"
                  :type="showOldPw ? 'text' : 'password'"
                  v-model="oldPassword"
                  required
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  class="pw-toggle"
                  @click="showOldPw = !showOldPw"
                >
                  <EyeOff v-if="showOldPw" :size="14" />
                  <Eye v-else :size="14" />
                </button>
              </div>
            </div>

            <!-- New + Confirm -->
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label for="new-pw">New Password</label>
                <div class="pw-input-wrap">
                  <Lock :size="14" class="pw-icon" />
                  <input
                    id="new-pw"
                    :type="showNewPw ? 'text' : 'password'"
                    v-model="newPassword"
                    required
                    minlength="6"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    class="pw-toggle"
                    @click="showNewPw = !showNewPw"
                  >
                    <EyeOff v-if="showNewPw" :size="14" />
                    <Eye v-else :size="14" />
                  </button>
                </div>
              </div>
              <div class="admin-form-group">
                <label for="confirm-pw">Confirm Password</label>
                <div class="pw-input-wrap">
                  <span class="pw-icon">
                    <Check
                      v-if="confirmPassword && confirmPassword === newPassword"
                      :size="14"
                      class="match-icon"
                    />
                    <Lock v-else :size="14" />
                  </span>
                  <input
                    id="confirm-pw"
                    :type="showConfirmPw ? 'text' : 'password'"
                    v-model="confirmPassword"
                    required
                    placeholder="Repeat new password"
                    :class="{
                      'input-mismatch':
                        confirmPassword && confirmPassword !== newPassword,
                    }"
                  />
                  <button
                    type="button"
                    class="pw-toggle"
                    @click="showConfirmPw = !showConfirmPw"
                  >
                    <EyeOff v-if="showConfirmPw" :size="14" />
                    <Eye v-else :size="14" />
                  </button>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button
                type="submit"
                class="admin-btn admin-btn-primary"
                :disabled="changingPassword"
              >
                <Loader2 v-if="changingPassword" :size="13" class="spin-icon" />
                <ShieldCheck v-else :size="13" />
                {{ changingPassword ? "Updating…" : "Update Password" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Language Preference -->
      <div class="admin-card settings-card">
        <div class="admin-card-header">
          <h3 class="card-title">
            <Globe :size="16" class="card-icon" /> Language
          </h3>
        </div>
        <div class="admin-card-body">
          <div class="settings-section-desc">
            Select the language for the admin interface.
          </div>
          <div class="lang-pills">
            <button type="button" class="lang-pill active">🇬🇧 English</button>
            <button type="button" class="lang-pill">🇰🇭 ខ្មែរ</button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="admin-card settings-card danger-card">
        <div class="admin-card-header">
          <h3 class="card-title danger-title">
            <LogOut :size="16" class="card-icon" /> Sign Out
          </h3>
        </div>
        <div class="admin-card-body">
          <p class="settings-section-desc">
            Sign out of your KDRC administrator account on this device.
          </p>
          <button
            type="button"
            class="admin-btn admin-btn-danger signout-btn"
            @click="logout"
          >
            <LogOut :size="14" /> Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <p v-if="toastMsg" class="admin-toast" :class="{ error: toastError }">
        {{ toastMsg }}
      </p>
    </Transition>
  </section>
</template>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.card-icon {
  color: var(--admin-accent);
}

.settings-section-desc {
  font-size: 0.82rem;
  color: var(--admin-muted);
  margin-bottom: 1rem;
}

/* Preferences row */
.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
}

.pref-info {
  flex: 1;
}

.pref-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--admin-text);
  margin: 0;
}

.pref-desc {
  font-size: 0.78rem;
  color: var(--admin-muted);
  margin: 0.2rem 0 0;
}

.pref-divider {
  height: 1px;
  background: var(--admin-border);
  margin: 0.75rem 0;
}

/* Theme toggle */
.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.theme-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.theme-icon-wrap.light-mode {
  background: #fef6e8;
  color: #d4920a;
}

.theme-icon-wrap.dark-mode {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.theme-toggle-track {
  width: 42px;
  height: 22px;
  background: var(--admin-border);
  border-radius: 999px;
  padding: 2px;
  transition: background 0.25s ease;
  position: relative;
}

.theme-toggle-track.active {
  background: var(--admin-accent);
}

.theme-toggle-thumb {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s ease;
  position: absolute;
  top: 2px;
  left: 2px;
}

.theme-toggle-thumb.active {
  transform: translateX(20px);
}

/* Form row */
.settings-form-row {
  margin-top: 0;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Password inputs */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.pw-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.pw-icon {
  position: absolute;
  left: 0.7rem;
  color: var(--admin-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.pw-input-wrap input {
  width: 100%;
  padding-left: 2.2rem !important;
  padding-right: 2.4rem !important;
}

.pw-toggle {
  position: absolute;
  right: 0.7rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--admin-muted);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.pw-toggle:hover {
  color: var(--admin-text);
}

.match-icon {
  color: var(--admin-accent);
}

.input-mismatch {
  border-color: var(--admin-danger) !important;
  box-shadow: 0 0 0 3px rgba(220, 76, 76, 0.12) !important;
}

/* Language pills */
.lang-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.lang-pill {
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lang-pill:hover {
  border-color: var(--admin-accent);
  color: var(--admin-accent);
}

.lang-pill.active {
  background: var(--admin-accent);
  border-color: var(--admin-accent);
  color: #fff;
}

/* Danger zone */
.danger-card .admin-card-header {
  border-bottom-color: rgba(220, 76, 76, 0.2);
}

.danger-title {
  color: var(--admin-danger);
}

.signout-btn {
  margin-top: 0.25rem;
}

/* Spinner */
.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Toast transition */
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
