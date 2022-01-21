export type PaginationMeta = {
  total: number;
  perPage: number;
  pageCount: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  previousPage: null | number;
  nextPage: null | number;
};

export type Response<T> = {
  code?: string;

  message: string;

  data: T;

  meta?: PaginationMeta;
};

export type Document = {
  id: string;

  updatedAt: string;

  createdAt: string;

  deleted: boolean;
};

export type Country = Document & {
  name: string;

  currency: string;

  currencySymbol: string;

  code: string;
};

export type User = Document & {
  firstname: string;

  lastname: string;

  email: string;

  country: Country;

  emailVerified: boolean;

  avatar?: string;

  phonenumber?: string;
};

export type LoggedInUser = {
  user: User;

  token: string;
};

export type SignupDTO = {
  firstname: string;

  lastname: string;

  email: string;

  password: string;

  country: string;
};

export type PaginateParams = {
  limit?: number;

  page?: number;

  all?: boolean;
};

export enum PayoutMethodNameEnum {
  'Bank Transfer' = 'Bank Transfer',
}

export type PayoutMethodName =
  | PayoutMethodNameEnum
  | keyof typeof PayoutMethodNameEnum;

export type PayoutMethod = Document & {
  name: PayoutMethodName;
  provider: string;
  country: string | Country;
};

export enum EmployeeStatusEnum {
  active = 'active',
  deactivated = 'deactivated',
}

export type EmployeeStatus =
  | EmployeeStatusEnum
  | keyof typeof EmployeeStatusEnum;

export const EmployeeStatuses: EmployeeStatus[] = Object.values(
  EmployeeStatusEnum,
);

export type Employee = Document & {
  company: string;
  firstname: string;
  lastname: string;
  salary: number;
  email: string;
  country: string | Country;
  payoutMethod?: PayoutMethod;
  payoutMethodMeta: unknown;
  salaryAddOns: unknown[];
  groups: EmployeeGroup[];
  status: EmployeeStatus;
};

export type Group = Document & {
  name: string;
};

export type EmployeeGroup = Document & {
  group: Group;
};

export type Company = Document & {
  name: string;
  email: string;
  phonenumber: string;
  country: string | Country;
  logo?: string;
};

export enum PermissionGroupEnum {
  Company = 'Company',
  Employee = 'Employee',
  'Wallet & Billing' = 'Wallet & Billing',
  Payroll = 'Payroll',
  AuditTrail = 'AuditTrail',
  Remittance = 'Remittance',
  Admin = 'Admin',
}

export enum PermissionLevelEnum {
  read = 'read',
  write = 'write',
}

export type PermissionGroup =
  | PermissionGroupEnum
  | keyof typeof PermissionGroupEnum;
export type PermissionLevel =
  | PermissionLevelEnum
  | keyof typeof PermissionLevelEnum;

export type Permission = Document & {
  group: PermissionGroup;
  level: PermissionLevel;
  description: string;
};

export type Role = Document & {
  name: string;
  company: string | Company;
  permissions: string[] | Permission[];
  description: string;
};

export type Administrator = Document & {
  user: string | User;
  role?: string | Role;
  isRoot: boolean;
  selected: boolean;
  company: string | Company;
};

export enum PayrollStatusEnum {
  pending = 'pending',
  processing = 'processing',
  completed = 'completed',
  paused = 'paused',
}

export type PayrollStatus = PayrollStatusEnum | keyof typeof PayrollStatusEnum;

export type RecentPayroll = {
  status: PayrollStatus;
  payDate: string;
  company: {
    country: {
      currencySymbol: string;
      id: string;
    };
    name: string;
    id: string;
    logo?: string;
  };
  totalAmount: number;
  id: string;
  size: number;
};

export type UserDashboardData = {
  totalNumberOfEmployees: number;
  recentPayrolls: RecentPayroll[];
  totalNumberOfPayrolls: number;
  totalNumberOfCompanies: number;
};

export type RecentTransaction = {
  amount: number;
  transactionMethod: string;
  date: string;
  meta: { description: string };
  id: string;
};

export type OrganisationDashboardData = {
  totalNumberOfPayrolls: number;
  totalNumberOfEmployees: number;
  totalPayrollBurden: number;
  recentTransactions: RecentTransaction[];
};

