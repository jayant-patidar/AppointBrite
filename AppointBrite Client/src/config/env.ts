/**
 * Typed environment variables for the client application.
 * All Vite env vars must be prefixed with VITE_.
 */

export const env = {
  API_URL: import.meta.env.VITE_API_URL as string || 'http://localhost:5001/api/v1',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL as string || 'http://localhost:5001',
  GOOGLE_MAPS_KEY: import.meta.env.VITE_GOOGLE_MAPS_KEY as string || '',
  STRIPE_PK: import.meta.env.VITE_STRIPE_PK as string || '',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
