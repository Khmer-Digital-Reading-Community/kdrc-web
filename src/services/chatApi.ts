import api from './api';

export interface ChatUser {
  id: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId?: string | null;
  user?: ChatUser | null;
  createdAt: string;
  updatedAt: string;
}

function unwrap<T>(response: any): T {
  const body = response.data;
  if (body && typeof body === 'object' && body.status === 'success') {
    return body.data as T;
  }
  return body as T;
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  const res = await api.get('/chat');
  return unwrap<ChatMessage[]>(res);
}

export async function sendChatMessage(content: string): Promise<ChatMessage> {
  const res = await api.post('/chat', { content });
  return unwrap<ChatMessage>(res);
}

// Admin endpoints
export async function getAdminChatMessages(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ChatMessage[]; total: number; page: number; limit: number }> {
  const res = await api.get('/chat/admin', { params });
  return unwrap(res);
}

export async function deleteAdminChatMessage(id: string): Promise<void> {
  await api.delete(`/chat/admin/${id}`);
}

export async function bulkDeleteAdminChatMessages(ids: string[]): Promise<{ deleted: number }> {
  const res = await api.delete('/chat/admin', { data: { ids } });
  return unwrap(res);
}
