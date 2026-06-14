<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  MoreVertical,
  Trash2,
  Edit3,
  Globe,
  FileText,
  Archive,
  FileText as FileTextIcon,
  Clock,
} from "lucide-vue-next";
import { apiBaseUrl } from "@/services/api";

const props = defineProps<{
  title: string;
  description?: string;
  words: string;
  edit: string;
  status: string;
  coverImageUrl?: string | null;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
  setStatus: [status: "PUBLISHED" | "DRAFT" | "ARCHIVED"];
}>();

const showMenu = ref(false);
const imageLoaded = ref(false);
const imageError = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const resolveCoverUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${apiBaseUrl}${url}`;
};

const statusConfig = computed(() => {
  const map = {
    PUBLISHED: { label: "Published", bg: "bg-emerald-100", text: "text-emerald-800", ring: "ring-emerald-400/30" },
    DRAFT: { label: "Draft", bg: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-400/30" },
    ARCHIVED: { label: "Archived", bg: "bg-gray-100", text: "text-gray-600", ring: "ring-gray-300/30" },
  };
  return map[props.status as keyof typeof map] || map.DRAFT;
});

const statusActions = computed(() => {
  const actions: { label: string; status: "PUBLISHED" | "DRAFT" | "ARCHIVED"; icon: any }[] = [];
  if (props.status !== "PUBLISHED") actions.push({ label: "Publish", status: "PUBLISHED", icon: Globe });
  if (props.status !== "DRAFT") actions.push({ label: "Move to Drafts", status: "DRAFT", icon: FileText });
  if (props.status !== "ARCHIVED") actions.push({ label: "Archive", status: "ARCHIVED", icon: Archive });
  return actions;
});

const closeMenu = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showMenu.value = false;
  }
};

onMounted(() => document.addEventListener("click", closeMenu));
onUnmounted(() => document.removeEventListener("click", closeMenu));
</script>

<template>
  <article
    class="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
  >
    <!-- Cover area -->
    <div class="relative h-48 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
      <img
        v-if="resolveCoverUrl(coverImageUrl) && !imageError"
        :src="resolveCoverUrl(coverImageUrl)!"
        :alt="title"
        loading="lazy"
        @load="imageLoaded = true"
        @error="imageError = true"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        :class="{ 'opacity-0': !imageLoaded }"
      />
      <!-- Placeholder when no cover -->
      <div
        v-if="!resolveCoverUrl(coverImageUrl) || imageError"
        class="absolute inset-0 flex items-center justify-center"
      >
        <FileTextIcon :size="48" class="text-stone-300" />
      </div>
      <!-- Gradient overlay -->
      <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      <!-- Status badge -->
      <span
        :class="[statusConfig.bg, statusConfig.text, statusConfig.ring]"
        class="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ring-1"
      >
        {{ statusConfig.label }}
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-4">
      <h3 class="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-1">
        {{ title }}
      </h3>
      <p class="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed min-h-[2.5em]">
        {{ description || "No description yet" }}
      </p>

      <!-- Stats row -->
      <div class="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <span class="flex items-center gap-1.5">
          <FileTextIcon :size="13" class="text-gray-300" />
          <span class="font-medium text-gray-600">{{ words }}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <Clock :size="13" class="text-gray-300" />
          <span class="font-medium text-gray-600">{{ edit }}</span>
        </span>
      </div>

      <!-- Spacer pushes actions to bottom -->
      <div class="flex-1" />

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <button
          @click="emit('edit')"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1BC47D] hover:bg-[#16a56a] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shadow-[#1BC47D]/20"
        >
          <Edit3 :size="13" />
          Continue
        </button>

        <!-- Menu -->
        <div ref="menuRef" class="relative">
          <button
            @click.stop="showMenu = !showMenu"
            class="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <MoreVertical :size="18" />
          </button>

          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-90 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90"
          >
            <div
              v-if="showMenu"
              class="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden origin-bottom-right"
            >
              <button
                v-for="action in statusActions"
                :key="action.status"
                @click="emit('setStatus', action.status); showMenu = false"
                class="w-full px-4 py-2.5 text-left text-xs font-medium flex items-center gap-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <component :is="action.icon" :size="14" />
                {{ action.label }}
              </button>
              <div class="border-t border-gray-100" />
              <button
                @click="emit('delete'); showMenu = false"
                class="w-full px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
              >
                <Trash2 :size="14" />
                Delete Book
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </article>
</template>
