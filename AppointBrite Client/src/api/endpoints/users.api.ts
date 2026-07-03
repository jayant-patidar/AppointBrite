import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse } from '@/types/api.types';

export const usersApi = {
  getFavorites: async (): Promise<ApiResponse<any[]>> => {
    const { data } = await axiosInstance.get('/users/favorites');
    return data;
  },
    
  addFavorite: async (businessId: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.post('/users/favorites', { businessId });
    return data;
  },
    
  removeFavorite: async (businessId: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.delete(`/users/favorites/${businessId}`);
    return data;
  },
};
