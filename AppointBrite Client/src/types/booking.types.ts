/**
 * Booking type definitions (per Doc 04 — bookings collection).
 */

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface Booking {
  _id: string;
  customerId: string;
  businessId: string;
  serviceId: string;
  staffId?: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
