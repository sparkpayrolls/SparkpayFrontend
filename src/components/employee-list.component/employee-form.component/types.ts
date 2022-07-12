import { FormikProps } from 'formik';
import { Values } from '../types';

export type EmployeesFormProps = {
  formikProps: FormikProps<Values>;
  headerRow?: string[];
  currency: string;
  payoutMethod: { id: string; name: string };
};
