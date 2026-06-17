<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  Clock,
  Crown,
  Sparkles,
  CreditCard,
} from "lucide-vue-next";
import {
  getPaymentHistory,
  type UserSubscription,
} from "../../services/subscriptionApi";

const router = useRouter();
const history = ref<UserSubscription[]>([]);
const loading = ref(false);
const errorMessage = ref("");

const totalSpent = computed(() =>
  history.value
    .filter((h) => h.status === "ACTIVE")
    .reduce((sum, h) => sum + Number(h.plan?.price ?? 0), 0)
);

const subscriptionCount = computed(() => history.value.length);

const activeSince = computed(() => {
  if (history.value.length === 0) return null;
  const oldest = [...history.value].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )[0];
  return new Date(oldest.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const stats = computed(() => [
  {
    label: "Total Spent",
    value: totalSpent.value === 0 ? "Free" : totalSpent.value + " credits",
    icon: CreditCard,
    color: "#093A3F",
  },
  {
    label: "Subscriptions",
    value: String(subscriptionCount.value),
    icon: Crown,
    color: "#c5a050",
  },
  {
    label: "Active Since",
    value: activeSince.value ?? "—",
    icon: Clock,
    color: "#735c00",
  },
]);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusColor = (status: string) => {
  if (status === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "CANCELLED") return "bg-red-100 text-red-700";
  if (status === "EXPIRED") return "bg-gray-100 text-gray-500";
  if (status === "TRIAL") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

const statusDot = (status: string) => {
  if (status === "ACTIVE") return "bg-emerald-500";
  if (status === "CANCELLED") return "bg-red-500";
  if (status === "EXPIRED") return "bg-gray-400";
  if (status === "TRIAL") return "bg-blue-500";
  return "bg-yellow-500";
};

onMounted(async () => {
  loading.value = true;
  try {
    history.value = await getPaymentHistory();
  } catch (e: any) {
    errorMessage.value =
      e?.response?.data?.message || "Failed to load payment history.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <button
        @click="router.push('/dashboard/billing')"
        class="w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-gray-200"
        style="background-color: rgba(9, 58, 63, 0.04); color: #093A3F"
      >
        <ArrowLeft :size="18" />
      </button>
      <div>
        <h1 class="text-2xl font-bold" style="color: #093A3F">
          Payment History
        </h1>
        <p class="text-gray-500 text-sm mt-0.5">
          Track all your subscription payments and renewals.
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2"
        style="border-color: #093A3F"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="errorMessage"
      class="text-center py-20"
    >
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style="background-color: rgba(239, 68, 68, 0.08)"
      >
        <CreditCard :size="24" class="text-red-500" />
      </div>
      <p class="text-red-500 font-medium mb-2">{{ errorMessage }}</p>
      <button
        @click="router.push('/dashboard/billing')"
        class="text-sm font-semibold hover:underline"
        style="color: #093A3F"
      >
        ← Back to Plan & Billing
      </button>
    </div>

    <template v-else>
      <!-- Stats Bar -->
      <div
        v-if="history.length > 0"
        class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :style="{ backgroundColor: stat.color + '14' }"
          >
            <component :is="stat.icon" :size="18" :style="{ color: stat.color }" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
              {{ stat.label }}
            </p>
            <p class="text-lg font-bold" style="color: #093A3F">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="history.length === 0"
        class="bg-white rounded-2xl border border-gray-100 py-16 text-center"
      >
        <Clock :size="40" class="mx-auto mb-4 text-gray-300" />
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          No Payment History
        </h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto mb-6">
          Your subscription transactions and renewals will appear here once you
          subscribe to a plan.
        </p>
        <button
          @click="router.push('/dashboard/billing')"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition text-white hover:opacity-90"
          style="background-color: #093A3F"
        >
          Browse Plans
        </button>
      </div>

      <!-- History Table -->
      <div
        v-else
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide"
              >
                <th class="text-left px-5 py-3.5 font-medium">Plan</th>
                <th class="text-left px-5 py-3.5 font-medium">Start Date</th>
                <th class="text-left px-5 py-3.5 font-medium">End Date</th>
                <th class="text-left px-5 py-3.5 font-medium">Credits</th>
                <th class="text-left px-5 py-3.5 font-medium">Status</th>
                <th class="text-left px-5 py-3.5 font-medium">Auto Renew</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in history"
                :key="item.id"
                class="border-b border-gray-50 hover:bg-gray-50/60 transition"
              >
                <!-- Plan -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      :style="
                        Number(item.plan?.price ?? 0) > 0
                          ? { backgroundColor: 'rgba(197, 160, 80, 0.12)', color: '#735c00' }
                          : { backgroundColor: 'rgba(9, 58, 63, 0.08)', color: '#093A3F' }
                      "
                    >
                      <Crown v-if="Number(item.plan?.price ?? 0) > 0" :size="14" />
                      <Sparkles v-else :size="14" />
                    </span>
                    <span class="font-medium text-gray-900">
                      {{ item.plan?.name ?? "—" }}
                    </span>
                  </div>
                </td>

                <!-- Start Date -->
                <td class="px-5 py-4 text-gray-500">
                  {{ formatDate(item.startDate) }}
                </td>

                <!-- End Date -->
                <td class="px-5 py-4 text-gray-500">
                  {{ formatDate(item.endDate) }}
                </td>

                <!-- Credits -->
                <td class="px-5 py-4">
                  <span class="font-semibold" :class="Number(item.plan?.price ?? 0) === 0 ? 'text-emerald-600' : 'text-gray-900'">
                    {{ Number(item.plan?.price ?? 0) === 0 ? 'Free' : Number(item.plan?.price ?? 0) + ' credits' }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-5 py-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusColor(item.status)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(item.status)"></span>
                    {{ item.status }}
                  </span>
                </td>

                <!-- Auto Renew -->
                <td class="px-5 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="
                      item.autoRenew && item.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    "
                  >
                    {{ item.autoRenew && item.status === 'ACTIVE' ? "On" : "Off" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
