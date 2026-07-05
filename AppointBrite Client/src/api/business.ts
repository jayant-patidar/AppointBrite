import axiosInstance from './axiosInstance';

export const businessApi = {
  getMyBusiness: async () => {
    const response = await axiosInstance.get('/businesses/my-business');
    return response.data.data;
  },

  updateMyBusiness: async (data: any) => {
    const response = await axiosInstance.patch('/businesses/my-business', data);
    return response.data.data;
  },

  getAnalytics: async (businessId: string) => {
    const response = await axiosInstance.get(`/analytics/${businessId}`);
    return response.data.data;
  },

  getOverview: async (businessId: string) => {
    const response = await axiosInstance.get(`/analytics/overview/${businessId}`);
    return response.data.data;
  },

  getCustomers: async (businessId: string) => {
    const response = await axiosInstance.get(`/businesses/${businessId}/customers`);
    return response.data.data;
  },

  banCustomer: async (businessId: string, payload: { email?: string; phone?: string; customerId?: string; reason?: string; action: 'BAN' | 'UNBAN' }) => {
    const response = await axiosInstance.post(`/businesses/${businessId}/ban-customer`, payload);
    return response.data;
  }
};
