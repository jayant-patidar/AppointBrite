/**
 * Business model (per Doc 04 — businesses collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type BusinessCategory = 'SALON' | 'RESTAURANT' | 'CLINIC' | 'FITNESS' | 'SPA' | 'DENTAL' | 'TUTORING' | 'AUTO_SERVICE' | 'HOME_SERVICE' | 'EVENT_VENUE' | 'CONSULTING';
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface IOperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  splitShifts?: { openTime: string; closeTime: string }[];
}

export interface IBusiness extends Document {
  ownerId: Types.ObjectId;
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
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    state?: string;
    country?: string;
    zipCode: string;
  };
  serviceArea?: {
    maxRadiusMiles?: number;
    coveredZipCodes?: string[];
  };
  licenses?: {
    licenseType: string;
    licenseNumber: string;
    expirationDate: Date;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  }[];
  insuranceInfo?: {
    providerName: string;
    policyNumber: string;
    coverageAmount: string;
  };
  operatingHours: IOperatingHours[];
  specialHours?: {
    date: Date;
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
  rating: { average: number; count: number };
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
  createdAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    legalName: { type: String },
    description: { type: String },
    shortDescription: { type: String, maxlength: 160 },
    category: {
      type: String,
      enum: ['SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA', 'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE', 'EVENT_VENUE', 'CONSULTING'],
    },
    subCategories: [{ type: String }],
    establishedYear: { type: Number },
    contact: {
      businessPhone: { type: String },
      businessEmail: { type: String },
      website: { type: String },
    },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    serviceArea: {
      maxRadiusMiles: { type: Number },
      coveredZipCodes: [{ type: String }],
    },
    licenses: [
      {
        licenseType: { type: String },
        licenseNumber: { type: String },
        expirationDate: { type: Date },
        verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
      }
    ],
    insuranceInfo: {
      providerName: { type: String },
      policyNumber: { type: String },
      coverageAmount: { type: String },
    },
    operatingHours: [
      {
        dayOfWeek: { type: Number, required: true },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
        splitShifts: [
          { openTime: { type: String }, closeTime: { type: String } }
        ]
      },
    ],
    specialHours: [
      {
        date: { type: Date },
        openTime: { type: String },
        closeTime: { type: String },
        isClosed: { type: Boolean, default: false },
      }
    ],
    timezone: { type: String },
    mediaGallery: [String],
    logoUrl: { type: String },
    coverPhotoUrl: { type: String },
    brandColors: {
      primaryColor: { type: String },
      secondaryColor: { type: String },
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    subscriptionTier: {
      type: String,
      enum: ['FREE', 'PRO', 'ENTERPRISE'],
      default: 'FREE',
    },
    stripeAccountId: String,
    cancellationPolicy: {
      type: { type: String, enum: ['FLEXIBLE', 'MODERATE', 'STRICT'], default: 'FLEXIBLE' },
      feePercentage: { type: Number },
      cutoffHours: { type: Number },
    },
    depositRequired: { type: Boolean, default: false },
    depositPercentage: { type: Number },
    maxAdvanceBookingDays: { type: Number, default: 30, min: 1 },
    bookingSettings: {
      minAdvanceBookingHours: { type: Number, default: 2 },
      slotDurationInterval: { type: Number, default: 30 },
      autoApproveBookings: { type: Boolean, default: true },
    },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      yelp: { type: String },
      googleMyBusiness: { type: String },
    },
    amenities: [{ type: String }],
    isActive: { type: Boolean, default: false }, // Should be false until onboarding is complete or verified
    onboardingStep: { type: Number, default: 1 },
  },
  { timestamps: true },
);

// Geospatial index for "near me" searches
businessSchema.index({ location: '2dsphere' });
// Text search index
businessSchema.index({ name: 'text', category: 'text' });

export const Business = mongoose.model<IBusiness>('Business', businessSchema);
