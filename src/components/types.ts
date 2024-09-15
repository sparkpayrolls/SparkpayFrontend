/* eslint-disable no-unused-vars */

import { NiceModalHandler } from '@ebay/nice-modal-react';
import { AutoCompleteProps, SelectProps } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import { FormikHelpers } from 'formik';
import { Moment } from 'moment';
import { NextRouter } from 'next/router';
import React, {
  ChangeEventHandler,
  CSSProperties,
  DetailedHTMLProps,
  FocusEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  RefAttributes,
  TableHTMLAttributes,
} from 'react';
import { InputRangeProps } from 'react-input-range';
import {
  Administrator,
  AuditAction,
  Company,
  CompanyWallet,
  Employee,
  EmployeeStatus,
  GroupStatus,
  InviteTypeStatus,
  OrganisationDashboardData,
  PaginationMeta,
  PayoutMethod,
  PayrollStatus,
  PermissionGroup,
  PermissionLevel,
  SalaryAddOnStatus,
  UserDashboardData,
  WalletTransactionStatus,
} from 'src/api/types';
import { IKebabItem } from './KebabMenu/KebabMenu.component';

export interface ITable {
  children: () => ReactElement;
  onCheckAllClick?: ChangeEventHandler<HTMLInputElement>;
  headerRow: ReactNode[];
  allChecked?: boolean;
  paginationMeta?: PaginationMeta;
  refresh?: (
    page?: number,
    perPage?: number,
    search?: string,
    all?: boolean,
  ) => void;
  title?: string;
  onSearch?: (_: string) => void;
  onFilterClick?: MouseEventHandler<HTMLButtonElement>;
  isEmpty?: boolean;
  emptyStateText?: string;
  isLoading?: boolean;
  kebabMenuItems?: IKebabItem[];
  isNotSelectable?: boolean;
  isNotSearchable?: boolean;
  buttons?: {
    href?: string;
    label: string;
    action?(): any;
    primary?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }[];
  selectAllNoun?: string;
  onSelectAll?: MouseEventHandler<HTMLButtonElement>;
  onClearSelection?: MouseEventHandler<HTMLButtonElement>;
  shouldClearSelection?: boolean;
  refreshV2?(params: Record<string, unknown>): unknown;
  appendToolBar?: ReactNode;
}

export interface ITR {
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export type ITablePagination = PaginationMeta & {
  refresh?: (page?: number, perPage?: number, all?: boolean) => void;
  refreshV2?(params: Record<string, unknown>): unknown;
};

export type ITablev2 = DetailedHTMLProps<
  TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
> & {
  loading?: boolean;
};

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
  className?: string;
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
  options: ISelectInputOptionItem[] | string[];
  error?: string | false;
  displayValue?: string;
  actualValue?: string;
  name?: string;
  value?: string;
  selected?: ISelectInputOptionItem;
  dropTop?: boolean;
  loading?: boolean;
  placeholder?: string;
  showSearch?: boolean | string;
  applyTableStyle?: boolean;
  customIcon?: ReactNode;
  selectorStyle?: CSSProperties;
};

/** AddEmployee */
export type AddEmployee = {
  firstname: string;
  lastname: string;
  email: string;
  salary: string;
  phoneNumber?: string;
};

/** Kebab Menus */
export type IOrganizationMenu = {
  companies: Administrator[];
  onSelect: (company: Administrator, closeMenu: () => void) => any;
  loading?: string;
  administrator: Administrator | null;
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
  onSendOnboardingLink(id: string | string[]): any;
  onStatusToggle(
    action: 'Activate' | 'Delete' | 'Deactivate',
  ): (id: string | string[]) => any;
};

/**User Profile */
/*user profile change password modal*/
export type ChangePasswordUserProfile = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type IUserProfile = {
  firstname: string;
  lastname: string;
  phonenumber?: string;
};

/** Tax */
export type TaxCalculation = {
  taxId: string;
  state: string;
  taxOfficeNumber: string;
};
/** Create Organization */
export type CreateOrganization = {
  name: string;
  email: string;
  phonenumber: string;
  country: string;
};

