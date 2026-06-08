<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  Check,
  CalendarDays,
  Sparkles,
  Settings,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatarFile,
} from "../../services/userApi";
import { useAuth } from "../../stores/useAuth";
import { useLanguage } from "../../composables/useLanguage";

const toast = useToast();
const router = useRouter();
const { user: authUser } = useAuth();
const { currentLang } = useLanguage();

const pageLoading = ref(true);
const savingProfile = ref(false);
const uploadingAvatar = ref(false);

const id = ref("");
const name = ref("");
const email = ref("");
const phoneNumber = ref("");
const bio = ref("");
const avatarUrl = ref("");
const role = ref("");
const createdAt = ref("");

const translations = {
  EN: {
    profile: "My Profile",
    subtitle: "Your public identity on KDRC",
    editProfile: "Edit Profile",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    bio: "Short Bio",
    readOnly: "Read-only",
    bioPlaceholder: "Write a short bio about yourself...",
    saveChanges: "Save Changes",
    saving: "Saving...",
    uploading: "Uploading...",
    joined: "Member since",
    role: "Role",
    goToSettings: "Settings",
    successSave: "Profile updated successfully!",
    errorGeneric: "An error occurred. Please try again.",
    activeAccount: "Active Account",
    writer: "Writer & Reader",
  },
  KH: {
    profile: "ប្រវត្តិរូបរបស់ខ្ញុំ",
    subtitle: "អត្តសញ្ញាណសាធារណៈរបស់អ្នកនៅ KDRC",
    editProfile: "កែប្រែប្រវត្តិរូប",
    personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
    fullName: "ឈ្មោះ​ពេញ",
    email: "អាសយដ្ឋាន​អ៊ីមែល",
    phone: "លេខទូរស័ព្ទ",
    bio: "ជីវប្រវត្តិសង្ខេប",
    readOnly: "បានតែអាន",
    bioPlaceholder: "សរសេរជីវប្រវត្តិសង្ខេបអំពីខ្លួនឯង...",
    saveChanges: "រក្សាទុកការផ្លាស់ប្តូរ",
    saving: "កំពុងរក្សាទុក...",
    uploading: "កំពុងផ្ទុកឡើង...",
    joined: "សមាជិកចាប់ពី",
    role: "តួនាទី",
    goToSettings: "ការកំណត់",
    successSave: "បានធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបដោយជោគជ័យ!",
    errorGeneric: "មានកំហុសមួយបានកើតឡើង។ សូមព្យាយាមម្តងទៀត។",
    activeAccount: "គណនីសកម្ម",
    writer: "អ្នកសរសេរ & អ្នកអាន",
  },
};

const t = computed(() => {
  const lang = currentLang.value === "KH" ? "KH" : "EN";
  return translations[lang];
});

