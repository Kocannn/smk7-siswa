import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/v1/student/profile');
  return response.data.data;
}

export async function updateProfile(data: { name?: string; email?: string }): Promise<User> {
  const response = await apiClient.put<ApiResponse<User>>('/v1/student/profile', data);
  return response.data.data;
}
