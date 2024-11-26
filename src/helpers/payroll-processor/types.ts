export type Addon = {
  name?: string;
  amount: number;
  isNotTaxable?: boolean;
};

export type SalaryBreakdown = Record<string, number>;

export type StatutoryDeductionOptions = {
  enabled: boolean;
  addToCharge: boolean;
} & Record<string, unknown>;

export type Employee = {
  country?: {
    iso2: string;
    currency: string;
  };
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

export type Fees = Record<
  string,
  {
    baseFee: number;
    perEmployee: number;
    perRemittanceEmployee: number;
  }
>;

export type ProcessPayload = {
  precision: number;
  employees: Employee[];
  feesByCountry: Fees;
  month: string;
  year: number;
  salaryBreakdownByCountry?: Record<string, SalaryBreakdown>;
  statutoryDeductionsByCountry?: Record<
    string,
    Record<string, StatutoryDeductionOptions>
  >;
  country: {
    iso2: string;
    currency: string;
  };
  conversionRates: Record<string, number>;
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
  salaryBreakdown?: { name: string; value: number }[];
  remittances?: Record<string, { amount: number } & Record<string, unknown>>;
};

export type ProcessedPayroll = {
  totalSalary: number;
  totalNetSalary: number;
  totalBonus: number;
  totalDeductions: number;
  totalFees: number;
  totalCharge: number;
  employeesByCountry: Record<string, ProcessedEmployee[]>;
  payrollSize: number;
  currencyCount: number;
  payrollTotalsByCountry: Record<
    string,
    Record<string, number> & {
      payrollSize: number;
      totalSalary: number;
      totalNetSalary: number;
      totalBonus: number;
      totalDeductions: number;
    }
  >;
};
