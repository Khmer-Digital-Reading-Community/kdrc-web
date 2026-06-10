import { ref, computed, onUnmounted } from "vue";
import QRCode from "qrcode";
import {
  createPaymentSession,
  getPaymentSession,
  confirmPaymentSession,
  cancelPaymentSession,
  type PaymentSession,
} from "../services/paymentApi";

export type PaymentPhase =
  | "idle"
  | "initiating"
  | "ready"
  | "polling"
  | "success"
  | "expired"
  | "failed";

export function usePaymentSession() {
  const phase = ref<PaymentPhase>("idle");
  const session = ref<PaymentSession | null>(null);
  const qrDataUrl = ref("");
  const countdown = ref(0);
  const error = ref<string | null>(null);

  let countdownInterval: ReturnType<typeof setInterval> | null = null;
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  const timeRemaining = computed(() => {
    const m = Math.floor(countdown.value / 60);
    const s = countdown.value % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  });

  const clearTimers = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  };

  const startCountdown = (expiresAt: string) => {
    clearTimers();
    const expireTime = new Date(expiresAt).getTime();

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
      countdown.value = remaining;
      if (remaining <= 0) {
        clearTimers();
        if (phase.value === "ready" || phase.value === "polling") {
          phase.value = "expired";
        }
      }
    };

    tick();
    countdownInterval = setInterval(tick, 1000);
  };

  const startPolling = () => {
    if (!session.value) return;
    phase.value = "polling";

    pollInterval = setInterval(async () => {
      if (!session.value) return;
      try {
        const latest = await getPaymentSession(session.value.id);
        session.value = latest;

        if (latest.status === "CONFIRMED") {
          clearTimers();
          phase.value = "success";
        } else if (latest.status === "EXPIRED") {
          clearTimers();
          phase.value = "expired";
        } else if (latest.status === "CANCELLED") {
          clearTimers();
          phase.value = "failed";
          error.value = "Payment was cancelled";
        }
      } catch {
        // keep polling
      }
    }, 3000);
  };

  const initiatePayment = async (itemType: "BOOK" | "CHAPTER", itemId: string) => {
    phase.value = "initiating";
    error.value = null;
    qrDataUrl.value = "";

    try {
      const s = await createPaymentSession(itemType, itemId);
      session.value = s;

      qrDataUrl.value = await QRCode.toDataURL(s.qrCodeData, {
        width: 280,
        margin: 2,
        color: { dark: "#123C3A", light: "#FFFFFF" },
      });

      phase.value = "ready";
      startCountdown(s.expiresAt);
      startPolling();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create payment";
      error.value = msg;
      phase.value = "failed";
    }
  };

  const confirmManually = async () => {
    if (!session.value) return;
    try {
      const updated = await confirmPaymentSession(session.value.id);
      session.value = updated;
      clearTimers();
      phase.value = "success";
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "Confirmation failed";
    }
  };

  const cancel = async () => {
    if (!session.value) return;
    try {
      await cancelPaymentSession(session.value.id);
    } catch {
      // session may already be expired
    }
    clearTimers();
    reset();
  };

  const reset = () => {
    clearTimers();
    phase.value = "idle";
    session.value = null;
    qrDataUrl.value = "";
    countdown.value = 0;
    error.value = null;
  };

  onUnmounted(() => {
    clearTimers();
  });

  return {
    phase,
    session,
    qrDataUrl,
    countdown,
    error,
    timeRemaining,
    initiatePayment,
    startPolling,
    confirmManually,
    cancel,
    reset,
  };
}
