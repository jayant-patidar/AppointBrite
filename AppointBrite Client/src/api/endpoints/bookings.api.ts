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

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const { data } = await axiosInstance.get('/bookings');
    return data;
  },

  cancelBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const { data } = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
    return data;
  },

  rescheduleBooking: async (bookingId: string, newStartTime: string): Promise<ApiResponse<Booking>> => {
    const { data } = await axiosInstance.patch(`/bookings/${bookingId}/reschedule`, { newStartTime });
    return data;
  },
  
  deleteBooking: async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.delete(`/bookings/${id}`);
    return data;
  },
};
