import { ref, onMounted } from "vue";
import {
  getPlans,
  subscribe,
  cancelSubscription,
  getMySubscription,
  checkSubscription,
  type SubscriptionPlan,
  type UserSubscription,
} from "../services/subscriptionApi";
import { token } from "../services/auth";

export function useSubscription() {
  const plans = ref<SubscriptionPlan[]>([]);
  const mySubscription = ref<UserSubscription | null>(null);
  const isSubscribed = ref(false);
  const loading = ref(false);
  const plansLoading = ref(false);

  const fetchPlans = async () => {
    plansLoading.value = true;
    try {
      plans.value = await getPlans();
    } catch {
      // ignore
    } finally {
      plansLoading.value = false;
    }
  };

  const fetchMySubscription = async () => {
    if (!token.value) return;
    try {
      const res = await checkSubscription();
      isSubscribed.value = res.subscribed;
      if (res.subscribed) {
        mySubscription.value = await getMySubscription();
      }
    } catch {
      // ignore
    }
  };

  const doSubscribe = async (planId: string) => {
    if (!token.value) return { success: false, error: "Login required" };
    loading.value = true;
    try {
      const result = await subscribe(planId);
      isSubscribed.value = true;
      mySubscription.value = result.subscription;
      return { success: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Subscription failed";
      return { success: false, error: msg };
    } finally {
      loading.value = false;
    }
  };

  const doCancel = async () => {
    if (!token.value) return;
    loading.value = true;
    try {
      await cancelSubscription();
      isSubscribed.value = false;
      mySubscription.value = null;
    } catch (err) {
      console.error("Cancel subscription failed:", err);
    } finally {
      loading.value = false;
    }
  };

  const canAccessPremium = () => isSubscribed.value;

  onMounted(() => {
    fetchPlans();
    fetchMySubscription();
  });

  return {
    plans,
    mySubscription,
    isSubscribed,
    loading,
    plansLoading,
    fetchPlans,
    fetchMySubscription,
    doSubscribe,
    doCancel,
    canAccessPremium,
  };
}
