import axiosInstance from './axiosInstance';
import type { User } from '@/types/user.types';

export const authApi = {
  login: async (credentials: { email: string; password: string; portal: 'CUSTOMER' | 'BUSINESS' }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data.data as { user: User; accessToken: string };
  },
  
  register: async (data: any) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data.data as { user: User; accessToken: string };
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
  
  me: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data as User;
  }
};
