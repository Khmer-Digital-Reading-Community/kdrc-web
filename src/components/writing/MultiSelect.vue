<template>
  <div class="relative" ref="root">
    <!-- Selected pills + search input -->
    <div
      @click="focusInput"
      :class="[
        'flex flex-wrap items-center gap-1.5 rounded-xl border px-3 py-2 min-h-[42px] cursor-text transition',
        focused
          ? 'border-[#c5a050] ring-2 ring-[#c5a050]/20'
          : 'border-gray-200 hover:border-gray-300',
      ]"
    >
      <!-- Selected pills -->
      <span
        v-for="slug in modelValue"
        :key="slug"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#123C3A] text-white rounded-lg text-xs font-medium"
      >
        {{ getLabel(slug) }}
        <button
          @click.stop="remove(slug)"
          class="text-white/60 hover:text-white transition"
        >
          <X :size="11" />
        </button>
      </span>

      <!-- Search input -->
      <input
        ref="inputEl"
        v-model="search"
        type="text"
        :placeholder="modelValue.length ? '' : placeholder"
        class="flex-1 bg-transparent text-[#123C3A] placeholder:text-gray-300 outline-none text-sm min-w-[120px] py-0.5"
        @focus="focused = true"
        @keydown.escape="focused = false; search = ''"
        @keydown.backspace="handleBackspace"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="focused && (filteredOptions.length > 0 || search.trim())"
      class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
    >
      <button
        v-for="option in filteredOptions"
        :key="option.value"
        @click="add(option.value)"
        :class="[
          'w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2',
          modelValue.includes(option.value)
            ? 'bg-[#F6F1E8] text-[#123C3A] font-medium'
            : 'hover:bg-gray-50 text-gray-700',
        ]"
      >
        <span class="text-gray-400 text-xs flex-shrink-0">#</span>
        {{ option.label }}
        <Check
          v-if="modelValue.includes(option.value)"
          :size="14"
          class="ml-auto text-[#c5a050]"
        />
      </button>

      <!-- Create new option -->
      <button
        v-if="search.trim() && !exactMatch"
        @click="createNew"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F1E8] transition flex items-center gap-2 border-t border-gray-100 text-[#c5a050] font-medium"
      >
        <Plus :size="14" />
        {{ createLabel }} "<span class="font-semibold">{{ search.trim() }}</span>"
      </button>

      <div
        v-if="filteredOptions.length === 0 && !search.trim()"
        class="px-4 py-3 text-xs text-gray-400 text-center"
      >
        {{ emptyText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { X, Check, Plus } from "lucide-vue-next";

const props = defineProps<{
  modelValue: string[];
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  emptyText?: string;
  createLabel?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  create: [name: string];
}>();

const root = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const focused = ref(false);
const search = ref("");

function getLabel(slug: string): string {
  const opt = props.options.find((o) => o.value === slug);
  return opt?.label ?? slug;
}

const exactMatch = computed(() =>
  props.options.some(
    (o) => o.label.toLowerCase() === search.value.trim().toLowerCase()
  )
);

const filteredOptions = computed(() => {
  if (!search.value.trim()) return props.options;
  const q = search.value.toLowerCase();
  return props.options.filter(
    (o) =>
      o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
  );
});

function add(slug: string) {
  if (props.modelValue.includes(slug)) return;
  emit("update:modelValue", [...props.modelValue, slug]);
  search.value = "";
}

function remove(slug: string) {
  emit(
    "update:modelValue",
    props.modelValue.filter((s) => s !== slug)
  );
}

function createNew() {
  const name = search.value.trim();
  if (!name) return;
  emit("create", name);
  search.value = "";
}

function focusInput() {
  focused.value = true;
  setTimeout(() => inputEl.value?.focus(), 50);
}

function handleBackspace() {
  if (search.value === "" && props.modelValue.length > 0) {
    remove(props.modelValue[props.modelValue.length - 1]);
  }
}

// Close on outside click
function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    focused.value = false;
    search.value = "";
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>
