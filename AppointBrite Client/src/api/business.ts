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
  },

  getPromotions: async (businessId: string) => {
    const response = await axiosInstance.get(`/businesses/${businessId}/promotions`);
    return response.data.data;
  },

  createPromotion: async (businessId: string, payload: any) => {
    const response = await axiosInstance.post(`/businesses/${businessId}/promotions`, payload);
    return response.data.data;
  },

  updatePromotion: async (businessId: string, promotionId: string, payload: any) => {
    const response = await axiosInstance.put(`/businesses/${businessId}/promotions/${promotionId}`, payload);
    return response.data.data;
  },

  togglePromotion: async (businessId: string, promotionId: string) => {
    const response = await axiosInstance.patch(`/businesses/${businessId}/promotions/${promotionId}/toggle`);
    return response.data.data;
  },

  deletePromotion: async (businessId: string, promotionId: string) => {
    const response = await axiosInstance.delete(`/businesses/${businessId}/promotions/${promotionId}`);
    return response.data.data;
  },

  getActivePromotions: async (businessId: string) => {
    const response = await axiosInstance.get(`/businesses/${businessId}/active-promotions`);
    return response.data.data;
  },

  validatePromotion: async (businessId: string, code: string) => {
    const response = await axiosInstance.post(`/businesses/${businessId}/promotions/validate`, { code });
    return response.data.data;
  }
};
