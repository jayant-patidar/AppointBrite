/**
 * Zod schemas for business profile validation.
 */
import { z } from 'zod';

const operatingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  isClosed: z.boolean(),
});

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.enum([
    'SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA',
    'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE',
    'EVENT_VENUE', 'CONSULTING',
  ]),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
  operatingHours: z.array(operatingHoursSchema).length(7, 'Must specify hours for all 7 days'),
});

export type CreateBusinessFormData = z.infer<typeof createBusinessSchema>;
