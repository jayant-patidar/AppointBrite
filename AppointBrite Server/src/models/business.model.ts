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
}

export interface IBusiness extends Document {
  ownerId: Types.ObjectId;
  name: string;
  description: string;
  category: BusinessCategory;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    zipCode: string;
  };
  operatingHours: IOperatingHours[];
  mediaGallery: string[];
  rating: { average: number; count: number };
  subscriptionTier: SubscriptionTier;
  stripeAccountId?: string;
  isActive: boolean;
  createdAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['SALON', 'RESTAURANT', 'CLINIC', 'FITNESS', 'SPA', 'DENTAL', 'TUTORING', 'AUTO_SERVICE', 'HOME_SERVICE', 'EVENT_VENUE', 'CONSULTING'],
      required: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    operatingHours: [
      {
        dayOfWeek: { type: Number, required: true },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
    ],
    mediaGallery: [String],
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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Geospatial index for "near me" searches
businessSchema.index({ location: '2dsphere' });
// Text search index
businessSchema.index({ name: 'text', category: 'text' });

export const Business = mongoose.model<IBusiness>('Business', businessSchema);
