import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/user';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/v1/login', data);
  return response.data.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/v1/register', data);
  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/v1/logout');
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/v1/me');
  return response.data.data;
}
