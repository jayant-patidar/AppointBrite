/**
 * Review model (per Doc 04 — reviews collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IReview extends Document {
  bookingId: Types.ObjectId;
  businessId: Types.ObjectId;
  customerId: Types.ObjectId;
  rating: number;
  comment: string;
  responseFromBusiness?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    responseFromBusiness: String,
  },
  { timestamps: true },
);

reviewSchema.index({ businessId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
