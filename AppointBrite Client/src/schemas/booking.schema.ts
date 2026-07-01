/**
 * Zod schemas for booking validation.
 */
import { z } from 'zod';

export const createBookingSchema = z.object({
  businessId: z.string().min(1, 'Business is required'),
  serviceId: z.string().min(1, 'Service is required'),
  staffId: z.string().optional(),
  startTime: z.string().datetime('Invalid date/time format'),
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
