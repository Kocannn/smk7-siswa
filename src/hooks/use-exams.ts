import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as examsApi from '@/api/exams';
import type { StartExamPayload, SaveResponsePayload } from '@/types/exam';

export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: examsApi.getExams,
  });
}

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, payload }: { examId: number; payload?: StartExamPayload }) =>
      examsApi.startExam(examId, payload),
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
      data: SaveResponsePayload;
    }) => examsApi.saveResponse(examId, attemptId, data),
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, attemptId }: { examId: number; attemptId: number }) =>
      examsApi.submitExam(examId, attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-attempt'] });
    },
  });
}
