<template>
  <div
    @click="navigateToBook"
    class="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1"
  >
    <!-- Cover -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-100">
      <img
        v-if="book.coverImage && !imgError"
        :src="book.coverImage"
        :alt="book.title"
        @error="imgError = true"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <!-- Fallback -->
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
        :style="{ background: coverGradient }"
      >
        <BookOpen :size="32" class="text-white/30" stroke-width="1.5" />
        <span class="text-white/60 text-xs font-semibold text-center line-clamp-3 leading-snug">
          {{ book.title }}
        </span>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <!-- Tags (top-left) -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5">
        <span
          v-if="tags.new"
          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-white shadow-sm"
        >
          New
        </span>
        <span
          v-if="tags.popular"
          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-900 shadow-sm"
        >
          Popular
        </span>
        <span
          v-if="tags.isPremium"
          class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500 text-white shadow-sm"
        >
          <Crown :size="10" />
          Exclusive
        </span>
        <span
          v-else-if="tags.isPurchasable"
          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 shadow-sm"
        >
          {{ formatPrice(book.price) }}
        </span>
      </div>

      <!-- Category badge (top-right) -->
      <span
        class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm"
      >
        {{ book.category }}
      </span>
    </div>

    <!-- Body -->
    <div class="flex flex-col flex-1 p-4">
      <h3
        class="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#B4690E] transition-colors duration-200 mb-1"
      >
        {{ book.title }}
      </h3>

      <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
        {{ book.author }}
      </p>

      <p class="text-[13px] text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
        {{ book.description || 'No description available.' }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <div class="flex items-center gap-0.5">
          <template v-for="i in 5" :key="i">
            <Star
              :size="12"
              :class="i <= starFill ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-gray-300'"
            />
          </template>
          <span class="text-[11px] font-semibold text-gray-500 ml-1">
            {{ book.rating > 0 ? book.rating.toFixed(1) : '' }}
          </span>
        </div>

        <span
          class="text-[11px] font-semibold text-[#B4690E] group-hover:translate-x-0.5 transition-transform duration-200"
        >
          Details
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { BookOpen, Star, Crown } from "lucide-vue-next";
import type { ExploreBook } from "../../types/exploreBook";

const props = defineProps<{ book: ExploreBook }>();

const router = useRouter();
const imgError = ref(false);

const navigateToBook = () => {
  router.push(`/book-detail/${props.book.id}`);
};

const starFill = computed(() => Math.round(props.book.rating));

const formatPrice = (price: number): string => {
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
};

const isNew = computed(() => {
  if (!props.book.createdAt) return false;
  const days = (Date.now() - new Date(props.book.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14;
});

const isPopular = computed(() => {
  return props.book.readCount >= 100 || props.book.likeCount >= 20 || props.book.rating >= 4.0;
});

const tags = computed(() => ({
  new: isNew.value,
  popular: isPopular.value,
  isPremium: props.book.isPremium,
  isPurchasable: props.book.isPurchasable && !props.book.isPremium && props.book.price > 0,
}));

const GRADIENTS = [
  "linear-gradient(135deg, #1a3a4a 0%, #0d2535 100%)",
  "linear-gradient(135deg, #2d4a3a 0%, #1a3028 100%)",
  "linear-gradient(135deg, #3d2a4a 0%, #251830 100%)",
  "linear-gradient(135deg, #4a2a2a 0%, #301a1a 100%)",
  "linear-gradient(135deg, #2a3a4a 0%, #1a2835 100%)",
  "linear-gradient(135deg, #3a3a2a 0%, #28281a 100%)",
  "linear-gradient(135deg, #4a3a2a 0%, #30281a 100%)",
  "linear-gradient(135deg, #1a4a4a 0%, #0d3535 100%)",
];

const coverGradient = computed(() => {
  let hash = 0;
  const key = props.book.category + props.book.id;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
});
</script>
