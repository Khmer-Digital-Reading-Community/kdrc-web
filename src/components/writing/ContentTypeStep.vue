<template>
  <div class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-[#123C3A] font-['Playfair_Display',Georgia,serif]">
        What are you writing?
      </h2>
      <p class="text-sm text-gray-500 mt-2">Choose the type that best fits your work</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="option in contentTypes"
        :key="option.value"
        @click="$emit('update:modelValue', option.value)"
        :class="[
          'p-5 rounded-2xl border-2 text-left transition-all duration-200',
          modelValue === option.value
            ? 'border-[#c5a050] bg-amber-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50',
        ]"
      >
        <span class="text-2xl mb-2 block">{{ option.icon }}</span>
        <h3 class="font-bold text-[#123C3A] text-sm">{{ option.label }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ option.guide }}</p>
      </button>
    </div>

    <div class="mt-6">
      <label class="block text-sm font-semibold text-[#123C3A] mb-2">
        Description <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <textarea
        :value="description"
        @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        placeholder="Briefly describe what your book is about..."
        rows="4"
        maxlength="500"
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] resize-none"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">{{ description.length }}/500</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentType } from "../../composables/useBookWizard";

defineProps<{
  modelValue: ContentType | null;
  description: string;
}>();

defineEmits<{
  "update:modelValue": [value: ContentType];
  "update:description": [value: string];
}>();

const contentTypes: { value: ContentType; label: string; icon: string; guide: string }[] = [
  { value: "Novel", label: "Novel", icon: "📚", guide: "50,000+ words, full narrative arc" },
  { value: "Novella", label: "Novella", icon: "📖", guide: "17,500–40,000 words" },
  { value: "Short Story", label: "Short Story", icon: "✍️", guide: "Under 7,500 words" },
  { value: "Poem Collection", label: "Poem Collection", icon: "🎭", guide: "Collection of poems" },
  { value: "Educational", label: "Educational", icon: "📘", guide: "Lessons, guides, tutorials" },
  { value: "Other", label: "Other", icon: "✨", guide: "Something different" },
];
</script>
