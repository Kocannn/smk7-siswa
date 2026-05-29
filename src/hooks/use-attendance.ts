import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as attendanceApi from '@/api/attendance';

export function useAttendance(page = 1) {
  return useQuery({
    queryKey: ['attendance', page],
    queryFn: () => attendanceApi.getAttendance(page),
  });
}

export function useScanAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrToken: string) => attendanceApi.scanAttendance(qrToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
