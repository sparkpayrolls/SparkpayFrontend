import { RefObject } from 'react';

export type BulkEmployeeUpdateContext = {
  handleSubmitClick: () => void;
  isSubmitting: boolean;
  hasChanges: boolean;
  loading: boolean;
  sheetRef: RefObject<HTMLDivElement>;
  searchQuery: string;
  setSearchQuery: (_query: string) => void;
};

export type OriginalEmployeeData = {
  id: string;
  firstname: string;
  lastname: string;
  salary: number;
  yearlyRentAmount?: number;
  email: string;
  phoneNumber?: string;
  bankId?: string;
  accountNumber?: string;
  accountName?: string;
};

export type EmployeeUpdatePayload = {
  id: string;
  firstname?: string;
  lastname?: string;
  salary?: number;
  yearlyRentAmount?: number;
  email?: string;
  phoneNumber?: string;
  payoutMethodMeta?: {
    bankId?: string;
    accountNumber?: string;
  };
};
