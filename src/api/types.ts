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

  subcribeToMailList?: boolean;
};

export type PaginateParams = {
  limit?: number;

  page?: number;

  all?: boolean;

  search?: string;
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
  phoneNumber?: string;
};

export enum GroupTypeEnum {
  employee = 'employee',
  tax = 'tax',
  pension = 'pension',
  NHF = 'NHF',
}

export type GroupType = keyof typeof GroupTypeEnum;

export enum GroupStatusEnum {
  active = 'active',
  disabled = 'disabled',
}

export type GroupStatus = keyof typeof GroupStatusEnum;

export type Group<T extends Record<string, any> = {}> = Document & {
  name: string;
  type: GroupType;
  description?: string;
  status: GroupStatus;
  company: string | Company;
  meta: T;
  employees?: EmployeeGroup[];
};

export type EmployeeGroup = Document & {
  group: string | Group;
  employee: string | Employee;
};

export type Company = Document & {
  name: string;
  email: string;
  phonenumber: string;
  country: string | Country;
  logo?: string;
  salaryBreakdown?: SalaryBreakdown[];
};

export enum PermissionGroupEnum {
  Company = 'Company',
  Employee = 'Employee',
  Transaction = 'Transaction',
  Payroll = 'Payroll',
  AuditTrail = 'AuditTrail',
  Remittance = 'Remittance',
  Admin = 'Admin',
  Overview = 'Overview',
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
  userCount?: number;
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
  prorate = 'prorate',
}

export enum SalaryAddOnStatusEnum {
  active = 'active',
  disabled = 'disabled',
}

export enum SalaryAddOnFrequencyEnum {
  recurring = 'recurring',
  once = 'once',
}

export type SalaryAddOnFrequency =
  | SalaryAddOnFrequencyEnum
  | keyof typeof SalaryAddOnFrequencyEnum;

export type SalaryAddOnStatus =
  | SalaryAddOnStatusEnum
  | keyof typeof SalaryAddOnStatusEnum;

export type SalaryAddOnType =
  | SalaryAddOnTypeEnum
  | keyof typeof SalaryAddOnTypeEnum;

export type PayrollEmployeePayoutStatus =
  | PayrollEmployeePayoutStatusEnum
  | keyof typeof PayrollEmployeePayoutStatusEnum;

export type SalaryAddonDate = {
  month: string;
  year?: number;
  days?: string[];
};

export type SalaryAddOn = Document & {
  name: string;
  description?: string;
  entity?: string | Employee | Group;
  type: SalaryAddOnType;
  status?: SalaryAddOnStatus;
  amount: number;
  meta?: unknown;
  payrollCycle?: string;
  frequency: SalaryAddOnFrequency;
  dates: SalaryAddonDate[];
  startYear?: number;
};

export type Addon = {
  addonId: string | SalaryAddOn;
  name: string;
  description: string;
  amount: number;
  type: string;
  meta?: unknown;
  id: string;
  dates: {
    days: [string?, string?];
    month: string;
    year: number;
  }[];
  customAddonIndex?: number;
};

export type Remittance = {
  name: string;
  amount: number;
  meta?: unknown;
  groupId?: string;
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
  remittances?: Remittance[];
  remark?: string;
};

export type ProcessPayrollPayload = {
  employeeIds?: string[] | null;
  excludedEmployeeIds?: string[] | null;
  proRateMonth: string;
  year?: number;
  cycle?: number;
};

export type PayrollSummary = {
  fee: number;
  totalNetSalaries: number;
  totalSalaries: number;
  items: { name: string; value: number }[];
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

export enum TaxStatusEnum {
  Disabled = 'Disabled',
  Calculate = 'Calculate',
  Deduct = 'Deduct',
  Remit = 'Remit',
}

export type TaxStatus = keyof typeof TaxStatusEnum;

export enum TaxTypeEnum {
  PAYE = 'PAYE',
  WITHHOLDING = 'WITHHOLDING',
}

export type TaxType = keyof typeof TaxTypeEnum;

export type State = Document & {
  country: string | Country;
  name: string;
  code?: string;
  meta?: Record<string, unknown>;
};

export type SalaryBreakdown = {
  name: string;
  value: number;
};

export type CustomTaxRelief = {
  name: string;
  amount: number;
};

export type NigerianTaxSettings = {
  status: TaxStatus;
  type: TaxType;
  whTaxRate: number;
  taxId: string;
  taxOffice: string;
  taxState: State;
  company: {
    id: string;
    salaryBreakdown: SalaryBreakdown[];
  };
  customTaxRelief: CustomTaxRelief[];
  id: string;
};

export type SetupTaxPayload = Partial<Omit<NigerianTaxSettings, 'company'>>;

export type EmployeeTaxDetail = Document & {
  employee: string | Employee;
  taxId?: string;
  taxState?: string | State;
  taxGroup?: string;
  company: string | Company;
  lastAdded?: string;
  companyTaxDetails?: NigerianTaxSettings;
};

export type EmployeeTaxDetailPayload = Pick<
  EmployeeTaxDetail,
  'employee' | 'taxId' | 'taxState'
> & {};

export type AddEmployeeToNigerianTaxPayload = {
  employeeDetails: EmployeeTaxDetailPayload[];
};

export type FileUploadPayload = {
  filename: string;
  data: string;
};

export type File = Document & {
  mime: string;
  filename: string;
  url: string;
  provider: string;
};

export enum InviteTypeStatusEnum {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending',
  Withdrawn = 'Withdrawn',
}

export type InviteTypeStatus = keyof typeof InviteTypeStatusEnum;

export type Invite = Document & {
  email?: string;
  name?: string;
  company: string | Company;
  status?: InviteTypeStatus;
  user?: string | User;
  role?: string | Role;
  token: string;
};

export type CompanyChartData = {
  barChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderWidth: number;
      borderRadius: number;
      borderSkipped: boolean;
    }[];
  };
  pieChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
};

export type EmployeeGroupPayload = {
  name: string;
  description?: string;
  commonSalary?: string | number;
};

export type EnabledRemittance = {
  name: string;
  hasGroupsFeature: boolean;
  groups: { id: string; name: string }[];
};

export type ProcessPayrollResponse = {
  cycle: number;
  year: number;
  payrollEmployees: PayrollEmployee[];
  proRateMonth: string;
  enabledRemittances: EnabledRemittance[];
};

export type NigerianTaxGroupMeta = {
  taxId?: string;
  taxState?: string;
  salaryBreakdown?: SalaryBreakdown[];
  customTaxRelief?: CustomTaxRelief[];
  taxOffice?: string;
  payrollFrequency?: number;
  status?: TaxStatus;
  type?: TaxType;
  whTaxRate?: number;
};

export type ICreatePayrollPayload = { payDate: string } & ProcessPayrollPayload;

export type PayrollUpdateResponse = {
  message: string;
  actions: string[];
};
