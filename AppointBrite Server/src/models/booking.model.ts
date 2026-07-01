/**
 * Booking model (per Doc 04 — bookings collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface IBooking extends Document {
  customerId?: Types.ObjectId; // Optional for guest checkouts
  businessId: Types.ObjectId;
  serviceId: Types.ObjectId;
  staffId?: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  notes?: string;
  
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  partySize?: number;
  specialRequests?: string;
  estimatedCost?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    notes: String,
    
    guestDetails: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    partySize: { type: Number, min: 1 },
    specialRequests: String,
    estimatedCost: { type: Number, min: 0 },
  },
  { timestamps: true },
);

// Compound indexes for availability checks and dashboard queries
bookingSchema.index({ businessId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ customerId: 1, startTime: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
