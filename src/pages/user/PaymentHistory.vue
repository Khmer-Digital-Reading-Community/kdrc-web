<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getPaymentHistory,
  type UserSubscription,
} from "../../services/subscriptionApi";

const router = useRouter();
const history = ref<UserSubscription[]>([]);
const loading = ref(false);
const errorMessage = ref("");

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

onMounted(async () => {
  loading.value = true;
  try {
    history.value = await getPaymentHistory();
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.message || "Failed to load payment history.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <button
        @click="router.push('/dashboard/billing')"
        class="text-gray-400 hover:text-gray-600 transition"
      >
        ← Back
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payment History</h1>
        <p class="text-gray-500 text-sm mt-1">
          All your past subscription payments.
        </p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">
      Loading...
    </div>

    <div v-else-if="errorMessage" class="text-center text-red-500 py-20">
      {{ errorMessage }}
    </div>

    <div
      v-else-if="history.length === 0"
      class="text-center text-gray-400 py-20 bg-white rounded-2xl border border-gray-100"
    >
      No payment history yet.
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
            <th class="text-left px-5 py-3">Start Date</th>
            <th class="text-left px-5 py-3">End Date</th>
            <th class="text-left px-5 py-3">Amount</th>
            <th class="text-left px-5 py-3">Status</th>
            <th class="text-left px-5 py-3">Auto Renew</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in history"
            :key="item.id"
            class="border-b border-gray-50 hover:bg-gray-50 transition"
            :class="index === history.length - 1 ? 'border-0' : ''"
          >
            <td class="px-5 py-4 font-medium text-gray-900">
              {{ item.plan?.name ?? "—" }}
            </td>
            <td class="px-5 py-4 text-gray-500">
              {{ formatDate(item.startDate) }}
            </td>
            <td class="px-5 py-4 text-gray-500">
              {{ formatDate(item.endDate) }}
            </td>
            <td class="px-5 py-4 font-semibold text-gray-900">
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
            <td class="px-5 py-4">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="
                  item.autoRenew && item.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
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