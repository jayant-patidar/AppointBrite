/**
 * Staff model (per Doc 04 — staff collection).
 */
import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IStaff extends Document {
  userId: Types.ObjectId;
  businessId: Types.ObjectId;
  providedServices: Types.ObjectId[];
  workingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  colorCode: string;
}

const staffSchema = new Schema<IStaff>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    providedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    workingHours: [
      {
        dayOfWeek: { type: Number, required: true },
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
        isClosed: { type: Boolean, default: false },
      },
    ],
    colorCode: { type: String, default: '#2563EB' },
  },
  { timestamps: true },
);

staffSchema.index({ businessId: 1, userId: 1 });

export const Staff = mongoose.model<IStaff>('Staff', staffSchema);
