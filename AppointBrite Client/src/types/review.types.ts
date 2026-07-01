/**
 * Review type definitions (per Doc 04 — reviews collection).
 */

export interface Review {
  _id: string;
  bookingId: string;
  businessId: string;
  customerId: string;
  rating: number; // 1-5
  comment: string;
  responseFromBusiness?: string;
  createdAt: string;
}
