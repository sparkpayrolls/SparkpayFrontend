export type Addon = {
  name?: string;
  amount: number;
};

export type SalaryBreakdown = Record<string, number>;

export type StatutoryDeductionOptions = {
  enabled: boolean;
  addToCharge: boolean;
} & Record<string, unknown>;

export type Employee = {
  id: string;
  firstname: string;
  lastname: string;
  salary: number;
  bonus: Addon[];
  deductions: Addon[];
  excludeFromTotals?: boolean;
  statutoryDeductionOptions?: Record<string, StatutoryDeductionOptions>;
  salaryBreakdown?: SalaryBreakdown;
  prorate?: {
    startDate: string;
    endDate: string;
  };
  voluntaryPensionContribution?: number;
};

export type Fees = {
  baseFee: number;
  perEmployee: number;
  perRemittanceEmployee: number;
};

export type ProcessPayload = {
  precision?: number;
  employees: Employee[];
  fees: Fees;
  statutoryDeductionOptions?: Record<string, StatutoryDeductionOptions>;
  salaryBreakdown?: SalaryBreakdown;
  month: string;
  year: number;
};

export type ProcessedEmployee = {
  id: string;
  firstname: string;
  lastname: string;
  totalBonus: number;
  totalDeductions: number;
  salary: number;
  netSalary: number;
  pension?: {
    amount: number;
  } & Record<string, unknown>;
  tax?: {
    amount: number;
  } & Record<string, unknown>;
  nhf?: {
    amount: number;
  } & Record<string, unknown>;
  proratedSalary: number;
  prorateDays: number;
  excludeFromTotals: boolean;
  salaryBreakdown: { name: string; value: number }[];
};

export type ProcessedPayroll = {
  totalSalary: number;
  totalNetSalary: number;
  totalBonus: number;
  totalDeductions: number;
  totalFees: number;
  totalPension: number;
  totalNHF: number;
  totalTax: number;
  totalPayrollPension: number;
  totalPayrollNHF: number;
  totalPayrollTax: number;
  totalCharge: number;
  employees: ProcessedEmployee[];
};
