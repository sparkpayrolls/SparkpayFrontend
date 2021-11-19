/* eslint-disable no-unused-vars */

import { NiceModalHandler } from '@ebay/nice-modal-react';
import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { InputRangeProps } from 'react-input-range';
import { Administrator, Employee, PaginationMeta } from 'src/api/types';

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
};

/** Kebab Menus */
export type IOrganizationMenu = {
  companies: Administrator[];
  onSelect: (company: Administrator, closeMenu: () => void) => any;
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

/** Create Organization */
export type CreateOrganization = {
  name: string;
  email: string;
  phonenumber: string;
  country: string;
};

