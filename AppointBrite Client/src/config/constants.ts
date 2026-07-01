/**
 * Application-wide constants.
 */

/** Maximum days in advance a customer can book */
export const MAX_BOOKING_DAYS = 30;

/** Default pagination limit */
export const DEFAULT_PAGE_SIZE = 20;

/** Default search radius in kilometers */
export const DEFAULT_SEARCH_RADIUS_KM = 10;

/** Booking status values */
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  NO_SHOW: 'NO_SHOW',
} as const;

/** Payment status values */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

/** User roles */
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  STAFF: 'STAFF',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

/** Business categories */
export const BUSINESS_CATEGORIES = {
  SALON: 'SALON',
  RESTAURANT: 'RESTAURANT',
  CLINIC: 'CLINIC',
  FITNESS: 'FITNESS',
  SPA: 'SPA',
  DENTAL: 'DENTAL',
  TUTORING: 'TUTORING',
  AUTO_SERVICE: 'AUTO_SERVICE',
  HOME_SERVICE: 'HOME_SERVICE',
  EVENT_VENUE: 'EVENT_VENUE',
  CONSULTING: 'CONSULTING',
} as const;

/** Subscription tiers */
export const SUBSCRIPTION_TIERS = {
  FREE: 'FREE',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const;

/** Animation durations (ms) */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
