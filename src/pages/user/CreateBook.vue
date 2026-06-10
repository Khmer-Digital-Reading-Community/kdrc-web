<script setup lang="ts">
import ContentTypeStep from "../../components/writing/ContentTypeStep.vue";
import MetadataStep from "../../components/writing/MetadataStep.vue";
import BookDetailsStep from "../../components/writing/BookDetailsStep.vue";
import { useBookWizard } from "../../composables/useBookWizard";
import type { ContentType } from "../../composables/useBookWizard";

const wizard = useBookWizard();

const steps = [
  { num: 1, label: "Content Type" },
  { num: 2, label: "Genre & Categories" },
  { num: 3, label: "Book Details" },
];
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-[#F6F1E8]">
    <div class="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-2 mb-12">
        <template v-for="(step, i) in steps" :key="step.num">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                wizard.currentStep.value > step.num
                  ? 'bg-green-500 text-white'
                  : wizard.currentStep.value === step.num
                    ? 'bg-[#c5a050] text-white shadow-lg shadow-amber-200'
                    : 'bg-gray-200 text-gray-500',
              ]"
            >
              <span v-if="wizard.currentStep.value > step.num">&check;</span>
              <span v-else>{{ step.num }}</span>
            </div>
            <span
              :class="[
                'text-xs font-semibold hidden sm:inline',
                wizard.currentStep.value >= step.num ? 'text-[#123C3A]' : 'text-gray-400',
              ]"
            >
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="i < steps.length - 1"
            :class="[
              'w-8 sm:w-12 h-0.5 rounded transition-colors duration-300',
              wizard.currentStep.value > step.num ? 'bg-green-500' : 'bg-gray-200',
            ]"
          ></div>
        </template>
      </div>

      <!-- Step 1: Content Type -->
      <ContentTypeStep
        v-if="wizard.currentStep.value === 1"
        :modelValue="wizard.contentType.value"
        :description="wizard.contentDescription.value"
        @update:modelValue="wizard.contentType.value = $event"
        @update:description="wizard.contentDescription.value = $event"
      />

      <!-- Step 2: Genre & Categories -->
      <MetadataStep
        v-else-if="wizard.currentStep.value === 2"
        :genreSlug="wizard.selectedGenre.value"
        :categorySlugs="wizard.selectedCategories.value"
        :tagSlugs="wizard.selectedTags.value"
        :genres="wizard.genres.value"
        :categories="wizard.categories.value"
        :tags="wizard.tags.value"
        :loadingGenres="wizard.isLoadingDropdowns.value"
        :loadingCategories="wizard.isLoadingDropdowns.value"
        :loadingTags="wizard.isLoadingDropdowns.value"
        :error="wizard.dropdownsError.value"
        @update:genreSlug="wizard.selectedGenre.value = $event"
        @update:categorySlugs="wizard.selectedCategories.value = $event"
        @update:tagSlugs="wizard.selectedTags.value = $event"
      />

      <!-- Step 3: Book Details -->
      <BookDetailsStep
        v-else-if="wizard.currentStep.value === 3"
        :title="wizard.title.value"
        :subtitle="wizard.subtitle.value"
        :coverPreviewUrl="wizard.coverPreviewUrl.value"
        :isUploading="wizard.isUploadingCover.value"
        @update:title="wizard.title.value = $event"
        @update:subtitle="wizard.subtitle.value = $event"
        @fileSelected="wizard.handleCoverSelected($event)"
        @clearCover="wizard.handleCoverClear()"
      />

      <!-- Navigation buttons -->
      <div class="flex justify-between mt-10">
        <button
          v-if="wizard.currentStep.value > 1"
          @click="wizard.goBack()"
          class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white transition"
        >
          Back
        </button>
        <div v-else></div>

        <div class="flex gap-3">
          <button
            v-if="wizard.currentStep.value === 1"
            @click="wizard.skipAndCreateMinimal()"
            :disabled="wizard.isSubmitting.value"
            class="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Skip for now
          </button>

          <button
            v-if="wizard.currentStep.value < 3"
            @click="wizard.goNext()"
            :disabled="!wizard.canGoNext.value"
            class="px-6 py-2.5 rounded-xl bg-[#093A3F] text-white text-sm font-semibold hover:bg-[#0d4a50] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>

          <button
            v-if="wizard.currentStep.value === 3"
            @click="wizard.uploadCoverAndCreateBook()"
            :disabled="wizard.isSubmitting.value || !wizard.title.value.trim()"
            class="px-6 py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span
              v-if="wizard.isSubmitting.value"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ wizard.isSubmitting.value ? "Creating..." : "Create & Start Writing" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
