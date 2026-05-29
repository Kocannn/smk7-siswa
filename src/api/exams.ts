import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type { Exam, ExamAttempt, ExamDetail } from '@/types/exam';

export async function getExams(page = 1): Promise<{ data: Exam[]; current_page: number; last_page: number }> {
  const response = await apiClient.get<ApiResponse<{ data: Exam[]; current_page: number; last_page: number }>>('/v1/student/exams', {
    params: { page },
  });
  return response.data.data;
}

export async function startExamAttempt(examId: number, accessCode?: string): Promise<ExamAttempt> {
  const response = await apiClient.post<ApiResponse<ExamAttempt>>(
    `/v1/student/exams/${examId}/attempts`,
    accessCode ? { access_code: accessCode } : {}
  );
  return response.data.data;
}

export async function getExamAttempt(examId: number, attemptId: number): Promise<ExamDetail> {
  const response = await apiClient.get<ApiResponse<ExamDetail>>(
    `/v1/student/exams/${examId}/attempts/${attemptId}`
  );
  return response.data.data;
}

export async function saveExamResponse(
  examId: number,
  attemptId: number,
  data: { question_id: number; answer_option_id?: number | null; response_text?: string | null }
): Promise<void> {
  await apiClient.post(`/v1/student/exams/${examId}/attempts/${attemptId}/responses`, data);
}

export async function submitExamAttempt(examId: number, attemptId: number): Promise<ExamAttempt> {
  const response = await apiClient.post<ApiResponse<ExamAttempt>>(
    `/v1/student/exams/${examId}/attempts/${attemptId}/submit`
  );
  return response.data.data;
}
