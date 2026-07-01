/**
 * Auth validation schemas.
 */
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['CUSTOMER', 'BUSINESS_OWNER']),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().datetime().optional().or(z.date().optional()),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    preferences: z.object({
      marketingOptIn: z.boolean().default(false),
      preferredCommunication: z.enum(['EMAIL', 'SMS', 'BOTH']).default('EMAIL'),
    }).optional(),
    timezone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
