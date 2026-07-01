/**
 * Zod schemas for review submission validation.
 */
import { z } from 'zod';

export const reviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(500),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
