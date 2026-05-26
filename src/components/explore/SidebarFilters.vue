<template>
  <div
    class="flex flex-col gap-8"
  >
    <!-- Categories -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.22em]
               text-[#B4690E] mb-3"
      >
        Categories
      </h3>

      <div class="flex flex-col gap-1.5">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="
            activeCategory === cat
              ? 'bg-[#1c3a2e] text-white shadow-sm'
              : 'text-[#48556a] hover:bg-[#f6f3ed]'
          "
          class="w-full text-left px-4 py-2.5
                 rounded-lg text-[13px]
                 font-medium transition-all"
          @click="emit('updateCategory', cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Format -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-3"
      >
        Format
      </h3>

      <div class="flex flex-wrap gap-2">
        <button
          class="px-4 py-1.5 rounded-full
                 border border-[#ebe4d8]
                 text-xs font-bold bg-[#fbfaf6]
                 hover:border-[#B4690E]
                 transition-colors"
        >
          E-book
        </button>

        <button
          class="px-4 py-1.5 rounded-full
                 border border-[#ebe4d8]
                 text-xs font-bold bg-[#fbfaf6]
                 hover:border-[#B4690E]
                 transition-colors"
        >
          Physical
        </button>
      </div>
    </div>

    <!-- Minimum Rating -->
    <div>
      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-3"
      >
        Minimum Rating
      </h3>

      <div class="flex flex-col gap-3">
        <button
          v-for="option in ratingOptions"
          :key="option.value"
          @click="
            emit(
              'updateMinRating',
              activeMinRating === option.value
                ? null
                : option.value
            )
          "
          class="flex items-center gap-3 text-left"
        >
          <span
            :class="
              activeMinRating === option.value
                ? 'border-[#1c3a2e] bg-[#1c3a2e]'
                : 'border-[#d8d3c8] bg-transparent'
            "
            class="flex h-4 w-4 items-center justify-center rounded-full border transition-colors"
          >
            <span
              v-if="activeMinRating === option.value"
              class="h-1.5 w-1.5 rounded-full bg-white"
            />
          </span>

          <span class="text-[13px] text-[#48556a]">
            {{ option.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Languages -->
    <div>

      <h3
        class="text-[11px] font-bold uppercase
               tracking-[0.2em]
               text-[#B4690E] mb-3"
      >
        Language
      </h3>

      <div class="flex flex-col gap-3">
        <button
          @click="emit('updateLanguage', 'All')"
          class="flex justify-between text-sm group cursor-pointer"
        >
          <span
            :class="
              activeLanguage === 'All'
                ? 'text-[#093A3F] font-bold'
                : 'text-gray-600'
            "
            class="group-hover:text-[#093A3F]
                   transition-colors"
          >
            All
          </span>

          <span
            class="text-gray-400 font-mono
                   text-[11px]
                   group-hover:text-[#B4690E]
                   transition-colors"
          >
            {{ languages.reduce((total, lang) => total + lang.count, 0) }}
          </span>
        </button>

        <button
          v-for="lang in languages"
          :key="lang.name"
          @click="emit('updateLanguage', lang.name)"
          class="flex justify-between text-sm
                 group cursor-pointer"
        >
          <span
            :class="
              activeLanguage === lang.name
                ? 'text-[#093A3F] font-bold'
                : 'text-gray-600'
            "
            class="group-hover:text-[#093A3F]
                   transition-colors"
          >
            {{ lang.name }}
          </span>

          <span
            class="text-gray-400 font-mono
                   text-[11px]
                   group-hover:text-[#B4690E]
                   transition-colors"
          >
            {{ lang.count }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeCategory: string;

  categories: string[];

  activeLanguage: string;

  activeMinRating: number | null;

  languages: {
    name: string;
    count: number;
  }[];
}>();

const ratingOptions = [
  { label: "4.5+ Stars", value: 4.5 },
  { label: "4.0+ Stars", value: 4.0 },
];

const emit = defineEmits([
  "updateCategory",
  "updateLanguage",
  "updateMinRating",
]);
</script>
