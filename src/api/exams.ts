import apiClient from './client';
import type { ApiResponse } from '@/types/api';
import type {
  Exam,
  ExamAttempt,
  ExamListItem,
  SaveResponsePayload,
  StartExamPayload,
} from '@/types/exam';

export async function getExams(): Promise<ExamListItem[]> {
  const response = await apiClient.get<ApiResponse<ExamListItem[]>>('/v1/student/exams');
  return response.data.data;
}

export async function startExam(
  examId: number,
  payload?: StartExamPayload
): Promise<ExamAttempt> {
  const response = await apiClient.post<ApiResponse<ExamAttempt>>(
    `/v1/student/exams/${examId}/attempts`,
    payload ?? {}
  );
  return response.data.data;
}

export async function getExamAttempt(
  examId: number,
  attemptId: number
): Promise<{ exam: Exam; attempt: ExamAttempt }> {
  const response = await apiClient.get<
    ApiResponse<{ exam: Exam; attempt: ExamAttempt }>
  >(`/v1/student/exams/${examId}/attempts/${attemptId}`);
  return response.data.data;
}

export async function saveResponse(
  examId: number,
  attemptId: number,
  data: SaveResponsePayload
): Promise<void> {
  await apiClient.post(
    `/v1/student/exams/${examId}/attempts/${attemptId}/responses`,
    data
  );
}

export async function submitExam(
  examId: number,
  attemptId: number
): Promise<{ score: number }> {
  const response = await apiClient.post<ApiResponse<{ score: number }>>(
    `/v1/student/exams/${examId}/attempts/${attemptId}/submit`
  );
  return response.data.data;
}
