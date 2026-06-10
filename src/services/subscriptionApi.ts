import api from "./api";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features?: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
  autoRenew: boolean;
  plan?: SubscriptionPlan;
}

export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await api.get("/subscriptions/plans");
  return res.data;
};

export const subscribe = async (planId: string, autoRenew = true) => {
  const res = await api.post("/subscriptions/subscribe", { planId, autoRenew });
  return res.data;
};

export const cancelSubscription = async () => {
  const res = await api.post("/subscriptions/cancel");
  return res.data;
};

export const getMySubscription = async () => {
  const res = await api.get("/subscriptions/me");
  return res.data as UserSubscription | null;
};

export const checkSubscription = async () => {
  const res = await api.get("/subscriptions/check");
  return res.data as { subscribed: boolean; subscription?: UserSubscription };
};
