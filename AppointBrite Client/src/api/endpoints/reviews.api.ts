/**
 * Review API endpoint functions.
 */
import axiosInstance from '@/api/axiosInstance';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Review } from '@/types/review.types';

interface SubmitReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  submit: async (payload: SubmitReviewPayload): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.post('/reviews', payload);
    return data;
  },

  getByBusiness: async (
    businessId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Review>> => {
    const { data } = await axiosInstance.get(`/reviews/business/${businessId}`, {
      params: { page, limit },
    });
    return data;
  },
};
