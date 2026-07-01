/**
 * Booking model (per Doc 04 — bookings collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface IBooking extends Document {
  customerId: Types.ObjectId;
  businessId: Types.ObjectId;
  serviceId: Types.ObjectId;
  staffId?: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
  },
  { timestamps: true },
);

// Compound indexes for availability checks and dashboard queries
bookingSchema.index({ businessId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ customerId: 1, startTime: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
