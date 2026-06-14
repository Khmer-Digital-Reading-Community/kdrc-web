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
          'group relative p-6 rounded-2xl border-2 text-left transition-all duration-300',
          'hover:shadow-lg hover:-translate-y-0.5',
          modelValue === option.value
            ? 'border-[#c5a050] bg-gradient-to-br from-amber-50 to-amber-50/60 shadow-md shadow-amber-100/50'
            : 'border-gray-200/80 bg-white hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-amber-100/30',
        ]"
      >
        <!-- Icon container -->
        <div
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
            modelValue === option.value
              ? 'bg-[#c5a050]/15 text-[#c5a050] shadow-sm'
              : 'bg-gray-100 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-700 group-hover:shadow-sm',
          ]"
        >
          <component :is="option.icon" :size="24" :stroke-width="1.75" />
        </div>

        <!-- Selected checkmark -->
        <div
          v-if="modelValue === option.value"
          class="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#c5a050] flex items-center justify-center transition-all duration-300"
        >
          <svg
            class="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 class="font-bold text-[#123C3A] text-[15px] mb-1.5 tracking-tight">
          {{ option.label }}
        </h3>
        <p class="text-xs text-gray-500 leading-relaxed">{{ option.guide }}</p>
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
        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a050]/20 focus:border-[#c5a050] resize-none placeholder:text-gray-400"
      />
      <p class="text-xs text-gray-400 mt-1 text-right">{{ description.length }}/500</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentType } from "../../composables/useBookWizard";
import {
  BookOpen,
  BookMarked,
  ScrollText,
  Feather,
  GraduationCap,
  Sparkles,
} from "lucide-vue-next";

defineProps<{
  modelValue: ContentType | null;
  description: string;
}>();

defineEmits<{
  "update:modelValue": [value: ContentType];
  "update:description": [value: string];
}>();

const contentTypes: {
  value: ContentType;
  label: string;
  icon: typeof BookOpen;
  guide: string;
}[] = [
  {
    value: "Novel",
    label: "Novel",
    icon: BookOpen,
    guide: "50,000+ words, full narrative arc",
  },
  {
    value: "Novella",
    label: "Novella",
    icon: BookMarked,
    guide: "17,500–40,000 words",
  },
  {
    value: "Short Story",
    label: "Short Story",
    icon: ScrollText,
    guide: "Under 7,500 words",
  },
  {
    value: "Poem Collection",
    label: "Poem Collection",
    icon: Feather,
    guide: "Collection of poems",
  },
  {
    value: "Educational",
    label: "Educational",
    icon: GraduationCap,
    guide: "Lessons, guides, tutorials",
  },
  {
    value: "Other",
    label: "Other",
    icon: Sparkles,
    guide: "Something different",
  },
];
</script>
