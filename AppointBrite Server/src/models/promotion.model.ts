import mongoose, { Schema, type Document, type Types } from 'mongoose';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface IPromotion extends Document {
  businessId: Types.ObjectId;
  code: string;
  type: DiscountType;
  value: number;
  validFrom: Date;
  validUntil?: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  applicableServices?: Types.ObjectId[];
  totalRevenueGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new Schema<IPromotion>(
  {
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    value: { type: Number, required: true, min: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    maxUses: { type: Number },
    currentUses: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    totalRevenueGenerated: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of code per business
promotionSchema.index({ businessId: 1, code: 1 }, { unique: true });

export const Promotion = mongoose.model<IPromotion>('Promotion', promotionSchema);
