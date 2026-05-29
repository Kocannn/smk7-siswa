import apiClient from './client';
import type { ApiResponse } from '@/types/api';

interface DashboardData {
  summary: {
    total_attendance: number;
    today_attendance: number;
  };
  recent_records: {
    id: number;
    session_type: string;
    subject: string | null;
    scanned_at: string | null;
    status: string;
  }[];
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<ApiResponse<DashboardData>>('/v1/student/dashboard');
  return response.data.data;
}
