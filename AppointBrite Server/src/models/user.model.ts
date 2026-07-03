/**
 * User model (per Doc 04 — users collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'STAFF' | 'SUPER_ADMIN';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    marketingOptIn: boolean;
    preferredCommunication: 'EMAIL' | 'SMS' | 'BOTH';
  };
  timezone?: string;
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ['CUSTOMER', 'BUSINESS_OWNER', 'STAFF', 'SUPER_ADMIN'],
      default: 'CUSTOMER',
    },
    profileImage: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    preferences: {
      marketingOptIn: { type: Boolean, default: false },
      preferredCommunication: {
        type: String,
        enum: ['EMAIL', 'SMS', 'BOTH'],
        default: 'EMAIL',
      },
    },
    timezone: { type: String },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
