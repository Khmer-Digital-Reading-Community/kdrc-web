import api from "./api";

export type PaymentSessionStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

export interface PaymentSession {
  id: string;
  itemType: "BOOK" | "CHAPTER";
  itemId: string;
  amount: number;
  status: PaymentSessionStatus;
  expiresAt: string;
  qrCodeData: string;
}

export const createPaymentSession = async (
  itemType: string,
  itemId: string,
): Promise<PaymentSession> => {
  const res = await api.post("/payments/sessions", { itemType, itemId });
  return res.data as PaymentSession;
};

export const getPaymentSession = async (sessionId: string): Promise<PaymentSession> => {
  const res = await api.get(`/payments/sessions/${sessionId}`);
  return res.data as PaymentSession;
};

export const confirmPaymentSession = async (sessionId: string): Promise<PaymentSession> => {
  const res = await api.post(`/payments/sessions/${sessionId}/confirm`);
  return res.data as PaymentSession;
};

export const cancelPaymentSession = async (sessionId: string): Promise<void> => {
  await api.post(`/payments/sessions/${sessionId}/cancel`);
};
