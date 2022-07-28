import { FieldArrayRenderProps, getIn } from 'formik';
import cloneDeep from 'lodash.clonedeep';
import {
  useState,
  useCallback,
  ChangeEvent,
  MouseEventHandler,
  FormEvent,
  useRef,
  useEffect,
} from 'react';
import { $api } from 'src/api';
import { Util } from 'src/helpers/util';
import { EmployeesFormProps } from './types';

const EMPLOYEE_LENGTH = 100;
export const useEmployeeFormContext = (props: EmployeesFormProps) => {
  const {
    values,
    handleSubmit,
    setValues,
    setSubmitting,
    touched,
    errors,
  } = props.formikProps;
  const employeeAddition = Math.min(
    200,
    Math.max(EMPLOYEE_LENGTH, Math.floor(values.employees.length * 0.1)),
  );
  const _errors = values.employees.reduce((acc, cur) => {
    if (cur.error) {
      acc[cur.email] = cur.error;
    }

    return acc;
  }, {} as Record<string, unknown>);
  const [changes, setChanges] = useState(
    {} as Record<string, typeof values.employees[0]>,
  );
  const [employeeLength, setEmployeeLength] = useState(employeeAddition);
  const [existingEmails, setExistingEmails] = useState(_errors);
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

  const handleChange = (event: ChangeEvent<any>) => {
    setTimeout(() => {
      const { name, value } = event.target;
      const [, index, prop] = name.split('.');
      const item = changes[index] || values.employees[index];
      item[prop as 'firstname'] = value;
      if (prop === 'email') {
        validateEmail(value);
      }
      setChanges({ ...changes, [index]: item });
    }, 0);
  };

  const _handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const vals = cloneDeep(values);
    Object.keys(changes).forEach((key) => {
      vals.employees[+key] = changes[+key];
    });
    setValues(vals);
    setTimeout(handleSubmit, 0, event);
  };

  const increaseEmployeeLength = () => {
    if (employeeLength >= values.employees.length) {
      return;
    }

    setEmployeeLength(employeeLength + employeeAddition);
  };

  const getEmptyEmployee = (
    payoutMethod: string,
  ): typeof values.employees[0] => ({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    salary: '' as any,
    payoutMethod,
    payoutMethodMeta: {},
    error: '',
  });

  const getAddRowClickHandler = (
    isSubmitting: boolean,
    helpers: FieldArrayRenderProps,
  ): MouseEventHandler<HTMLButtonElement> => {
    return (event) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      helpers.push(
        getEmptyEmployee(values.employees[0]?.payoutMethod as string),
      );
    };
  };

  const getFieldError = (params: { name: string; index: number }) => {
    const { index, name } = params;
    const email = values.employees[index]?.email;
    if (name === 'email' && !!email && !!existingEmails[email]) {
      return 'email exists in company';
    }

    const key = `employees.${index}.${name}`;
    const fieldTouched = getIn(touched, key);
    if (fieldTouched) {
      return getIn(errors, key);
    }

    return '';
  };

  const hasExistingEmail = values.employees.some(
    (employee) => !!employee.email && !!existingEmails[employee.email],
  );

  return {
    getAddRowClickHandler,
    getFieldError,
    busy,
    hasExistingEmail,
    changes,
    handleChange,
    handleSubmit: _handleSubmit,
    increaseEmployeeLength,
    employeeLength,
  };
};

export const useElementPosition = <T extends HTMLElement>(
  dependencies: unknown,
) => {
  const elementRef = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

  useEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setPosition(rect);
    }
  }, [dependencies]);

  return { elementRef, position };
};