export type CompanyWallet = Document & {
  company: string | Company;
  balance: number;
};

export type WalletTransactionStatus = 'successful' | 'failed';

export type WalletTransaction = Document & {
  wallet: string | CompanyWallet;
  status: WalletTransactionStatus;
  amount: number;
  transactionMethod: string;
  balance: number;
  date: string;
  meta?: Record<string, unknown>;
  reference: string;
};

export enum ProRateMonthEnum {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December',
}

export const ProRateMonths = Object.values(ProRateMonthEnum);

export type ProRateMonth = ProRateMonthEnum | keyof typeof ProRateMonthEnum;

export type Payroll = Document & {
  proRateMonth: ProRateMonth;
  company: string | Company;
  status?: PayrollStatus;
  totalAmount: number;
  fee: number;
  payDate: string;
  employees?: unknown[];
  size?: number;
};

export type PaymentMethodName = 'Bank Transfer' | 'Card';

export type PaymentMethod = Document & {
  provider: string;
  name: PaymentMethodName;
  country: string | Country;
};

export enum AuditActionEnum {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  LOGIN = 'LOGIN',
  DELETE = 'DELETE',
}

export type AuditAction = AuditActionEnum | keyof typeof AuditActionEnum;

export type Audit = Document & {
  company: string | Company;
  actionBy: string | User;
  action: AuditAction;
  description: string;
  role: string;
  meta?: unknown;
};

export enum PayrollEmployeePayoutStatusEnum {
  pending = 'pending',
  processing = 'processing',
  failed = 'failed',
  successful = 'successful',
}

export enum SalaryAddOnTypeEnum {
  deduction = 'deduction',
  bonus = 'bonus',
}

export enum SalaryAddOnStatusEnum {
  active = 'active',
  disabled = 'disabled',
}

export enum SalaryAddOnPayrollCycleEnum {
  all = 'all',
  first = 'first',
  second = 'second',
}

export enum SalaryAddOnFrequencyEnum {
  recurring = 'recurring',
  once = 'once',
}

export type SalaryAddOnFrequency =
  | SalaryAddOnFrequencyEnum
  | keyof typeof SalaryAddOnFrequencyEnum;

export type SalaryAddOnPayrollCycle =
  | SalaryAddOnPayrollCycleEnum
  | keyof typeof SalaryAddOnPayrollCycleEnum;

export type SalaryAddOnStatus =
  | SalaryAddOnStatusEnum
  | keyof typeof SalaryAddOnStatusEnum;

export type SalaryAddOnType =
  | SalaryAddOnTypeEnum
  | keyof typeof SalaryAddOnTypeEnum;

export type PayrollEmployeePayoutStatus =
  | PayrollEmployeePayoutStatusEnum
  | keyof typeof PayrollEmployeePayoutStatusEnum;

export type SalaryAddOn = Document & {
  name: string;
  description?: string;
  entity?: string | Employee | Group;
  type: SalaryAddOnType;
  status?: SalaryAddOnStatus;
  amount: number;
  meta?: unknown;
  payrollCycle?: SalaryAddOnPayrollCycle;
  frequency?: SalaryAddOnFrequency;
  addonMonths: string[];
};

export type Addon = {
  addonId: string | SalaryAddOn;
  name: string;
  description: string;
  amount: number;
  meta?: unknown;
};

export type PayrollEmployee = Document & {
  salary: number;
  employee: string | Employee;
  payroll: string | Payroll;
  netSalary: number;
  transfer: string | unknown;
  payoutStatus?: PayrollEmployeePayoutStatus;
  deductions?: Addon[];
  bonuses?: Addon[];
  remark?: string;
};

export type ProcessPayrollPayload = {
  employeeIds?: string[] | null;
  excludedEmployeeIds?: string[] | null;
  proRateMonth: string;
};

export type PayrollSummary = {
  fee: number;
  totalNetSalaries: number;
  totalSalaries: number;
  totalBonus: number;
  totalDeduction: number;
  payrollSize: number;
  totalAmount: number;
};

export type Bank = Document & {
  name: string;
  meta?: unknown;
  country: string | Country;
};

export type UpdateUserPayload = {
  firstname?: string;
  lastname?: string;
  phonenumber?: string;
  avatarFile?: {
    filename: string;
    data: string;
  };
};
