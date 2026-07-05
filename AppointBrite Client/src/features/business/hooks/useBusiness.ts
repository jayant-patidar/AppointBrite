import { useQuery } from '@tanstack/react-query';
import { businessesApi } from '@/api/endpoints/businesses.api';

export function useBusiness(id?: string) {
  return useQuery({
    queryKey: ['businesses', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      // For now, since the backend might not have all relations wired up,
      // we'll try to fetch the real data. If the API fails or doesn't return
      // enough data, we'll gracefully fallback or error out depending on setup.
      const response = await businessesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useBusinessServices(id?: string) {
  return useQuery({
    queryKey: ['businessServices', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      const response = await businessesApi.getServices(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useBusinessReviews(id?: string) {
  return useQuery({
    queryKey: ['businessReviews', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      const response = await businessesApi.getReviews(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useBusinessPromotions(id?: string) {
  return useQuery({
    queryKey: ['businessPromotions', id],
    queryFn: async () => {
      if (!id) throw new Error('Business ID is required');
      const response = await businessesApi.getActivePromotions(id);
      return response.data;
    },
    enabled: !!id,
  });
}
