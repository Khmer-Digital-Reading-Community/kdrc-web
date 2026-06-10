<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getPlans,
  getMySubscription,
  toggleAutoRenew,
  getPaymentHistory,
  subscribe,
  cancelSubscription,
  type SubscriptionPlan,
  type UserSubscription,
} from "../../services/subscriptionApi";

const router = useRouter();

const plans = ref<SubscriptionPlan[]>([]);
const mySubscription = ref<UserSubscription | null>(null);
const history = ref<UserSubscription[]>([]);
const loading = ref(false);
const toggleLoading = ref(false);
const subscribeLoading = ref<string | null>(null);
const errorMessage = ref("");

const currentPlan = computed(() =>
  plans.value.find((p) => p.id === mySubscription.value?.planId)
);

const nextPayment = computed(() => {
  if (!mySubscription.value) return null;
  return new Date(mySubscription.value.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusColor = (status: string) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-700";
  if (status === "CANCELLED") return "bg-red-100 text-red-700";
  if (status === "EXPIRED") return "bg-gray-100 text-gray-500";
  return "bg-yellow-100 text-yellow-700";
};

const buttonLabel = (plan: SubscriptionPlan) => {
  if (subscribeLoading.value === plan.id) return "Processing...";
  if (mySubscription.value?.planId === plan.id) return "Active";
  if (Number(plan.price) === 0) return "Get Started";
  if (mySubscription.value) return "Switch Plan";
  return "Subscribe";
};

const handleToggleRenew = async () => {
  toggleLoading.value = true;
  try {
    const res = await toggleAutoRenew();
    if (mySubscription.value) {
      mySubscription.value.autoRenew = res.autoRenew;
    }
  } catch (e) {
    console.error(e);
  } finally {
    toggleLoading.value = false;
  }
};

const handleSelectPlan = async (plan: SubscriptionPlan) => {
  errorMessage.value = "";
  subscribeLoading.value = plan.id;
  try {
    if (mySubscription.value) {
      await cancelSubscription();
    }
    if (Number(plan.price) > 0) {
      await subscribe(plan.id);
    }
    const [s, h] = await Promise.all([
      getMySubscription(),
      getPaymentHistory(),
    ]);
    mySubscription.value = s;
    history.value = h;
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.message || "Something went wrong";
  } finally {
    subscribeLoading.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const [p, s, h] = await Promise.all([
      getPlans(),
      getMySubscription(),
      getPaymentHistory(),
    ]);
    plans.value = p;
    mySubscription.value = s;
    history.value = h;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Plan & Billing</h1>
      <p class="text-gray-500 text-sm mt-1">
        Manage your membership and billing preferences.
      </p>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">
      Loading...
    </div>

    <div v-else>
      <!-- Active Subscription Card -->
      <div
        v-if="mySubscription && currentPlan"
        class="bg-[#093A3F] text-white rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest opacity-60">
            Active Subscription
          </span>
          <h2 class="text-xl font-bold mt-1">{{ currentPlan.name }}</h2>
          <p class="text-sm opacity-70 mt-1">
            You are currently enjoying {{ currentPlan.features?.join(", ") }}.
          </p>
          <div class="flex gap-6 mt-4 text-sm">
            <div>
              <p class="opacity-60 text-xs uppercase tracking-wide">Next Payment</p>
              <p class="font-semibold">{{ nextPayment }}</p>
            </div>
            <div>
              <p class="opacity-60 text-xs uppercase tracking-wide">Amount Due</p>
              <p class="font-semibold">${{ currentPlan.price }}/mo</p>
            </div>
          </div>
        </div>

        <!-- Manage Renewal Toggle -->
        <div class="flex flex-col items-start md:items-end gap-2">
          <p class="text-xs opacity-60 uppercase tracking-wide">Auto Renewal</p>
          <button
            @click="handleToggleRenew"
            :disabled="toggleLoading"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition"
            :class="
              mySubscription.autoRenew
                ? 'bg-white text-[#093A3F] hover:bg-gray-100'
                : 'bg-white/20 text-white hover:bg-white/30'
            "
          >
            <span
              class="w-3 h-3 rounded-full"
              :class="mySubscription.autoRenew ? 'bg-green-500' : 'bg-gray-400'"
            ></span>
            {{
              toggleLoading
                ? "Updating..."
                : mySubscription.autoRenew
                ? "On — Click to Cancel"
                : "Off — Click to Enable"
            }}
          </button>
        </div>
      </div>

      <!-- No subscription -->
      <div
        v-else
        class="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 text-center"
      >
        <p class="text-gray-500">You don't have an active subscription.</p>
      </div>

      <!-- Error message -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4 px-1">
        {{ errorMessage }}
      </p>

      <!-- Pricing Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">
          Change Your Perspective
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="rounded-2xl border p-5 flex flex-col transition"
            :class="
              mySubscription?.planId === plan.id
                ? 'border-[#093A3F] bg-[#093A3F] text-white'
                : 'border-gray-200 bg-white text-gray-900'
            "
          >
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-base">{{ plan.name }}</h3>
              <span
                v-if="mySubscription?.planId === plan.id"
                class="text-xs font-bold uppercase tracking-widest bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full"
              >
                Active
              </span>
            </div>
            <p class="text-2xl font-bold mt-1">
              ${{ Number(plan.price).toFixed(2) }}
              <span class="text-sm font-normal opacity-60">/month</span>
            </p>
            <ul class="mt-4 space-y-2 flex-1">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-2 text-sm"
                :class="
                  mySubscription?.planId === plan.id
                    ? 'opacity-80'
                    : 'text-gray-600'
                "
              >
                <span class="text-green-500">✓</span> {{ feature }}
              </li>
            </ul>
            <button
              @click="handleSelectPlan(plan)"
              :disabled="
                mySubscription?.planId === plan.id ||
                subscribeLoading !== null
              "
              class="mt-5 w-full py-2 rounded-xl text-sm font-semibold transition"
              :class="
                mySubscription?.planId === plan.id
                  ? 'bg-white text-[#093A3F] cursor-default'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
              "
            >
              {{ buttonLabel(plan) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Billing History Preview -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Billing History</h2>
          <button
            @click="router.push('/dashboard/billing/history')"
            class="text-sm text-[#093A3F] font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        <div
          v-if="history.length === 0"
          class="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100"
        >
          No billing history yet.
        </div>

        <div
          v-else
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <table class="w-full text-sm">
            <thead>
              <tr
                class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide"
              >
                <th class="text-left px-5 py-3">Plan</th>
                <th class="text-left px-5 py-3">Date</th>
                <th class="text-left px-5 py-3">Amount</th>
                <th class="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in history.slice(0, 3)"
                :key="item.id"
                class="border-b border-gray-50 hover:bg-gray-50 transition"
                :class="index === history.slice(0, 3).length - 1 ? 'border-0' : ''"
              >
                <td class="px-5 py-4 font-medium text-gray-900">
                  {{ item.plan?.name ?? "—" }}
                </td>
                <td class="px-5 py-4 text-gray-500">
                  {{ formatDate(item.startDate) }}
                </td>
                <td class="px-5 py-4 text-gray-900 font-semibold">
                  ${{ item.plan?.price ?? "—" }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="statusColor(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>