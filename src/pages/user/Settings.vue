<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Moon, 
  Sun, 
  Camera, 
  LogOut, 
  Loader2, 
  Save, 
  Check 
} from "lucide-vue-next";
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadAvatarFile, 
  changeUserPassword 
} from "../../services/userApi";
import { useTheme } from "../../composables/useTheme";
import { useLanguage } from "../../composables/useLanguage";
import { useAuth } from "../../stores/useAuth";

const toast = useToast();
const { isDark, toggleTheme } = useTheme();
const { currentLang, setLanguage } = useLanguage();
const { logout, user: authUser } = useAuth();

// Loading states
const pageLoading = ref(true);
const savingProfile = ref(false);
const changingPassword = ref(false);
const uploadingAvatar = ref(false);

// Form refs
const id = ref("");
const name = ref("");
const email = ref("");
const phoneNumber = ref("");
const bio = ref("");
const avatarUrl = ref("");

// Password fields
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Translations dictionary
const translations = {
  EN: {
    title: "Account Settings",
    subtitle: "Manage your profile, credentials, and preferences.",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    bio: "Short Bio",
    saveChanges: "Save Changes",
    saving: "Saving...",
    changePassword: "Security & Password",
    oldPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Update Password",
    preferences: "Application Preferences",
    language: "Preferred Language",
    theme: "Color Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    logout: "Sign Out",
    logoutDesc: "Sign out of your account on this device.",
    uploading: "Uploading...",
    successSave: "Profile updated successfully!",
    successPassword: "Password updated successfully!",
    errorPasswordMatch: "Passwords do not match!",
    errorGeneric: "An error occurred. Please try again.",
    validationPhone: "Please enter a valid phone number",
    passwordPlaceholder: "Enter password"
  },
  KH: {
    title: "ការកំណត់គណនី",
    subtitle: "គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន លិខិតសម្គាល់ និងចំណង់ចំណូលចិត្តរបស់អ្នក។",
    personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
    fullName: "ឈ្មោះ​ពេញ",
    email: "អាសយដ្ឋាន​អ៊ីមែល",
    phone: "លេខទូរស័ព្ទ",
    bio: "ជីវប្រវត្តិសង្ខេប",
    saveChanges: "រក្សាទុកការផ្លាស់ប្តូរ",
    saving: "កំពុងរក្សាទុក...",
    changePassword: "សុវត្ថិភាព និងពាក្យសម្ងាត់",
    oldPassword: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
    newPassword: "ពាក្យសម្ងាត់ថ្មី",
    confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    updatePassword: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",
    preferences: "ចំណង់ចំណូលចិត្តកម្មវិធី",
    language: "ភាសាដែលចង់បាន",
    theme: "រចនាប័ទ្មពណ៌",
    lightMode: "រចនាប័ទ្មភ្លឺ",
    darkMode: "រចនាប័ទ្មងងឹត",
    logout: "ចាកចេញពីគណនី",
    logoutDesc: "ចាកចេញពីគណនីរបស់អ្នកនៅលើឧបករណ៍នេះ។",
    uploading: "កំពុងផ្ទុកឡើង...",
    successSave: "បានធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបដោយជោគជ័យ!",
    successPassword: "បានធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ដោយជោគជ័យ!",
    errorPasswordMatch: "ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!",
    errorGeneric: "មានកំហុសមួយបានកើតឡើង។ សូមព្យាយាមម្តងទៀត។",
    validationPhone: "សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ",
    passwordPlaceholder: "បញ្ចូលពាក្យសម្ងាត់"
  }
};

const t = computed(() => {
  const lang = (currentLang.value === "KH") ? "KH" : "EN";
  return translations[lang];
});

// Load profile data
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
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    pageLoading.value = false;
  }
};

// Handle personal info saving
const saveProfile = async () => {
  savingProfile.value = true;
  try {
    const updated = await updateUserProfile({
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      bio: bio.value
    });
    // Sync store authUser state immediately
    if (authUser.value) {
      authUser.value.name = updated.name;
      authUser.value.email = updated.email;
    }
    toast.success(t.value.successSave);
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    savingProfile.value = false;
  }
};

// Handle password change
const savePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error(t.value.errorPasswordMatch);
    return;
  }
  
  changingPassword.value = true;
  try {
    await changeUserPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    });
    toast.success(t.value.successPassword);
    // Clear password fields
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    changingPassword.value = false;
  }
};

