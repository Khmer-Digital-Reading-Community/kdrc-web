<template>
  <div class="relative" ref="root">
    <!-- Selected value display / search input -->
    <div
      @click="openDropdown"
      :class="[
        'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition',
        open
          ? 'border-[#c5a050] ring-2 ring-[#c5a050]/20'
          : 'border-gray-200 hover:border-gray-300',
      ]"
    >
      <Search :size="14" class="text-gray-400 flex-shrink-0" />
      <input
        ref="inputEl"
        v-model="search"
        type="text"
        :placeholder="selectedLabel || placeholder"
        class="flex-1 bg-transparent text-[#123C3A] placeholder:text-gray-300 outline-none text-sm min-w-0"
        @focus="openDropdown"
        @keydown.escape="closeDropdown"
      />
      <button
        v-if="modelValue"
        @click.stop="clear"
        class="text-gray-300 hover:text-gray-500 transition flex-shrink-0"
      >
        <X :size="14" />
      </button>
      <ChevronDown
        :size="14"
        :class="[
          'text-gray-400 flex-shrink-0 transition-transform duration-200',
          open && 'rotate-180',
        ]"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
    >
      <button
        v-for="option in filteredOptions"
        :key="option.value"
        @click="select(option)"
        :class="[
          'w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2',
          option.value === modelValue
            ? 'bg-[#F6F1E8] text-[#123C3A] font-medium'
            : 'hover:bg-gray-50 text-gray-700',
        ]"
      >
        <span class="text-gray-400 text-xs flex-shrink-0">#</span>
        {{ option.label }}
        <Check v-if="option.value === modelValue" :size="14" class="ml-auto text-[#c5a050]" />
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
import { Search, X, ChevronDown, Check, Plus } from "lucide-vue-next";

const props = defineProps<{
  modelValue: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  emptyText?: string;
  createLabel?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  create: [name: string];
}>();

const root = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const open = ref(false);
const search = ref("");

const selectedLabel = computed(() => {
  const opt = props.options.find((o) => o.value === props.modelValue);
  return opt?.label ?? null;
});

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

function openDropdown() {
  open.value = true;
  // Focus the input next tick
  setTimeout(() => inputEl.value?.focus(), 50);
}

function closeDropdown() {
  open.value = false;
  search.value = "";
}

function select(option: { value: string; label: string }) {
  emit("update:modelValue", option.value);
  search.value = "";
  open.value = false;
}

function createNew() {
  const name = search.value.trim();
  if (!name) return;
  emit("create", name);
  search.value = "";
  open.value = false;
}

function clear() {
  emit("update:modelValue", "");
  search.value = "";
}

// Close on outside click
function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>
