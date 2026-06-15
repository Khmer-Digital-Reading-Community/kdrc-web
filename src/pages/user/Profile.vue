<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  CalendarDays,
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

// Local image uploading refs
const avatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref<string | null>(null);

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
    avatarPreviewUrl.value = profile.avatarUrl || "";
    role.value = profile.role || "user";
    createdAt.value = profile.createdAt || "";
  } catch (error: any) {
    toast.error(error?.message || t.value.errorGeneric);
  } finally {
    pageLoading.value = false;
  }
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    toast.error("Please select a valid image file.");
    target.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error("File size must be under 2MB.");
    target.value = "";
    return;
  }

  // Revoke previous blob url if one exists
  if (avatarPreviewUrl.value && avatarPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }

  avatarFile.value = file;
  avatarPreviewUrl.value = URL.createObjectURL(file);
};

const removeAvatar = () => {
  if (avatarPreviewUrl.value && avatarPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }
  avatarFile.value = null;
  avatarPreviewUrl.value = "";
};

const saveProfile = async () => {
  savingProfile.value = true;
  try {
    let finalAvatarUrl = avatarUrl.value;

    // Upload selected file first, if changed
    if (avatarFile.value) {
      uploadingAvatar.value = true;
      const result = await uploadAvatarFile(avatarFile.value);
      if (result?.url) {
        finalAvatarUrl = result.url;
      }
      uploadingAvatar.value = false;
    } else if (avatarPreviewUrl.value === "") {
      // User cleared the avatar
      finalAvatarUrl = "";
    }

    const updated = await updateUserProfile({
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      bio: bio.value,
      avatarUrl: finalAvatarUrl,
    });

    if (authUser.value) {
      authUser.value.name = updated.name;
      authUser.value.email = updated.email;
      authUser.value.phoneNumber = updated.phoneNumber;
      (authUser.value as any).bio = updated.bio;
      authUser.value.avatarUrl = updated.avatarUrl;
    }

    avatarUrl.value = updated.avatarUrl || "";
    avatarPreviewUrl.value = updated.avatarUrl || "";
    avatarFile.value = null;

    toast.success(t.value.successSave);
  } catch (error: any) {
    const apiData = error.response?.data;
    const nestedData = apiData && typeof apiData === "object" ? (apiData as any).data : null;
    let errMsg =
      (nestedData && nestedData.message) ||
      apiData?.message ||
      apiData?.error ||
      error.message ||
      t.value.errorGeneric;
    if (nestedData && Array.isArray(nestedData.errors)) {
      errMsg = nestedData.errors.join("; ");
    } else if (nestedData && nestedData.errors) {
      errMsg = String(nestedData.errors);
    }
    toast.error(errMsg);
  } finally {
    savingProfile.value = false;
    uploadingAvatar.value = false;
  }
};

onMounted(() => {
  loadProfile();
});

onBeforeUnmount(() => {
  if (avatarPreviewUrl.value && avatarPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }
});
</script>

