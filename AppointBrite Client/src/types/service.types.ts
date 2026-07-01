/**
 * Service type definitions (per Doc 04 — services collection).
 */

export interface Service {
  _id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  isActive: boolean;
}
