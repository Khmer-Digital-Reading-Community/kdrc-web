<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "@/components/common/Sidebar.vue";
import Navbar from "@/components/common/Navbar.vue";
import PlanCard from "@/components/subscription/PlanCard.vue";
import { useSubscription } from "../../composables/useSubscription";
import { token } from "../../services/auth";

const {
  plans,
  mySubscription,
  isSubscribed,
  loading,
  plansLoading,
  doSubscribe,
  doCancel,
} = useSubscription();

const errorMessage = ref("");

const handleSubscribe = async (planId: string) => {
  errorMessage.value = "";
  const result = await doSubscribe(planId);
  if (!result.success && result.error) {
    errorMessage.value = result.error;
  }
};

const handleCancel = async () => {
  await doCancel();
};
</script>

<template>
  <div class="relative flex h-screen overflow-hidden bg-[#F6F1E8]">
    <Sidebar />
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <div class="sticky top-0 z-30">
        <Navbar />
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
          <div class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold mt-2">
              Subscription Plans
            </h1>
            <p class="text-gray-500 mt-2">
              Unlock premium content with a subscription.
            </p>
          </div>

          <!-- Active subscription banner -->
          <div
            v-if="token && isSubscribed && mySubscription"
            class="bg-[#093A3F] text-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <p class="text-sm opacity-80">Active Subscription</p>
              <p class="text-lg font-bold">
                {{ mySubscription.plan?.name }} — expires
                {{ new Date(mySubscription.endDate).toLocaleDateString() }}
              </p>
            </div>
            <button
              @click="handleCancel"
              :disabled="loading"
              class="px-4 py-2 text-sm font-semibold rounded-xl bg-white/20 hover:bg-white/30 transition disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          </div>

          <p
            v-if="errorMessage"
            class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-6"
          >
            {{ errorMessage }}
          </p>

          <!-- Plans grid -->
          <div v-if="plansLoading" class="text-center text-gray-500 py-12">
            Loading plans...
          </div>

          <div
            v-else-if="plans.length === 0"
            class="text-center text-gray-500 py-12"
          >
            No subscription plans available right now.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PlanCard
              v-for="plan in plans"
              :key="plan.id"
              :plan="plan"
              :loading="loading"
              :is-current-plan="
                isSubscribed && mySubscription?.planId === plan.id
              "
              @subscribe="handleSubscribe(plan.id)"
            />
          </div>

          <div
            v-if="!token"
            class="text-center mt-8 p-6 bg-white rounded-2xl"
          >
            <p class="text-gray-500">Sign in to subscribe to a plan.</p>
            <router-link
              to="/login"
              class="inline-block mt-4 px-6 py-2 bg-[#093A3F] text-white rounded-xl text-sm font-semibold"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
