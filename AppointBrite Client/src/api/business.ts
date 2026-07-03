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
};
