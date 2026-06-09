<template>
  <div class="relative">
    <div class="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#093A3F] text-white rounded-full text-xs font-medium"
      >
        {{ tag }}
        <button
          @click="removeTag(tag)"
          class="text-white/70 hover:text-white transition"
          type="button"
        >
          &times;
        </button>
      </span>
    </div>

    <div class="relative">
      <input
        v-model="search"
        type="text"
        :placeholder="modelValue.length ? 'Add more tags...' : 'Search or create tags...'"
        :disabled="loading"
        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] disabled:opacity-50"
        @keydown.enter.prevent="handleEnter"
        @focus="showDropdown = true"
      />

      <div
        v-if="showDropdown && (filteredOptions.length > 0 || search.trim())"
        class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
      >
        <button
          v-for="option in filteredOptions"
          :key="option"
          @click="addTag(option)"
          class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F1E8] transition flex items-center gap-2"
        >
          <span class="text-gray-400 text-xs">#</span>
          {{ option }}
        </button>

        <button
          v-if="search.trim() && !filteredOptions.includes(search.trim())"
          @click="addTag(search.trim())"
          class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F1E8] transition flex items-center gap-2 border-t border-gray-100 text-[#c5a050] font-medium"
        >
          <span class="text-xs">+</span>
          Create "{{ search.trim() }}"
        </button>
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-if="loading" class="text-xs text-gray-400 mt-1">Loading tags...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string[];
  availableTags: string[];
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const search = ref("");
const showDropdown = ref(false);

const filteredOptions = computed(() => {
  if (!search.value.trim()) return props.availableTags.filter((t) => !props.modelValue.includes(t));
  const q = search.value.toLowerCase();
  return props.availableTags.filter(
    (t) => t.toLowerCase().includes(q) && !props.modelValue.includes(t),
  );
});

function addTag(tag: string) {
  if (!tag.trim() || props.modelValue.includes(tag.trim())) return;
  emit("update:modelValue", [...props.modelValue, tag.trim()]);
  search.value = "";
  showDropdown.value = false;
}

function removeTag(tag: string) {
  emit(
    "update:modelValue",
    props.modelValue.filter((t) => t !== tag),
  );
}

function handleEnter() {
  if (search.value.trim()) {
    addTag(search.value.trim());
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".relative")) {
    showDropdown.value = false;
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("click", handleClickOutside);
}
</script>
