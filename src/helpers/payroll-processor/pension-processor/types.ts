import { SalaryBreakdown } from '../types';

export type ProcessPayload = {
  enabled: boolean;
  addToCharge: boolean;
  voluntaryPension?: number;
  employerPercent?: number;
  employeePercent?: number;
  type?: string;
  salaryBreakdown?: SalaryBreakdown;
  precision: number;
  proratedSalary: number;
};
