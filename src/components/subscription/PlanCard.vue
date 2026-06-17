<script setup lang="ts">
import { computed } from "vue";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-vue-next";
import type { SubscriptionPlan } from "../../services/subscriptionApi";

const props = defineProps<{
  plan: SubscriptionPlan;
  loading: boolean;
  isCurrentPlan: boolean;
}>();

defineEmits<{
  subscribe: [];
}>();

const isFree = computed(() => Number(props.plan.price) === 0);

// const priceText = computed(() =>
//   isFree.value ? "Free" : `${props.plan.price} credits`
// );

// const periodText = computed(() =>
//   isFree.value
//     ? "forever"
//     : `/ ${props.plan.durationDays} days`
// );

const buttonText = computed(() => {
  if (props.loading) return "Processing...";
  if (props.isCurrentPlan) return "Current Plan";
  if (isFree.value) return "Get Started Free";
  return "Subscribe";
});
</script>

<template>
  <div
    class="relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col"
    :class="
      isCurrentPlan
        ? 'border-[#c5a050] shadow-lg ring-1 ring-[#c5a050]/30'
        : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
    "
  >
    <!-- Recommended badge (Premium) -->
    <div
      v-if="!isFree && !isCurrentPlan"
      class="absolute -top-3 left-6 px-4 py-1 rounded-full text-xs font-bold bg-[#c5a050] text-white shadow-sm"
    >
      Recommended
    </div>

    <!-- Current Plan badge -->
    <div v-if="isCurrentPlan" class="mb-3">
      <span
        class="inline-flex items-center gap-1.5 text-xs font-bold bg-[#c5a050] text-white px-3 py-1 rounded-full"
      >
        <ShieldCheck :size="12" />
        Current Plan
      </span>
    </div>

    <!-- Plan icon + name -->
    <div class="flex items-center gap-2.5 mb-1">
      <span
        class="w-9 h-9 rounded-xl flex items-center justify-center"
        :class="
          isFree
            ? 'bg-[#093A3F]/10 text-[#093A3F]'
            : 'bg-[#c5a050]/10 text-[#735c00]'
        "
      >
        <Crown v-if="!isFree" :size="17" />
        <Sparkles v-else :size="17" />
      </span>
      <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
    </div>

    <p
      v-if="plan.description"
      class="text-sm text-gray-500 mt-1.5 mb-4 leading-relaxed"
    >
      {{ plan.description }}
    </p>

    <!-- Price -->
    <div class="mt-2 mb-6">
      <span class="text-3xl font-extrabold text-[#093A3F]">
        {{ isFree ? "Free" : plan.price }}
      </span>
      <span class="text-gray-500 text-sm ml-1">
        {{ isFree ? "forever" : "credits / " + plan.durationDays + " days" }}
      </span>
    </div>

    <!-- Features -->
    <ul v-if="plan.features?.length" class="space-y-3 mb-6 flex-1">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="flex items-start gap-2.5 text-sm text-gray-600"
      >
        <Check :size="16" class="text-green-500 mt-0.5 shrink-0" />
        <span>{{ feature }}</span>
      </li>
    </ul>

    <!-- CTA Button -->
    <button
      v-if="!isCurrentPlan"
      @click="$emit('subscribe')"
      :disabled="loading"
      class="w-full py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      :class="
        isFree
          ? 'bg-[#093A3F] text-white hover:bg-[#0a4a50]'
          : 'bg-[#c5a050] text-white hover:bg-[#b8913f]'
      "
    >
      <RefreshCw v-if="loading" :size="16" class="animate-spin" />
      {{ buttonText }}
    </button>

    <!-- Active indicator for current plan -->
    <div
      v-else
      class="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-gray-100 text-gray-500 cursor-default flex items-center justify-center gap-2"
    >
      <ShieldCheck :size="16" />
      Current Plan
    </div>
  </div>
</template>
