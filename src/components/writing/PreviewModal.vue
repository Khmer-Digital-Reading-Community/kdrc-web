<script setup lang="ts">
import { watch, onMounted, onUnmounted, ref, computed } from "vue";
import { X, Sun, Moon } from "lucide-vue-next";
import { renderContent } from "@/utils/content";

const props = defineProps<{
  open: boolean;
  bookTitle: string;
  chapterTitle: string;
  content: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isDark = ref(false);

const themeBg = computed(() => (isDark.value ? "#1a1a1a" : "#FBF7F0"));
const themeText = computed(() => (isDark.value ? "#e8e0d5" : "#2c2c2c"));
const themeMuted = computed(() => (isDark.value ? "#8a8a80" : "#999"));

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.open) emit("close");
};

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex flex-col"
        :style="{ backgroundColor: themeBg, color: themeText }"
      >
        <!-- Header -->
        <header
          class="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b backdrop-blur-sm shrink-0"
          :style="{
            backgroundColor: isDark ? 'rgba(26,26,26,0.92)' : 'rgba(251,247,240,0.92)',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="min-w-0">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5"
                :style="{ color: themeMuted }"
              >
                {{ bookTitle }}
              </p>
              <h2 class="text-sm font-bold truncate">{{ chapterTitle || "Untitled" }}</h2>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="isDark = !isDark"
              class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              :title="isDark ? 'Light mode' : 'Dark mode'"
            >
              <Sun v-if="isDark" :size="17" />
              <Moon v-else :size="17" />
            </button>
            <button
              @click="emit('close')"
              class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Close preview"
            >
              <X :size="20" />
            </button>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-2xl mx-auto px-5 py-10 sm:py-14">
            <article
              v-if="content"
              class="prose prose-base sm:prose-lg leading-relaxed transition-colors duration-200"
              :style="{ color: themeText }"
              v-html="renderContent(content)"
            />
            <div
              v-else
              class="flex flex-col items-center justify-center py-20 text-center"
              :style="{ color: themeMuted }"
            >
              <p class="text-sm font-semibold mb-1">Nothing to preview yet</p>
              <p class="text-xs">Start writing in the editor to see your content here.</p>
            </div>
          </div>
        </main>

        <!-- Footer bar -->
        <footer
          class="shrink-0 flex items-center justify-center gap-3 px-5 py-3 border-t text-xs font-medium"
          :style="{
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            color: themeMuted,
          }"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Preview mode &mdash; readers will see this with your book&rsquo;s theme settings
        </footer>
      </div>
    </transition>
  </Teleport>
</template>
