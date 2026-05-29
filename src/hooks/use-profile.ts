import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as profileApi from '@/api/profile';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
