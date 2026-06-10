<template>
  <div class="min-h-screen bg-[#F9FAFB] px-4 py-10 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div v-if="loading" class="mx-auto max-w-7xl py-20 text-center text-gray-500">
      Loading trade details...
    </div>

    <div v-else-if="error" class="mx-auto max-w-3xl py-20 text-center">
      <h2 class="text-2xl font-bold mb-2">Trade not found</h2>
      <p class="text-gray-500 mb-6">This trade may have been removed or you do not have access.</p>
      <router-link to="/exchange-dashboard-v2" class="inline-block bg-[#093A3F] text-white px-6 py-2 rounded-xl">
        Back to Trade Center
      </router-link>
    </div>

    <div v-else-if="trade" class="mx-auto max-w-7xl space-y-8">
      <div class="rounded-[32px] bg-gradient-to-r from-[#093A3F] to-[#0f5961] px-6 py-8 text-white shadow-xl sm:px-8">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Trade Management</p>
            <h1 class="mt-2 text-3xl font-extrabold sm:text-4xl text-white!">
              {{ trade.exchange?.title }} ↔ {{ trade.offeredExchange?.title }}
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              Coordinate pickup with {{ counterpartyName }} and mark the trade complete once both books have been exchanged.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <p class="text-xs font-bold uppercase tracking-wider text-white/60">Auto refresh</p>
            <p class="mt-1 text-sm font-semibold text-white">Polling every 10 seconds</p>
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
            <span class="status-pill" :class="statusClasses(trade.status)">
              <span class="status-dot" :class="dotClasses(trade.status)"></span>
              {{ getStatusLabel(trade.status) }}
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
              <p class="mt-1 font-semibold text-gray-900">{{ trade.meetingLocation || trade.exchange?.location || 'Not scheduled yet' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Pickup window</p>
              <p class="mt-1 font-semibold text-gray-900">{{ trade.meetingTime || 'Not scheduled yet' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Counterparty</p>
              <p class="mt-1 font-semibold text-gray-900">{{ counterpartyName }}</p>
            </div>
          </div>

          <form
            v-if="trade.status === 'ACCEPTED'"
            class="mt-6 space-y-3"
            @submit.prevent="submitSchedule"
          >
            <input
              v-model="scheduleForm.meetingLocation"
              type="text"
              required
              placeholder="Meeting location"
              class="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#8B5CF6]"
            />
            <input
              v-model="scheduleForm.meetingTime"
              type="text"
              required
              placeholder="Pickup time (e.g. Today, 5:00 PM)"
              class="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#8B5CF6]"
            />
            <button
              type="submit"
              class="w-full rounded-2xl bg-[#8B5CF6] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#7C3AED] disabled:opacity-50"
              :disabled="scheduling"
            >
              {{ scheduling ? 'Saving...' : 'Schedule Meeting' }}
            </button>
          </form>

          <div class="mt-6 flex flex-col gap-3">
            <button
              type="button"
              @click="markAsCompleted"
              class="rounded-2xl bg-[#093A3F] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0d4d54] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="trade.status === 'COMPLETED' || completing"
            >
              {{ completing ? 'Saving...' : 'Mark as Completed' }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Books in this trade</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900">Exchange summary</h2>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-gray-100 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Listed book</p>
              <div class="flex gap-4">
                <img :src="trade.exchange?.imageUrl" class="h-24 w-16 rounded-lg object-cover" />
                <div>
                  <p class="font-bold text-gray-900">{{ trade.exchange?.title }}</p>
                  <p class="text-sm text-gray-500">{{ trade.exchange?.author }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ trade.exchange?.location }}</p>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-gray-100 p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Offered book</p>
              <div class="flex gap-4">
                <img :src="trade.offeredExchange?.imageUrl" class="h-24 w-16 rounded-lg object-cover" />
                <div>
                  <p class="font-bold text-gray-900">{{ trade.offeredExchange?.title }}</p>
                  <p class="text-sm text-gray-500">{{ trade.offeredExchange?.author }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ trade.offeredExchange?.location }}</p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="trade.message" class="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <span class="font-semibold text-gray-900">Proposal message:</span> {{ trade.message }}
          </p>
        </div>

        <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Auto refresh</p>
          <h2 class="mt-1 text-2xl font-bold text-gray-900">Polling state</h2>
          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <p>The page refreshes trade status automatically while the exchange is active.</p>
            <p class="font-semibold text-gray-900">Refresh count: {{ refreshCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authState } from '../../services/auth';
import { exchangeService } from '../../services/exchange.service';
import type { ExchangeRequest, ExchangeRequestStatus } from '../../types/exchange';

const route = useRoute();
const router = useRouter();

const trade = ref<ExchangeRequest | null>(null);
const loading = ref(true);
const error = ref(false);
const refreshCount = ref(0);
const lastSynced = ref(new Date());
const timerId = ref<number | null>(null);
const scheduling = ref(false);
const completing = ref(false);

const scheduleForm = reactive({
  meetingLocation: '',
  meetingTime: '',
});

const steps = [
  { key: 'pending', title: 'Requested', description: 'The exchange request was sent and is awaiting a response.' },
  { key: 'accepted', title: 'Accepted', description: 'Both sides agreed to trade and can schedule pickup.' },
  { key: 'meeting', title: 'Meeting Scheduled', description: 'Pickup time and location have been set.' },
  { key: 'completed', title: 'Completed', description: 'The books were exchanged and the trade is closed.' },
] as const;

const statusToStep: Record<ExchangeRequestStatus, number> = {
  PENDING: 0,
  ACCEPTED: 1,
  MEETING_SCHEDULED: 2,
  COMPLETED: 3,
  CANCELLED: 0,
  REJECTED: 0,
};

const currentStepIndex = computed(() =>
  trade.value ? statusToStep[trade.value.status] ?? 0 : 0,
);
const progressWidth = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100);
const lastSyncedLabel = computed(() => lastSynced.value.toLocaleTimeString());

const counterpartyName = computed(() => {
  if (!trade.value || !authState.user.value) return 'Partner';
  const isOwner = trade.value.exchange?.owner?.id === authState.user.value.id;
  return isOwner
    ? trade.value.requester?.name || 'Trader'
    : trade.value.exchange?.owner?.name || 'Owner';
});

const getStatusLabel = (status: ExchangeRequestStatus) => {
  const labels: Record<ExchangeRequestStatus, string> = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    MEETING_SCHEDULED: 'Meeting Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected',
  };
  return labels[status];
};

const statusClasses = (status: ExchangeRequestStatus) => {
  const map: Record<ExchangeRequestStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-600',
    ACCEPTED: 'bg-blue-50 text-blue-600',
    MEETING_SCHEDULED: 'bg-indigo-50 text-indigo-600',
    COMPLETED: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-red-50 text-red-600',
    REJECTED: 'bg-red-50 text-red-600',
  };
  return map[status];
};

const dotClasses = (status: ExchangeRequestStatus) => {
  const map: Record<ExchangeRequestStatus, string> = {
    PENDING: 'bg-yellow-500',
    ACCEPTED: 'bg-blue-500',
    MEETING_SCHEDULED: 'bg-indigo-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    REJECTED: 'bg-red-500',
  };
  return map[status];
};

const loadTrade = async () => {
  const tradeId = String(route.params.tradeId ?? '');
  const response = await exchangeService.getRequest(tradeId);
  trade.value = response.data;
  scheduleForm.meetingLocation = trade.value.meetingLocation || trade.value.exchange?.location || '';
  scheduleForm.meetingTime = trade.value.meetingTime || '';
  refreshCount.value += 1;
  lastSynced.value = new Date();

  if (trade.value.status === 'COMPLETED' || trade.value.status === 'CANCELLED' || trade.value.status === 'REJECTED') {
    stopPolling();
  }
};

const stopPolling = () => {
  if (timerId.value !== null) {
    window.clearInterval(timerId.value);
    timerId.value = null;
  }
};

const submitSchedule = async () => {
  if (!trade.value) return;
  scheduling.value = true;
  try {
    const response = await exchangeService.scheduleMeeting(trade.value.id, {
      meetingLocation: scheduleForm.meetingLocation,
      meetingTime: scheduleForm.meetingTime,
    });
    trade.value = response.data;
  } finally {
    scheduling.value = false;
  }
};

const markAsCompleted = async () => {
  if (!trade.value) return;
  completing.value = true;
  try {
    const response = await exchangeService.completeRequest(trade.value.id);
    trade.value = response.data;
    stopPolling();
  } finally {
    completing.value = false;
  }
};

onMounted(async () => {
  if (!authState.token.value) {
    router.push({
      path: '/login',
      query: { redirect: route.fullPath },
    });
    return;
  }

  try {
    await loadTrade();
    timerId.value = window.setInterval(() => {
      loadTrade().catch(() => undefined);
    }, 10000);
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  stopPolling();
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
