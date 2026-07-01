import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse } from '@/types/api.types';
import type { Booking, CheckAvailabilityParams, CreateBookingPayload } from '@/types/booking.types';

export const bookingsApi = {
  checkAvailability: async (
    businessId: string,
    params: CheckAvailabilityParams
  ): Promise<ApiResponse<string[]>> => {
    const { data } = await axiosInstance.get(`/bookings/availability/${businessId}`, { params });
    return data;
  },

  createBooking: async (payload: CreateBookingPayload): Promise<ApiResponse<Booking>> => {
    const { data } = await axiosInstance.post('/bookings', payload);
    return data;
  },
};
