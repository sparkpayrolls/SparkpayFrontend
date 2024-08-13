import { Employee } from '../types';

export type ProcessPayload = {
  employee: Employee;
  enabled: boolean;
  addToCharge: boolean;
  precision: number;
  proratedSalary: number;
  totalBonus: number;
  type?: string;
  withholdingTaxRate?: number;
  pension?: number;
  nhf?: number;
  healthRelief?: number;
};
