export interface StaffWorkingHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Staff {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  businessId: string;
  providedServices: Array<{
    _id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  workingHours: StaffWorkingHour[];
  colorCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  providedServices?: string[]; // array of service IDs
  workingHours?: StaffWorkingHour[];
  colorCode?: string;
}

export interface UpdateStaffPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  providedServices?: string[];
  workingHours?: StaffWorkingHour[];
  colorCode?: string;
}
