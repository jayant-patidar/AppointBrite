/**
 * Business type definitions (per Doc 04 — businesses collection).
 */

export type BusinessCategory =
  | 'SALON'
  | 'RESTAURANT'
  | 'CLINIC'
  | 'FITNESS'
  | 'SPA'
  | 'DENTAL'
  | 'TUTORING'
  | 'AUTO_SERVICE'
  | 'HOME_SERVICE'
  | 'EVENT_VENUE'
  | 'CONSULTING';

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface OperatingHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // "09:00"
  closeTime: string; // "17:00"
  isClosed: boolean;
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  city: string;
  zipCode: string;
}

export interface BusinessRating {
  average: number;
  count: number;
}

export interface Business {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  category: BusinessCategory;
  location: GeoLocation;
  operatingHours: OperatingHours[];
  mediaGallery: string[];
  rating: BusinessRating;
  subscriptionTier: SubscriptionTier;
  stripeAccountId?: string;
  maxAdvanceBookingDays: number;
  isActive: boolean;
  createdAt: string;
}
