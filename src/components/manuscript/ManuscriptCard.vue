<script setup lang="ts">
import { ref, computed } from "vue";
import { MoreVertical, Trash2, Edit3, Globe, FileText, Archive } from "lucide-vue-next";
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

const resolveCoverUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${apiBaseUrl}${url}`;
};

const statusActions = computed(() => {
  const actions: { label: string; status: "PUBLISHED" | "DRAFT" | "ARCHIVED"; icon: any; class: string }[] = [];
  if (props.status !== "PUBLISHED") {
    actions.push({ label: "Publish", status: "PUBLISHED", icon: Globe, class: "text-green-600 hover:bg-green-50" });
  }
  if (props.status !== "DRAFT") {
    actions.push({ label: "Move to Drafts", status: "DRAFT", icon: FileText, class: "text-amber-600 hover:bg-amber-50" });
  }
  if (props.status !== "ARCHIVED") {
    actions.push({ label: "Archive", status: "ARCHIVED", icon: Archive, class: "text-gray-600 hover:bg-gray-50" });
  }
  return actions;
});
</script>

<template>
  <div
    class="bg-[#FBF7F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
  >
    <!-- Cover -->
    <div
      class="h-64 bg-gradient-to-br from-[#2A241D] to-[#0B0A09] relative overflow-hidden"
    >
      <img
        v-if="coverImageUrl && !imageError"
        :src="resolveCoverUrl(coverImageUrl)"
        :alt="title"
        @load="imageLoaded = true"
        @error="imageError = true"
        class="w-full h-full object-cover"
      />
      <div
        v-if="!coverImageUrl || imageError"
        class="w-full h-full bg-gradient-to-br from-[#2A241D] to-[#0B0A09]"
      />
      <span
        :class="[
          'absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full font-bold uppercase',
          status === 'PUBLISHED'
            ? 'bg-[#2FE0A5] text-[#123C3A]'
            : status === 'ARCHIVED'
              ? 'bg-gray-300 text-gray-700'
              : 'bg-amber-400 text-[#123C3A]',
        ]"
      >
        {{ status }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h2 class="font-bold text-[#123C3A] text-lg leading-snug mb-1 line-clamp-1">
        {{ title }}
      </h2>
      <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
        {{ description || "No description available" }}
      </p>
      <div class="text-[11px] text-gray-400 space-y-1 mb-4 font-medium uppercase tracking-wider">
        <p>{{ words }}</p>
        <p>Last Edit: {{ edit }}</p>
      </div>

      <!-- Bottom -->
      <div class="flex items-center justify-between relative">
        <button
          @click="emit('edit')"
          class="bg-[#1BC47D] hover:bg-[#16a56a] text-white text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Edit3 :size="14" />
          Continue Edit
        </button>

        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical :size="20" />
          </button>

          <div
            v-if="showMenu"
            class="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden"
          >
            <button
              v-for="action in statusActions"
              :key="action.status"
              @click="emit('setStatus', action.status); showMenu = false"
              :class="['w-full px-4 py-2.5 text-left text-xs flex items-center gap-2 transition', action.class]"
            >
              <component :is="action.icon" :size="14" />
              {{ action.label }}
            </button>
            <hr class="border-gray-100" />
            <button
              @click="emit('delete'); showMenu = false"
              class="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
            >
              <Trash2 :size="14" />
              Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
