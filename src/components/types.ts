/* eslint-disable no-unused-vars */

import { NiceModalHandler } from '@ebay/nice-modal-react';
import { Moment } from 'moment';
import { NextRouter } from 'next/router';
import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { InputRangeProps } from 'react-input-range';
import {
  Administrator,
  Audit,
  AuditAction,
  Employee,
  EmployeeStatus,
  OrganisationDashboardData,
  PaginationMeta,
  PaymentMethod,
  PaymentMethodName,
  Payroll,
  PayrollStatus,
  PermissionGroup,
  PermissionLevel,
  UserDashboardData,
  WalletTransaction,
  WalletTransactionStatus,
} from 'src/api/types';
import { IKebabItem } from './KebabMenu/KebabMenu.component';

/** MultiSelect Props */
export type IMultiSelectOptionItem = Record<string, unknown>;
export type IMultiSelectHandler = (
  selectedList: IMultiSelectOptionItem[],
  selectedItem: IMultiSelectOptionItem,
) => void;
export type IMultiSelect = {
  options: IMultiSelectOptionItem[];
  onSelect?: IMultiSelectHandler;
  onRemove?: IMultiSelectHandler;
  label: string;
  displayValue: string;
  selectedValues?: IMultiSelectOptionItem[];
};

/** ModalLayout Props */
export type IModalLayout = {
  title: string;
  children?: (modal: NiceModalHandler) => ReactNode;
};

export type IRangeInput = { label: string } & InputRangeProps;

/** EmployeeFilterModal */
export type IEmployeeFilter = {
  status?: string;
  salaryRange?: string;
};

export type IEmployeeFilterModal = {
  filter?: IEmployeeFilter;
  onFilter?: (filter: IEmployeeFilter) => any;
};

/** SelectInput */
export type ISelectInputOptionItem = Record<string, unknown>;
export type ISelectOption = {
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLSpanElement>;
};
export type ISelectInput = {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  label?: string;
  options: ISelectInputOptionItem[];
  error?: string;
  displayValue: string;
  actualValue: string;
  name?: string;
  value?: string;
  selected?: ISelectInputOptionItem;
  dropTop?: boolean;
  loading?: boolean;
};

/** AddEmployee */
export type AddEmployee = {
  firstname: string;
  lastname: string;
  email: string;
  salary: string;
};

export type ISingleEmployeeUpload = {
  onDone?: (employee: Employee) => any;
  administrator: Administrator;
};

/** Kebab Menus */
export type IOrganizationMenu = {
  companies: Administrator[];
  onSelect: (company: Administrator, closeMenu: () => void) => any;
  loading?: string;
};

export type IProfileMenu = {
  name: string;
  role: string;
  avatar?: string;
  actions: {
    action?: (close: () => void) => any;
    name: string;
    href?: string;
  }[];
};

/** Common */
export type IImageLoader = {
  width?: string | number;
  height?: string | number;
  src: string;
  alt?: string;
};

/** Table */
export type IOrganizationTable = {
  organizations: Administrator[];
  paginationMeta: PaginationMeta;
  getOrganizations(_: Record<string, unknown>): any;
  deleteOrganisation(id: string): any;
  loading?: boolean;
};

export type IGetEmployees = (
  page?: number,
  perPage?: number,
  search?: string,
  all?: boolean,
  filter?: Record<string, any>,
) => any;

export type IEmployeeTable = {
  employees: Employee[];
  paginationMeta: PaginationMeta;
  getEmployees: IGetEmployees;
  onFilter(): any;
  loading: boolean;
  administrator: Administrator;
  onDelete(id: string | string[]): any;
  onStatusToggle(
    action: 'Activate' | 'Delete' | 'Deactivate',
  ): (id: string | string[]) => any;
};

export type ITransactionTable = {
  transactions: WalletTransaction[];
  meta: PaginationMeta;
  getTransactions(
    page?: number,
    perPage?: number,
    search?: string,
    all?: boolean,
  ): any;
  loading?: boolean;
  administrator: Administrator | null;
};

