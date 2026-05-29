import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as examsApi from '@/api/exams';

export function useExams(page = 1) {
  return useQuery({
    queryKey: ['exams', page],
    queryFn: () => examsApi.getExams(page),
  });
}

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, accessCode }: { examId: number; accessCode?: string }) =>
      examsApi.startExamAttempt(examId, accessCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useExamAttempt(examId: number, attemptId: number) {
  return useQuery({
    queryKey: ['exam-attempt', examId, attemptId],
    queryFn: () => examsApi.getExamAttempt(examId, attemptId),
    enabled: !!examId && !!attemptId,
  });
}

export function useSaveResponse() {
  return useMutation({
    mutationFn: ({
      examId,
      attemptId,
      data,
    }: {
      examId: number;
      attemptId: number;
      data: { question_id: number; answer_option_id?: number | null; response_text?: string | null };
    }) => examsApi.saveExamResponse(examId, attemptId, data),
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, attemptId }: { examId: number; attemptId: number }) =>
      examsApi.submitExamAttempt(examId, attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-attempt'] });
    },
  });
}
