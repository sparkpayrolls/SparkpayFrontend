export type PayrollAgGridMode = 'create' | 'view';

export type PayrollAgGridRow = {
  id: string;
  name: string;
  salary: number;
  netSalary: number;
  bonus: number;
  deduction: number;
  tax: number;
  employerPension?: number;
  employeePension?: number;
  voluntaryPension?: number;
  pension?: number;
  nhf: number;
  nsitf: number;
  nhis: number;
  payoutStatus?: string;
};
