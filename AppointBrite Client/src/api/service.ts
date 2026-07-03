import axiosInstance from './axiosInstance';
import type { Service, CreateServicePayload, UpdateServicePayload } from '@/types/service.types';

export const serviceApi = {
  getMyServices: async (): Promise<Service[]> => {
    const response = await axiosInstance.get('/services/my-services');
    return response.data.data;
  },

  createService: async (data: CreateServicePayload): Promise<Service> => {
    const response = await axiosInstance.post('/services', data);
    return response.data.data;
  },

  updateService: async ({ id, data }: { id: string; data: UpdateServicePayload }): Promise<Service> => {
    const response = await axiosInstance.patch(`/services/${id}`, data);
    return response.data.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/services/${id}`);
  },
};