/** Edit Organisation Details */
export type OrganisationDetails = {
  name: string;
  email: string;
  phonenumber: string;
  country: string;
};

/** Employee Onboard */
export type EmployeeOnboarding = {
  country: string;
  payoutMethod: string;
  payoutMethodMeta: Record<string, any>;
};

/** Wallet Billing */
export type WalletBilling = {
  amount: string;
  channel: string;
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
  onCreate?(org: Company): any;
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
  className?: string;
};

/** Statuschip */
export type IStatusChip = {
  status:
    | PayrollStatus
    | EmployeeStatus
    | WalletTransactionStatus
    | AuditAction
    | InviteTypeStatus
    | GroupStatus
    | SalaryAddOnStatus
    | InviteTypeStatus
    | 'Enabled'
    | 'Disabled';
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
  buttons?: (ButtonProps & {
    href?: string;
    action?(): any;
  })[];
  menuItems?: IKebabItem[];
  searchPlaceholder?: string;
  searchDelay?: number;
  fixedHeader?: boolean;
  filterButtonClassName?: string;
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
  perPageItems?: { value: string }[];
  refresh?(query: Record<string, any>): any;
  meta?: Partial<
    Pick<
      PaginationMeta,
      | 'perPage'
      | 'total'
      | 'page'
      | 'pageCount'
      | 'hasNextPage'
      | 'hasPrevPage'
      | 'previousPage'
      | 'nextPage'
    >
  >;
};

export type IWalletBillingForm = {
  modal: NiceModalHandler;
  switchForm(value: 'NGMoreInfo'): void;
};

export type IWalletCard = {
  title: string;
  amount: number;
  loading?: boolean;
  wallet?: CompanyWallet;
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
  helper?: string;
};

export type ITotalCard = {
  loading?: boolean;
  title: string;
  value: string;
  type?: 'primary' | 'secondary';
};

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label?: string | ReactElement;

  /**
   * Button type 'button' | 'submit'
   */
  type?: 'button' | 'submit';
  /**
   * Optional click handler
   */
  onClick?: MouseEventHandler;
  /**
   * Custom css className
   */
  className?: string;

  /**
   * Should the button be disabled
   */
  disabled?: boolean;

  /**
   * Should the button indicate loading
   */
  showSpinner?: boolean;

  /**
   * Should the button show loading
   */
  showLabel?: boolean;

  element?: 'a';

  href?: string;

  title?: string;

  danger?: boolean;
}

export interface IElementWrapper {
  element: string;
  className?: string;
}

export type IText = Record<string, unknown> & {
  element: 'span' | 'p';
  text: string;
  className?: string;
};

export type IPayoutMethodMeta = {
  method: PayoutMethod | null;
  error?: boolean;
  setMeta(meta: Record<string, any>): any;
  initialValues: Record<string, any>;
};

export type IBankPayoutMethodMeta = {
  method: PayoutMethod;
  initialValues: { bankId: string; accountNumber: string };
  error?: boolean;
  setMeta(meta: unknown): any;
};

export type IEmployeeOnboardingForm = {
  onSubmit(
    values: EmployeeOnboarding,
    formikHelpers: FormikHelpers<EmployeeOnboarding>,
  ): any;
  initialValue: EmployeeOnboarding;
  loading?: boolean;
};

export type ISelect<T> = SelectProps<T> & {
  ref?: React.Ref<RefSelectProps>;
  label?: string;
  error?: string | boolean;
  containerClassName?: string;
};

export type IAutoComplete = AutoCompleteProps &
  RefAttributes<RefSelectProps> & {
    label?: string;
    error?: string;
    loading?: boolean;
  };
export type IEmployeeAddForm = {
  initialValues: AddEmployee;
  onSubmit(vals: AddEmployee, helpers: FormikHelpers<AddEmployee>): any;
  currency: string;
  country?: string;
};

export type IEditEmployeeDetailsModal = {
  administrator: Administrator;
  employee: Employee;
  onSubmit(
    modal: NiceModalHandler,
    vals: AddEmployee,
    helpers: FormikHelpers<AddEmployee>,
  ): any;
};
