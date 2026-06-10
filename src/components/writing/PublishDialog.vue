<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="text-lg font-bold text-[#123C3A]">Publish Book</h2>
          <p class="text-sm text-gray-500 mt-1">
            Make your book available to readers
          </p>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="book?.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ book?.title }}</p>
              <p class="text-xs text-gray-500">
                Status will change to <span class="font-bold text-green-600">Published</span>
              </p>
            </div>
          </div>

          <div class="bg-[#F6F1E8] rounded-xl p-4 space-y-2">
            <h4 class="text-sm font-semibold text-[#123C3A]">Chapter Summary</h4>
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-xl font-bold text-[#123C3A]">{{ publishSummary.total }}</p>
                <p class="text-xs text-gray-500">Total</p>
              </div>
              <div>
                <p class="text-xl font-bold text-green-600">{{ publishSummary.published }}</p>
                <p class="text-xs text-gray-500">Published</p>
              </div>
              <div>
                <p class="text-xl font-bold text-amber-600">{{ publishSummary.draft }}</p>
                <p class="text-xs text-gray-500">Draft</p>
              </div>
            </div>
          </div>

          <div v-if="book?.isPremium" class="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-xs text-yellow-700 font-medium">Premium content</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            @click="$emit('close')"
            :disabled="isPublishing"
            class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="isPublishing"
            class="px-5 py-2.5 rounded-xl bg-[#c5a050] text-white text-sm font-semibold hover:bg-[#b09040] transition disabled:opacity-60 flex items-center gap-2"
          >
            <span
              v-if="isPublishing"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isPublishing ? "Publishing..." : "Publish Now" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Book } from "../../services/bookApi";

defineProps<{
  show: boolean;
  book: Book | null;
  publishSummary: { total: number; published: number; draft: number; archived: number };
  isPublishing: boolean;
}>();

defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
