import axiosInstance from './axiosInstance';
import type { Staff, CreateStaffPayload, UpdateStaffPayload } from '@/types/staff.types';

export const staffApi = {
  getBusinessStaff: async (businessId?: string): Promise<Staff[]> => {
    // If businessId is provided, get it via public route. Otherwise, get for logged-in business owner.
    const url = businessId ? `/staff/business/${businessId}` : '/staff';
    const response = await axiosInstance.get(url);
    return response.data.data;
  },

  createStaff: async (data: CreateStaffPayload): Promise<Staff> => {
    const response = await axiosInstance.post('/staff', data);
    return response.data.data;
  },

  updateStaff: async ({ id, data }: { id: string; data: UpdateStaffPayload }): Promise<Staff> => {
    const response = await axiosInstance.put(`/staff/${id}`, data);
    return response.data.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/staff/${id}`);
  },
};
