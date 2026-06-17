<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  CreditCard,
  Crown,
  Sparkles,
  ChevronRight,
  Clock,
  Check,
  ShieldCheck,
  BadgeCheck,
  Zap,
  RefreshCw,
} from "lucide-vue-next";
import {
  getPlans,
  getMySubscription,
  getPaymentHistory,
  cancelSubscription,
  toggleAutoRenew,
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
const cancelLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const currentPlan = computed(() =>
  plans.value.find((p) => p.id === mySubscription.value?.planId),
);

const isPremium = computed(() => {
  if (!currentPlan.value) return false;
  return Number(currentPlan.value.price) > 0;
});

const daysRemaining = computed(() => {
  if (!mySubscription.value) return 0;
  const end = new Date(mySubscription.value.endDate);
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, diff);
});

const progressPercent = computed(() => {
  if (!mySubscription.value || !currentPlan.value) return 100;
  const start = new Date(mySubscription.value.startDate);
  const end = new Date(mySubscription.value.endDate);
  const now = new Date();
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
});

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
  if (status === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "CANCELLED") return "bg-red-100 text-red-700";
  if (status === "EXPIRED") return "bg-gray-100 text-gray-500";
  if (status === "TRIAL") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
};

const buttonLabel = (plan: SubscriptionPlan) => {
  if (subscribeLoading.value === plan.id) return "Processing...";
  if (mySubscription.value?.planId === plan.id) return "Current Plan";
  if (Number(plan.price) === 0) return "Get Started Free";
  if (mySubscription.value) return "Switch to Premium";
  return "Subscribe";
};

const buttonStyle = (plan: SubscriptionPlan) => {
  if (mySubscription.value?.planId === plan.id) {
    return Number(plan.price) === 0
      ? "bg-gray-100 text-gray-500 cursor-default"
      : "bg-white text-[#093A3F] cursor-default";
  }
  return Number(plan.price) === 0
    ? "bg-[#093A3F] text-white hover:bg-[#0a4a50]"
    : "bg-[#c5a050] text-white hover:bg-[#b8913f]";
};

const sortedPlans = computed(() =>
  [...plans.value].sort((a, b) => Number(a.price) - Number(b.price)),
);

const handleToggleRenew = async () => {
  toggleLoading.value = true;
  try {
    const res = await toggleAutoRenew();
    if (mySubscription.value) {
      mySubscription.value.autoRenew = res.autoRenew;
    }
    successMessage.value = res.autoRenew
      ? "Auto-renew enabled. Your subscription will renew automatically."
      : "Auto-renew disabled. Your subscription will expire at the end of the period.";
    setTimeout(() => (successMessage.value = ""), 4000);
  } catch (e) {
    console.error(e);
  } finally {
    toggleLoading.value = false;
  }
};

const handleCancel = async () => {
  cancelLoading.value = true;
  errorMessage.value = "";
  try {
    await cancelSubscription();
    const [s, h] = await Promise.all([
      getMySubscription(),
      getPaymentHistory(),
    ]);
    mySubscription.value = s;
    history.value = h;
    successMessage.value = "Subscription cancelled successfully.";
    setTimeout(() => (successMessage.value = ""), 4000);
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.message || "Failed to cancel subscription.";
  } finally {
    cancelLoading.value = false;
  }
};

