export type Response<T> = {
  code?: string;

  message: string;

  data: T;

  meta?: {
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

  emailVerfied: boolean;
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
