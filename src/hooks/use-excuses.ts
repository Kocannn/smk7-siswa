import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as excusesApi from '@/api/excuses';
import type { CreateExcuseRequest } from '@/types/excuse';

export function useExcuses(page = 1) {
  return useQuery({
    queryKey: ['excuses', page],
    queryFn: () => excusesApi.getExcuses(page),
  });
}

export function useCreateExcuse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExcuseRequest) => excusesApi.createExcuse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['excuses'] });
    },
  });
}

export function useExcuseDetail(id: number) {
  return useQuery({
    queryKey: ['excuse', id],
    queryFn: () => excusesApi.getExcuseDetail(id),
    enabled: !!id,
  });
}
