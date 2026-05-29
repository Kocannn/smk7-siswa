import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { CreateExcuseRequest, Excuse } from '@/types/excuse';

export async function getExcuses(page = 1): Promise<{ data: Excuse[]; current_page: number; last_page: number }> {
  const response = await apiClient.get<ApiResponse<{ data: Excuse[]; current_page: number; last_page: number }>>('/v1/student/excuses', {
    params: { page },
  });
  return response.data.data;
}

export async function createExcuse(data: CreateExcuseRequest): Promise<Excuse> {
  const response = await apiClient.post<ApiResponse<Excuse>>('/v1/student/excuses', data);
  return response.data.data;
}

export async function getExcuseDetail(id: number): Promise<Excuse> {
  const response = await apiClient.get<ApiResponse<Excuse>>(`/v1/student/excuses/${id}`);
  return response.data.data;
}
