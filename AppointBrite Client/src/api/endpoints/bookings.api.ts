/**
 * Booking API endpoint functions.
 */
import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Booking, BookingStatus } from '@/types/booking.types';

interface CreateBookingPayload {
  businessId: string;
  serviceId: string;
  staffId?: string;
  startTime: string;
}

interface BusinessBookingsParams {
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export const bookingsApi = {
  create: async (payload: CreateBookingPayload): Promise<ApiResponse<Booking>> => {
    const { data } = await axiosInstance.post('/bookings', payload);
    return data;
  },

  getMyBookings: async (page = 1, limit = 20): Promise<PaginatedResponse<Booking>> => {
    const { data } = await axiosInstance.get('/bookings/me', { params: { page, limit } });
    return data;
  },

  getBusinessBookings: async (
    businessId: string,
    params: BusinessBookingsParams,
  ): Promise<PaginatedResponse<Booking>> => {
    const { data } = await axiosInstance.get(`/bookings/business/${businessId}`, { params });
    return data;
  },

  updateStatus: async (
    id: string,
    status: BookingStatus,
  ): Promise<ApiResponse<Booking>> => {
    const { data } = await axiosInstance.put(`/bookings/${id}/status`, { status });
    return data;
  },
};