const handleSelectPlan = async (plan: SubscriptionPlan) => {
  errorMessage.value = "";
  successMessage.value = "";
  subscribeLoading.value = plan.id;
  try {
    const isSwitching = !!mySubscription.value;
    // const result = await subscribe(plan.id);
    const [s, h] = await Promise.all([
      getMySubscription(),
      getPaymentHistory(),
    ]);
    mySubscription.value = s;
    history.value = h;
    successMessage.value = isSwitching
      ? `Successfully switched to ${plan.name}!`
      : `Successfully subscribed to ${plan.name}!`;
    setTimeout(() => (successMessage.value = ""), 4000);
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || "Something went wrong";
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
  } catch (e: any) {
    errorMessage.value =
      e?.response?.data?.message || "Failed to load billing information.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          style="background-color: rgba(9, 58, 63, 0.08)"
        >
          <CreditCard :size="20" style="color: #093a3f" />
        </div>
        <div>
          <h1 class="text-2xl font-bold" style="color: #093a3f">
            Plan & Billing
          </h1>
        </div>
      </div>
      <p class="text-gray-500 text-sm mt-2 ml-[52px]">
        Manage your membership, subscription plan, and billing preferences.
      </p>
    </div>

    <!-- Status messages -->
    <div
      v-if="successMessage"
      class="mb-6 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2"
    >
      <BadgeCheck :size="16" />
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
    >
      <Zap :size="16" class="shrink-0" />
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2"
        style="border-color: #093a3f"
      />
    </div>

    <div v-else>
      <!-- Active Subscription Card -->
      <div
        v-if="mySubscription && currentPlan"
        class="rounded-2xl overflow-hidden mb-8"
        style="background-color: #093a3f; color: #f7f1e6"
      >
        <div class="p-6 sm:p-8">
          <!-- Top row: badge + tier -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2.5">
              <span
                class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
              ></span>
              <span
                class="text-xs font-semibold uppercase tracking-widest opacity-70"
              >
                Active Subscription
              </span>
            </div>
            <span
              v-if="isPremium"
              class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full"
              style="background-color: #f9ae5b; color: #093a3f"
            >
              <Crown :size="12" />
              Premium
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full"
              style="
                background-color: rgba(255, 255, 255, 0.15);
                color: #f7f1e6;
              "
            >
              <Sparkles :size="12" />
              Free
            </span>
          </div>

          <!-- Plan name + features -->
          <h2 class="text-2xl sm:text-3xl font-bold mb-2">
            {{ currentPlan.name }}
          </h2>
          <p class="text-sm opacity-70 mb-2">{{ currentPlan.description }}</p>
          <div class="flex flex-wrap gap-3 mb-6">
            <span
              v-for="feature in currentPlan.features"
              :key="feature"
              class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style="background-color: rgba(255, 255, 255, 0.1)"
            >
              <Check :size="12" />
              {{ feature }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="mb-6">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="opacity-60">Subscription period</span>
              <span class="opacity-80 font-medium"
                >{{ daysRemaining }} days remaining</span
              >
            </div>
            <div
              class="w-full h-2 rounded-full"
              style="background-color: rgba(255, 255, 255, 0.15)"
            >
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: progressPercent + '%',
                  backgroundColor: '#F9AE5B',
                }"
              ></div>
            </div>
            <div
              class="flex items-center justify-between text-xs mt-1.5 opacity-50"
            >
              <span>{{ formatDate(mySubscription.startDate) }}</span>
              <span>{{ nextPayment }}</span>
            </div>
          </div>

          <!-- Payment info + actions -->
          <div
            class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div class="flex gap-8">
              <div>
                <p class="text-xs uppercase tracking-wide opacity-50 mb-1">
                  Plan Cost
                </p>
                <p class="font-bold text-lg">
                  {{
                    Number(currentPlan.price) === 0
                      ? "Free"
                      : Number(currentPlan.price) + " credits"
                  }}
                  <span
                    v-if="Number(currentPlan.price) > 0"
                    class="text-sm font-normal opacity-60"
                    >/ {{ currentPlan.durationDays }} days</span
                  >
                </p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wide opacity-50 mb-1">
                  Next Renewal
                </p>
                <p class="font-bold text-lg">{{ nextPayment }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Auto-renew toggle (premium only) -->
              <div v-if="isPremium" class="flex items-center gap-2">
                <span class="text-xs opacity-70">Auto-renew</span>
                <button
                  @click="handleToggleRenew"
                  :disabled="toggleLoading"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200"
                  :class="mySubscription.autoRenew ? '' : 'opacity-60'"
                  :style="{
                    backgroundColor: mySubscription.autoRenew
                      ? '#F9AE5B'
                      : 'rgba(255,255,255,0.2)',
                  }"
                >
                  <span
                    class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                    :class="
                      mySubscription.autoRenew
                        ? 'translate-x-5 left-0.5'
                        : 'left-0.5'
                    "
                    :style="{
                      left: mySubscription.autoRenew ? undefined : '2px',
                    }"
                  ></span>
                </button>
                <RefreshCw
                  v-if="toggleLoading"
                  :size="14"
                  class="animate-spin opacity-60"
                />
              </div>

              <!-- Cancel button (premium only) -->
              <button
                v-if="isPremium"
                @click="handleCancel"
                :disabled="cancelLoading"
                class="px-4 py-2 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                style="
                  background-color: rgba(255, 255, 255, 0.15);
                  color: #f7f1e6;
                "
              >
                {{ cancelLoading ? "Cancelling..." : "Cancel Subscription" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No subscription -->
      <div
        v-else
        class="bg-white border border-gray-200 rounded-2xl p-8 mb-8 text-center"
      >
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style="background-color: rgba(9, 58, 63, 0.06)"
        >
          <Crown :size="24" style="color: #093a3f" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          No Active Subscription
        </h3>
        <p class="text-gray-500 text-sm max-w-sm mx-auto">
          You don't have an active subscription. Choose a plan below to unlock
          premium content and start your reading journey.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="mb-8">
        <h2 class="text-lg font-bold mb-1" style="color: #093a3f">
          Choose Your Plan
        </h2>
        <p class="text-gray-500 text-sm mb-5">
          Select the plan that fits your reading and writing goals.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="plan in sortedPlans"
            :key="plan.id"
            class="relative rounded-2xl border-2 p-6 flex flex-col transition-all duration-300"
            :class="
              mySubscription?.planId === plan.id
                ? 'border-[#093A3F] shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            "
            :style="
              mySubscription?.planId === plan.id
                ? { backgroundColor: '#093A3F', color: '#f7f1e6' }
                : {}
            "
          >
            <!-- Recommended badge -->
            <div
              v-if="Number(plan.price) > 0"
              class="absolute -top-3 right-4 px-4 py-1 rounded-full text-xs font-bold"
              style="background-color: #c5a050; color: #fff"
            >
              Recommended
            </div>

            <!-- Plan header -->
            <div class="flex items-center gap-2 mb-1">
              <Crown
                v-if="Number(plan.price) > 0"
                :size="18"
                :style="
                  mySubscription?.planId === plan.id
                    ? { color: '#F9AE5B' }
                    : { color: '#c5a050' }
                "
              />
              <Sparkles
                v-else
                :size="18"
                :style="
                  mySubscription?.planId === plan.id
                    ? { color: 'rgba(255,255,255,0.6)' }
                    : { color: '#093A3F' }
                "
              />
              <h3 class="font-semibold text-lg">{{ plan.name }}</h3>
            </div>
            <p
              class="text-sm mb-4"
              :class="
                mySubscription?.planId === plan.id
                  ? 'opacity-70'
                  : 'text-gray-500'
              "
            >
              {{ plan.description }}
            </p>

            <!-- Price -->
            <div class="mb-5">
              <span class="text-3xl font-extrabold">
                {{
                  Number(plan.price) === 0
                    ? "Free"
                    : Number(plan.price) + " credits"
                }}
              </span>
              <span
                class="text-sm ml-1.5"
                :class="
                  mySubscription?.planId === plan.id
                    ? 'opacity-60'
                    : 'text-gray-400'
                "
              >
                {{
                  Number(plan.price) > 0
                    ? "/ " + plan.durationDays + " days"
                    : "forever"
                }}
              </span>
            </div>

            <!-- Features -->
            <ul class="space-y-3 flex-1 mb-6">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-3 text-sm"
                :class="
                  mySubscription?.planId === plan.id
                    ? 'opacity-80'
                    : 'text-gray-600'
                "
              >
                <Check
                  :size="16"
                  class="mt-0.5 shrink-0"
                  :style="
                    mySubscription?.planId === plan.id
                      ? { color: '#4ade80' }
                      : { color: '#10b981' }
                  "
                />
                {{ feature }}
              </li>
            </ul>

            <!-- CTA -->
            <button
              @click="handleSelectPlan(plan)"
              :disabled="
                mySubscription?.planId === plan.id || subscribeLoading !== null
              "
              class="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="buttonStyle(plan)"
            >
              <span class="flex items-center justify-center gap-2">
                <template v-if="subscribeLoading === plan.id">
                  <RefreshCw :size="16" class="animate-spin" />
                  Processing...
                </template>
                <template v-else>
                  <ShieldCheck
                    v-if="mySubscription?.planId === plan.id"
                    :size="16"
                  />
                  {{ buttonLabel(plan) }}
                </template>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Billing History Preview -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <h2 class="text-lg font-bold" style="color: #093a3f">
              Billing History
            </h2>
            <span
              v-if="history.length > 0"
              class="text-xs px-2 py-0.5 rounded-full font-medium"
              style="background-color: rgba(9, 58, 63, 0.08); color: #093a3f"
            >
              {{ history.length }}
            </span>
          </div>
          <button
            v-if="history.length > 0"
            @click="router.push('/dashboard/billing/history')"
            class="flex items-center gap-1 text-sm font-semibold transition hover:opacity-80"
            style="color: #093a3f"
          >
            View All
            <ChevronRight :size="16" />
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="history.length === 0"
          class="bg-white rounded-2xl border border-gray-100 py-12 text-center"
        >
          <Clock :size="32" class="mx-auto mb-3 text-gray-300" />
          <p class="text-gray-500 text-sm">No billing history yet.</p>
          <p class="text-gray-400 text-xs mt-1">
            Your subscription transactions will appear here.
          </p>
        </div>

        <!-- History table preview -->
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
                  <th class="text-left px-5 py-3.5 font-medium">Date</th>
                  <th class="text-left px-5 py-3.5 font-medium">Credits</th>
                  <th class="text-left px-5 py-3.5 font-medium">Status</th>
                  <th class="text-right px-5 py-3.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in history.slice(0, 5)"
                  :key="item.id"
                  class="border-b border-gray-50 hover:bg-gray-50/60 transition"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-2.5">
                      <span
                        class="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                        :style="
                          Number(item.plan?.price ?? 0) > 0
                            ? {
                                backgroundColor: 'rgba(197, 160, 80, 0.12)',
                                color: '#735c00',
                              }
                            : {
                                backgroundColor: 'rgba(9, 58, 63, 0.08)',
                                color: '#093A3F',
                              }
                        "
                      >
                        <Crown
                          v-if="Number(item.plan?.price ?? 0) > 0"
                          :size="14"
                        />
                        <Sparkles v-else :size="14" />
                      </span>
                      <span class="font-medium text-gray-900">
                        {{ item.plan?.name ?? "—" }}
                      </span>
                    </div>
                  </td>
                  <td class="px-5 py-4 text-gray-500">
                    {{ formatDate(item.startDate) }}
                  </td>
                  <td class="px-5 py-4 font-semibold text-gray-900">
                    {{
                      Number(item.plan?.price ?? 0) === 0
                        ? "Free"
                        : Number(item.plan?.price ?? 0) + " credits"
                    }}
                  </td>
                  <td class="px-5 py-4">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="statusColor(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <ChevronRight :size="16" class="text-gray-300 ml-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
