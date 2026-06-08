import api from './api';
import type { Book } from './bookApi';

export interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  totalComments: number;
  pendingComments: number;
  totalChallenges: number;
  totalReviews: number;
  totalReports: number;
  pendingReports: number;
  newUsersThisMonth: number;
  newBooksThisMonth: number;
}

export interface AdminActivityItem {
  id: string;
  type: 'user_registered' | 'book_added' | 'comment' | 'report';
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

export interface AdminReport {
  id: string;
  type: string;
  description: string;
  status: string;
  reporter?: { id: string; name?: string; email: string };
  reportedUser?: { id: string; name?: string; email: string };
  createdAt: string;
}

export interface PaginatedBooks {
  data: Book[];
  total: number;
  page: number;
  limit: number;
}

export const fetchAdminStats = () =>
  api.get<AdminStats>('/admin/stats').then((r) => r.data);

export const fetchAdminActivity = (limit = 10) =>
  api
    .get<AdminActivityItem[]>('/admin/activity', { params: { limit } })
    .then((r) => r.data);

export const fetchAdminAnalytics = () =>
  api.get('/admin/analytics').then((r) => r.data);

export const fetchAdminUsers = () =>
  api.get<AdminUser[]>('/users').then((r) => r.data);

export const updateAdminUser = (
  id: string,
  data: { name?: string; role?: string },
) => api.patch(`/users/${id}`, data).then((r) => r.data);

export const deleteAdminUser = (id: string) =>
  api.delete(`/users/${id}`).then((r) => r.data);

export const fetchAdminBooks = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) =>
  api.get<PaginatedBooks>('/books', { params }).then((r) => r.data);

export const updateAdminBook = (id: string, data: Partial<Book>) =>
  api.patch(`/books/${id}`, data).then((r) => r.data);

export const deleteAdminBook = (id: string) =>
  api.delete(`/books/${id}`).then((r) => r.data);

export const fetchAdminReports = () =>
  api.get<AdminReport[]>('/reports').then((r) => r.data);

export const updateReportStatus = (id: string, status: string) =>
  api.patch(`/reports/${id}/status`, { status }).then((r) => r.data);

export const deleteAdminReport = (id: string) =>
  api.delete(`/reports/${id}`).then((r) => r.data);

export const updateMyProfile = (data: { name?: string; bio?: string; avatarUrl?: string }) =>
  api.patch('/users/me', data).then((r) => r.data);
