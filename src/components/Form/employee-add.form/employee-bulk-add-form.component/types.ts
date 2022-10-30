import { FormikErrors, FormikTouched } from 'formik';
import { SetStateAction } from 'react';

export type Values = {
  file: string;
  fileName: string;
  payoutMethod: string;
};

export type EmployeeBulkAddFormProps = {
  onSubmit(): unknown;
  gotoPayrollCreation?: boolean;
};

export type useEmployeeBulAddFormContextPayload = EmployeeBulkAddFormProps;

type setTouched = (_touched: FormikTouched<Values>) => unknown;
type setValues = (_values: SetStateAction<Values>) => unknown;

export type IgetBulkEmployeeFileUploadHandler = {
  setTouched: setTouched;
  setValues: setValues;
  setErrors(_errors: FormikErrors<Values>): unknown;
  values: Values;
};
