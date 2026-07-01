/**
 * Validated environment variables using Zod.
 */
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5001'),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/appointbrite'),
  JWT_SECRET: z.string().default('dev_jwt_secret'),
  JWT_REFRESH_SECRET: z.string().default('dev_jwt_refresh_secret'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_mock'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_mock'),
  SENDGRID_API_KEY: z.string().default('mock'),
  TWILIO_ACCOUNT_SID: z.string().default('mock'),
  TWILIO_AUTH_TOKEN: z.string().default('mock'),
  TWILIO_PHONE_NUMBER: z.string().default('+10000000000'),
  CLIENT_URL: z.string().default('http://localhost:3001'),
});

export const env = envSchema.parse(process.env);
