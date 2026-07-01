/**
 * User model (per Doc 04 — users collection).
 */
import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'STAFF' | 'SUPER_ADMIN';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
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
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
