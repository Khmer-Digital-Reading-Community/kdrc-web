<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../services/api';
import { updateMyProfile } from '../../services/adminApi';
import { uploadAvatarFile } from '../../services/userApi';
import {
  Camera,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  CalendarDays,
  Check,
  Settings,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { authState } from '../../services/auth';

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const uploadingAvatar = ref(false);
const toastMsg = ref('');
const toastError = ref(false);

const form = ref({
  name: '',
  email: '',
  bio: '',
  phoneNumber: '',
  avatarUrl: '',
  role: 'admin',
  createdAt: '',
});

const showToast = (msg: string, err = false) => {
  toastMsg.value = msg;
  toastError.value = err;
  setTimeout(() => { toastMsg.value = ''; }, 3500);
};

const initials = computed(() => {
  if (form.value.name) return form.value.name.charAt(0).toUpperCase();
  if (form.value.email) return form.value.email.charAt(0).toUpperCase();
  return 'A';
});

const joinedFormatted = computed(() => {
  if (!form.value.createdAt) return '—';
  return new Date(form.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
});

onMounted(async () => {
  try {
    const user = await api.get('/users/me').then((r) => r.data);
    console.log('Loaded admin profile user:', user);
    form.value = {
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      phoneNumber: user.phoneNumber || '',
      avatarUrl: user.avatarUrl || '',
      role: user.role || 'admin',
      createdAt: user.createdAt || '',
    };
  } catch (err: any) {
    console.error('Failed to load profile:', err);
    showToast('Could not load profile: ' + (err.response?.data?.message || err.message), true);
  } finally {
    loading.value = false;
  }
});

const saveProfile = async () => {
  saving.value = true;
  try {
    console.log('Saving admin profile data:', { name: form.value.name, bio: form.value.bio });
    await updateMyProfile({ name: form.value.name, bio: form.value.bio });
    if (authState.user.value) {
      authState.user.value.name = form.value.name;
    }
    showToast('Profile saved successfully!');
  } catch (err: any) {
    console.error('Failed to save admin profile:', err);
    const apiData = err.response?.data;
    const nestedData = apiData && typeof apiData === 'object' ? (apiData as any).data : null;
    let errMsg = (nestedData && nestedData.message) || apiData?.message || apiData?.error || err.message || 'Please try again.';
    if (nestedData && Array.isArray(nestedData.errors)) {
      errMsg = nestedData.errors.join('; ');
    } else if (nestedData && nestedData.errors) {
      errMsg = String(nestedData.errors);
    }
    showToast('Save failed: ' + errMsg, true);
  } finally {
    saving.value = false;
  }
};

const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  uploadingAvatar.value = true;
  try {
    const result = await uploadAvatarFile(file);
    if (result?.url) {
      form.value.avatarUrl = result.url;
      await updateMyProfile({ avatarUrl: result.url } as any);
      if (authState.user.value) {
        authState.user.value.avatarUrl = result.url;
      }
      showToast('Avatar updated!');
    }
  } catch {
    showToast('Failed to upload avatar', true);
  } finally {
    uploadingAvatar.value = false;
  }
};
</script>

<template>
  <section class="admin-page">
    <!-- Header -->
    <div class="admin-page-header">
      <div>
        <h2>My Profile</h2>
        <p>Manage your administrator identity and personal information.</p>
      </div>
      <button type="button" class="admin-btn admin-btn-secondary profile-settings-btn" @click="router.push('/admin/settings')">
        <Settings :size="15" />
        Settings
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="admin-loading">
      <Loader2 class="spin-icon" :size="32" />
      <p>Loading profile…</p>
    </div>

    <template v-else>
      <!-- Hero Profile Card -->
      <div class="profile-hero-card">
        <!-- Banner -->
        <div class="profile-banner">
          <div class="banner-orb banner-orb-1"></div>
          <div class="banner-orb banner-orb-2"></div>
        </div>

        <!-- Avatar + Meta -->
        <div class="profile-hero-body">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar-outer">
              <div class="profile-avatar group">
                <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="Avatar" class="avatar-img" />
                <div v-else class="avatar-initials">{{ initials }}</div>

                <!-- Upload overlay -->
                <label class="avatar-overlay">
                  <Camera v-if="!uploadingAvatar" :size="20" color="white" />
                  <Loader2 v-else :size="20" color="white" class="spin-icon" />
                  <span>{{ uploadingAvatar ? 'Uploading…' : 'Change' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="onFileSelected" :disabled="uploadingAvatar" />
                </label>
              </div>
            </div>
          </div>

          <div class="profile-meta">
            <div class="profile-meta-left">
              <h3 class="profile-name">{{ form.name || 'Administrator' }}</h3>
              <p class="profile-email">{{ form.email }}</p>
              <div class="profile-badges">
                <span class="badge badge-admin">
                  <Shield :size="11" />
                  Administrator
                </span>
                <span class="badge badge-active">
                  <Check :size="11" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Strip -->
      <div class="profile-stats-grid">
        <div class="profile-stat-card">
          <div class="stat-icon stat-icon-green">
            <Shield :size="18" />
          </div>
          <div>
            <p class="stat-label">Role</p>
            <p class="stat-value capitalize">{{ form.role }}</p>
          </div>
        </div>
        <div class="profile-stat-card">
          <div class="stat-icon stat-icon-blue">
            <CalendarDays :size="18" />
          </div>
          <div>
            <p class="stat-label">Member Since</p>
            <p class="stat-value">{{ joinedFormatted }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Form Card -->
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="flex items-center gap-2">
            <User :size="16" /> Personal Information
          </h3>
        </div>
        <div class="admin-card-body">
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="profile-form-grid">
              <!-- Name -->
              <div class="admin-form-group">
                <label for="admin-name">Display Name</label>
                <div class="input-icon-wrap">
                  <User :size="15" class="input-icon" />
                  <input id="admin-name" v-model="form.name" type="text" required placeholder="e.g. Admin User" />
                </div>
              </div>

              <!-- Email (readonly) -->
              <div class="admin-form-group">
                <label for="admin-email">Email Address <span class="label-badge">Read-only</span></label>
                <div class="input-icon-wrap">
                  <Mail :size="15" class="input-icon" />
                  <input id="admin-email" v-model="form.email" type="email" disabled class="input-disabled" />
                </div>
              </div>

              <!-- Bio -->
              <div class="admin-form-group full-width">
                <label for="admin-bio">Short Bio</label>
                <textarea id="admin-bio" v-model="form.bio" rows="3" placeholder="A short bio about yourself…" class="profile-textarea"></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="admin-btn admin-btn-primary" :disabled="saving">
                <Loader2 v-if="saving" :size="14" class="spin-icon" />
                <Save v-else :size="14" />
                {{ saving ? 'Saving…' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

    <!-- Toast -->
    <Transition name="toast">
      <p v-if="toastMsg" class="admin-toast" :class="{ error: toastError }">{{ toastMsg }}</p>
    </Transition>
  </section>
</template>

<style scoped>
/* ——— Hero Card ——— */
.profile-hero-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  overflow: hidden;
}

.profile-banner {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #0d4a34 0%, #1a7a55 50%, #3aa876 100%);
  overflow: hidden;
}

.banner-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
}
.banner-orb-1 {
  width: 200px; height: 200px;
  top: -80px; right: -40px;
}
.banner-orb-2 {
  width: 120px; height: 120px;
  bottom: -60px; left: 15%;
}

.profile-hero-body {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.profile-avatar-wrap {
  margin-top: -44px;
}

.profile-avatar-outer {
  border-radius: 18px;
  border: 4px solid var(--admin-surface);
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  overflow: hidden;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
}

.profile-avatar {
  position: relative;
  width: 100%;
  height: 100%;
}

.avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-avatar:hover .avatar-img {
  transform: scale(1.08);
}

.avatar-initials {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #1a7a55, #3aa876);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 800;
}

.avatar-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.25s ease;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

input.hidden { display: none; }

.profile-meta {
  flex: 1;
  padding-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.profile-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text);
  letter-spacing: -0.02em;
}

.profile-email {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--admin-muted);
}

.profile-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge-admin {
  background: var(--admin-accent-soft);
  color: var(--admin-accent);
  border: 1px solid rgba(61, 107, 79, 0.2);
}

.badge-active {
  background: var(--admin-badge-success-bg);
  color: var(--admin-badge-success-text);
}

/* ——— Stats Strip ——— */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.profile-stat-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--admin-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.08);
}

.stat-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.stat-icon-green { background: var(--admin-accent-soft); color: var(--admin-accent); }
.stat-icon-blue { background: var(--admin-stat-blue-bg); color: var(--admin-info); }

.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--admin-muted);
  margin: 0;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
  margin: 0.15rem 0 0;
}

/* ——— Form ——— */
.profile-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.full-width {
  grid-column: 1 / -1;
}

.input-icon-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--admin-muted);
  pointer-events: none;
}

.input-icon-wrap input {
  padding-left: 2.25rem !important;
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.label-badge {
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.05rem 0.4rem;
  border-radius: 4px;
  background: var(--admin-badge-neutral-bg);
  color: var(--admin-badge-neutral-text);
  vertical-align: middle;
}

.profile-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-sm);
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--admin-surface);
  color: var(--admin-text);
  resize: vertical;
  min-height: 90px;
}

.profile-textarea:focus {
  outline: none;
  border-color: var(--admin-accent);
  box-shadow: 0 0 0 3px var(--admin-accent-soft);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.profile-settings-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* ——— Spinner ——— */
.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ——— Toast transition ——— */
.toast-enter-active, .toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .profile-form-grid { grid-template-columns: 1fr; }
  .profile-hero-body { gap: 1rem; }
}
</style>