const joinedFormatted = computed(() => {
  if (!createdAt.value) return "—";
  return new Date(createdAt.value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
});

const initials = computed(() => {
  if (name.value) return name.value.charAt(0).toUpperCase();
  if (email.value) return email.value.charAt(0).toUpperCase();
  return "U";
});

const loadProfile = async () => {
  pageLoading.value = true;
  try {
    const profile = await getUserProfile();
    id.value = profile.id;
    name.value = profile.name || "";
    email.value = profile.email || "";
    phoneNumber.value = profile.phoneNumber || "";
    bio.value = profile.bio || "";
    avatarUrl.value = profile.avatarUrl || "";
    role.value = profile.role || "user";
    createdAt.value = profile.createdAt || "";
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    pageLoading.value = false;
  }
};

const saveProfile = async () => {
  savingProfile.value = true;
  try {
    const updated = await updateUserProfile({
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      bio: bio.value,
    });
    if (authUser.value) {
      authUser.value.name = updated.name;
      authUser.value.email = updated.email;
      authUser.value.phoneNumber = updated.phoneNumber;
      (authUser.value as any).bio = updated.bio;
    }
    toast.success(t.value.successSave);
  } catch (error: any) {
    const apiData = error.response?.data;
    const nestedData = apiData && typeof apiData === 'object' ? (apiData as any).data : null;
    let errMsg = (nestedData && nestedData.message) || apiData?.message || apiData?.error || error.message || t.value.errorGeneric;
    if (nestedData && Array.isArray(nestedData.errors)) {
      errMsg = nestedData.errors.join('; ');
    } else if (nestedData && nestedData.errors) {
      errMsg = String(nestedData.errors);
    }
    toast.error(errMsg);
  } finally {
    savingProfile.value = false;
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
      avatarUrl.value = result.url;
      const updated = await updateUserProfile({ avatarUrl: result.url });
      if (authUser.value) {
        authUser.value.avatarUrl = updated.avatarUrl;
      }
      toast.success("Avatar updated!");
    }
  } catch (error: any) {
    toast.error(error?.message || "Failed to upload avatar");
  } finally {
    uploadingAvatar.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div class="profile-root relative flex h-screen overflow-hidden text-[var(--text)] transition-colors duration-300">
    <Sidebar />
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="p-3 sm:p-4 lg:p-6">
          <!-- Breadcrumb -->
          <div class="text-[10px] sm:text-[11px] lg:text-sm uppercase tracking-[0.15em] text-gray-500 mb-4 sm:mb-6">
            Atelier &gt;
            <span class="font-bold text-black dark:text-white">{{ t.profile }}</span>
          </div>

          <!-- Loading -->
          <div v-if="pageLoading" class="flex flex-col items-center justify-center min-h-[50vh] py-12">
            <Loader2 class="w-12 h-12 animate-spin text-[#0f6d5f] dark:text-[#4cc2a5] mb-4" />
            <p class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>

          <div v-else class="profile-page animate-fadeIn max-w-5xl">
            <!-- Header -->
            <div class="profile-page-header">
              <div>
                <h2>{{ t.profile }}</h2>
                <p>{{ t.subtitle }}</p>
              </div>
              <button type="button" class="profile-btn profile-btn-secondary profile-settings-btn" @click="router.push('/settings')">
                <Settings :size="15" />
                {{ t.goToSettings }}
              </button>
            </div>

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
                      <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                      <div v-else class="avatar-initials">{{ initials }}</div>

                      <!-- Upload overlay -->
                      <label class="avatar-overlay">
                        <Camera v-if="!uploadingAvatar" :size="20" color="white" />
                        <Loader2 v-else :size="20" color="white" class="spin-icon" />
                        <span>{{ uploadingAvatar ? t.uploading : 'Change' }}</span>
                        <input type="file" accept="image/*" class="hidden" @change="onFileSelected" :disabled="uploadingAvatar" />
                      </label>
                    </div>
                  </div>
                </div>

                <div class="profile-meta">
                  <div class="profile-meta-left">
                    <h3 class="profile-name">{{ name || t.writer }}</h3>
                    <p class="profile-email">{{ email }}</p>
                    <div class="profile-badges">
                      <span class="badge badge-user">
                        <Sparkles :size="11" />
                        {{ role }}
                      </span>
                      <span class="badge badge-active">
                        <Check :size="11" />
                        {{ t.activeAccount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Strip -->
            <div class="profile-stats-grid">
              <div class="profile-stat-card">
                <div class="stat-icon stat-icon-teal">
                  <Sparkles :size="18" />
                </div>
                <div>
                  <p class="stat-label">{{ t.role }}</p>
                  <p class="stat-value capitalize">{{ role || '—' }}</p>
                </div>
              </div>
              <div class="profile-stat-card">
                <div class="stat-icon stat-icon-blue">
                  <CalendarDays :size="18" />
                </div>
                <div>
                  <p class="stat-label">{{ t.joined }}</p>
                  <p class="stat-value">{{ joinedFormatted }}</p>
                </div>
              </div>
            </div>

            <!-- Edit Form Card -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="flex items-center gap-2">
                  <User :size="16" /> {{ t.personalInfo }}
                </h3>
              </div>
              <div class="profile-card-body">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <div class="profile-form-grid">
                    <!-- Name -->
                    <div class="profile-form-group">
                      <label for="user-name">{{ t.fullName }}</label>
                      <div class="input-icon-wrap">
                        <User :size="15" class="input-icon" />
                        <input id="user-name" v-model="name" type="text" required placeholder="e.g. John Doe" />
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="profile-form-group">
                      <label for="user-email">{{ t.email }} <span class="label-badge">{{ t.readOnly }}</span></label>
                      <div class="input-icon-wrap">
                        <Mail :size="15" class="input-icon" />
                        <input id="user-email" v-model="email" type="email" disabled class="input-disabled" />
                      </div>
                    </div>

                    <!-- Phone -->
                    <div class="profile-form-group">
                      <label for="user-phone">{{ t.phone }}</label>
                      <div class="input-icon-wrap">
                        <Phone :size="15" class="input-icon" />
                        <input id="user-phone" v-model="phoneNumber" type="text" placeholder="e.g. +855 12 345 678" />
                      </div>
                    </div>

                    <!-- Bio -->
                    <div class="profile-form-group full-width">
                      <label for="user-bio">{{ t.bio }}</label>
                      <textarea id="user-bio" v-model="bio" rows="3" :placeholder="t.bioPlaceholder" class="profile-textarea"></textarea>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="profile-btn profile-btn-primary" :disabled="savingProfile">
                      <Loader2 v-if="savingProfile" :size="14" class="spin-icon" />
                      <Save v-else :size="14" />
                      {{ savingProfile ? t.saving : t.saveChanges }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.profile-root {
  background: #ffffff;
}

:global(.dark) .profile-root {
  background: #171612;
}

/* ——— Page Layout ——— */
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.profile-page-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-h);
}

.profile-page-header p {
  margin: 0;
  color: var(--text-muted, #6b7c6f);
  font-size: 0.9rem;
}

/* ——— Hero Card ——— */
.profile-hero-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 22, 17, 0.06), 0 8px 24px rgba(15, 22, 17, 0.04);
  overflow: hidden;
}

:global(.dark) .profile-hero-card {
  background: #1f1e1a;
}

.profile-banner {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #0f6d5f 0%, #1a8a78 50%, #4cc2a5 100%);
  overflow: hidden;
}

.banner-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}

.banner-orb-1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -40px;
}

