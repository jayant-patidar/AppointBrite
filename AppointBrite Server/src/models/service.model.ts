/**
 * Service model (per Doc 04 — services collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IService extends Document {
  businessId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  isActive: boolean;
}

const serviceSchema = new Schema<IService>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 1 },
    bufferMinutes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
