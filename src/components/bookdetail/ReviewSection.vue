<template>
  <div
    class="flex flex-col lg:flex-row gap-12"
  >

    <!-- Left Summary -->
    <div class="w-full lg:w-72 shrink-0">

      <div
        class="bg-[#FDF6E9]/50 rounded-3xl
               p-8 text-center
               border border-orange-100/50"
      >

        <h2
          class="text-6xl font-black
                 text-gray-900 mb-2"
        >
          {{ rating }}
        </h2>

        <!-- Stars -->
        <div
          class="flex justify-center
                 text-yellow-500 mb-2"
        >

          <svg
            v-for="i in 5"
            :key="i"
            class="w-5 h-5 fill-current"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921
              1.902 0l1.07 3.292a1 1 0 00.95.69
              h3.462c.969 0 1.371 1.24.588 1.81
              l-2.8 2.034a1 1 0 00-.364 1.118
              l1.07 3.292c.3.921-.755 1.688-1.54
              1.118l-2.8-2.034a1 1 0 00-1.175 0
              l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118
              l1.07-3.292a1 1 0 00-.364-1.118
              L2.98 8.72c-.783-.57-.38-1.81.588-1.81
              h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>

        </div>

        <p
          class="text-[10px] text-gray-400
                 font-bold uppercase
                 tracking-widest mb-8"
        >
          Based on {{ reviewCount }} Ratings
        </p>

        <!-- Breakdown -->
        <div class="space-y-3 mb-10">

          <div
            v-for="(percent, star) in ratingBreakdown"
            :key="star"
            class="flex items-center gap-3"
          >

            <span
              class="text-[10px] font-bold
                     text-gray-600 w-2"
            >
              {{ star }}
            </span>

            <div
              class="flex-1 h-1.5 bg-gray-200
                     rounded-full overflow-hidden"
            >

              <div
                class="h-full bg-[#CC9552]"
                :style="{ width: percent + '%' }"
              />

            </div>

            <span
              class="text-[10px] font-bold
                     text-gray-400 w-6 text-right"
            >
              {{ percent }}%
            </span>

          </div>

        </div>

        <button
          class="w-full py-3 px-4
                 border border-gray-900
                 rounded-xl text-xs font-bold
                 hover:bg-gray-900
                 hover:text-white transition-all"
        >
          Write a Review
        </button>

      </div>

    </div>

    <!-- Reviews -->
    <div class="flex-1 space-y-12">

      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
      />

      <button
        class="w-full py-4 bg-white
               border border-gray-100
               rounded-xl text-[10px]
               font-bold text-gray-500
               uppercase tracking-widest
               hover:bg-gray-50 transition-colors"
      >
        Load More Reviews
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Review } from "../../types/bookDetails";

import ReviewCard from "./ReviewCard.vue";

defineProps<{
  reviews: Review[];
  rating: number;
  reviewCount: number;
}>();

const ratingBreakdown = {
  5: 85,
  4: 10,
  3: 3,
  2: 1,
  1: 1,
};
</script>