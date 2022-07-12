/* eslint-disable no-unused-vars */
import { AddEmployee } from '@/components/types';
import { NiceModalHandler } from '@ebay/nice-modal-react';
import { FormikHelpers } from 'formik';
import { pick } from 'lodash';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Employee } from 'src/api/types';
import { IgetEmployeeMethod } from './types';
import { Util } from './util';

export const getEmployeeAddSubmitHandler = (
  onDone?: (employee: Employee) => any,
) => {
  return async (values: AddEmployee, helpers: FormikHelpers<AddEmployee>) => {
    try {
      helpers.setSubmitting(true);
      const employee = await $api.employee.addSingleEmployee({
        ...values,
        salary: +values.salary,
      });
      toast.success('Employee added successfully');
      if (onDone) {
        onDone(employee);
      }
    } catch (error) {
      const err = error as HttpError;
      if (err.errors && Object.keys(err.errors).length) {
        helpers.setErrors(err.errors);
      } else {
        toast.error(err.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };
};

export const getEmployeeEditSubmitHandler = (
  id: string,
  getEmployee: () => any,
) => {
  return async (
    modal: NiceModalHandler,
    values: AddEmployee,
    helpers: FormikHelpers<AddEmployee>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await $api.employee.updateSingleEmployee(id, {
        ...pick(values, [
          'firstname',
          'lastname',
          'email',
          'payoutMethod',
          'payoutMethodMeta',
          'phoneNumber',
        ]),
        salary: +values.salary,
      });
      await getEmployee();
      toast.success('Employee details updated');
      modal.hide();
    } catch (error) {
      const err = error as HttpError;
      if (err.errors && Object.keys(err.errors).length) {
        helpers.setErrors(err.errors);
      } else {
        toast.error(err.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };
};

export const getEmployeeMethod = (params: IgetEmployeeMethod) => {
  const {
    employeeId,
    apiCallStarted,
    setEmployee,
    setNotFound,
    apiCallDone,
  } = params;

  return async () => {
    try {
      if (!employeeId) {
        return;
      }

      apiCallStarted();
      const employee = await $api.employee.getSingleEmployee(employeeId);
      setEmployee(employee);
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 404) {
        setNotFound(true);
      }
    } finally {
      apiCallDone();
    }
  };
};
