/**
 * Auth API endpoint functions.
 */
import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/user.types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'BUSINESS_OWNER';
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    marketingOptIn: boolean;
    preferredCommunication: string;
  };
  timezone?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await axiosInstance.post('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await axiosInstance.post('/auth/register', payload);
    return data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },
};
