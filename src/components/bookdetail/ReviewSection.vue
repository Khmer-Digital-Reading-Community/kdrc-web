<template>
  <div class="flex flex-col lg:flex-row gap-12">
    <div class="w-full lg:w-80 shrink-0">
      <div class="bg-[#FDF6E9]/60 rounded-[30px] p-8 border border-[#EEDFC7]">
        <h2 class="text-6xl font-black text-gray-900 mb-2">
          {{ formattedRating }}
        </h2>

        <div class="flex justify-center gap-1 mb-2">
          <button
            v-for="i in 5"
            :key="`summary-${i}`"
            type="button"
            class="transition-colors"
            :disabled="true"
          >
            <svg
              class="w-5 h-5"
              :class="i <= roundedRating ? 'text-[#B46A20]' : 'text-gray-300'"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
        </div>

        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">
          Based on {{ book.reviewCount }} Ratings
        </p>

        <div class="space-y-3 mb-10">
          <div
            v-for="item in ratingBreakdown"
            :key="item.star"
            class="flex items-center gap-3"
          >
            <span class="text-[10px] font-bold text-gray-600 w-2">
              {{ item.star }}
            </span>

            <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-[#CC9552]"
                :style="{ width: `${item.percent}%` }"
              />
            </div>

            <span class="text-[10px] font-bold text-gray-400 w-8 text-right">
              {{ item.percent }}%
            </span>
          </div>
        </div>

        <button
          type="button"
          class="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="canWriteReview
            ? 'border border-gray-900 hover:bg-gray-900 hover:text-white'
            : 'border border-gray-200 text-gray-400 cursor-not-allowed bg-white/70'"
          :disabled="!canWriteReview"
          @click="isModalOpen = true"
        >
          {{ hasExistingReview ? "Review Submitted" : isLoggedIn ? "Write a Review" : "Login to Review" }}
        </button>

        <p v-if="!isLoggedIn" class="mt-3 text-xs text-gray-500 leading-relaxed">
          Sign in to leave a rating and share your thoughts about this book.
        </p>
      </div>
    </div>

    <div class="flex-1 space-y-12">
      <div
        v-if="book.reviews.length === 0"
        class="rounded-[24px] border border-dashed border-[#D9D6CF] bg-white px-8 py-14 text-center text-gray-500"
      >
        No reviews yet. Be the first reader to share one.
      </div>

      <ReviewCard
        v-for="review in visibleReviews"
        v-else
        :key="review.id"
        :review="review"
      />

      <button
        v-if="book.reviews.length > visibleCount"
        type="button"
        class="w-full py-4 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-colors"
        @click="visibleCount += 4"
      >
        Load More Reviews
      </button>
    </div>
  </div>

  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F1C]/40 px-4 py-8"
    @click.self="closeModal"
  >
    <div class="w-full max-w-2xl rounded-[24px] bg-white p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div class="flex items-start justify-between gap-4 mb-8">
        <div>
          <h3 class="text-4xl font-bold text-[#173B63] mb-2">
            Leave a Review
          </h3>
          <p class="text-gray-500">
            Share your reading experience with the community.
          </p>
        </div>

        <button
          type="button"
          class="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <form class="space-y-6" @submit.prevent="submitReview">
        <div>
          <p class="text-[11px] uppercase tracking-[0.28em] text-gray-500 font-semibold mb-3">
            Overall Rating
          </p>

          <div class="flex items-center gap-2">
            <button
              v-for="i in 5"
              :key="`input-${i}`"
              type="button"
              class="transition-transform hover:scale-110"
              @click="form.rating = i"
            >
              <svg
                class="w-8 h-8"
                :class="i <= form.rating ? 'text-[#B46A20]' : 'text-gray-300'"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
            <span class="text-sm text-gray-500 ml-2">
              {{ form.rating }}/5
            </span>
          </div>
        </div>

        <label class="block">
          <span class="text-[11px] uppercase tracking-[0.28em] text-gray-500 font-semibold mb-3 block">
            Review Title
          </span>
          <input
            v-model.trim="form.title"
            type="text"
            maxlength="120"
            placeholder="A hauntingly beautiful narrative..."
            class="w-full border-0 border-b border-gray-200 px-0 py-3 text-lg text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#173B63]"
          />
        </label>

        <label class="block">
          <span class="text-[11px] uppercase tracking-[0.28em] text-gray-500 font-semibold mb-3 block">
            Your Review
          </span>
          <textarea
            v-model.trim="form.comment"
            rows="6"
            placeholder="Describe the atmosphere, the characters, or how this book moved you..."
            class="w-full rounded-none border border-[#F0E9DC] bg-[#FDF8EE] px-5 py-4 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E3C79A]"
          />
        </label>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <div class="flex items-center gap-4 pt-2">
          <button
            type="submit"
            class="min-w-40 bg-[#0F3B35] text-white px-6 py-3 rounded-none text-sm font-semibold tracking-[0.14em] uppercase hover:bg-[#184942] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Submitting..." : "Submit Review" }}
          </button>

          <button
            type="button"
            class="text-sm font-medium uppercase tracking-[0.12em] text-[#173B63] hover:text-[#0F3B35]"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { BookDetails } from "../../types/bookDetails";
import { createReview } from "../../services/bookApi";
import { authState } from "../../services/auth";

import ReviewCard from "./ReviewCard.vue";

const props = defineProps<{
  book: BookDetails;
}>();

const emit = defineEmits<{
  (e: "review-submitted"): void;
}>();

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const visibleCount = ref(4);
const form = reactive({
  rating: 0,
  title: "",
  comment: "",
});

const isLoggedIn = computed(() => Boolean(authState.token.value));
const currentUserId = computed(() => authState.user.value?.id ?? "");
const hasExistingReview = computed(() =>
  props.book.reviews.some((review) => review.reviewerId === currentUserId.value),
);
const canWriteReview = computed(() => isLoggedIn.value && !hasExistingReview.value);
const roundedRating = computed(() => Math.round(props.book.rating));
const formattedRating = computed(() => props.book.rating.toFixed(1));
const visibleReviews = computed(() =>
  props.book.reviews.slice(0, visibleCount.value),
);

const ratingBreakdown = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = props.book.reviews.length;

  props.book.reviews.forEach((review) => {
    const key = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[key] += 1;
  });

  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    percent: total > 0 ? Math.round((counts[star as 1 | 2 | 3 | 4 | 5] / total) * 100) : 0,
  }));
});

function buildCommentPayload() {
  const title = form.title.trim();
  const comment = form.comment.trim();

  if (!title) {
    return comment;
  }

  return comment ? `${title}\n\n${comment}` : title;
}

function resetForm() {
  form.rating = 0;
  form.title = "";
  form.comment = "";
  errorMessage.value = "";
}

function closeModal() {
  isModalOpen.value = false;
  errorMessage.value = "";
}

async function submitReview() {
  errorMessage.value = "";

  if (form.rating < 1) {
    errorMessage.value = "Please select a star rating before submitting.";
    return;
  }

  if (!form.comment.trim() && !form.title.trim()) {
    errorMessage.value = "Please add a review title or review comment.";
    return;
  }

  isSubmitting.value = true;

  try {
    await createReview({
      bookId: props.book.id,
      rating: form.rating,
      comment: buildCommentPayload(),
    });

    resetForm();
    isModalOpen.value = false;
    emit("review-submitted");
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to submit review.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
