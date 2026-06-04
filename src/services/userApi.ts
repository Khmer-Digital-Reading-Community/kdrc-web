import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  role?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  createdAt?: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/users/me');
  return response.data;
}

export async function updateUserProfile(data: {
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
}): Promise<UserProfile> {
  const response = await api.patch<UserProfile>('/users/me', data);
  return response.data;
}

export async function uploadAvatarFile(file: File): Promise<{ success: boolean; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function changeUserPassword(data: {
  oldPassword?: string;
  newPassword?: string;
}): Promise<{ message: string }> {
  const response = await api.patch('/users/change-password', data);
  return response.data;
}