export type IPayrollTable = {
  administrator: Administrator | null;
  meta: PaginationMeta;
  payrolls: Payroll[];
  loading: boolean;
  getPayrolls(
    page?: number,
    perPage?: number,
    search?: string,
    all?: boolean,
  ): any;
  kebabMenuItems(payroll: Payroll): IKebabItem[];
};

/** Create Organization */
export type CreateOrganization = {
  name: string;
  email: string;
  phonenumber: string;
  country: string;
};

/** Wallet Billing */
export type WalletBilling = {
  amount: string;
  channel: PaymentMethodName;
};
/** NavListItem */
export type IDashboardNavigationListItem = {
  router: NextRouter;
  href: string;
  match: string;
  // eslint-disable-next-line no-undef
  Icon(): JSX.Element;
  title: string;
};

/** Allowed Permissions */
export type IAllowedPermissions = [PermissionGroup, PermissionLevel][];

/** Button */
export type ICreateOrganisationButton = {
  onCreate?(): any;
};

/** Dashboard */
export type IDashboardCard = {
  value: string | number;
  title: string;
  // eslint-disable-next-line no-undef
  Icon(): JSX.Element;
  loading?: boolean;
};

/** Identity */
export type IIdentity = {
  name?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: 'reverse';
  initial?: string;
};

/** Statuschip */
export type IStatusChip = {
  status:
    | PayrollStatus
    | EmployeeStatus
    | WalletTransactionStatus
    | AuditAction;
};

/** TransactionMethod */
export type ITransactionMethod = {
  method: string;
};

/** Tabs */
export type IEmployeeTab = {
  administrator: Administrator | null;
  loading?: boolean;
  employees: Employee[];
  paginationMeta: PaginationMeta;
  refreshEmployees: IGetEmployees;
};

export type ITab = {
  default?: string;
  active?: string;
  onChange?(activeKey: string): any;
};

/** Dashboard */
export type IUserDashboard = {
  data: UserDashboardData;
  getData(): any;
  loading?: boolean;
};

export type IOrganisationDashboard = {
  data: OrganisationDashboardData;
  getData(): any;
  loading?: boolean;
  administrator: Administrator;
};

export type IOnSearch = (value: string) => any;

export type ISearchInput = {
  placeholder?: string;
  value?: string;
  onSearch?(value: string): any;
};

export type ITableLayout = {
  // eslint-disable-next-line no-undef
  title?: string | JSX.Element;
  onSearch?(value: string): any;
  onFilter?(): any;
  buttons?: {
    href?: string;
    label: string;
    action?(): any;
    primary?: boolean;
  }[];
  menuItems?: IKebabItem[];
  searchPlaceholder?: string;
};

export type ICheckboxTableColumn = {
  element: 'td' | 'th';
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export type IMenuTableColumn = {
  element: 'td' | 'th';
  items: IKebabItem[];
};

export type IPagination = {
  refresh?(query: Record<string, any>): any;
  meta?: Pick<
    PaginationMeta,
    | 'perPage'
    | 'total'
    | 'page'
    | 'pageCount'
    | 'hasNextPage'
    | 'hasPrevPage'
    | 'previousPage'
    | 'nextPage'
  >;
};

export type IWalletBillingForm = {
  modal: NiceModalHandler;
  administrator: Administrator;
  paymentMethods: PaymentMethod[];
};

export type IWalletBillingModal = {
  administrator: Administrator;
  paymentMethods: PaymentMethod[];
};

export type IWalletCard = {
  title: string;
  amount: string;
  administrator: Administrator;
  refreshBalance(): any;
  paymentMethods: PaymentMethod[];
};

export type IAuditTable = {
  logs: Audit[];
  getLogs(params: Record<string, any>): any;
  meta: PaginationMeta;
  loading: boolean;
};

export type IDatePicker = {
  error?: string;
  onChange?(value: Moment | null, dateString: string): void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: Moment | null;
  name?: string;
  placeholder?: string;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};
