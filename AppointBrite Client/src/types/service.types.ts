/**
 * Service type definitions (per Doc 04 — services collection).
 */

export interface Service {
  _id: string;
  businessId: string;
  name: string;
  category?: string;
  description: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  capacity: number;
  requiresApproval: boolean;
  isActive: boolean;
}

export type CreateServicePayload = Omit<Service, '_id' | 'businessId'>;
export type UpdateServicePayload = Partial<CreateServicePayload>;
