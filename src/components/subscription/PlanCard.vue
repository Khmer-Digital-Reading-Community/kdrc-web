<script setup lang="ts">
import { Check } from "lucide-vue-next";
import type { SubscriptionPlan } from "../../services/subscriptionApi";

defineProps<{
  plan: SubscriptionPlan;
  loading: boolean;
  isCurrentPlan: boolean;
}>();

defineEmits<{
  subscribe: [];
}>();
</script>

<template>
  <div
    class="bg-white rounded-2xl p-6 border-2 transition-all"
    :class="
      isCurrentPlan
        ? 'border-[#c5a050] shadow-lg'
        : 'border-gray-100 hover:border-gray-200'
    "
  >
    <div v-if="isCurrentPlan" class="mb-3">
      <span
        class="text-xs font-bold bg-[#c5a050] text-white px-3 py-1 rounded-full"
      >
        Current Plan
      </span>
    </div>

    <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
    <p v-if="plan.description" class="text-sm text-gray-500 mt-1">
      {{ plan.description }}
    </p>

    <div class="mt-4 mb-6">
      <span class="text-3xl font-extrabold text-[#093A3F]">
        {{ plan.price }}
      </span>
      <span class="text-gray-500 text-sm"> credits / {{ plan.durationDays }} days</span>
    </div>

    <ul v-if="plan.features?.length" class="space-y-2 mb-6">
      <li
        v-for="(feature, i) in plan.features"
        :key="i"
        class="flex items-start gap-2 text-sm text-gray-600"
      >
        <Check :size="16" class="text-green-500 mt-0.5 shrink-0" />
        {{ feature }}
      </li>
    </ul>

    <button
      v-if="!isCurrentPlan"
      @click="$emit('subscribe')"
      :disabled="loading"
      class="w-full py-2.5 text-sm font-semibold rounded-xl transition bg-[#c5a050] text-white hover:bg-[#b8913f] disabled:opacity-50"
    >
      {{ loading ? "Processing..." : "Subscribe" }}
    </button>
  </div>
</template>
