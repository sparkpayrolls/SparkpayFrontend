import { FieldArrayRenderProps, getIn } from 'formik';
import keyBy from 'lodash.keyby';
import {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  MouseEventHandler,
} from 'react';
import { $api } from 'src/api';
import { Util } from 'src/helpers/util';
import { BulkEmployeeUploadList } from '../types';
import { EmployeesFormProps } from './types';

export const useEmployeeFormContext = (props: EmployeesFormProps) => {
  const { values } = props.formikProps;
  const { currency } = props;
  const [existingEmails, setExistingEmails] = useState<Record<string, unknown>>(
    {},
  );
  const [busy, setBusy] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateEmail = useCallback(
    Util.debounce(
      Util.queuedThrottle((email: string) => {
        if (existingEmails[email]) {
          return;
        }
        setBusy(true);
        $api.employee
          .findEmployeeByEmail(email)
          .then((employee) => {
            setExistingEmails((existingEmails) => ({
              ...existingEmails,
              [email]: employee,
            }));
          })
          .catch(() => {})
          .finally(() => setBusy(false));
      }, 500),
      500,
    ),
    [],
  );

  useEffect(() => {
    if (values.employees.length) {
      setBusy(true);
      $api.employee
        .findEmployeesByEmail(
          values.employees.map((employee) => employee.email),
        )
        .then((employees) => {
          const existingEmails = keyBy(employees, 'email');
          setExistingEmails(existingEmails);
        })
        .catch(() => {})
        .finally(() => setBusy(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transformSalary = (val: string) => {
    const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
    if (!valTransformed) return '';

    return `${currency} ${valTransformed.toLocaleString()}`;
  };

  const getEmptyEmployee = (
    payoutMethod: string,
    length: number,
  ): BulkEmployeeUploadList => ({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    salary: '',
    payoutMethod,
    payoutDetails: Array(length).fill(''),
  });

  const getAddRowClickHandler = (
    isSubmitting: boolean,
    helpers: FieldArrayRenderProps,
    length: number,
  ): MouseEventHandler<HTMLButtonElement> => {
    return (event) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      helpers.push(getEmptyEmployee(props.payoutMethod.id, length));
    };
  };

  const getFieldError = <T, K>(params: {
    name: string;
    index: number;
    touched: T;
    errors: K;
  }) => {
    const { errors, touched, index, name } = params;
    if (name === 'email' && existingEmails[values.employees[index]?.email]) {
      return 'email exists in company';
    }

    const key = `employees.${index}.${name}`;
    const fieldTouched = getIn(touched, key);
    if (fieldTouched) {
      return getIn(errors, key);
    }

    return '';
  };

  const getEmailChangeHandler = <T extends (..._args: any) => any>(params: {
    handleChange: T;
  }) => {
    const { handleChange } = params;

    return (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event);
      validateEmail(event.target.value);
    };
  };

  const hasExistingEmail = values.employees.some(
    (employee) => !!existingEmails[employee.email],
  );

  return {
    busy,
    getAddRowClickHandler,
    getEmailChangeHandler,
    getFieldError,
    hasExistingEmail,
    transformSalary,
  };
};
