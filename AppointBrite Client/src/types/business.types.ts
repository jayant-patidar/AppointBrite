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
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  splitShifts?: { openTime: string; closeTime: string }[];
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number];
  address: string;
  city: string;
  state?: string;
  country?: string;
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
  legalName?: string;
  description?: string;
  shortDescription?: string;
  category?: BusinessCategory;
  subCategories?: string[];
  establishedYear?: number;
  contact?: {
    businessPhone?: string;
    businessEmail?: string;
    website?: string;
  };
  location?: GeoLocation;
  serviceArea?: {
    maxRadiusMiles?: number;
    coveredZipCodes?: string[];
  };
  licenses?: {
    licenseType: string;
    licenseNumber: string;
    expirationDate: string;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  }[];
  insuranceInfo?: {
    providerName: string;
    policyNumber: string;
    coverageAmount: string;
  };
  operatingHours: OperatingHours[];
  specialHours?: {
    date: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  timezone?: string;
  mediaGallery: string[];
  logoUrl?: string;
  coverPhotoUrl?: string;
  brandColors?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  rating: BusinessRating;
  subscriptionTier: SubscriptionTier;
  stripeAccountId?: string;
  cancellationPolicy?: {
    type: 'FLEXIBLE' | 'MODERATE' | 'STRICT';
    feePercentage?: number;
    cutoffHours?: number;
  };
  depositRequired?: boolean;
  depositPercentage?: number;
  maxAdvanceBookingDays: number;
  bookingSettings?: {
    minAdvanceBookingHours?: number;
    slotDurationInterval?: number;
    autoApproveBookings?: boolean;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    yelp?: string;
    googleMyBusiness?: string;
  };
  amenities?: string[];
  isActive: boolean;
  onboardingStep: number;
  createdAt: string;
}
