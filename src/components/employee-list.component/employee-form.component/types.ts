import { ISelectProps } from '@/components/Input/select.component';
import { FormikProps } from 'formik';
import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from 'react';
import { Values } from '../types';

export type EmployeesFormProps = {
  formikProps: FormikProps<Values>;
  headerRow?: string[];
  currency: string;
  payoutMethod: string;
  payoutMethodContext: Record<string, unknown>;
};

export type IConcealedInput = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  error?: string;
  helper?: string;
  loading?: boolean;
};

export type IConcealedSelect<T = any> = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  selectProps?: ISelectProps<T>;
  error?: string;
  helper?: string;
  loading?: boolean;
};
