import { StatutoryDeductionOptions } from '../types';

export type ProcessPayload = {
  proratedSalary: number;
  precision: number;
  percentage: number;
  options?: StatutoryDeductionOptions;
};

export type ProcessResult = {
  amount: number;
  addToCharge: boolean;
};