<template>
  <div class="p-3 sm:p-4 lg:p-6">
    <!-- Loading -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center min-h-[50vh] py-12">
      <Loader2 class="w-12 h-12 animate-spin text-[#0f6d5f] mb-4" />
      <p class="text-sm font-semibold tracking-wide text-gray-500">Loading profile...</p>
    </div>

    <div v-else class="profile-page animate-fadeIn max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 shadow-sm transition-colors duration-300">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight leading-none mb-1.5 font-['Playfair_Display',serif]">{{ t.profile }}</h2>
          <p class="text-xs text-[#7a5b3e]">{{ t.subtitle }}</p>
        </div>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:bg-[#F6F1E8] rounded-xl transition duration-200 shadow-sm"
          @click="router.push('/settings')"
        >
          <Settings :size="14" />
          {{ t.goToSettings }}
        </button>
      </div>

      <!-- Main Columns: Avatar Selection + Main Details -->
      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        
        <!-- Left: Photo/Avatar selection -->
        <div class="flex flex-col gap-6">
          <div class="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm flex flex-col items-center text-center transition-colors duration-300">
            <span class="text-[10px] uppercase font-bold tracking-widest text-[#7a5b3e] mb-6 w-full text-left">Avatar Card</span>
            
            <!-- Avatar Container -->
            <div class="relative w-36 h-36 mb-6">
              <div class="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gradient-to-tr from-[#0f6d5f] to-[#4cc2a5] flex items-center justify-center transition-colors duration-300">
                <img
                  v-if="avatarPreviewUrl"
                  :src="avatarPreviewUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div v-else class="text-white text-5xl font-extrabold font-['Playfair_Display',serif]">
                  {{ initials }}
                </div>
              </div>

              <!-- Clear/Delete Overlay Button in Corner -->
              <button
                v-if="avatarPreviewUrl"
                type="button"
                @click="removeAvatar"
                class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition shadow-md border-2 border-white text-sm font-bold"
                title="Remove photo"
              >
                &times;
              </button>
            </div>

            <!-- Upload CTA -->
            <div class="w-full space-y-3">
              <label class="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-[#0f6d5f] hover:bg-[#0c574c] text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-sm text-center">
                <Camera :size="14" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  class="hidden"
                  @change="onFileSelected"
                />
              </label>

              <button
                v-if="avatarPreviewUrl"
                type="button"
                @click="removeAvatar"
                class="w-full py-1 text-xs font-semibold text-red-600 hover:text-red-700 transition text-center"
              >
                Remove Avatar
              </button>

              <p class="text-[10px] text-gray-400 leading-tight mt-1">PNG or JPG up to 2MB. Updates only after saving changes.</p>
            </div>
          </div>

          <!-- Quick Stats Cards -->
          <div class="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-sm space-y-4 transition-colors duration-300">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <CalendarDays :size="16" />
              </div>
              <div class="text-left">
                <p class="text-[9px] uppercase font-bold tracking-wider text-gray-400">{{ t.joined }}</p>
                <p class="text-xs font-bold text-gray-800 mt-0.5">{{ joinedFormatted }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Edit Form Card -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/50 shadow-sm transition-colors duration-300">
          <h3 class="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <User :size="16" class="text-[#0f6d5f]" />
            {{ t.personalInfo }}
          </h3>

          <form @submit.prevent="saveProfile" class="space-y-6 text-left">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <!-- Name -->
              <div class="space-y-1.5">
                <label for="user-name" class="block text-xs font-bold text-[#7a5b3e]">{{ t.fullName }}</label>
                <div class="relative">
                  <User :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="user-name"
                    v-model="name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150"
                  />
                </div>
              </div>

              <!-- Email (Read-only) -->
              <div class="space-y-1.5">
                <label for="user-email" class="block text-xs font-bold text-[#7a5b3e]">
                  {{ t.email }}
                  <span class="ml-1.5 text-[8px] font-extrabold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider">{{ t.readOnly }}</span>
                </label>
                <div class="relative">
                  <Mail :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="user-email"
                    v-model="email"
                    type="email"
                    disabled
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div class="space-y-1.5 sm:col-span-2">
                <label for="user-phone" class="block text-xs font-bold text-[#7a5b3e]">{{ t.phone }}</label>
                <div class="relative">
                  <Phone :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="user-phone"
                    v-model="phoneNumber"
                    type="text"
                    placeholder="e.g. +855 12 345 678"
                    class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150"
                  />
                </div>
              </div>

              <!-- Bio -->
              <div class="space-y-1.5 sm:col-span-2">
                <label for="user-bio" class="block text-xs font-bold text-[#7a5b3e]">{{ t.bio }}</label>
                <textarea
                  id="user-bio"
                  v-model="bio"
                  rows="4"
                  :placeholder="t.bioPlaceholder"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition duration-150 resize-y min-h-[100px]"
                ></textarea>
              </div>

            </div>

            <!-- Actions -->
            <div class="flex justify-end pt-4 border-t border-gray-100 mt-6">
              <button
                type="submit"
                class="flex items-center gap-2 px-6 py-3 bg-[#0f6d5f] hover:bg-[#0c574c] text-white font-bold text-xs rounded-xl transition duration-150 shadow-md shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="savingProfile || uploadingAvatar"
              >
                <Loader2 v-if="savingProfile || uploadingAvatar" :size="14" class="animate-spin" />
                <Save v-else :size="14" />
                <span>
                  {{ uploadingAvatar ? t.uploading : savingProfile ? t.saving : t.saveChanges }}
                </span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.45s ease-out forwards;
}
</style>