.banner-orb-2 {
  width: 120px;
  height: 120px;
  bottom: -60px;
  left: 15%;
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
  border: 4px solid #ffffff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  overflow: hidden;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
  background: #ffffff;
}

:global(.dark) .profile-avatar-outer {
  border-color: #1f1e1a;
  background: #1f1e1a;
}

.profile-avatar {
  position: relative;
  width: 100%;
  height: 100%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-avatar:hover .avatar-img {
  transform: scale(1.08);
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f6d5f, #4cc2a5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 800;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  color: var(--text-h);
  letter-spacing: -0.02em;
}

.profile-email {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #6b7c6f);
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

.badge-user {
  background: rgba(15, 109, 95, 0.1);
  color: #0f6d5f;
  border: 1px solid rgba(15, 109, 95, 0.2);
}

:global(.dark) .badge-user {
  background: rgba(76, 194, 165, 0.15);
  color: #4cc2a5;
  border: 1px solid rgba(76, 194, 165, 0.2);
}

.badge-active {
  background: #e8f5ec;
  color: #2d6a4f;
  border: 1px solid rgba(45, 106, 79, 0.2);
}

:global(.dark) .badge-active {
  background: rgba(143, 212, 168, 0.2);
  color: #8fd4a8;
  border: 1px solid rgba(143, 212, 168, 0.3);
}

/* ——— Stats Strip ——— */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.profile-stat-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(15, 22, 17, 0.06), 0 8px 24px rgba(15, 22, 17, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:global(.dark) .profile-stat-card {
  background: #1f1e1a;
}

.profile-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(15, 22, 17, 0.08);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-teal {
  background: rgba(15, 109, 95, 0.1);
  color: #0f6d5f;
}

:global(.dark) .stat-icon-teal {
  background: rgba(76, 194, 165, 0.15);
  color: #4cc2a5;
}

.stat-icon-blue {
  background: rgba(59, 130, 196, 0.1);
  color: #3b82c4;
}

:global(.dark) .stat-icon-blue {
  background: rgba(59, 130, 196, 0.15);
  color: #7eb8e8;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted, #6b7c6f);
  margin: 0;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-h);
  margin: 0.15rem 0 0;
}

/* ——— Profile Card & Form ——— */
.profile-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 22, 17, 0.06), 0 8px 24px rgba(15, 22, 17, 0.04);
  overflow: hidden;
}

:global(.dark) .profile-card {
  background: #1f1e1a;
}

.profile-card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-h);
}

.profile-card-body {
  padding: 1.25rem;
}

.profile-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .profile-form-grid {
    grid-template-columns: 1fr;
  }
}

.profile-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-form-group.full-width {
  grid-column: 1 / -1;
}

.profile-form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
}

.input-icon-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted, #6b7c6f);
  pointer-events: none;
}

.input-icon-wrap input {
  width: 100%;
  padding: 0.65rem 0.75rem 0.65rem 2.25rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  background: #ffffff;
  color: var(--text-h);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:global(.dark) .input-icon-wrap input {
  background: #171612;
}

.input-icon-wrap input:focus {
  border-color: #0f6d5f;
  box-shadow: 0 0 0 3px rgba(15, 109, 95, 0.1);
}

:global(.dark) .input-icon-wrap input:focus {
  border-color: #4cc2a5;
  box-shadow: 0 0 0 3px rgba(76, 194, 165, 0.15);
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
  background: #f0f3f1;
  color: #5a6b5e;
  vertical-align: middle;
}

:global(.dark) .label-badge {
  background: #242e28;
  color: #a8b8ad;
}

.profile-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background: #ffffff;
  color: var(--text-h);
  resize: vertical;
  min-height: 90px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:global(.dark) .profile-textarea {
  background: #171612;
}

.profile-textarea:focus {
  border-color: #0f6d5f;
  box-shadow: 0 0 0 3px rgba(15, 109, 95, 0.1);
}

:global(.dark) .profile-textarea:focus {
  border-color: #4cc2a5;
  box-shadow: 0 0 0 3px rgba(76, 194, 165, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

/* ——— Buttons ——— */
.profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.profile-btn-primary {
  background: #0f6d5f;
  color: #fff;
}

.profile-btn-primary:hover {
  background: #0c574c;
}

:global(.dark) .profile-btn-primary {
  background: #4cc2a5;
  color: #093A3F;
}

:global(.dark) .profile-btn-primary:hover {
  background: #3eb094;
}

.profile-btn-secondary {
  background: #ffffff;
  color: var(--text-h);
  border: 1px solid var(--border);
}

.profile-btn-secondary:hover {
  background: #f6f5f0;
}

:global(.dark) .profile-btn-secondary {
  background: #1f1e1a;
  border-color: var(--border);
}

:global(.dark) .profile-btn-secondary:hover {
  background: #2b2a25;
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

input.hidden {
  display: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.45s ease-out forwards;
}
</style>

