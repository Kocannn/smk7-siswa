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
  const response = await apiClient.get('/v1/student/exams');
  // Backend returns paginated response: { data: { data: [...], current_page, ... } }
  const payload = response.data;
  const items = payload?.data?.data ?? payload?.data ?? [];
  // Map backend field names to frontend types
  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    subject_name: item.subject ?? '-',
    duration_minutes: item.duration_minutes,
    status: item.status,
    starts_at: item.starts_at,
    ends_at: item.ends_at,
    questions_count: item.questions_count ?? 0,
    attempt: item.attempt,
  }));
}

export async function startExam(
  examId: number,
  payload?: StartExamPayload
): Promise<ExamAttempt> {
  const response = await apiClient.post(
    `/v1/student/exams/${examId}/attempts`,
    payload ?? {}
  );
  const data = response.data.data;
  // Backend returns minimal object, fill in defaults
  return {
    id: data.id,
    exam_id: examId,
    started_at: data.started_at,
    submitted_at: data.submitted_at ?? null,
    status: data.status,
    score: data.score ?? null,
    responses: [],
  };
}

export async function getExamAttempt(
  examId: number,
  attemptId: number
): Promise<{ exam: Exam; attempt: ExamAttempt }> {
  const response = await apiClient.get(
    `/v1/student/exams/${examId}/attempts/${attemptId}`
  );
  const data = response.data.data;
  // Backend returns questions with embedded responses, transform to expected shape
  const questions = (data.questions ?? []).map((q: any) => ({
    id: q.id,
    prompt: q.prompt,
    type: q.type,
    points: q.points,
    sort_order: q.sort_order,
    explanation: q.explanation ?? null,
    answer_options: q.answer_options ?? [],
  }));
  // Extract responses from questions
  const responses = (data.questions ?? [])
    .filter((q: any) => q.response != null)
    .map((q: any) => ({
      id: 0,
      question_id: q.id,
      answer_option_id: q.response.answer_option_id,
      response_text: q.response.response_text,
    }));
  const exam: Exam = {
    id: data.exam.id,
    title: data.exam.title,
    subject: { id: 0, name: data.exam.subject ?? '-' },
    class: { id: 0, name: '-' },
    instructions: data.exam.instructions ?? null,
    duration_minutes: data.exam.duration_minutes,
    starts_at: data.exam.starts_at,
    ends_at: data.exam.ends_at,
    status: data.exam.status,
    questions_count: questions.length,
    questions,
    attempt: null,
  };
  const attempt: ExamAttempt = {
    id: data.attempt.id,
    exam_id: examId,
    started_at: data.attempt.started_at,
    submitted_at: data.attempt.submitted_at ?? null,
    status: data.attempt.status,
    score: data.attempt.score ?? null,
    responses,
  };
  return { exam, attempt };
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
): Promise<{ score: number | null }> {
  const response = await apiClient.post(
    `/v1/student/exams/${examId}/attempts/${attemptId}/submit`
  );
  const data = response.data.data;
  return { score: data.score ?? null };
}
