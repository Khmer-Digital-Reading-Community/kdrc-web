<template>
  <div
    class="border-b border-gray-100
           pb-12 last:border-0"
  >

    <!-- Header -->
    <div class="flex justify-between items-start mb-4">

      <div class="flex items-center gap-4">

        <img
          :src="review.userImg"
          :alt="review.userName"
          @error="onAvatarError"
          class="w-12 h-12 rounded-xl object-cover"
        />

        <div>

          <h4
            class="font-bold text-sm text-gray-900"
          >
            {{ review.userName }}
          </h4>

          <p
            class="text-[10px] text-gray-400
                   font-medium"
          >
            {{ review.date }}
          </p>

        </div>

      </div>

      <!-- Stars -->
      <div class="flex gap-0.5">

        <svg
          v-for="i in 5"
          :key="i"
          class="w-3 h-3 transition-colors"
          :class="i <= Math.round(review.rating) ? 'text-[#B46A20]' : 'text-gray-300'"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
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

    </div>

    <!-- Title -->
    <h3 v-if="review.title" class="font-bold text-gray-900 mb-3">
      {{ review.title }}
    </h3>

    <!-- Comment -->
    <p
      class="text-gray-600 text-sm
             leading-relaxed mb-6"
    >
      {{ review.comment }}
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-6">

      <button
        class="flex items-center gap-2
               text-[10px] font-bold
               text-gray-400 hover:text-gray-900
               uppercase tracking-widest"
      >
        Helpful ({{ review.helpfulCount }})
      </button>

      <button
        class="flex items-center gap-2
               text-[10px] font-bold
               text-gray-400 hover:text-gray-900
               uppercase tracking-widest"
      >
        Reply
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { Review } from "../../types/bookDetails";

defineProps<{
  review: Review;
}>();

function onAvatarError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "https://placehold.co/96x96?text=User";
}
</script>
