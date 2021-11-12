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

export enum PayoutMethods {
  'Bank Transfer' = 'Bank Transfer',
}

export type PayoutMethod = Document & {
  name: PayoutMethods | keyof typeof PayoutMethods;
  country: string;
};

export enum EmployeeStatus {
  active = 'active',
  deactivated = 'deactivated',
}

export const EmployeeStatuses: (
  | EmployeeStatus
  | keyof typeof EmployeeStatus
)[] = Object.values(EmployeeStatus);

export type Employee = Document & {
  company: string;
  firstname: string;
  lastname: string;
  salary: number;
  email: string;
  countryOfOrigin: string;
  countryOfResidence: string;
  payoutMethod?: PayoutMethod;
  payoutMethodMeta: unknown;
  salaryAddOns: unknown[];
  groups: EmployeeGroup[];
  status: EmployeeStatus | keyof typeof EmployeeStatus;
};

export type Group = Document & {
  name: string;
};

export type EmployeeGroup = Document & {
  group: Group;
};