// Handle avatar upload
const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingAvatar.value = true;
  try {
    const result = await uploadAvatarFile(file);
    if (result?.url) {
      avatarUrl.value = result.url;
      // Persist url directly to user profile
      const updated = await updateUserProfile({ avatarUrl: result.url });
      
      // Sync store authUser state
      if (authUser.value) {
        authUser.value.avatarUrl = updated.avatarUrl;
      }
      
      toast.success("Avatar uploaded and updated!");
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
  <div class="relative flex h-screen overflow-hidden bg-[#F6F1E8] dark:bg-[#171612] text-[var(--text)] transition-colors duration-300">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <!-- Sticky Navbar -->
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-3 sm:p-4 lg:p-6">
          <!-- Breadcrumb -->
          <div class="text-[10px] sm:text-[11px] lg:text-sm uppercase tracking-[0.15em] text-gray-500 mb-4 sm:mb-6">
            Atelier >
            <span class="font-bold text-black dark:text-white">{{ t.title }}</span>
          </div>

          <!-- Top loading state -->
          <div v-if="pageLoading" class="flex flex-col items-center justify-center min-h-[50vh] py-12">
            <Loader2 class="w-12 h-12 animate-spin text-[#0f6d5f] dark:text-[#4cc2a5] mb-4" />
            <p class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400">Loading settings...</p>
          </div>

          <div v-else class="space-y-8 animate-fadeIn max-w-4xl">
            
            <!-- Header -->
            <div class="border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)] my-0 leading-tight">
                  {{ t.title }}
                </h1>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ t.subtitle }}
                </p>
              </div>
              <button 
                type="button"
                @click="logout"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold text-sm shadow-sm hover:bg-red-50 dark:hover:bg-red-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <LogOut class="w-4 h-4" />
                {{ t.logout }}
              </button>
            </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column - Profile Picture & Quick Meta -->
          <div class="space-y-6 lg:col-span-1">
            <div class="bg-white/60 dark:bg-[#1f1e1a]/60 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
              
              <!-- Profile Avatar -->
              <div class="relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#2f2a22] shadow-md">
                <img 
                  v-if="avatarUrl"
                  :src="avatarUrl" 
                  alt="User Avatar"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-[#0f6d5f] to-[#4cc2a5] flex items-center justify-center text-white text-3xl font-bold uppercase">
                  {{ name ? name.charAt(0) : email.charAt(0) }}
                </div>

                <!-- Hover Overlay -->
                <label class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <Camera class="w-6 h-6 text-white mb-1" />
                  <span class="text-xs text-white font-medium">Change</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="onFileSelected"
                    :disabled="uploadingAvatar"
                  />
                </label>

                <!-- Uploading state -->
                <div v-if="uploadingAvatar" class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 class="w-8 h-8 animate-spin text-white mb-1" />
                  <span class="text-[10px] text-white font-medium">{{ t.uploading }}</span>
                </div>
              </div>

              <!-- Quick Meta -->
              <h2 class="mt-4 text-xl font-bold text-[var(--text-h)] my-0 leading-tight">
                {{ name || "Reader & Writer" }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full">
                {{ email }}
              </p>
              
              <div class="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-xs font-semibold">
                <Check class="w-3 h-3" />
                Active Account
              </div>
            </div>
            
            <!-- Preference Cards -->
            <div class="bg-white/60 dark:bg-[#1f1e1a]/60 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 space-y-6 shadow-lg">
              <h3 class="text-base font-bold text-[var(--text-h)] flex items-center gap-2">
                <Globe class="w-4 h-4 text-[#0f6d5f] dark:text-[#4cc2a5]" />
                {{ t.preferences }}
              </h3>
              
              <!-- Language selector -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t.language }}
                </label>
                <div class="flex p-1 rounded-lg bg-gray-100 dark:bg-[#171612] border border-[var(--border)]">
                  <button 
                    type="button"
                    @click="setLanguage('EN')"
                    class="flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer"
                    :class="currentLang === 'EN' ? 'bg-[#0f6d5f] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-[var(--text-h)]'"
                  >
                    English
                  </button>
                  <button 
                    type="button"
                    @click="setLanguage('KH')"
                    class="flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer"
                    :class="currentLang === 'KH' ? 'bg-[#0f6d5f] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-[var(--text-h)]'"
                  >
                    ខ្មែរ
                  </button>
                </div>
              </div>

              <!-- Theme Toggle -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t.theme }}
                </label>
                <button 
                  type="button"
                  @click="toggleTheme"
                  class="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm font-medium cursor-pointer"
                >
                  <span class="flex items-center gap-2">
                    <Sun v-if="!isDark" class="w-4 h-4 text-orange-500" />
                    <Moon v-else class="w-4 h-4 text-indigo-400" />
                    {{ isDark ? t.darkMode : t.lightMode }}
                  </span>
                  
                  <!-- Switch UI -->
                  <div class="w-10 h-6 bg-gray-200 dark:bg-[#2f2a22] rounded-full p-0.5 transition-colors" :class="{ 'bg-emerald-500!': isDark }">
                    <div class="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform" :class="{ 'translate-x-4': isDark }"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Form Fields -->
          <div class="space-y-6 lg:col-span-2">
            
            <!-- Personal Info Card -->
            <form @submit.prevent="saveProfile" class="bg-white/60 dark:bg-[#1f1e1a]/60 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 shadow-lg space-y-6">
              <h3 class="text-lg font-bold text-[var(--text-h)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
                <User class="w-5 h-5 text-[#0f6d5f] dark:text-[#4cc2a5]" />
                {{ t.personalInfo }}
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full name -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t.fullName }}
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User class="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      v-model="name"
                      class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                </div>

                <!-- Email Address -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t.email }}
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail class="w-4 h-4" />
                    </span>
                    <input 
                      type="email" 
                      v-model="email"
                      class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                      placeholder="e.g. john@example.com"
                      required
                    />
                  </div>
                </div>

                <!-- Phone number -->
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t.phone }}
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone class="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      v-model="phoneNumber"
                      class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                      placeholder="e.g. +855 12 345 678"
                    />
                  </div>
                </div>

                <!-- Bio -->
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t.bio }}
                  </label>
                  <textarea 
                    v-model="bio"
                    rows="3"
                    class="block w-full px-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)] resize-none"
                    placeholder="Tell something about yourself..."
                  ></textarea>
                </div>
              </div>

              <!-- Save profile button -->
              <div class="flex justify-end pt-2">
                <button 
                  type="submit"
                  :disabled="savingProfile"
                  class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0f6d5f] dark:bg-[#4cc2a5] text-white dark:text-[#093A3F] font-bold text-sm shadow-md hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <Loader2 v-if="savingProfile" class="w-4 h-4 animate-spin" />
                  <Save v-else class="w-4 h-4" />
                  {{ savingProfile ? t.saving : t.saveChanges }}
                </button>
              </div>
            </form>

            <!-- Password Card -->
            <form @submit.prevent="savePassword" class="bg-white/60 dark:bg-[#1f1e1a]/60 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 shadow-lg space-y-6">
              <h3 class="text-lg font-bold text-[var(--text-h)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
                <Lock class="w-5 h-5 text-[#0f6d5f] dark:text-[#4cc2a5]" />
                {{ t.changePassword }}
              </h3>

              <div class="grid grid-cols-1 gap-6">
                <!-- Current Password -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t.oldPassword }}
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock class="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      v-model="oldPassword"
                      class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                      :placeholder="t.passwordPlaceholder"
                      required
                    />
                  </div>
                </div>

                <!-- New Password & Confirm -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ t.newPassword }}
                    </label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock class="w-4 h-4" />
                      </span>
                      <input 
                        type="password" 
                        v-model="newPassword"
                        class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                        :placeholder="t.passwordPlaceholder"
                        required
                        minlength="6"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ t.confirmPassword }}
                    </label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock class="w-4 h-4" />
                      </span>
                      <input 
                        type="password" 
                        v-model="confirmPassword"
                        class="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#171612] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:border-[#0f6d5f] dark:focus:border-[#4cc2a5] focus:ring-2 focus:ring-[#0f6d5f]/10 dark:focus:ring-[#4cc2a5]/10 transition-all text-[var(--text-h)]"
                        :placeholder="t.passwordPlaceholder"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save password button -->
              <div class="flex justify-end pt-2">
                <button 
                  type="submit"
                  :disabled="changingPassword"
                  class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm shadow-md hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <Loader2 v-if="changingPassword" class="w-4 h-4 animate-spin" />
                  <Lock v-else class="w-4 h-4" />
                  {{ changingPassword ? t.saving : t.updatePassword }}
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
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
