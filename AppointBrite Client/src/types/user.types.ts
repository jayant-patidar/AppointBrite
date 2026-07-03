/**
 * User type definitions (per Doc 04 — users collection).
 */

export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'STAFF' | 'SUPER_ADMIN';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
  businessProfile?: {
    _id: string;
    onboardingStep: number;
  };
  createdAt: string;
  updatedAt: string;
}
