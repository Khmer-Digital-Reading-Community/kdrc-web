import type {
  ExchangeListing,
  ExchangeRequest,
  ExchangeSearchResult,
} from '../types/exchange';
import api from './api';

export const exchangeService = {
  create(data: FormData) {
    return api.post<ExchangeListing>('/exchanges', data);
  },

  findOne(id: string) {
    return api.get<ExchangeListing>(`/exchanges/${id}`);
  },

  search(params?: Record<string, string | number>) {
    return api.get<ExchangeSearchResult>('/exchanges', { params });
  },

  findMine() {
    return api.get<ExchangeListing[]>('/exchanges/mine');
  },

  remove(id: string) {
    return api.delete(`/exchanges/${id}`);
  },

  createRequest(payload: {
    exchangeId: string;
    offeredExchangeId: string;
    message?: string;
  }) {
    return api.post<ExchangeRequest>('/exchange-requests', payload);
  },

  getIncomingRequests() {
    return api.get<ExchangeRequest[]>('/exchange-requests/incoming');
  },

  getMyRequests() {
    return api.get<ExchangeRequest[]>('/exchange-requests/mine');
  },

  getRequest(id: string) {
    return api.get<ExchangeRequest>(`/exchange-requests/${id}`);
  },

  hasPendingRequest(exchangeId: string) {
    return api.get<{ hasPending: boolean; requestId: string | null }>(
      '/exchange-requests/pending',
      { params: { exchangeId } },
    );
  },

  acceptRequest(id: string) {
    return api.patch<ExchangeRequest>(`/exchange-requests/${id}/accept`);
  },

  rejectRequest(id: string) {
    return api.patch<ExchangeRequest>(`/exchange-requests/${id}/reject`);
  },

  cancelRequest(id: string) {
    return api.patch<ExchangeRequest>(`/exchange-requests/${id}/cancel`);
  },

  scheduleMeeting(
    id: string,
    payload: { meetingLocation: string; meetingTime: string },
  ) {
    return api.patch<ExchangeRequest>(`/exchange-requests/${id}/schedule`, payload);
  },

  completeRequest(id: string) {
    return api.patch<ExchangeRequest>(`/exchange-requests/${id}/complete`);
  },
};

export default exchangeService;
