import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/api/staff';
import type { CreateStaffPayload, UpdateStaffPayload } from '@/types/staff.types';

export function useStaff(businessId?: string) {
  return useQuery({
    queryKey: ['staff', businessId],
    queryFn: () => staffApi.getBusinessStaff(businessId),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStaffPayload) => staffApi.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (variables: { id: string; data: UpdateStaffPayload }) => 
      staffApi.updateStaff(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
