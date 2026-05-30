<template>
  <div class="min-h-screen bg-[#F9FAFB] px-4 py-10 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div class="mx-auto max-w-7xl space-y-8">
      <div class="rounded-[32px] bg-gradient-to-r from-[#093A3F] to-[#0f5961] px-6 py-8 text-white shadow-xl sm:px-8">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Trade Management</p>
            <h1 class="mt-2 text-3xl font-extrabold sm:text-4xl text-white!">Manage pickup for trade #{{ tradeId }}</h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Track the exchange status, coordinate the meetup, and keep the owner and trader synced as the trade moves forward.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p class="text-xs font-bold uppercase tracking-wider text-white/60">Auto refresh</p>
            <p class="mt-1 text-sm font-semibold text-white">Polling every 5 seconds</p>
            <p class="text-xs text-white/70">Last sync: {{ lastSyncedLabel }}</p>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Trade progress</p>
              <h2 class="mt-1 text-2xl font-bold text-gray-900">Timeline</h2>
            </div>
            <span class="status-pill" :class="statusClasses(tradeStatus)">
              <span class="status-dot" :class="dotClasses(tradeStatus)"></span>
              {{ tradeStatus }}
            </span>
          </div>

          <div class="mt-8">
            <div class="mb-4 h-2 rounded-full bg-gray-100">
              <div
                class="h-2 rounded-full bg-[#8B5CF6] transition-all duration-300"
                :style="{ width: `${progressWidth}%` }"
              ></div>
            </div>

            <div class="grid gap-4 sm:grid-cols-4">
              <div
                v-for="(step, index) in steps"
                :key="step.key"
                class="rounded-2xl border p-4 transition-all"
                :class="index <= currentStepIndex ? 'border-[#8B5CF6] bg-purple-50' : 'border-gray-200 bg-white'"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Step {{ index + 1 }}</span>
                  <span
                    class="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold"
                    :class="index <= currentStepIndex ? 'bg-[#8B5CF6] text-white' : 'bg-gray-100 text-gray-400'"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
                <h3 class="mt-3 font-bold text-gray-900">{{ step.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Trade details</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900">Meeting info</h2>

          <div class="mt-6 space-y-4">
            <div class="rounded-2xl bg-gray-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Location</p>
              <p class="mt-1 font-semibold text-gray-900">BKK1, Phnom Penh</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Pickup window</p>
              <p class="mt-1 font-semibold text-gray-900">Today, 5:00 PM - 7:00 PM</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Counterparty</p>
              <p class="mt-1 font-semibold text-gray-900">Sokha R.</p>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3">
            <button
              type="button"
              @click="markAsCompleted"
              class="rounded-2xl bg-[#093A3F] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0d4d54] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="tradeStatus === 'Completed'"
            >
              Mark as Completed
            </button>
            <button
              type="button"
              class="rounded-2xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Message Partner
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Live activity</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900">Status feed</h2>

          <div class="mt-6 space-y-4">
            <div v-for="event in activityFeed" :key="event.label" class="flex gap-4 rounded-2xl border border-gray-100 p-4">
              <div class="mt-1 h-3 w-3 rounded-full bg-[#8B5CF6]"></div>
              <div>
                <p class="font-semibold text-gray-900">{{ event.label }}</p>
                <p class="text-sm text-gray-500">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Auto refresh</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900">Polling state</h2>
          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <p>Every interval refreshes the local trade snapshot.</p>
            <p>When the trade reaches the final step, the page stops polling automatically.</p>
            <p class="font-semibold text-gray-900">Refresh count: {{ refreshCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

type TradeStatus = 'Requested' | 'Accepted' | 'Meeting Scheduled' | 'Completed';

type ActivityEvent = {
  label: string;
  description: string;
};

const route = useRoute();
const tradeId = computed(() => String(route.params.tradeId ?? '0000'));

const steps = [
  {
    key: 'requested',
    title: 'Requested',
    description: 'The exchange request is created and waiting for confirmation.',
  },
  {
    key: 'accepted',
    title: 'Accepted',
    description: 'The owner approves the request and starts coordinating.',
  },
  {
    key: 'meeting',
    title: 'Meeting Scheduled',
    description: 'Both sides agree on a pickup time and location.',
  },
  {
    key: 'completed',
    title: 'Completed',
    description: 'The books have been swapped and the trade is closed.',
  },
] as const;

const currentStepIndex = ref(1);
const refreshCount = ref(0);
const lastSynced = ref(new Date());
const timerId = ref<number | null>(null);

const tradeStatus = computed<TradeStatus>(() => steps[currentStepIndex.value]?.title ?? 'Completed');
const progressWidth = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100);
const lastSyncedLabel = computed(() => lastSynced.value.toLocaleTimeString());

const activityFeed = computed<ActivityEvent[]>(() => [
  {
    label: 'Owner accepted the exchange',
    description: 'The current offer has been approved and is ready for coordination.',
  },
  {
    label: 'Pickup location confirmed',
    description: 'Meet at BKK1, Phnom Penh during the agreed pickup window.',
  },
  {
    label: tradeStatus.value === 'Completed' ? 'Trade completed' : 'Waiting for final confirmation',
    description: tradeStatus.value === 'Completed'
      ? 'Both parties marked the exchange as completed.'
      : 'The page will refresh automatically to detect the latest status.',
  },
]);

const statusClasses = (status: TradeStatus) => {
  const map: Record<TradeStatus, string> = {
    Requested: 'bg-yellow-50 text-yellow-600',
    Accepted: 'bg-blue-50 text-blue-600',
    'Meeting Scheduled': 'bg-indigo-50 text-indigo-600',
    Completed: 'bg-green-50 text-green-600',
  };

  return map[status];
};

const dotClasses = (status: TradeStatus) => {
  const map: Record<TradeStatus, string> = {
    Requested: 'bg-yellow-500',
    Accepted: 'bg-blue-500',
    'Meeting Scheduled': 'bg-indigo-500',
    Completed: 'bg-green-500',
  };

  return map[status];
};

const syncTradeState = () => {
  refreshCount.value += 1;
  lastSynced.value = new Date();

  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value += 1;
  } else if (timerId.value !== null) {
    window.clearInterval(timerId.value);
    timerId.value = null;
  }
};

const markAsCompleted = () => {
  currentStepIndex.value = steps.length - 1;
  lastSynced.value = new Date();

  if (timerId.value !== null) {
    window.clearInterval(timerId.value);
    timerId.value = null;
  }
};

onMounted(() => {
  timerId.value = window.setInterval(syncTradeState, 5000);
});

onBeforeUnmount(() => {
  if (timerId.value !== null) {
    window.clearInterval(timerId.value);
  }
});
</script>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
}
</style>
