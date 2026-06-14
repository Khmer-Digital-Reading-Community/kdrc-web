<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="toggle"
    :class="[
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#c5a050]/30 focus:ring-offset-2',
      modelValue ? (activeColor || 'bg-emerald-500') : 'bg-gray-300',
    ]"
  >
    <span
      :class="[
        'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
        modelValue ? 'translate-x-[22px]' : 'translate-x-[2px]',
      ]"
    />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  activeColor?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

function toggle() {
  emit("update:modelValue", !props.modelValue);
}
</script>
