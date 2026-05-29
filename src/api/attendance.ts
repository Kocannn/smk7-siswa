import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { AttendanceResponse, AttendanceRecord } from '@/types/attendance';

export async function getAttendance(page = 1): Promise<AttendanceResponse> {
  const response = await apiClient.get<ApiResponse<AttendanceResponse>>('/v1/student/attendance', {
    params: { page },
  });
  return response.data.data;
}

export async function scanAttendance(qrToken: string): Promise<{ message: string; data?: AttendanceRecord }> {
  const response = await apiClient.post<ApiResponse<AttendanceRecord>>('/v1/student/attendance/scan', {
    qr_token: qrToken,
  });
  return { message: response.data.message || 'Absensi berhasil.', data: response.data.data };
}
