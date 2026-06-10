<template>
  <div
    class="group relative flex items-center gap-4 sm:gap-5 p-4 rounded-xl border transition-all duration-200"
    :class="rowClasses"
    @click="handleClick"
  >
    <!-- Left accent strip -->
    <div
      class="absolute left-0 top-2 bottom-2 w-1 rounded-full"
      :class="accentClass"
    ></div>

    <!-- Chapter number -->
    <span
      class="shrink-0 w-8 text-center font-mono text-sm font-bold"
      :class="numberClass"
    >
      {{ String(index + 1).padStart(2, "0") }}
    </span>

    <!-- Title & meta -->
    <div class="flex-1 min-w-0">
      <h3
        class="font-semibold text-sm sm:text-base truncate transition-colors"
        :class="titleClass"
      >
        {{ chapter.title }}
      </h3>
      <div class="flex items-center gap-2 mt-0.5">
        <span class="text-xs text-gray-400">{{ chapter.duration }}</span>
        <span
          v-if="chapter.isPublic"
          class="text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5"
          :class="badgeClass"
        >
          <component :is="badgeIcon" :size="10" class="inline-block -mt-px mr-0.5" />
          {{ badgeLabel }}
        </span>
        <span
          v-else
          class="text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 bg-gray-100 text-gray-400"
        >
          DRAFT
        </span>
      </div>
    </div>

    <!-- Action indicator -->
    <div class="shrink-0 flex items-center">
      <!-- Lock with tooltip -->
      <div v-if="!clickable && chapter.isPublic" class="relative flex items-center gap-2">
        <Lock
          :size="16"
          class="text-gray-300 group-hover:text-gray-500 transition-colors"
        />
        <!-- Tooltip -->
        <div
          class="absolute right-0 top-full mt-1 w-48 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10"
        >
          <p class="font-semibold">{{ lockReasonTitle }}</p>
          <p class="text-gray-300 mt-0.5 text-[11px]">{{ lockReasonSub }}</p>
        </div>
        <!-- Purchase icon for paid chapters -->
        <button
          v-if="isPaid && !chapter.isPremium"
          @click.stop="emit('purchase')"
          class="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-[#c5a050]/10 text-[#c5a050] hover:bg-[#c5a050] hover:text-white transition-all"
          title="Purchase with QR"
        >
          <ShoppingCart :size="14" />
        </button>
      </div>

      <!-- Chevron for clickable -->
      <ChevronRight
        v-else-if="clickable"
        :size="18"
        class="text-gray-300 group-hover:text-[#134e4a] group-hover:translate-x-0.5 transition-all"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Lock, ChevronRight, Globe, ShoppingCart, Star } from "lucide-vue-next";
import type { Chapter } from "../../types/bookDetails";

const props = defineProps<{
  chapter: Chapter;
  index: number;
  accessible?: boolean;
}>();

const emit = defineEmits<{
  click: [];
  purchase: [];
}>();

const accessible = computed(() => props.accessible ?? true);
const clickable = computed(() => props.chapter.isPublic && accessible.value);

function handleClick() {
  emit("click");
}

// ── Row styling ──

const isPaid = computed(
  () => !props.chapter.isFree && props.chapter.isPurchasable && props.chapter.price > 0
);

const rowClasses = computed(() => {
  if (!props.chapter.isPublic) {
    return "bg-gray-50/80 border-gray-100 cursor-default";
  }
  if (clickable.value) {
    return "bg-white border-gray-100 hover:border-[#134e4a]/30 hover:shadow-md cursor-pointer";
  }
  return "bg-white border-gray-100 hover:border-amber-200 hover:shadow-sm cursor-pointer";
});

const accentClass = computed(() => {
  if (!props.chapter.isPublic) return "bg-gray-300";
  if (props.chapter.isPremium) return "bg-purple-400";
  if (isPaid.value) return "bg-amber-400";
  if (clickable.value) return "bg-green-400";
  return "bg-gray-300";
});

const numberClass = computed(() => {
  if (!props.chapter.isPublic) return "text-gray-300";
  if (clickable.value) return "text-gray-400 group-hover:text-[#134e4a]";
  return "text-gray-300";
});

const titleClass = computed(() => {
  if (!props.chapter.isPublic) return "text-gray-400";
  if (clickable.value) return "text-gray-900 group-hover:text-[#134e4a]";
  return "text-gray-500";
});

// ── Badge ──

const badgeIcon = computed(() => {
  if (props.chapter.isPremium) return Star;
  if (isPaid.value) return ShoppingCart;
  return Globe;
});

const badgeLabel = computed(() => {
  if (props.chapter.isPremium) return "PREMIUM";
  if (isPaid.value) return `$${props.chapter.price.toFixed(2)}`;
  return "FREE";
});

const badgeClass = computed(() => {
  if (props.chapter.isPremium) {
    return "bg-purple-100 text-purple-700";
  }
  if (isPaid.value) {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-emerald-100 text-emerald-700";
});

// ── Lock reason ──

const lockReasonTitle = computed(() => {
  if (props.chapter.isPremium) return "Premium Chapter";
  if (isPaid.value) return "Paid Chapter";
  return "Locked";
});

const lockReasonSub = computed(() => {
  if (props.chapter.isPremium) return "Subscribe to unlock premium content";
  if (isPaid.value) return `Purchase for $${props.chapter.price.toFixed(2)} to read`;
  return "This chapter is not available";
});
</script>
