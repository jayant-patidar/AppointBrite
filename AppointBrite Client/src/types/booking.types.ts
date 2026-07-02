export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface Booking {
  _id: string;
  customerId?: string;
  businessId: string | { _id: string, name: string, location: any, mediaGallery: string[], category: string };
  serviceId: string | { _id: string, name: string, durationMinutes: number, price: number };
  staffId?: string;
  startTime: string;
  endTime: string;
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
  
  createdAt: string;
  updatedAt: string;
}

export interface CheckAvailabilityParams {
  date: string;
  serviceId: string;
}

export interface CreateBookingPayload {
  businessId: string;
  serviceId: string;
  startTime: string; // ISO String
  guestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  partySize?: number;
  specialRequests?: string;
}
