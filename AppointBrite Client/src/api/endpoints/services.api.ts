/**
 * Service API endpoint functions.
 */
import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse } from '@/types/api.types';
import type { Service } from '@/types/service.types';

export const servicesApi = {
  getByBusiness: async (businessId: string): Promise<ApiResponse<Service[]>> => {
    const { data } = await axiosInstance.get(`/businesses/${businessId}/services`);
    return data;
  },

  create: async (businessId: string, payload: Partial<Service>): Promise<ApiResponse<Service>> => {
    const { data } = await axiosInstance.post(`/businesses/${businessId}/services`, payload);
    return data;
  },

  update: async (
    businessId: string,
    serviceId: string,
    payload: Partial<Service>,
  ): Promise<ApiResponse<Service>> => {
    const { data } = await axiosInstance.put(
      `/businesses/${businessId}/services/${serviceId}`,
      payload,
    );
    return data;
  },

  remove: async (businessId: string, serviceId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(
      `/businesses/${businessId}/services/${serviceId}`,
    );
    return data;
  },
};
