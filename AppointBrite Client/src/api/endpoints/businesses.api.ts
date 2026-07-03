/**
 * Business API endpoint functions.
 */
import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Business } from '@/types/business.types';
import type { Service } from '@/types/service.types';
import type { Review } from '@/types/review.types';

interface SearchParams {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  category?: string;
  page?: number;
  limit?: number;
}

interface AvailabilityParams {
  date: string;
  serviceId?: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export const businessesApi = {
  search: async (params: SearchParams): Promise<PaginatedResponse<Business>> => {
    const { data } = await axiosInstance.get('/businesses/search', { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Business>> => {
    const { data } = await axiosInstance.get(`/businesses/${id}`);
    return data;
  },

  getServices: async (id: string): Promise<ApiResponse<Service[]>> => {
    const { data } = await axiosInstance.get(`/businesses/${id}/services`);
    return data;
  },

  getReviews: async (id: string): Promise<ApiResponse<Review[]>> => {
    const { data } = await axiosInstance.get(`/businesses/${id}/reviews`);
    return data;
  },

  getStaff: async (id: string): Promise<ApiResponse<any[]>> => {
    const { data } = await axiosInstance.get(`/businesses/${id}/staff`);
    return data;
  },

  create: async (payload: Partial<Business>): Promise<ApiResponse<Business>> => {
    const { data } = await axiosInstance.post('/businesses', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Business>): Promise<ApiResponse<Business>> => {
    const { data } = await axiosInstance.put(`/businesses/${id}`, payload);
    return data;
  },

  getAvailability: async (
    id: string,
    params: AvailabilityParams,
  ): Promise<ApiResponse<TimeSlot[]>> => {
    const { data } = await axiosInstance.get(`/businesses/${id}/availability`, { params });
    return data;
  },
};
