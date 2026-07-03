/**
 * Centralized route path constants.
 * Use these instead of hardcoded strings to prevent typos and enable refactoring.
 */

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Search & Discovery
  SEARCH: '/search',
  BUSINESS_PROFILE: '/business/:id',

  // Booking
  BOOKING_WIZARD: '/book/:businessId',
  BOOKING_CONFIRMATION: '/booking/confirmation/:bookingId',

  // Customer Portal
  CUSTOMER: {
    DASHBOARD: '/my/dashboard',
    BOOKINGS: '/my/bookings',
    FAVORITES: '/my/favorites',
    PROFILE: '/my/profile',
  },

  // Business Dashboard
  DASHBOARD: {
    ROOT: '/business',
    ONBOARDING: '/business/onboarding',
    OVERVIEW: '/business/dashboard',
    CALENDAR: '/business/calendar',
    BOOKINGS: '/business/bookings',
    SERVICES: '/business/services',
    STAFF: '/business/staff',
    CUSTOMERS: '/business/customers',
    ANALYTICS: '/business/analytics',
    PROFILE: '/business/profile',
    PROMOTIONS: '/business/promotions',
  },

  // Super Admin
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    BUSINESSES: '/admin/businesses',
    MODERATION: '/admin/moderation',
    ANALYTICS: '/admin/analytics',
    CATEGORIES: '/admin/categories',
  },
} as const;
