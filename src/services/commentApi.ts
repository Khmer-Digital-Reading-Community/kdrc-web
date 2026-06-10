import api from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  bookId?: string; // Mapped to Chapter ID in DB
  userId: string;
  user?: User;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

function unwrap<T>(response: any): T {
  const body = response.data;
  // If the global response interceptor already unwrapped it, body is the direct payload.
  // Otherwise, we unwrap it here.
  if (body && typeof body === 'object' && body.status === 'success') {
    return body.data as T;
  }
  return body as T;
}

export async function getCommentsForPage(chapterId: string, pageNumber: number): Promise<Comment[]> {
  const res = await api.get(`/comments/book/${chapterId}/page/${pageNumber}`);
  return unwrap<Comment[]>(res);
}

export async function submitComment(chapterId: string, pageNumber: number, content: string): Promise<Comment> {
  const res = await api.post('/comments', {
    bookId: chapterId,
    pageNumber,
    content,
  });
  return unwrap<Comment>(res);
}
